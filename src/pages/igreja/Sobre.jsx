// ============================================================
// IBSB — Sobre a IBSB (história, missão, visão, valores, liderança)
// ============================================================

import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';

const VALUE_ICONS = ['heart', 'users', 'cross', 'send'];

export default function Sobre() {
  const { settings, app } = useData();
  const about = settings?.about || {};
  const src = app.pageImages?.sobre;

  return (
    <>
      {src ? (
        <PageBanner page="sobre" />
      ) : (
        <div className="about-hero">
          <h1>{app.fullName}</h1>
          <p>{app.tagline}</p>
        </div>
      )}

      <PageHeader title={`Sobre a ${app.name}`} back={false} />

      <div className="detail-body" style={{ maxWidth: '100%' }}>
        <section className="about-block">
          <h3 className="section-title">Nossa história</h3>
          {Array.isArray(about.history) ? (
            about.history.map((p, i) => (
              <p key={i} className="detail-text">{p}</p>
            ))
          ) : (
            <p className="detail-text">{about.history}</p>
          )}
        </section>

        <section className="about-block">
          <h3 className="section-title">Missão</h3>
          <div className="detail-block">
            <p className="detail-text" style={{ margin: 0 }}>{about.mission}</p>
          </div>
        </section>

        <section className="about-block">
          <h3 className="section-title">Visão</h3>
          <div className="detail-block">
            <p className="detail-text" style={{ margin: 0 }}>{about.vision}</p>
          </div>
        </section>

        {Array.isArray(about.values) && about.values.length > 0 && (
          <section className="about-block">
            <h3 className="section-title">Valores</h3>
            <div className="values-grid">
              {about.values.map((v, i) => (
                <div key={i} className="value-card">
                  <span className="value-card-ic">
                    <Icon name={VALUE_ICONS[i % VALUE_ICONS.length]} size={20} />
                  </span>
                  <h4>{v.title}</h4>
                  <p>{v.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(Array.isArray(about.leadership) && about.leadership.length > 0) || app.pastorName ? (
          <section className="about-block">
            <h3 className="section-title">Liderança</h3>
            {app.pastorName && (
              <div className="leader-card leader-card-pastor">
                <span className="leader-avatar">
                  {app.pastorName.charAt(0)}
                </span>
                <span>
                  <strong>{app.pastorName}</strong>
                  <small>{app.pastorRole}</small>
                </span>
              </div>
            )}
            {Array.isArray(about.leadership) && about.leadership.length > 0 && (
              <div className="leadership-grid">
                {about.leadership.map((l, i) => (
                  <div key={i} className="leader-card">
                    <span className="leader-avatar">
                      {l.name && l.name !== 'A definir' ? l.name.charAt(0) : 'I'}
                    </span>
                    <span>
                      <strong>{l.name}</strong>
                      <small>{l.role}</small>
                      {l.note && <small style={{ display: 'block' }}>{l.note}</small>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </>
  );
}
