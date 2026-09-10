// ============================================================
// IBSB — Favoritos da Bíblia
// Guarda o ID do versículo + metadados para exibição offline.
// O texto continua vindo da fonte BLIVRE (não é editado).
// ============================================================

const KEY = 'ibsb.bible.favorites';

let cache = null;
const listeners = new Set();

function read() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(list) ? list : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Armazenamento indisponível: mantém apenas em memória.
  }
  listeners.forEach((cb) => cb(cache));
}

export function getFavorites() {
  return read();
}

export function isFavorite(id) {
  return read().some((f) => f.id === id);
}

export function toggleFavorite(record) {
  if (!record || !record.id) return false;
  const exists = isFavorite(record.id);
  if (exists) {
    write(read().filter((f) => f.id !== record.id));
    return false;
  }
  write([{ ...record, addedAt: new Date().toISOString() }, ...read()]);
  return true;
}

export function removeFavorite(id) {
  write(read().filter((f) => f.id !== id));
}

export function subscribeFavorites(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
