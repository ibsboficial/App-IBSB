// ============================================================
// IBSB — Detalhe do devocional
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import { MediaImage } from '../../components/ui/Media';
import Icon from '../../components/ui/Icon';
import { EmptyState, Chip } from '../../components/ui/UI';
import { formatFull } from '../../utils/dates';

export default function DevocionalDetail() {
  const { id } = useParams();
  const { crud } = useData();
  const dev = crud.devotionals.get(id);

  if (!dev) {
    return (
      <>
        <PageHeader title="Devocional não encontrado" />
        <EmptyState icon="search" title="Não encontramos este devocional" action={
          <Link to="/devocionais" className="btn btn-outline">Voltar para Devocionais</Link>
        } />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Devocional" />

      <div className="detail-hero">
        <MediaImage src={dev.image} theme="devotional" className="detail-hero-media" alt={dev.title} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <Chip tone="ok">Devocional</Chip>
          <h1 className="detail-title">{dev.title}</h1>
          <div className="detail-meta-row">
            <span><Icon name="calendar" size={16} /> {formatFull(dev.date)}</span>
            <span><Icon name="user" size={16} /> {dev.author}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="section">
          <div className="verse-block">
            <p>“{dev.verse}”</p>
            <cite>— {dev.verseRef}</cite>
          </div>

          <div className="detail-block mt-16">
            <p className="detail-text" style={{ margin: 0 }}>{dev.text}</p>
          </div>

          <div className="home-prayer mt-16">
            <div className="home-prayer-inner">
              <span className="home-prayer-icon">
                <Icon name="prayer" size={24} />
              </span>
              <div className="home-prayer-text">
                <h3>Quer orar sobre isso?</h3>
                <p>Envie um pedido de oração e compartilhe com a igreja, em confidencialidade.</p>
              </div>
              <Link to="/oracao" className="btn btn-primary">
                Orar <Icon name="send" size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
