// ============================================================
// IBSB — Conteúdos (hub)
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import PageHeader from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/UI';
import { SermonCard, DevotionalCard } from '../../components/ibsb/cards';
import { useData } from '../../context/DataContext';

const HUBS = [
  { to: '/pregacoes', icon: 'mic', label: 'Pregações', desc: 'Mensagens dos cultos', color: '#1677d6' },
  { to: '/devocionais', icon: 'book', label: 'Devocionais', desc: 'Palavra para o dia', color: '#12a185' },
  { to: '/ao-vivo', icon: 'live', label: 'Ao Vivo', desc: 'Transmissão dos cultos', color: '#d64545' },
  { to: '/biblia', icon: 'bible', label: 'Bíblia', desc: 'Leitura e busca', color: '#254c8f' },
];

export default function Conteudos() {
  const { recentSermons, recentDevotionals } = useData();

  return (
    <>
      <PageHeader title="Conteúdos" subtitle="Pregações, devocionais e transmissões" />

      <section className="section">
        <div className="bible-options">
          {HUBS.map((h) => (
            <Link key={h.to} to={h.to} className="bible-option">
              <span className="bible-option-icon" style={{ background: h.color + '18', color: h.color }}>
                <Icon name={h.icon} size={22} />
              </span>
              <span>
                <strong>{h.label}</strong>
                <small>{h.desc}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader title="Pregações recentes" to="/pregacoes" />
        {recentSermons.length > 0 ? (
          <div className="cards-grid">
            {recentSermons.slice(0, 3).map((s) => (
              <SermonCard key={s.id} sermon={s} />
            ))}
          </div>
        ) : (
          <p className="muted">As pregações estarão disponíveis em breve.</p>
        )}
      </section>

      <section className="section">
        <SectionHeader title="Devocionais recentes" to="/devocionais" />
        {recentDevotionals.length > 0 ? (
          <div className="cards-grid">
            {recentDevotionals.slice(0, 3).map((d) => (
              <DevotionalCard key={d.id} devotional={d} />
            ))}
          </div>
        ) : (
          <p className="muted">Novos devocionais em breve.</p>
        )}
      </section>
    </>
  );
}
