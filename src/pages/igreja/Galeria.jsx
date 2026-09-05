// ============================================================
// IBSB — Galeria de fotos organizada por eventos
// ============================================================

import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import Icon from '../../components/ui/Icon';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { MediaImage } from '../../components/ui/Media';
import { useData } from '../../context/DataContext';
import { formatFull } from '../../utils/dates';

export default function Galeria() {
  const { albumId } = useParams();
  const { gallery, ready } = useData();

  const sorted = [...gallery].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!ready) return <Spinner />;

  if (albumId) {
    const album = gallery.find((g) => g.id === albumId);
    if (!album) {
      return (
        <>
          <PageHeader title="Álbum não encontrado" />
          <EmptyState icon="image" title="Não encontramos este álbum" />
        </>
      );
    }
    return (
      <>
        <PageHeader title={album.eventName} subtitle={formatFull(album.date)} />
        <div className="photo-grid">
          {album.photos.map((p) => (
            <figure key={p.id} className="photo-item">
              <MediaImage src={p.url} theme="gallery" className="photo-media" alt={p.caption || album.eventName} />
              {p.caption && <figcaption className="photo-caption">{p.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Galeria" subtitle="Fotos dos eventos da igreja" />
      <PageBanner page="galeria" />

      {sorted.length === 0 ? (
        <EmptyState
          icon="image"
          title="Nenhuma foto publicada"
          text="As fotos dos nossos eventos aparecerão aqui."
        />
      ) : (
        <div className="cards-grid">
          {sorted.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </>
  );
}

function AlbumCard({ album }) {
  const thumbs = album.photos.slice(0, 3);
  const extra = album.photos.length - thumbs.length;
  return (
    <Link to={`/galeria/${album.id}`} className="gallery-album">
      <div className="gallery-thumbs">
        {thumbs.map((p) => (
          <span key={p.id} className="gallery-thumb">
            <MediaImage src={p.url} theme="gallery" alt={p.caption || ''} />
            {extra > 0 && p === thumbs[thumbs.length - 1] && (
              <span className="gallery-thumb-more">+{extra}</span>
            )}
          </span>
        ))}
      </div>
      <div className="gallery-body">
        <h3>{album.eventName}</h3>
        <small>{formatFull(album.date)} · {album.photos.length} fotos</small>
      </div>
    </Link>
  );
}
