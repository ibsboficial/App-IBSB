// ============================================================
// IBSB — PageHeader (título + navegação de volta + ações)
// ============================================================

import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function PageHeader({ title, subtitle, back = true, actions }) {
  const navigate = useNavigate();
  return (
    <div className="page-header">
      <div className="page-header-row">
        {back && (
          <button
            className="page-back"
            onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/'))}
            aria-label="Voltar"
          >
            <Icon name="chevronRight" size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
        <div className="page-header-titles">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
}
