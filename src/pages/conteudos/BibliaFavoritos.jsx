// ============================================================
// IBSB — Bíblia (favoritos)
// ============================================================

import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/UI';
import { useBibleFavorites } from '../../hooks/useBible';
import { removeFavorite } from '../../data/bibleFavorites';

const enc = (v) => encodeURIComponent(v);

export default function BibliaFavoritos() {
  const favorites = useBibleFavorites();

  return (
    <>
      <PageHeader title="Favoritos" subtitle="Versículos que você guardou" />

      <section className="section">
        {favorites.length === 0 ? (
          <EmptyState
            icon="heart"
            title="Nenhum favorito ainda"
            text="Abra um capítulo, toque em um versículo e escolha Favoritar."
            action={<Link to="/biblia" className="btn btn-outline">Ir para a Bíblia</Link>}
          />
        ) : (
          <div className="bible-fav-list">
            {favorites.map((f) => (
              <div className="bible-fav" key={f.id}>
                <Link
                  to={`/biblia/${enc(f.abbrev)}/${f.chapter}?v=${f.verse}`}
                  className="bible-fav-main"
                >
                  <span className="bible-fav-ref">{f.book} {f.chapter}:{f.verse}</span>
                  <span className="bible-fav-text">{f.text}</span>
                </Link>
                <button
                  type="button"
                  className="bible-fav-remove"
                  onClick={() => removeFavorite(f.id)}
                  aria-label={`Remover ${f.book} ${f.chapter}:${f.verse} dos favoritos`}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
