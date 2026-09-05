// ============================================================
// IBSB — Cards de conteúdo (cultos, eventos, pregações, etc.)
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { MediaImage } from '../ui/Media';
import { DateBadge } from '../ui/UI';
import { relativeDay } from '../../utils/dates';

function CardMedia({ item, theme, to }) {
  const content = (
    <MediaImage
      src={item.image}
      theme={theme}
      className="card-media"
      alt={item.title}
    />
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export function ServiceCard({ service }) {
  return (
    <article className="content-card">
      <CardMedia item={service} theme="service" to={`/cultos/${service.id}`} />
      <div className="content-card-body">
        <div className="content-card-top">
          <DateBadge value={service.date} />
          <div className="content-card-title-group">
            <h3 className="content-card-title">
              <Link to={`/cultos/${service.id}`}>{service.title}</Link>
            </h3>
            <p className="content-card-meta">
              <Icon name="clock" size={14} />
              {service.time} · {relativeDay(service.date)}
            </p>
          </div>
        </div>
        <p className="content-card-text small muted">{service.description}</p>
      </div>
    </article>
  );
}

export function EventCard({ event }) {
  return (
    <article className="content-card">
      <CardMedia item={event} theme={event.image || 'gallery'} to={`/eventos/${event.id}`} />
      <div className="content-card-body">
        <div className="content-card-top">
          <DateBadge value={event.date} />
          <div className="content-card-title-group">
            <h3 className="content-card-title">
              <Link to={`/eventos/${event.id}`}>{event.title}</Link>
            </h3>
            <p className="content-card-meta">
              <Icon name="clock" size={14} />
              {event.time} · {relativeDay(event.date)}
            </p>
          </div>
        </div>
        <div className="content-card-footer">
          <span className="tag tag-brand">{event.category}</span>
        </div>
      </div>
    </article>
  );
}

export function SermonCard({ sermon }) {
  return (
    <article className="content-card">
      <CardMedia item={sermon} theme="sermon" to={`/pregacoes/${sermon.id}`} />
      <div className="content-card-body">
        <h3 className="content-card-title">
          <Link to={`/pregacoes/${sermon.id}`}>{sermon.title}</Link>
        </h3>
        <p className="content-card-meta">
          <Icon name="mic" size={14} /> {sermon.preacher}
        </p>
        {sermon.passage && <p className="content-card-text small muted">{sermon.passage}</p>}
        {sermon.videoUrl ? (
          <a
            className="btn btn-outline btn-sm mt-8"
            href={sermon.videoUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="play" size={15} /> Assistir
          </a>
        ) : (
          <span className="tiny muted mt-8 inline-block">
            Vídeo em breve (integração YouTube)
          </span>
        )}
      </div>
    </article>
  );
}

export function DevotionalCard({ devotional }) {
  return (
    <article className="content-card devotional-card">
      <CardMedia item={devotional} theme="devotional" to={`/devocionais/${devotional.id}`} />
      <div className="content-card-body">
        <span className="tiny tag tag-brand">Devocional · {relativeDay(devotional.date)}</span>
        <h3 className="content-card-title">
          <Link to={`/devocionais/${devotional.id}`}>{devotional.title}</Link>
        </h3>
        <p className="content-card-text small muted">{devotional.verse}</p>
      </div>
    </article>
  );
}

export function NewsCard({ item }) {
  return (
    <article className="content-card">
      <CardMedia item={item} theme="news" to={`/noticias/${item.id}`} />
      <div className="content-card-body">
        <h3 className="content-card-title">
          <Link to={`/noticias/${item.id}`}>{item.title}</Link>
        </h3>
        <p className="content-card-meta">
          <Icon name="calendar" size={14} /> {relativeDay(item.date)}
        </p>
        <p className="content-card-text small muted">{item.text}</p>
      </div>
    </article>
  );
}
