// ============================================================
// IBSB — Detalhe da pregação
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import { MediaImage } from '../../components/ui/Media';
import Icon from '../../components/ui/Icon';
import { EmptyState, Chip } from '../../components/ui/UI';
import { SermonCard } from '../../components/ibsb/cards';
import { formatFull, relativeDay } from '../../utils/dates';

export default function PregacaoDetail() {
  const { id } = useParams();
  const { crud, sermons } = useData();
  const sermon = crud.sermons.get(id);

  if (!sermon) {
    return (
      <>
        <PageHeader title="Pregação não encontrada" />
        <EmptyState icon="search" title="Não encontramos esta pregação" action={
          <Link to="/pregacoes" className="btn btn-outline">Voltar para Pregações</Link>
        } />
      </>
    );
  }

  const others = sermons.filter((s) => s.id !== sermon.id).slice(0, 3);

  return (
    <>
      <PageHeader title="Pregação" />

      <div className="detail-hero">
        <MediaImage src={sermon.image} theme="sermon" className="detail-hero-media" alt={sermon.title} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <Chip tone="accent">{relativeDay(sermon.date)}</Chip>
          <h1 className="detail-title">{sermon.title}</h1>
          <div className="detail-meta-row">
            <span><Icon name="mic" size={16} /> {sermon.preacher}</span>
            <span><Icon name="calendar" size={16} /> {formatFull(sermon.date)}</span>
            {sermon.passage && <span><Icon name="bible" size={16} /> {sermon.passage}</span>}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="section">
          {sermon.videoUrl ? (
            <div className="live-player" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)' }}>
              <iframe
                className="video-frame"
                src={sermon.videoUrl}
                title={sermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="live-panel">
              <div className="live-player">
                <div className="live-placeholder">
                  <span className="live-icon-ring">
                    <Icon name="play" size={38} />
                  </span>
                  <strong>Vídeo em breve</strong>
                  <span className="small" style={{ opacity: 0.8 }}>
                    Este vídeo será publicado no canal do YouTube. Integração prevista.
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="section">
          <h3 className="section-title">Sobre a mensagem</h3>
          <p className="detail-text">{sermon.description}</p>
          {sermon.passage && (
            <div className="verse-block mt-16">
              <p>“Leitura sugerida: {sermon.passage}”</p>
            </div>
          )}
        </section>

        {others.length > 0 && (
          <section className="section">
            <h3 className="section-title">Mais pregações</h3>
            <div className="cards-grid mt-12">
              {others.map((s) => (
                <SermonCard key={s.id} sermon={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
