// ============================================================
// IBSB — Igreja (hub)
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import PageHeader from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/UI';
import { NewsCard } from '../../components/ibsb/cards';
import { useData } from '../../context/DataContext';

export default function Igreja() {
  const { recentNews, settings, app } = useData();
  const serviceTimes = settings?.serviceTimes || [];

  const items = [
    { to: '/sobre', icon: 'heart', label: `Sobre a ${app.name}`, desc: 'História, missão e valores', color: '#1677d6' },
    { to: '/redes', icon: 'users', label: 'Redes da Igreja', desc: 'Homens, mulheres, jovens e kids', color: '#16a37e' },
    { to: '/noticias', icon: 'bell', label: 'Notícias e avisos', desc: 'Comunicados da igreja', color: '#d99a24' },
    { to: '/galeria', icon: 'image', label: 'Galeria de fotos', desc: 'Momentos e eventos', color: '#6a5bd8' },
    { to: '/contato', icon: 'chat', label: 'Contato', desc: 'Endereço e redes sociais', color: '#0f5fb0' },
  ];

  return (
    <>
      <PageHeader title="A Igreja" subtitle={app.fullName} />

      <section className="section">
        <div className="bible-options">
          {items.map((h) => (
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

      {serviceTimes.length > 0 && (
        <section className="section">
          <h3 className="section-title">Horários dos cultos</h3>
          <div className="service-times">
            {serviceTimes.map((st) => (
              <div key={st.id} className="service-time">
                <div>
                  <strong>{st.title || 'Culto'}</strong>
                  <small>{st.day}</small>
                </div>
                <span className="service-time-clock">{st.time}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <SectionHeader title="Notícias e avisos" to="/noticias" />
        {recentNews.length > 0 ? (
          <div className="cards-grid">
            {recentNews.slice(0, 2).map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        ) : (
          <p className="muted">Comunicados serão publicados aqui.</p>
        )}
      </section>
    </>
  );
}
