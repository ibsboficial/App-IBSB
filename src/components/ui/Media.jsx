// ============================================================
// IBSB — Media (imagem de conteúdo + logo)
// Se o item tiver uma URL de imagem real, mostra a imagem;
// caso contrário, renderiza um placeholder temático local.
// ============================================================

import { useState } from 'react';
import PlaceholderImage from './PlaceholderImage';
import { useData } from '../../context/DataContext';
import { BRAND } from '../../config/appConfig';

export function MediaImage({ src, theme = 'service', alt = '', className = '', imgClassName = '' }) {
  // Se não há URL real, renderiza um placeholder temático local.
  // Chaves como "service", "men", "women" (usadas nos dados de
  // demonstração) são tratadas como temas, não como URLs.
  const isRealImage =
    typeof src === 'string' &&
    !src.startsWith('theme:') &&
    (src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('data:') ||
      src.startsWith('blob:') ||
      src.startsWith('/'));

  if (!src || !isRealImage) {
    const t = src && src.startsWith('theme:') ? src.replace('theme:', '') : theme;
    return (
      <div className={`media-placeholder ${className}`.trim()}>
        <PlaceholderImage theme={t} />
      </div>
    );
  }

  return (
    <div className={`media-image ${className}`.trim()}>
      <img src={src} alt={alt} loading="lazy" className={imgClassName} />
    </div>
  );
}

export function Logo({ size = 44, withText = false, dark = false, className = '' }) {
  const { app } = useData();
  const [fallback, setFallback] = useState(false);
  const src = dark && app.logoDark ? app.logoDark : app.logoUrl;
  const primary = app.colors?.primary || BRAND.primary;
  const accent = app.colors?.accent || BRAND.accent;
  return (
    <div className={`logo ${className}`.trim()}>
      {!fallback ? (
        <img
          className="logo-img"
          src={src}
          alt={app.name}
          width={size}
          height={size}
          style={{ width: size, height: size }}
          onError={() => setFallback(true)}
        />
      ) : (
        <div className="logo-mark" style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} aria-label={app.name}>
            <rect x="1" y="1" width="46" height="46" rx="13" fill={primary} />
            <path d="M22 9h4v11h11v4H26v11h-4V24H11v-4h11z" fill="#ffffff" />
            <circle cx="36" cy="10" r="5" fill={accent} />
          </svg>
        </div>
      )}
      {withText && (
        <div className="logo-text">
          <strong>{app.name}</strong>
          <span>{app.fullName}</span>
        </div>
      )}
    </div>
  );
}
