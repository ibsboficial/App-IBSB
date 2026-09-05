// ============================================================
// IBSB — Footer
// ============================================================

import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useData } from '../../context/DataContext';
import { backend } from '../../data/backend';

export default function Footer() {
  const { settings, app } = useData();
  const c = settings?.contact || {};

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>{app.fullName}</strong>
          <span className="small muted">{app.tagline}</span>
        </div>
        <nav className="footer-links" aria-label="Links do rodapé">
          <Link to="/cultos">Cultos</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/pregacoes">Pregações</Link>
          <Link to="/devocionais">Devocionais</Link>
          <Link to="/oracao">Pedido de oração</Link>
          <Link to="/sobre">Sobre a {app.name}</Link>
          <Link to="/contato">Contato</Link>
        </nav>
        <div className="footer-social">
          {c.instagram && (
            <a href={normalize(c.instagram, 'https://instagram.com/')} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" size={18} />
            </a>
          )}
          {c.facebook && (
            <a href={normalize(c.facebook, 'https://facebook.com/')} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Icon name="facebook" size={18} />
            </a>
          )}
          {c.youtube && (
            <a href={normalize(c.youtube, 'https://youtube.com/')} target="_blank" rel="noreferrer" aria-label="YouTube">
              <Icon name="youtube" size={18} />
            </a>
          )}
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <Icon name="whatsapp" size={18} />
            </a>
          )}
        </div>
        <p className="footer-copy tiny muted">
          © {new Date().getFullYear()} {app.fullName}.
          {backend.mode === 'demo' ? ' Aplicativo oficial. Dados de demonstração.' : ' Aplicativo oficial.'}
        </p>
      </div>
    </footer>
  );
}

function normalize(value, prefix) {
  if (/^https?:\/\//.test(value)) return value;
  return prefix + value.replace(/^@/, '');
}
