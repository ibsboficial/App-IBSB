// ============================================================
// IBSB — Detalhe do evento
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import { MediaImage } from '../../components/ui/Media';
import Icon from '../../components/ui/Icon';
import { Chip, EmptyState } from '../../components/ui/UI';
import { formatFull, relativeDay } from '../../utils/dates';
import { normalizeUrl } from '../../utils/format';

export default function EventoDetail() {
  const { id } = useParams();
  const { crud, settings } = useData();
  const evento = crud.events.get(id);
  const whatsapp = settings?.contact?.whatsapp;

  if (!evento) {
    return (
      <>
        <PageHeader title="Evento não encontrado" />
        <EmptyState icon="search" title="Não encontramos este evento" action={
          <Link to="/eventos" className="btn btn-outline">Voltar para Eventos</Link>
        } />
      </>
    );
  }

  const shareMessage = encodeURIComponent(
    `${evento.title} — ${formatFull(evento.date)} às ${evento.time} na ${evento.location}.`,
  );

  return (
    <>
      <PageHeader title="Evento" />

      <div className="detail-hero">
        <MediaImage src={evento.image} theme="gallery" className="detail-hero-media" alt={evento.title} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <Chip tone="accent">{evento.category}</Chip>
          <h1 className="detail-title">{evento.title}</h1>
          <div className="detail-meta-row">
            <span><Icon name="calendar" size={16} /> {formatFull(evento.date)}</span>
            <span><Icon name="clock" size={16} /> {evento.time}</span>
            <span><Icon name="pin" size={16} /> {evento.location}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="section">
          <h3 className="section-title">Sobre o evento</h3>
          <p className="detail-text">{evento.description}</p>

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
      </div>
    </>
  );
}
