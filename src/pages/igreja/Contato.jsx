// ============================================================
// IBSB — Contato
// Dados configuráveis (Painel Administrativo) — sem inventar.
// ============================================================

import PageHeader from '../../components/ui/PageHeader';
import PageBanner from '../../components/ui/PageBanner';
import Icon from '../../components/ui/Icon';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { normalizeUrl } from '../../utils/format';

export default function Contato() {
  const { settings, app } = useData();
  const c = settings?.contact || {};

  const rows = [];
  if (c.address) rows.push({ icon: 'pin', label: 'Endereço', value: c.address, href: normalizeUrl(c.mapUrl) });
  if (c.phone) rows.push({ icon: 'phone', label: 'Telefone', value: c.phone, href: `tel:${c.phone.replace(/\D/g, '')}` });
  if (c.whatsapp) rows.push({ icon: 'whatsapp', label: 'WhatsApp', value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}` });
  if (c.email) rows.push({ icon: 'send', label: 'E-mail', value: c.email, href: `mailto:${c.email}` });
  if (c.instagram) rows.push({ icon: 'instagram', label: 'Instagram', value: c.instagram, href: normalizeUrl(c.instagram, 'https://instagram.com/') });
  if (c.facebook) rows.push({ icon: 'facebook', label: 'Facebook', value: c.facebook, href: normalizeUrl(c.facebook, 'https://facebook.com/') });
  if (c.youtube) rows.push({ icon: 'youtube', label: 'YouTube', value: c.youtube, href: normalizeUrl(c.youtube, 'https://youtube.com/') });

  return (
    <>
      <PageHeader title="Contato" subtitle={`Fale com a ${app.name}`} />
      <PageBanner page="contato" />

      <div className="contact-grid">
        <section className="card contact-card">
          <h3 className="section-title">Informações</h3>

          {rows.length === 0 && (
            <p className="muted">
              Os dados de contato ainda não foram configurados. Em breve estarão disponíveis.
            </p>
          )}

          <div className="stack-8 mt-12">
            {rows.map((r) => (
              <a key={r.label} className="contact-row" href={r.href} target={r.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="contact-row-ic">
                  <Icon name={r.icon} size={20} />
                </span>
                <span>
                  <strong>{r.label}</strong>
                  <span>{r.value}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="card contact-card">
          <h3 className="section-title">Localização</h3>
          {c.mapUrl ? (
            <div className="map-frame mt-12">
              <a
                className="btn btn-primary"
                href={normalizeUrl(c.mapUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="pin" size={16} /> Abrir no mapa
              </a>
            </div>
          ) : (
            <div className="map-frame mt-12">
              <span className="muted small">
                O endereço e o mapa serão configurados pela igreja.
              </span>
            </div>
          )}
        </section>
      </div>

      <section className="home-prayer mt-24">
        <div className="home-prayer-inner">
          <span className="home-prayer-icon">
            <Icon name="chat" size={24} />
          </span>
          <div className="home-prayer-text">
            <h3>Precisa de oração ou conversar?</h3>
            <p>Você também pode enviar um pedido de oração — tudo é mantido em confidencialidade.</p>
          </div>
          <Link to="/oracao" className="btn btn-primary">
            Pedir oração <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
