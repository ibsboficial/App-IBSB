// ============================================================
// IBSB — Eventos (com filtro por categoria)
// ============================================================

import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { EventCard } from '../../components/ibsb/cards';
import { EVENT_CATEGORIES } from '../../config/appConfig';

export default function Eventos() {
  const { events, ready } = useData();
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', ...EVENT_CATEGORIES];

  const upcoming = useMemo(
    () =>
      [...events]
        .filter((e) => new Date(e.date) >= new Date(Date.now() - 3 * 60 * 60 * 1000))
        .filter((e) => category === 'Todos' || e.category === category)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events, category],
  );

  const past = useMemo(
    () =>
      [...events]
        .filter((e) => new Date(e.date) < new Date(Date.now() - 3 * 60 * 60 * 1000))
        .filter((e) => category === 'Todos' || e.category === category)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [events, category],
  );

  if (!ready) return <Spinner />;

  return (
    <>
      <PageHeader title="Eventos" subtitle="Encontros, redes e conferências da IBSB" />
      <PageBanner page="eventos" />

      <div className="chip-row" role="tablist" aria-label="Categorias de eventos">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`chip-filter ${category === c ? 'is-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="section mt-16">
        {upcoming.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="Nenhum evento nesta categoria"
            text="Novos eventos serão divulgados em breve."
          />
        ) : (
          <div className="cards-grid">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="section">
          <h3 className="section-title">Eventos anteriores</h3>
          <div className="cards-grid mt-12">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
