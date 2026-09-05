// ============================================================
// IBSB — BottomNav (navegação inferior no celular)
// INÍCIO · CULTOS · CONTEÚDOS · IGREJA · MENU
// ============================================================

import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const ITEMS = [
  { to: '/', label: 'Início', icon: 'home', end: true },
  { to: '/cultos', label: 'Cultos', icon: 'church' },
  { to: '/conteudos', label: 'Conteúdos', icon: 'book' },
  { to: '/igreja', label: 'Igreja', icon: 'users' },
  { to: '/menu', label: 'Menu', icon: 'menu' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'is-active' : ''}`}
        >
          <span className="bottom-nav-icon">
            <Icon name={item.icon} size={23} strokeWidth={item.end ? 2 : 1.9} />
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
