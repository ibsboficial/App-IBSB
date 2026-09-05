// ============================================================
// IBSB — Pregações
// ============================================================

import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { SermonCard } from '../../components/ibsb/cards';

export default function Pregacoes() {
  const { sermons, ready } = useData();

  const sorted = [...sermons].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!ready) return <Spinner />;

  return (
    <>
      <PageHeader
        title="Pregações"
        subtitle="Mensagens da Palavra de Deus"
      />
      <PageBanner page="pregacoes" />

      {sorted.length === 0 ? (
        <EmptyState
          icon="mic"
          title="Nenhuma pregação publicada"
          text="As mensagens dos cultos serão publicadas aqui. Em breve haverá integração com o canal do YouTube."
        />
      ) : (
        <div className="cards-grid">
          {sorted.map((s) => (
            <SermonCard key={s.id} sermon={s} />
          ))}
        </div>
      )}
    </>
  );
}
