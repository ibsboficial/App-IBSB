// ============================================================
// IBSB — Bíblia (Sobre / atribuição obrigatória da BLIVRE)
// ============================================================

import { useMemo } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { useBible } from '../../hooks/useBible';
import { BIBLE_LABEL, getBooks } from '../../data/bible';

export default function BibliaSobre() {
  const { ready } = useBible();

  const stats = useMemo(() => {
    if (!ready) return null;
    const books = getBooks();
    let chapters = 0;
    let verses = 0;
    books.forEach((b) => {
      chapters += b.chapterCount;
      b.chapters.forEach((c) => {
        verses += c.length;
      });
    });
    return { books: books.length, chapters, verses };
  }, [ready]);

  return (
    <>
      <PageHeader title="Sobre a Bíblia" subtitle={BIBLE_LABEL} />

      <section className="section">
        <div className="card bible-about">
          <span className="bible-about-icon">
            <Icon name="bible" size={30} />
          </span>
          <h2>{BIBLE_LABEL}</h2>
          <p className="bible-about-copy">
            Todo o texto bíblico deste aplicativo vem exclusivamente da Bíblia Livre
            (BLIVRE), preservado integralmente como no arquivo original.
          </p>

          <dl className="bible-about-grid">
            <div>
              <dt>Título</dt>
              <dd>Bíblia Livre (BLIVRE)</dd>
            </div>
            <div>
              <dt>Copyright</dt>
              <dd>© Diego Santos, Mario Sérgio e Marco Teles. Fevereiro de 2018.</dd>
            </div>
            <div>
              <dt>Licença</dt>
              <dd>
                Creative Commons Atribuição 4.0 Brasil (CC BY 4.0) —{' '}
                <a
                  className="bible-about-link"
                  href="https://creativecommons.org/licenses/by/4.0/br/"
                  target="_blank"
                  rel="noreferrer"
                >
                  creativecommons.org/licenses/by/4.0/br/
                </a>
              </dd>
            </div>
            <div>
              <dt>Fonte</dt>
              <dd>
                <a
                  className="bible-about-link"
                  href="http://sites.google.com/site/biblialivre/"
                  target="_blank"
                  rel="noreferrer"
                >
                  sites.google.com/site/biblialivre/
                </a>
              </dd>
            </div>
            <div>
              <dt>Versão utilizada</dt>
              <dd>Bíblia Livre (BLIVRE)</dd>
            </div>
          </dl>

          {stats && (
            <p className="muted small bible-about-stats">
              {stats.books} livros · {stats.chapters.toLocaleString('pt-BR')} capítulos ·{' '}
              {stats.verses.toLocaleString('pt-BR')} versículos
            </p>
          )}
        </div>
      </section>
    </>
  );
}
