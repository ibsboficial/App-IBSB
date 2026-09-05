// ============================================================
// IBSB — Detalhe da notícia
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import PageHeader from '../../components/ui/PageHeader';
import { MediaImage } from '../../components/ui/Media';
import Icon from '../../components/ui/Icon';
import { EmptyState, Chip } from '../../components/ui/UI';
import { formatFull } from '../../utils/dates';

export default function NoticiaDetail() {
  const { id } = useParams();
  const { crud } = useData();
  const noticia = crud.news.get(id);

  if (!noticia) {
    return (
      <>
        <PageHeader title="Notícia não encontrada" />
        <EmptyState icon="search" title="Não encontramos este comunicado" action={
          <Link to="/noticias" className="btn btn-outline">Voltar para Notícias</Link>
        } />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Notícia" />

      <div className="detail-hero">
        <MediaImage src={noticia.image} theme="news" className="detail-hero-media" alt={noticia.title} />
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <Chip tone="accent">Aviso</Chip>
          <h1 className="detail-title">{noticia.title}</h1>
          <div className="detail-meta-row">
            <span><Icon name="calendar" size={16} /> {formatFull(noticia.date)}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="section">
          <div className="detail-block">
            <p className="detail-text" style={{ margin: 0 }}>{noticia.text}</p>
          </div>
        </section>
      </div>
    </>
  );
}
