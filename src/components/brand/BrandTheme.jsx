// ============================================================
// IBSB — BrandTheme
// Aplica dinamicamente as cores, o favicon e o theme-color
// vindos das configurações (settings) administradas pelo painel.
// ============================================================

import { useEffect } from 'react';
import { useData } from '../../context/DataContext';

export default function BrandTheme() {
  const { app, settings, ready } = useData();

  // Cores principais → variáveis CSS
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const c = app.colors;
    if (c.primary) root.style.setProperty('--ibsb-500', c.primary);
    if (c.primaryDark) root.style.setProperty('--ibsb-600', c.primaryDark);
    if (c.primaryLight) root.style.setProperty('--ibsb-300', c.primaryLight);
    if (c.accent) root.style.setProperty('--accent', c.accent);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && c.primary) meta.content = c.primary;

    const full = (settings?.identity?.fullName || app.fullName || '').trim();
    if (full) document.title = full;
  }, [app.colors, app.fullName, settings, ready]);

  // Favicon configurável
  useEffect(() => {
    if (!ready || !app.favicon) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== app.favicon) link.href = app.favicon;
  }, [app.favicon, ready]);

  return null;
}
