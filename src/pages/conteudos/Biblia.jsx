// ============================================================
// IBSB — Bíblia
// Interface preparada para futura integração com uma API
// bíblica (ex.: Bible API). Nenhum conteúdo protegido é usado.
// ============================================================

import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';

export default function Biblia() {
  const [query, setQuery] = useState('');

  return (
    <>
      <PageHeader title="Bíblia" subtitle="Leitura e busca bíblica" />

      <section className="section">
        <div className="live-panel">
          <div className="bible-intro">
            <span className="bible-icon">
              <Icon name="bible" size={36} />
            </span>
            <h2>A Palavra de Deus</h2>
            <p className="muted" style={{ maxWidth: 460, margin: '0 auto' }}>
              Em breve você poderá ler e buscar qualquer passagem bíblica aqui no aplicativo,
              integrada a uma API bíblica gratuita e licenciada.
            </p>
          </div>

          <div className="detail-body" style={{ maxWidth: '100%', padding: '0 20px 24px' }}>
            <div className="field">
              <label htmlFor="bible-search">Buscar passagem</label>
              <input
                id="bible-search"
                className="input"
                type="text"
                placeholder="Ex.: João 3.16"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled
              />
              <p className="form-hint">
                Busca desabilitada por enquanto — será ativada com a integração da API bíblica.
              </p>
            </div>

            <div className="bible-options">
              <div className="bible-option" style={{ pointerEvents: 'none' }}>
                <span className="bible-option-icon"><Icon name="book" size={20} /></span>
                <span>
                  <strong>Planos de leitura</strong>
                  <small>Em breve</small>
                </span>
              </div>
              <div className="bible-option" style={{ pointerEvents: 'none' }}>
                <span className="bible-option-icon"><Icon name="sparkles" size={20} /></span>
                <span>
                  <strong>Versículo do dia</strong>
                  <small>Em breve</small>
                </span>
              </div>
              <div className="bible-option" style={{ pointerEvents: 'none' }}>
                <span className="bible-option-icon"><Icon name="search" size={20} /></span>
                <span>
                  <strong>Busca por palavra</strong>
                  <small>Em breve</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
