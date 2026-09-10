// ============================================================
// IBSB — Utilidade: normalização de links do YouTube
// ============================================================

// Converte links do YouTube para o formato aceito pelo iframe
// (https://www.youtube.com/embed/VIDEO_ID).
// Aceita: /live/, /watch?v=, youtu.be/, /shorts/ e /embed/.
export function toEmbedUrl(url) {
  if (!url) return url;

  const value = String(url).trim();

  if (/youtube\.com\/embed\//.test(value)) return value;

  const patterns = [
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/(?:live|shorts)\/([\w-]{6,})/,
    /youtube\.com\/watch\?(?:[^#]*&)?v=([\w-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return value;
}
