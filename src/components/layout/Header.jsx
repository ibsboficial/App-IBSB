// ============================================================
// IBSB — Header (barra superior + navegação para desktop)
// ============================================================

import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import { Logo } from '../ui/Media';
import { useData } from '../../context/DataContext';

const DESKTOP_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/cultos', label: 'Cultos' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/pregacoes', label: 'Pregações' },
  { to: '/devocionais', label: 'Devocionais' },
  { to: '/igreja', label: 'A Igreja' },
  { to: '/contato', label: 'Contato' },
];

export default function Header() {
  const { settings, app } = useData();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsapp = settings?.contact?.whatsapp;

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar-inner">
        <Link to="/" className="topbar-brand" aria-label="Ir para o início">
          <Logo size={34} />
          <span className="topbar-title">
            <strong>{app.name}</strong>
            <small>{app.fullName}</small>
          </span>
        </Link>

        <nav className="topbar-links hide-mobile" aria-label="Navegação principal">
          {DESKTOP_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `topbar-link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          {whatsapp && (
            <a
              className="topbar-wa"
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <Icon name="whatsapp" size={19} />
            </a>
          )}
          <Link to="/ao-vivo" className="btn btn-primary btn-sm topbar-live">
            <Icon name="live" size={16} />
            <span className="hide-mobile-inline">Ao Vivo</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
