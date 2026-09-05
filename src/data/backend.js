// ============================================================
// IBSB — Backend dispatcher
// Decide entre o modo demonstração (localStorage) e o modo
// produção (Supabase), conforme VITE_DATA_MODE + variáveis.
// Se VITE_DATA_MODE=supabase mas as chaves faltarem, cai no
// modo demo para o app nunca quebrar.
// ============================================================

import { db } from './db';
import * as supabase from './supabase';
import {
  seedServices,
  seedEvents,
  seedSermons,
  seedDevotionals,
  seedNews,
  seedGallery,
} from './mockData';

const requested = (import.meta.env.VITE_DATA_MODE || 'demo').toLowerCase();

export const DATA_MODE =
  requested === 'supabase' && supabase.supabaseAvailable() ? 'supabase' : 'demo';

const isSup = DATA_MODE === 'supabase';

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
    reader.readAsDataURL(file);
  });

export const backend = {
  mode: DATA_MODE,
  isSupabase: isSup,

  // Coleções (mesma interface do db local, porém assíncrona)
  async all(name) {
    return isSup ? supabase.collectionAll(name) : db[name].all();
  },
  async byId(name, id) {
    return isSup ? supabase.collectionById(name, id) : db[name].byId(id);
  },
  async insert(name, data) {
    return isSup
      ? supabase.collectionInsert(name, data)
      : db[name].insert(data);
  },
  async update(name, id, data) {
    return isSup
      ? supabase.collectionUpdate(name, id, data)
      : db[name].update(id, data);
  },
  async remove(name, id) {
    return isSup ? supabase.collectionRemove(name, id) : db[name].remove(id);
  },
  async replaceAll(name, list) {
    return isSup
      ? supabase.collectionReplaceAll(name, list)
      : db[name].replaceAll(list);
  },

  // Configurações da igreja
  async settingsGet() {
    return isSup ? supabase.settingsGet() : db.settings.get();
  },
  async settingsSet(value) {
    return isSup ? supabase.settingsSet(value) : db.settings.set(value);
  },

  // Autenticação
  async authSignIn(credentials) {
    return isSup
      ? supabase.authSignIn(credentials.email, credentials.password)
      : null;
  },
  async authSignOut() {
    if (isSup) await supabase.authSignOut();
  },
  async authGetSession() {
    return isSup ? supabase.authGetSession() : db.auth.get();
  },

  // Imagens: no Supabase sobe para o Storage (URL pública); no modo
  // demo lê como data URL (persiste no navegador, sem backend).
  async uploadImage(file, folder = 'uploads') {
    if (isSup) return supabase.uploadImage(file, folder);
    return readAsDataUrl(file);
  },
  async removeImage(url) {
    if (isSup && url) {
      try {
        await supabase.removeUpload(url);
      } catch {
        /* não crítico */
      }
    }
  },

  // Modo demo: popula o localStorage com os dados de exemplo.
  seedDemo() {
    db.ensureSeed('services', seedServices);
    db.ensureSeed('events', seedEvents);
    db.ensureSeed('sermons', seedSermons);
    db.ensureSeed('devotionals', seedDevotionals);
    db.ensureSeed('news', seedNews);
    db.ensureSeed('gallery', seedGallery);
    db.ensureSeed('prayers', []);
  },

  // Supabase: importa os dados de demonstração apenas nas
  // tabelas vazias. O id/createdAt são gerados no banco.
  async importDemo() {
    if (!isSup) return 0;
    const defs = [
      ['services', seedServices],
      ['events', seedEvents],
      ['sermons', seedSermons],
      ['devotionals', seedDevotionals],
      ['news', seedNews],
      ['gallery', seedGallery],
    ];
    let imported = 0;
    for (const [name, fn] of defs) {
      const existing = await this.all(name);
      if (existing.length > 0) continue;
      const items = fn();
      for (const item of items) {
        const { id, createdAt, updatedAt, ...rest } = item;
        await this.insert(name, rest);
        imported += 1;
      }
    }
    return imported;
  },
};
