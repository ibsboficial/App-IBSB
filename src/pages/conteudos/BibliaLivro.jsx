// ============================================================
// IBSB — Bíblia (livro: grade de capítulos)
// ============================================================

import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { useBible } from '../../hooks/useBible';
import { getBook } from '../../data/bible';

export default function BibliaLivro() {
  const { abbrev } = useParams();
  const { ready, error } = useBible();
  const book = ready ? getBook(abbrev) : null;

  if (!ready && !error) {
    return (
      <>
        <PageHeader title="Bíblia" />
        <Spinner label="Carregando..." />
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <PageHeader title="Livro não encontrado" />
        <EmptyState
          icon="book"
          title="Não encontramos este livro"
          text={error ? error.message : `A abreviação "${abbrev}" não existe na Bíblia.`}
          action={<Link to="/biblia" className="btn btn-outline">Voltar para a Bíblia</Link>}
        />
      </>
    );
  }

  const chapters = Array.from({ length: book.chapterCount }, (_, i) => i + 1);

  return (
    <>
      <PageHeader
        title={book.displayName}
        subtitle={`${book.abbrev} · ${book.chapterCount} capítulos · ${
          book.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'
        }`}
      />

      <section className="section">
        <Link to="/biblia" className="bible-crumb">
          Bíblia
        </Link>
        <h3 className="section-title" style={{ marginTop: 6 }}>Escolha um capítulo</h3>
        <div className="bible-chapters">
          {chapters.map((c) => (
            <Link key={c} to={`/biblia/${encodeURIComponent(book.abbrev)}/${c}`} className="bible-chapter">
              {c}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
