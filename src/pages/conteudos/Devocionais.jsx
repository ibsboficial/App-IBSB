// ============================================================
// IBSB — Devocionais
// ============================================================

import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { DevotionalCard } from '../../components/ibsb/cards';

export default function Devocionais() {
  const { devotionals, ready } = useData();

  const sorted = [...devotionals].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!ready) return <Spinner />;

  return (
    <>
      <PageHeader title="Devocionais" subtitle="Uma palavra para o seu dia" />
      <PageBanner page="devocionais" />

      {sorted.length === 0 ? (
        <EmptyState
          icon="book"
          title="Nenhum devocional publicado"
          text="Novos devocionais serão publicados em breve."
        />
      ) : (
        <div className="cards-grid">
          {sorted.map((d) => (
            <DevotionalCard key={d.id} devotional={d} />
          ))}
        </div>
      )}
    </>
  );
}
