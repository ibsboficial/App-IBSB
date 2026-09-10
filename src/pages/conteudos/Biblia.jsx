// ============================================================
// IBSB — Bíblia (tela principal)
// Fonte: BLIVRE.json. Antigo e Novo Testamento, livros e atalhos.
// ============================================================

import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { useBible, useBibleFavorites } from '../../hooks/useBible';
import { BOOK_TESTAMENTS, BIBLE_LABEL, getBooks } from '../../data/bible';

export default function Biblia() {
  const { ready, error } = useBible();
  const favorites = useBibleFavorites();

  return (
    <>
      <PageHeader title="Bíblia" subtitle={BIBLE_LABEL} />

      <section className="section">
        <div className="bible-hero">
          <span className="bible-hero-icon">
            <Icon name="bible" size={34} />
          </span>
          <div className="bible-hero-text">
            <h2>Bíblia Livre</h2>
            <p className="muted small">
              Leia, pesquise e favorite versículos. Texto integral da {BIBLE_LABEL}.
            </p>
          </div>
          <div className="bible-hero-actions">
            <Link to="/biblia/pesquisa" className="btn btn-primary">
              <Icon name="search" size={16} /> Pesquisar
            </Link>
            <Link to="/biblia/favoritos" className="btn btn-outline">
              <Icon name="heart" size={16} /> Favoritos{favorites.length ? ` (${favorites.length})` : ''}
            </Link>
            <Link to="/biblia/sobre" className="btn btn-ghost">
              Sobre a Bíblia
            </Link>
          </div>
        </div>
      </section>

      {!ready && !error && <Spinner label="Carregando a Bíblia..." />}

      {error && (
        <EmptyState
          icon="book"
          title="Não foi possível carregar a Bíblia"
          text={error.message}
        />
      )}

      {ready &&
        BOOK_TESTAMENTS.map((t) => {
          const books = getBooks(t.key);
          return (
            <section className="section" key={t.key}>
              <div className="bible-testament-head">
                <h3 className="section-title">{t.label}</h3>
                <span className="muted small">{books.length} livros</span>
              </div>
              <div className="bible-books">
                {books.map((b) => (
                  <Link
                    key={b.abbrev}
                    to={`/biblia/${encodeURIComponent(b.abbrev)}`}
                    className="bible-book"
                  >
                    <span className="bible-book-abbrev">{b.abbrev}</span>
                    <span className="bible-book-name">{b.displayName}</span>
                    <span className="bible-book-meta">{b.chapterCount} capítulos</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
    </>
  );
}
