// ============================================================
// IBSB — Detalhe do culto
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import { MediaImage } from '../../components/ui/Media';
import Icon from '../../components/ui/Icon';
import { Chip, EmptyState } from '../../components/ui/UI';
import { formatFull, relativeDay } from '../../utils/dates';
import { normalizeUrl } from '../../utils/format';

export default function CultoDetail() {
  const { id } = useParams();
  const { crud, services, settings } = useData();
  const culto = crud.services.get(id);
  const whatsapp = settings?.contact?.whatsapp;

  if (!culto) {
    return (
      <>
        <PageHeader title="Culto não encontrado" />
        <EmptyState icon="search" title="Não encontramos este culto" action={
          <Link to="/cultos" className="btn btn-outline">Voltar para Cultos</Link>
        } />
      </>
    );
  }

  const others = services
    .filter((s) => s.id !== culto.id && new Date(s.date) >= new Date())
    .slice(0, 2);

  const shareMessage = encodeURIComponent(
    `${culto.title} — ${formatFull(culto.date)} às ${culto.time} na ${culto.location}.`,
  );

  return (
    <>
      <PageHeader title="Culto" />

      <div className="detail-hero">
        <MediaImage src={culto.image} theme="service" className="detail-hero-media" alt={culto.title} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <span className="tiny tag tag-accent">{relativeDay(culto.date)}</span>
          <h1 className="detail-title">{culto.title}</h1>
          <div className="detail-meta-row">
            <span><Icon name="calendar" size={16} /> {formatFull(culto.date)}</span>
            <span><Icon name="clock" size={16} /> {culto.time}</span>
            <span><Icon name="pin" size={16} /> {culto.location}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="section">
          <h3 className="section-title">Sobre este culto</h3>
          <p className="detail-text">{culto.description}</p>

          <div className="detail-actions mt-16">
            {whatsapp && (
              <a
                className="btn btn-primary"
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${shareMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={17} /> Quero participar
              </a>
            )}
            {settings?.contact?.mapUrl && (
              <a
                className="btn btn-outline"
                href={normalizeUrl(settings.contact.mapUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="pin" size={16} /> Como chegar
              </a>
            )}
          </div>
        </section>

        {others.length > 0 && (
          <section className="section">
            <h3 className="section-title">Outros cultos</h3>
            <div className="mini-list mt-12">
              {others.map((s) => (
                <Link key={s.id} to={`/cultos/${s.id}`} className="mini-list-item">
                  <span className="mini-list-date">
                    {new Date(s.date).getDate()}
                    <small>
                      {new Date(s.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </small>
                  </span>
                  <span className="mini-list-main">
                    <strong>{s.title}</strong>
                    <small>{formatFull(s.date)} · {s.time}</small>
                  </span>
                  <Icon name="chevronRight" size={16} className="mini-list-arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
