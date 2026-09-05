// ============================================================
// IBSB — Componentes de UI reutilizáveis
// ============================================================

import { Link } from 'react-router-dom';
import Icon from './Icon';

export function SectionHeader({ title, to, actionLabel = 'Ver todos', style }) {
  return (
    <div className="section-head" style={style}>
      <h3 className="section-title">{title}</h3>
      {to && (
        <Link to={to} className="section-link">
          {actionLabel} <Icon name="arrowRight" size={15} />
        </Link>
      )}
    </div>
  );
}

export function Chip({ tone = 'brand', children }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

export function Spinner({ label = 'Carregando...' }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" />
      <span className="small muted">{label}</span>
    </div>
  );
}

export function EmptyState({ icon = 'search', title = 'Nada por aqui ainda', text = '', action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon name={icon} size={30} />
      </div>
      <h4>{title}</h4>
      {text && <p className="muted small">{text}</p>}
      {action}
    </div>
  );
}

export function Card({ children, className = '', hover = false, as: Tag = 'div', ...props }) {
  const cls = `card ${hover ? 'card-hover' : ''} ${className}`.trim();
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}

export function DateBadge({ value, fallback }) {
  const d = new Date(value);
  return (
    <div className="date-badge">
      <span className="date-badge-day">{d.getDate()}</span>
      <span className="date-badge-month">
        {d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
      </span>
    </div>
  );
}

export function Tag({ children, tone = 'brand' }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      {icon && (
        <span className="stat-icon">
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
