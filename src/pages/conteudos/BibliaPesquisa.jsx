// ============================================================
// IBSB — Bíblia (pesquisa em toda a Bíblia)
// Pesquisa sem diferenciar maiúsculas/minúsculas e sem acentos.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { EmptyState, Spinner } from '../../components/ui/UI';
import { useBible } from '../../hooks/useBible';
import { searchBible } from '../../data/bible';

const EXAMPLES = ['amor', 'Jesus', 'Espírito Santo', 'fé', 'salvação'];

const enc = (v) => encodeURIComponent(v);

export default function BibliaPesquisa() {
  const { ready, error } = useBible();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const doSearch = (value) => {
    const term = value.trim();
    setQuery(value);
    if (term.length < 2) {
      setResult({ total: 0, results: [], truncated: false });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setResult(searchBible(term, { limit: 200 }));
      setBusy(false);
    }, 0);
  };

  return (
    <>
      <PageHeader title="Pesquisar na Bíblia" subtitle="Busca em Gênesis a Apocalipse" />

      <section className="section">
        <form className="bible-search-form" onSubmit={(e) => { e.preventDefault(); doSearch(query); }}>
          <div className="bible-search-row">
            <input
              className="input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: amor, Jesus, Espírito Santo"
              aria-label="Pesquisar na Bíblia"
            />
            <button type="submit" className="btn btn-primary">
              <Icon name="search" size={16} /> Buscar
            </button>
          </div>
          <div className="bible-search-examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="chip-filter" onClick={() => doSearch(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </form>
      </section>

      {(!ready && !error) && <Spinner label="Carregando a Bíblia..." />}
      {error && <EmptyState icon="book" title="Bíblia indisponível" text={error.message} />}

      {ready && busy && <Spinner label="Pesquisando..." />}

      {ready && !busy && result && (
        <section className="section">
          <p className="muted small">
            {result.total === 0
              ? 'Nenhum versículo encontrado.'
              : `${result.total} versículo(s) encontrado(s)${
                  result.truncated ? ' — mostrando os 200 primeiros' : ''
                }.`}
          </p>

          {result.results.length === 0 ? (
            <EmptyState
              icon="search"
              title="Sem resultados"
              text="Tente outra palavra ou uma palavra mais curta."
            />
          ) : (
            <div className="bible-results">
              {result.results.map((r) => (
                <Link
                  key={r.id}
                  to={`/biblia/${enc(r.abbrev)}/${r.chapter}?v=${r.verse}`}
                  className="bible-result"
                >
                  <span className="bible-result-ref">
                    {r.book} {r.chapter}:{r.verse}
                    <span className="badge-sm">{r.testament}</span>
                  </span>
                  <span className="bible-result-text">{r.text}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
