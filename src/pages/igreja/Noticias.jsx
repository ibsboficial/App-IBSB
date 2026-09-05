// ============================================================
// IBSB — Notícias e Avisos
// ============================================================

import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { NewsCard } from '../../components/ibsb/cards';

export default function Noticias() {
  const { news, ready, app } = useData();
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!ready) return <Spinner />;

  return (
    <>
      <PageHeader title="Notícias e avisos" subtitle={`Comunicados oficiais da ${app.name}`} />
      <PageBanner page="noticias" />

      {sorted.length === 0 ? (
        <EmptyState
          icon="bell"
          title="Nenhum aviso publicado"
          text="Os comunicados da igreja aparecerão aqui."
        />
      ) : (
        <div className="cards-grid">
          {sorted.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}
    </>
  );
}
