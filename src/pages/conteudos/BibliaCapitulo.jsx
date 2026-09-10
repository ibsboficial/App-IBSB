// ============================================================
// IBSB — Bíblia (leitura do capítulo)
// Navegação entre capítulos/livros, seleção rápida, destaque,
// favoritos, copiar e compartilhar. Texto integral da BLIVRE.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { useBible, useBibleFavorites } from '../../hooks/useBible';
import {
  getBook,
  getBooks,
  getChapter,
  getNextChapter,
  getPrevChapter,
  getVerseRecord,
} from '../../data/bible';
import { toggleFavorite } from '../../data/bibleFavorites';

const enc = (v) => encodeURIComponent(v);

export default function BibliaCapitulo() {
  const { abbrev, chapter } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlight = Number(searchParams.get('v')) || null;

  const { ready, error } = useBible();
  const favorites = useBibleFavorites();

  const data = ready ? getChapter(abbrev, chapter) : null;
  const prev = ready ? getPrevChapter(abbrev, chapter) : null;
  const next = ready ? getNextChapter(abbrev, chapter) : null;

  const favIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const [activeVerse, setActiveVerse] = useState(highlight);
  const [bookSel, setBookSel] = useState(abbrev);
  const [chapSel, setChapSel] = useState(String(chapter));
  const [toast, setToast] = useState('');

  useEffect(() => {
    setActiveVerse(highlight);
    setBookSel(abbrev);
    setChapSel(String(chapter));
  }, [highlight, abbrev, chapter]);

  useEffect(() => {
    if (!highlight) return undefined;
    const t = setTimeout(() => {
      const el = document.getElementById(`verse-${highlight}`);
      if (el) el.scrollIntoView({ block: 'center' });
    }, 80);
    return () => clearTimeout(t);
  }, [highlight, data]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!ready && !error) {
    return (
      <>
        <PageHeader title="Bíblia" />
        <Spinner label="Carregando..." />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <PageHeader title="Capítulo não encontrado" />
        <EmptyState
          icon="book"
          title="Não encontramos este capítulo"
          text={error ? error.message : 'Verifique o livro e o capítulo selecionados.'}
          action={<Link to="/biblia" className="btn btn-outline">Voltar para a Bíblia</Link>}
        />
      </>
    );
  }

  const selectedBook = getBook(bookSel) || data;
  const allBooks = getBooks();

  const copyVerse = async (rec) => {
    const text = `${rec.book} ${rec.chapter}:${rec.verse} — ${rec.text}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast('Versículo copiado');
    } catch {
      setToast('Não foi possível copiar');
    }
  };

  const shareVerse = async (rec) => {
    const text = `${rec.book} ${rec.chapter}:${rec.verse}\n${rec.text}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${rec.book} ${rec.chapter}:${rec.verse}`, text });
        return;
      } catch {
        return;
      }
    }
    copyVerse(rec);
  };

  const onToggleFavorite = (rec) => {
    const added = toggleFavorite(rec);
    setToast(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  };

  return (
    <>
      <PageHeader
        title={`${data.book} ${data.chapter}`}
        subtitle={`${data.abbrev} · ${
          data.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'
        }`}
      />

      <div className="bible-reader-toolbar">
        <div className="bible-quick">
          <label className="bible-quick-field">
            <span className="bible-quick-label">Livro</span>
            <select
              className="input"
              value={bookSel}
              onChange={(e) => navigate(`/biblia/${enc(e.target.value)}/1`)}
            >
              {allBooks.map((b) => (
                <option key={b.abbrev} value={b.abbrev}>{b.displayName}</option>
              ))}
            </select>
          </label>
          <label className="bible-quick-field">
            <span className="bible-quick-label">Capítulo</span>
            <select
              className="input"
              value={chapSel}
              onChange={(e) => navigate(`/biblia/${enc(bookSel)}/${e.target.value}`)}
            >
              {Array.from({ length: selectedBook.chapterCount }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <Link to="/biblia/pesquisa" className="btn btn-outline bible-quick-search" aria-label="Pesquisar">
            <Icon name="search" size={16} /> Buscar
          </Link>
        </div>
      </div>

      <article className="bible-reading">
        {data.verses.map((v) => {
          const isActive = activeVerse === v.verse;
          const isHighlight = highlight === v.verse;
          const rec = getVerseRecord(data.abbrev, data.chapter, v.verse);
          const fav = favIds.has(v.id);
          return (
            <div
              key={v.id}
              id={`verse-${v.verse}`}
              className={`bible-verse ${isActive ? 'is-active' : ''} ${isHighlight ? 'is-highlight' : ''}`}
              onClick={() => setActiveVerse(isActive ? null : v.verse)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveVerse(isActive ? null : v.verse);
              }}
            >
              <sup className="bible-verse-num">{v.verse}</sup>
              <span className="bible-verse-text">{v.text}</span>
              {isActive && (
                <div className="bible-verse-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`bible-action ${fav ? 'is-on' : ''}`}
                    onClick={() => onToggleFavorite(rec)}
                    aria-label={fav ? 'Remover dos favoritos' : 'Favoritar'}
                  >
                    <Icon name="heart" size={16} /> {fav ? 'Favorito' : 'Favoritar'}
                  </button>
                  <button type="button" className="bible-action" onClick={() => copyVerse(rec)}>
                    <Icon name="book" size={16} /> Copiar
                  </button>
                  <button type="button" className="bible-action" onClick={() => shareVerse(rec)}>
                    <Icon name="share" size={16} /> Compartilhar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </article>

      <nav className="bible-chapter-nav" aria-label="Navegação entre capítulos">
        {prev ? (
          <Link to={`/biblia/${enc(prev.abbrev)}/${prev.chapter}`} className="btn btn-outline">
            ‹ {prev.book} {prev.chapter}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/biblia/${enc(next.abbrev)}/${next.chapter}`} className="btn btn-outline">
            {next.book} {next.chapter} ›
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {toast && <div className="bible-toast" role="status">{toast}</div>}
    </>
  );
}
