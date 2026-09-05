// ============================================================
// IBSB — Home
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { SectionHeader, Chip } from '../../components/ui/UI';
import { Logo } from '../../components/ui/Media';
import Countdown from '../../components/ui/Countdown';
import { useData } from '../../context/DataContext';
import { formatFull, relativeDay, dayNumber } from '../../utils/dates';

const SHORTCUTS = [
  { to: '/biblia', icon: 'bible', label: 'Bíblia', tone: '#1677d6' },
  { to: '/cultos', icon: 'church', label: 'Cultos', tone: '#0f5fb0' },
  { to: '/eventos', icon: 'calendar', label: 'Eventos', tone: '#6a5bd8' },
  { to: '/oracao', icon: 'prayer', label: 'Oração', tone: '#d96ba6' },
  { to: '/contato', icon: 'chat', label: 'Contato', tone: '#16a37e' },
];

export default function Home() {
  const {
    ready,
    upcomingServices,
    upcomingEvents,
    recentSermons,
    recentDevotionals,
    settings,
    app,
  } = useData();

  const nextService = upcomingServices[0];
  const nextEvent = upcomingEvents[0];
  const lastSermon = recentSermons[0];
  const lastDevotional = recentDevotionals[0];
  const live = settings?.live;

  const isLive = Boolean(live?.active && live?.streamUrl);

  const heroBg = app.homeBackground
    ? {
        backgroundImage: `linear-gradient(rgba(10, 35, 70, 0.5), rgba(10, 35, 70, 0.62)), url(${app.homeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <>
      {/* Hero */}
      <section className="home-hero" style={heroBg}>
        <div className="home-hero-inner">
          <Logo size={64} dark />
          <div className="home-hero-text">
            <h1 className="home-title">Bem-vindo à {app.name}</h1>
            <p className="home-subtitle">
              {app.tagline}. Que a sua casa encontre a nossa família de fé.
            </p>
          </div>

          {isLive ? (
            <a href={live.streamUrl} target="_blank" rel="noreferrer" className="home-live-banner">
              <span className="live-dot" />
              <strong>Ao vivo agora</strong>
              <span className="home-live-cta">
                <Icon name="play" size={16} /> Assistir
              </span>
            </a>
          ) : (
            <Link to="/ao-vivo" className="home-live-off">
              <span className="live-dot live-dot-off" />
              <span>Transmissão ao vivo</span>
              <Icon name="chevronRight" size={16} />
            </Link>
          )}

          {nextService ? (
            <div className="home-next card">
              <div className="home-next-label">
                <Chip tone="accent">Próximo culto</Chip>
              </div>
              <div className="home-next-row">
                <div className="home-next-info">
                  <h2 className="home-next-title">{nextService.title}</h2>
                  <p className="home-next-meta">
                    <Icon name="calendar" size={15} /> {formatFull(nextService.date)}
                    &nbsp;·&nbsp;
                    <Icon name="clock" size={15} /> {nextService.time}
                  </p>
                  <p className="home-next-meta">
                    <Icon name="pin" size={15} /> {nextService.location}
                  </p>
                  <Link to={`/cultos/${nextService.id}`} className="btn btn-primary mt-8">
                    Ver detalhes <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
                <div className="home-countdown">
                  <span className="home-countdown-label">Começa em</span>
                  <Countdown date={nextService.date} />
                </div>
              </div>
            </div>
          ) : (
            <div className="card home-next">
              <p className="muted">Em breve divulgaremos os próximos cultos.</p>
            </div>
          )}
        </div>
      </section>

      {/* Atalhos */}
      <section className="section">
        <div className="shortcuts-grid">
          {SHORTCUTS.map((s) => (
            <Link key={s.to} to={s.to} className="shortcut">
              <span className="shortcut-icon" style={{ background: s.tone }}>
                <Icon name={s.icon} size={22} />
              </span>
              <span className="shortcut-label">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner principal */}
      {app.homeBanner && (
        <section className="section">
          <img
            className="home-banner"
            src={app.homeBanner}
            alt="Banner principal"
            loading="lazy"
          />
        </section>
      )}

      {/* Última pregação */}
      <section className="section">
        <SectionHeader title="Última pregação" to="/pregacoes" />
        {lastSermon ? (
          <Link to={`/pregacoes/${lastSermon.id}`} className="home-feature">
            <div className="home-feature-media">
              <img
                src={lastSermon.image && lastSermon.image !== 'sermon' ? lastSermon.image : app.featuredImage || undefined}
                alt=""
                className={lastSermon.image === 'sermon' && !app.featuredImage ? 'hidden-img' : undefined}
              />
              {lastSermon.image === 'sermon' && !app.featuredImage && (
                <div className="home-feature-ph">
                  <Icon name="mic" size={40} />
                  <span>Pregação</span>
                </div>
              )}
              <span className="home-feature-badge">
                <Icon name="play" size={15} /> Ver mensagem
              </span>
            </div>
            <div className="home-feature-body">
              <Chip tone="brand">{relativeDay(lastSermon.date)}</Chip>
              <h3 className="home-feature-title">{lastSermon.title}</h3>
              <p className="home-feature-meta">
                {lastSermon.preacher}
                {lastSermon.passage ? ` · ${lastSermon.passage}` : ''}
              </p>
            </div>
          </Link>
        ) : (
          <p className="muted">As pregações estarão disponíveis em breve.</p>
        )}
      </section>

      {/* Devocional do dia */}
      <section className="section">
        <SectionHeader title="Devocional" to="/devocionais" />
        {lastDevotional ? (
          <Link to={`/devocionais/${lastDevotional.id}`} className="home-devotional">
            <div className="home-devotional-icon">
              <Icon name="book" size={24} />
            </div>
            <div className="home-devotional-text">
              <span className="tiny tag tag-ok">Devocional de hoje</span>
              <h3 className="home-devotional-title">{lastDevotional.title}</h3>
              <p className="home-devotional-verse">“{lastDevotional.verse}”</p>
              <span className="home-devotional-ref">— {lastDevotional.verseRef}</span>
            </div>
            <Icon name="chevronRight" size={18} className="home-devotional-arrow" />
          </Link>
        ) : (
          <p className="muted">Novos devocionais em breve.</p>
        )}
      </section>

      {/* Próximo evento */}
      <section className="section">
        <SectionHeader title="Próximo evento" to="/eventos" />
        {nextEvent ? (
          <Link to={`/eventos/${nextEvent.id}`} className="home-event">
            <div className="home-event-date">
              <span>{new Date(nextEvent.date).getDate()}</span>
              <small>
                {new Date(nextEvent.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
              </small>
            </div>
            <div className="home-event-info">
              <span className="tiny tag tag-accent">{nextEvent.category}</span>
              <h3 className="home-event-title">{nextEvent.title}</h3>
              <p className="home-event-meta">
                {dayNumber(nextEvent.date)} · {nextEvent.time} · {nextEvent.location}
              </p>
            </div>
            <Icon name="chevronRight" size={18} className="home-event-arrow" />
          </Link>
        ) : (
          <p className="muted">Os próximos eventos serão divulgados em breve.</p>
        )}
      </section>

      {/* Pedido de oração */}
      <section className="home-prayer">
        <div className="home-prayer-inner">
          <span className="home-prayer-icon">
            <Icon name="prayer" size={26} />
          </span>
          <div className="home-prayer-text">
            <h3>Precisa de oração?</h3>
            <p>
              Envie seu pedido de oração. A igreja {app.name} estará orando por você, de forma
              confidencial.
            </p>
          </div>
          <Link to="/oracao" className="btn btn-primary">
            Enviar pedido <Icon name="send" size={16} />
          </Link>
        </div>
      </section>

      {/* Serviços futuros */}
      {upcomingServices.length > 1 && (
        <section className="section">
          <SectionHeader title="Próximos cultos" to="/cultos" />
          <div className="mini-list">
            {upcomingServices.slice(1, 4).map((s) => (
              <Link key={s.id} to={`/cultos/${s.id}`} className="mini-list-item">
                <span className="mini-list-date">
                  {new Date(s.date).getDate()}
                  <small>
                    {new Date(s.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </small>
                </span>
                <span className="mini-list-main">
                  <strong>{s.title}</strong>
                  <small>
                    {dayNumber(s.date)} · {s.time}
                  </small>
                </span>
                <Icon name="chevronRight" size={16} className="mini-list-arrow" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
