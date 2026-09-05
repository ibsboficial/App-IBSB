// ============================================================
// IBSB — Utilitários de texto/formatação
// ============================================================

export function normalizeUrl(value, prefix = 'https://') {
  if (!value) return value;
  if (/^https?:\/\//.test(value)) return value;
  if (/^mailto:/i.test(value)) return value;
  return prefix + value.replace(/^@/, '');
}

export function stripTags(html) {
  return html ? html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
}

export function truncate(text, max = 140) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
