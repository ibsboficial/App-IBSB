// ============================================================
// IBSB — Bíblia Livre (BLIVRE)
// Fonte textual exclusiva: /data/BLIVRE.json (arquivo fornecido).
// Este módulo apenas lê, valida e indexa o conteúdo, preservando
// integralmente o texto original. Nenhum texto é gerado, corrigido
// ou substituído por outra tradução.
// ============================================================

export const BIBLE_VERSION = 'BLIVRE';
export const BIBLE_LABEL = 'Bíblia Livre (BLIVRE)';

const SOURCE_URL = `${import.meta.env.BASE_URL}data/BLIVRE.json`;

const IDB_NAME = 'ibsb-bible';
const IDB_STORE = 'files';
const IDB_KEY = 'BLIVRE.json';

// Alguns nomes são encurtados apenas na interface (a fonte não muda).
const DISPLAY_NAMES = {
  'Lamentações de Jeremias': 'Lamentações',
};

// --- Armazenamento offline (IndexedDB) -------------------------
let idbPromise = null;

function openIdb() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return idbPromise;
}

async function idbRead(key) {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbWrite(key, value) {
  const db = await openIdb();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, key);
  } catch {
    // Sem persistência local: seguir apenas em memória.
  }
}

// --- Validação da fonte ---------------------------------------
function validateBible(data) {
  const fail = (msg) => {
    throw new Error(`BLIVRE.json inválido: ${msg}`);
  };
  if (!Array.isArray(data)) fail('a raiz não é um array');
  if (data.length !== 66) fail(`esperado 66 livros, encontrado ${data.length}`);

  let chapters = 0;
  let verses = 0;
  const ids = new Set();

  data.forEach((book, bi) => {
    if (typeof book.name !== 'string' || !book.name) fail(`livro ${bi + 1} sem "name"`);
    if (typeof book.abbrev !== 'string' || !book.abbrev) fail(`livro ${bi + 1} sem "abbrev"`);
    if (!Array.isArray(book.chapters)) fail(`"${book.abbrev}": "chapters" não é array`);
    book.chapters.forEach((chapter, ci) => {
      chapters += 1;
      if (!Array.isArray(chapter)) fail(`"${book.abbrev}" capítulo ${ci + 1} não é array`);
      if (chapter.length === 0) fail(`"${book.abbrev}" capítulo ${ci + 1} está vazio`);
      chapter.forEach((text, vi) => {
        if (typeof text !== 'string') {
          fail(`"${book.abbrev}" ${ci + 1}:${vi + 1} não é texto`);
        }
        if (text.trim() === '') fail(`"${book.abbrev}" ${ci + 1}:${vi + 1} está vazio`);
        const id = `${book.abbrev}-${ci + 1}-${vi + 1}`;
        if (ids.has(id)) fail(`ID duplicado: ${id}`);
        ids.add(id);
        verses += 1;
      });
    });
  });

  if (chapters !== 1189) fail(`esperado 1189 capítulos, encontrado ${chapters}`);
  if (verses !== 31102) fail(`esperado 31102 versículos, encontrado ${verses}`);
}

// --- Estado em memória ----------------------------------------
let engine = null;
let loadPromise = null;

function buildEngine(data, sourceLabel) {
  const books = data.map((book, bi) => {
    const bookNumber = bi + 1;
    return {
      name: book.name,
      displayName: DISPLAY_NAMES[book.name] || book.name,
      abbrev: book.abbrev,
      chapters: book.chapters,
      bookNumber,
      testament: bookNumber <= 39 ? 'AT' : 'NT',
      chapterCount: book.chapters.length,
    };
  });

  const byAbbrev = new Map();
  books.forEach((b) => byAbbrev.set(b.abbrev, b));
  // Abreviações são únicas na fonte; se houver variação de caixa, ainda resolve.
  books.forEach((b) => byAbbrev.set(b.abbrev.toLowerCase(), b));

  return { books, byAbbrev, sourceLabel };
}

async function readSource() {
  const cached = await idbRead(IDB_KEY);
  if (cached) {
    try {
      return { text: cached, sourceLabel: 'cache local' };
    } catch {
      // segue para a rede
    }
  }
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Falha ao carregar a Bíblia (HTTP ${res.status}).`);
  const text = await res.text();
  idbWrite(IDB_KEY, text);
  return { text, sourceLabel: SOURCE_URL };
}

export async function loadBible() {
  if (engine) return engine;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { text, sourceLabel } = await readSource();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('BLIVRE.json não pôde ser interpretado (JSON inválido).');
    }
    validateBible(data);
    engine = buildEngine(data, sourceLabel);
    return engine;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

export function isBibleLoaded() {
  return Boolean(engine);
}

export function getBooks(testament) {
  if (!engine) return [];
  if (!testament) return engine.books;
  return engine.books.filter((b) => b.testament === testament);
}

export function getBook(abbrev) {
  if (!engine || !abbrev) return null;
  return engine.byAbbrev.get(abbrev) || engine.byAbbrev.get(String(abbrev).toLowerCase()) || null;
}

export function getChapter(abbrev, chapter) {
  const book = getBook(abbrev);
  if (!book) return null;
  const n = Number(chapter);
  if (!Number.isInteger(n) || n < 1 || n > book.chapterCount) return null;
  const texts = book.chapters[n - 1];
  return {
    abbrev: book.abbrev,
    book: book.displayName,
    fullBookName: book.name,
    testament: book.testament,
    bookNumber: book.bookNumber,
    chapter: n,
    verses: texts.map((text, i) => ({
      id: `${book.abbrev}-${n}-${i + 1}`,
      verse: i + 1,
      text,
    })),
  };
}

export function parseId(id) {
  if (typeof id !== 'string') return null;
  const parts = id.split('-');
  if (parts.length !== 3) return null;
  const [abbrev, chapter, verse] = parts;
  const c = Number(chapter);
  const v = Number(verse);
  if (!Number.isInteger(c) || !Number.isInteger(v)) return null;
  return { abbrev, chapter: c, verse: v };
}

export function getVerseRecord(abbrev, chapter, verse) {
  const ch = getChapter(abbrev, chapter);
  if (!ch) return null;
  const item = ch.verses[Number(verse) - 1];
  if (!item) return null;
  return {
    id: item.id,
    abbrev: ch.abbrev,
    book: ch.book,
    testament: ch.testament,
    bookNumber: ch.bookNumber,
    chapter: ch.chapter,
    verse: item.verse,
    text: item.text,
    version: BIBLE_VERSION,
  };
}

export function getVerseRecordById(id) {
  const parsed = parseId(id);
  if (!parsed) return null;
  return getVerseRecord(parsed.abbrev, parsed.chapter, parsed.verse);
}

// Ordem sequencial (livro/capítulo) para navegação entre livros.
function sequentialChapters() {
  if (!engine) return [];
  if (!engine._seq) {
    const seq = [];
    engine.books.forEach((b) => {
      for (let c = 1; c <= b.chapterCount; c += 1) seq.push({ abbrev: b.abbrev, chapter: c });
    });
    engine._seq = seq;
    engine._seqIndex = new Map(seq.map((s, i) => [`${s.abbrev}-${s.chapter}`, i]));
  }
  return engine._seq;
}

function chapterAt(offset, abbrev, chapter) {
  const seq = sequentialChapters();
  if (!seq.length) return null;
  const key = `${abbrev}-${Number(chapter)}`;
  const idx = engine._seqIndex.get(key);
  if (idx == null) return null;
  const next = seq[idx + offset];
  if (!next) return null;
  const book = getBook(next.abbrev);
  return { abbrev: next.abbrev, chapter: next.chapter, book: book ? book.displayName : next.abbrev };
}

export function getNextChapter(abbrev, chapter) {
  return chapterAt(1, abbrev, chapter);
}

export function getPrevChapter(abbrev, chapter) {
  return chapterAt(-1, abbrev, chapter);
}

// --- Pesquisa --------------------------------------------------
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function flatIndex() {
  if (!engine) return [];
  if (!engine._flat) {
    const flat = [];
    engine.books.forEach((b) => {
      b.chapters.forEach((chapterTexts, ci) => {
        chapterTexts.forEach((text, vi) => {
          flat.push({
            id: `${b.abbrev}-${ci + 1}-${vi + 1}`,
            abbrev: b.abbrev,
            book: b.displayName,
            testament: b.testament,
            bookNumber: b.bookNumber,
            chapter: ci + 1,
            verse: vi + 1,
            text,
            search: normalize(text),
          });
        });
      });
    });
    engine._flat = flat;
  }
  return engine._flat;
}

export function searchBible(query, options = {}) {
  const { limit = 200 } = options;
  const term = normalize(String(query || '').trim());
  if (term.length < 2) return { total: 0, results: [], truncated: false };

  const results = [];
  let total = 0;
  const list = flatIndex();
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].search.includes(term)) {
      total += 1;
      if (results.length < limit) results.push(list[i]);
    }
  }

  return {
    total,
    results: results.map(({ search, ...rest }) => rest),
    truncated: total > results.length,
  };
}

export const BOOK_TESTAMENTS = [
  { key: 'AT', label: 'Antigo Testamento' },
  { key: 'NT', label: 'Novo Testamento' },
];
