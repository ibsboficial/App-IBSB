// ============================================================
// IBSB — Imagens de demonstração (SVG local, sem rede)
// Renderiza placeholders temáticos da marca. As imagens reais
// (da igreja) substituirão estes placeholders via admin.
// ============================================================

import Icon from './Icon';

const THEMES = {
  service: { icon: 'church', label: 'Culto', from: '#1677d6', to: '#0a5cae' },
  worship: { icon: 'live', label: 'Louvor', from: '#2f8fe6', to: '#1562b8' },
  sermon: { icon: 'mic', label: 'Pregação', from: '#1f6fc4', to: '#0c4d92' },
  devotional: { icon: 'book', label: 'Devocional', from: '#12a185', to: '#0a7460' },
  bible: { icon: 'bible', label: 'Bíblia', from: '#254c8f', to: '#142f5e' },
  news: { icon: 'bell', label: 'Aviso', from: '#e8a13c', to: '#c07e22' },
  men: { icon: 'users', label: 'Rede de Homens', from: '#1677d6', to: '#0a4f96' },
  women: { icon: 'users', label: 'Rede de Mulheres', from: '#d96ba6', to: '#a83e78' },
  youth: { icon: 'flame', label: 'Geração no Caminho', from: '#16a37e', to: '#0b6f54' },
  kids: { icon: 'sparkles', label: 'Rede Kids', from: '#e99a3a', to: '#c5731c' },
  conference: { icon: 'calendar', label: 'Conferência', from: '#6a5bd8', to: '#4335a8' },
  people: { icon: 'users', label: 'Comunhão', from: '#3a7bd5', to: '#1c4e93' },
  community: { icon: 'heart', label: 'Comunidade', from: '#d64580', to: '#9c2a55' },
  prayer: { icon: 'prayer', label: 'Oração', from: '#7c6fe0', to: '#4b3cb0' },
  gallery: { icon: 'image', label: 'Galeria', from: '#1f86c9', to: '#10547f' },
  logo: { icon: 'cross', label: 'IBSB', from: '#1677d6', to: '#0d4d90' },
};

export default function PlaceholderImage({ theme = 'service', label, className = '', height, width }) {
  const t = THEMES[theme] || THEMES.service;
  const id = `ph-${theme}`;
  const text = label || t.label;

  return (
    <svg
      className={className}
      width={width || '100%'}
      height={height || '100%'}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Imagem ilustrativa de demonstração: ${text}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.from} />
          <stop offset="100%" stopColor={t.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx="360" cy="20" r="110" fill="#ffffff" opacity="0.06" />
      <circle cx="20" cy="230" r="140" fill="#ffffff" opacity="0.07" />
      <g transform="translate(200 96)" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="-1" cy="-1" r="40" />
        <path d={iconPath(theme)} transform="translate(-1 -1) scale(0.6)" />
      </g>
      <text x="200" y="190" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="17" fontWeight="600" fill="#ffffff" opacity="0.92">
        {text}
      </text>
      <text x="200" y="214" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fontWeight="500" fill="#ffffff" opacity="0.65">
        Imagem de demonstração
      </text>
    </svg>
  );
}

function iconPath(theme) {
  const map = {
    service: 'M12 2L8 5v3L2 11v11h8v-6h4v6h8V11l-6-3V5z',
    worship: 'M8 5v14l11-7z',
    sermon: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 12a7 7 0 0 1-14 0M12 19v3M8 22h8',
    devotional: 'M4 4c2.5 0 4 1 4 1v15c0-1.5-1.5-3-4-3V4zm16 0c-2.5 0-4 1-4 1v15c0-1.5 1.5-3 4-3V4z',
    bible: 'M4 4c2.5 0 4 1 4 1v15c0-1.5-1.5-3-4-3V4zm16 0c-2.5 0-4 1-4 1v15c0-1.5 1.5-3 4-3V4zM8 5h8',
    news: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21a2 2 0 0 0 4 0',
    men: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87',
    women: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87',
    youth: 'M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-1.5.6-2.8 1.3-4C9 8.5 12 2 12 2z',
    kids: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z',
    conference: 'M7 2v3M17 2v3M4 7h16v13H4zM4 11h16',
    people: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    community: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
    prayer: 'M12 21c-4 0-8-2-8-8V7h3v6c0 2 2 3 5 3s5-1 5-3V7h3v6c0 6-4 8-8 8z',
    gallery: 'M4 4h16v16H4zM8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 17l4-4 3 3 3-4 6 6',
    logo: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',
    live: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6l5 4-5 4z',
  };
  return map[theme] || map.service;
}
