// ============================================================
// IBSB — Admin Layout (protegido)
// ============================================================

import { NavLink, Navigate, Outlet } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Visão geral', icon: 'home', end: true },
  { to: '/admin/cultos', label: 'Cultos', icon: 'church' },
  { to: '/admin/eventos', label: 'Eventos', icon: 'calendar' },
  { to: '/admin/pregacoes', label: 'Pregações', icon: 'mic' },
  { to: '/admin/devocionais', label: 'Devocionais', icon: 'book' },
  { to: '/admin/noticias', label: 'Notícias', icon: 'bell' },
  { to: '/admin/fotos', label: 'Galeria', icon: 'image' },
  { to: '/admin/links', label: 'Links', icon: 'external' },
  { to: '/admin/oracoes', label: 'Pedidos de oração', icon: 'prayer' },
  { to: '/admin/igreja', label: 'Informações', icon: 'settings' },
  { to: '/admin/visual', label: 'Identidade visual', icon: 'palette' },
];

export default function AdminLayout() {
  const { isAdmin, authReady, logout, session } = useAuth();

  if (!authReady) {
    return (
      <div className="admin-page">
        <p className="muted small">Carregando…</p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <strong>Painel IBSB</strong>
          <small>Administração</small>
        </div>
        <nav className="admin-nav" aria-label="Menu do painel">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'is-active' : ''}`}
            >
              <Icon name={l.icon} size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div className="admin-user">
            <span className="admin-avatar">{session?.user?.charAt(0) || 'A'}</span>
            <span className="admin-user-info">
              <strong>{session?.user || 'admin'}</strong>
              <small>Administrador</small>
            </span>
          </div>
          <button className="btn btn-outline btn-sm btn-block" onClick={logout}>
            <Icon name="logout" size={15} /> Sair
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-mobile-top">
          <strong>Painel IBSB</strong>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            <Icon name="logout" size={16} /> Sair
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
