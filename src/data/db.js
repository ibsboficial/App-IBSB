// ============================================================
// IBSB — Camada de dados (db.js)
// Abstrai o acesso aos dados. Hoje usa localStorage (funciona
// offline e sem backend). A interface é a mesma que será usada
// pelo Supabase: basta trocar o modo em .env (VITE_DATA_MODE).
// ============================================================

const PREFIX = 'ibsb.';

const KEYS = {
  services: 'services',
  events: 'events',
  sermons: 'sermons',
  devotionals: 'devotionals',
  prayers: 'prayers',
  news: 'news',
  gallery: 'gallery',
  settings: 'settings',
  auth: 'auth',
};

const read = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
};

const remove = (key) => {
  localStorage.removeItem(PREFIX + key);
};

const uid = () =>
  'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);

const nowIso = () => new Date().toISOString();

// --- Coleções genéricas ----------------------------------------
const collection = (key) => ({
  all: () => read(key, []),
  byId: (id) => read(key, []).find((item) => item.id === id) || null,
  insert: (data) => {
    const list = read(key, []);
    const record = { id: uid(), createdAt: nowIso(), ...data };
    list.push(record);
    write(key, list);
    return record;
  },
  update: (id, data) => {
    const list = read(key, []);
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, updatedAt: nowIso() };
    write(key, list);
    return list[idx];
  },
  remove: (id) => {
    const list = read(key, []).filter((item) => item.id !== id);
    write(key, list);
    return true;
  },
  replaceAll: (list) => {
    write(key, list);
    return list;
  },
});

// --- Serviços específicos ---------------------------------------
export const db = {
  services: collection(KEYS.services),
  events: collection(KEYS.events),
  sermons: collection(KEYS.sermons),
  devotionals: collection(KEYS.devotionals),
  prayers: collection(KEYS.prayers),
  news: collection(KEYS.news),
  gallery: collection(KEYS.gallery),

  settings: {
    get: () => read(KEYS.settings, null),
    set: (value) => write(KEYS.settings, value),
  },

  auth: {
    get: () => read(KEYS.auth, null),
    set: (value) => write(KEYS.auth, value),
    clear: () => remove(KEYS.auth),
  },

  // Utilidade: se uma coleção estiver vazia, popula com seeds.
  ensureSeed: (key, seedFn) => {
    if ((read(key, null) === null || read(key, []).length === 0) && seedFn) {
      const data = typeof seedFn === 'function' ? seedFn() : seedFn;
      write(key, data);
      return data;
    }
    return read(key, []);
  },

  clearAllDemo: () => {
    Object.values(KEYS).forEach((k) => remove(k));
  },
};
