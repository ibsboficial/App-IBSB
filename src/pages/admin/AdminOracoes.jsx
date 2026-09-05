// ============================================================
// IBSB — Admin: Pedidos de oração (privados)
// Somente o administrador tem acesso a estes pedidos.
// ============================================================

import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/ui/UI';
import { formatFull } from '../../utils/dates';

export default function AdminOracoes() {
  const { prayers, crud } = useData();
  const [filter, setFilter] = useState('new');

  const sorted = [...prayers].sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

  const filtered = sorted.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'new') return !p.status || p.status === 'new';
    return p.status === 'prayed';
  });

  const setStatus = (id, status) => {
    crud.prayers.update(id, { status });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Pedidos de oração</h1>
          <p className="muted small">
            Confidenciais — visíveis somente no painel administrativo. Nunca publique.
          </p>
        </div>
      </div>

      <div className="chip-row">
        {[
          { k: 'new', l: 'Novos' },
          { k: 'prayed', l: 'Já orados' },
          { k: 'all', l: 'Todos' },
        ].map((f) => (
          <button
            key={f.k}
            className={`chip-filter ${filter === f.k ? 'is-active' : ''}`}
            onClick={() => setFilter(f.k)}
          >
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="prayer" title="Nenhum pedido aqui" text="Os pedidos enviados pelo aplicativo aparecerão nesta lista." />
      ) : (
        <div className="admin-prayer-cards">
          {filtered.map((p) => (
            <article key={p.id} className={`card admin-prayer-card ${p.status === 'prayed' ? 'is-prayed' : ''}`}>
              <header className="admin-prayer-head">
                <strong>{p.name || 'Anônimo'}</strong>
                <span className="tiny muted">
                  {formatFull(p.createdAt || p.date || new Date())}
                </span>
              </header>
              <p className="admin-prayer-text">{p.request}</p>
              <footer className="admin-prayer-foot">
                <span className="tiny muted">
                  {p.wantContact ? `Quer contato${p.email ? ` (${p.email})` : ''}` : 'Sem contato'}
                  {p.email && !p.wantContact ? ` · ${p.email}` : ''}
                </span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setStatus(p.id, p.status === 'prayed' ? 'new' : 'prayed')}
                >
                  <Icon name={p.status === 'prayed' ? 'x' : 'check'} size={14} />
                  {p.status === 'prayed' ? 'Marcar como novo' : 'Marcar como orado'}
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
