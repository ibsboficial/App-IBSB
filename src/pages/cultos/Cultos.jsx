// ============================================================
// IBSB — Cultos
// ============================================================

import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { ServiceCard } from '../../components/ibsb/cards';
import { formatFull, relativeDay } from '../../utils/dates';
import Icon from '../../components/ui/Icon';

export default function Cultos() {
  const { upcomingServices, services, ready } = useData();

  const past = services
    .filter((s) => new Date(s.date) < new Date(Date.now() - 3 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!ready) return <Spinner />;

  return (
    <>
      <PageHeader title="Cultos" subtitle="Venha celebrar com a nossa família de fé" />
      <PageBanner page="cultos" />

      {upcomingServices.length === 0 && (
        <EmptyState
          icon="church"
          title="Nenhum culto agendado"
          text="Os próximos cultos serão divulgados em breve."
        />
      )}

      <section className="section">
        <div className="cards-grid">
          {upcomingServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section">
          <h3 className="section-title">Cultos anteriores</h3>
          <div className="mini-list mt-12">
            {past.map((s) => (
              <Link key={s.id} to={`/cultos/${s.id}`} className="mini-list-item">
                <span className="mini-list-date">
                  {new Date(s.date).getDate()}
                  <small>
                    {new Date(s.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </small>
                </span>
                <span className="mini-list-main">
                  <strong>{s.title}</strong>
                  <small>
                    {formatFull(s.date)} · {s.time}
                  </small>
                </span>
                <Icon name="chevronRight" size={16} className="mini-list-arrow" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-prayer mt-24">
        <div className="home-prayer-inner">
          <span className="home-prayer-icon">
            <Icon name="bell" size={24} />
          </span>
          <div className="home-prayer-text">
            <h3>Fique por dentro</h3>
            <p>Ative o instalável e receba avisos dos próximos cultos e eventos.</p>
          </div>
          <Link to="/eventos" className="btn btn-primary">
            Ver eventos <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
