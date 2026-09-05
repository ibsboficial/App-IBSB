// ============================================================
// IBSB — Redes da Igreja
// ============================================================

import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';

export default function Redes() {
  const { networks, settings, app } = useData();
  const whatsapp = settings?.contact?.whatsapp;

  return (
    <>
      <PageHeader
        title="Redes da Igreja"
        subtitle="Espaços de comunhão e discipulado"
      />

      <div className="cards-grid">
        {networks.map((r) => (
          <article key={r.id} className="network-card">
            <div className="network-card-top" style={{ background: `linear-gradient(135deg, ${r.color}, ${shade(r.color)})` }}>
              <span className="network-ic">
                <Icon name={r.icon} size={24} />
              </span>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
            </div>
            <div className="network-card-body">
              <span className="small muted">Participe</span>
              {whatsapp && (
                <a
                  className="btn btn-outline btn-sm"
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Quero participar da ${r.title} da ${app.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" size={15} /> Chamar no WhatsApp
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 45);
  const g = Math.max(0, ((n >> 8) & 0xff) - 45);
  const b = Math.max(0, (n & 0xff) - 45);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
