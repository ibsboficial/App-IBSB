// ============================================================
// IBSB — PageBanner
// Banner configurável no topo das páginas internas, definido em
// Identidade Visual (settings.branding.pageImages[<página>]).
// ============================================================

import { useData } from '../../context/DataContext';

export default function PageBanner({ page }) {
  const { app } = useData();
  const src = app.pageImages?.[page];
  if (!src) return null;
  return (
    <div className="page-banner">
      <img src={src} alt="" loading="lazy" />
    </div>
  );
}
