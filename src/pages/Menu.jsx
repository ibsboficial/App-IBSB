// ============================================================
// IBSB — Menu completo
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { backend } from '../data/backend';

const GROUPS = [
  {
    title: 'Cultos e eventos',
    items: [
      { to: '/cultos', icon: 'church', label: 'Cultos', desc: 'Agenda de celebrações', color: '#1677d6' },
      { to: '/eventos', icon: 'calendar', label: 'Eventos', desc: 'Redes e conferências', color: '#6a5bd8' },
      { to: '/ao-vivo', icon: 'live', label: 'Ao Vivo', desc: 'Transmissões', color: '#d64545' },
    ],
  },
  {
    title: 'Conteúdos',
    items: [
      { to: '/pregacoes', icon: 'mic', label: 'Pregações', desc: 'Mensagens', color: '#1677d6' },
      { to: '/devocionais', icon: 'book', label: 'Devocionais', desc: 'Palavra do dia', color: '#12a185' },
      { to: '/biblia', icon: 'bible', label: 'Bíblia', desc: 'Leitura e busca', color: '#254c8f' },
    ],
  },
  {
    title: 'A igreja',
    items: [
      { to: '/sobre', icon: 'heart', label: 'Sobre a IBSB', desc: 'História e valores', color: '#1677d6' },
      { to: '/redes', icon: 'users', label: 'Redes da Igreja', desc: 'Homens, mulheres, jovens, kids', color: '#16a37e' },
      { to: '/noticias', icon: 'bell', label: 'Notícias e avisos', desc: 'Comunicados', color: '#d99a24' },
      { to: '/galeria', icon: 'image', label: 'Galeria', desc: 'Fotos de eventos', color: '#6a5bd8' },
    ],
  },
  {
    title: 'Serviços',
    items: [
      { to: '/oracao', icon: 'prayer', label: 'Pedido de oração', desc: 'Confidencial', color: '#d96ba6' },
      { to: '/contato', icon: 'chat', label: 'Contato', desc: 'Endereço e redes', color: '#0f5fb0' },
    ],
  },
];

export default function Menu() {
  const { isAdmin } = useAuth();
  const { app } = useData();

  return (
    <>
      <PageHeader title="Menu" subtitle={`Tudo o que a ${app.name} oferece`} />

      {GROUPS.map((g) => (
        <section key={g.title} className="section">
          <h4 className="menu-section-title">{g.title}</h4>
          <div className="menu-grid">
            {g.items.map((it) => (
              <Link key={it.to} to={it.to} className="menu-item">
                <span className="menu-item-ic" style={{ background: it.color }}>
                  <Icon name={it.icon} size={22} />
                </span>
                <span>
                  <strong>{it.label}</strong>
                  <br />
                  <small>{it.desc}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="section">
        <h4 className="menu-section-title">Configurações</h4>
        <div className="menu-grid">
          {isAdmin ? (
            <Link to="/admin" className="menu-item">
              <span className="menu-item-ic" style={{ background: '#0f5fb0' }}>
                <Icon name="settings" size={22} />
              </span>
              <span>
                <strong>Painel administrativo</strong>
                <br />
                <small>Gerenciar conteúdo</small>
              </span>
            </Link>
          ) : (
            <Link to="/admin" className="menu-item">
              <span className="menu-item-ic" style={{ background: '#6b82a0' }}>
                <Icon name="user" size={22} />
              </span>
              <span>
                <strong>Área do administrador</strong>
                <br />
                <small>Entrar</small>
              </span>
            </Link>
          )}
          <InstallAppItem />
        </div>
      </section>

      <p className="tiny muted center" style={{ marginTop: 26 }}>
        {backend.mode === 'demo'
          ? 'Versão de demonstração — os conteúdos são fictícios. Aplicativo oficial em preparação para publicação.'
          : `Aplicativo oficial da ${app.fullName}.`}
      </p>
    </>
  );
}

function InstallAppItem() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBefore = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onBefore);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <button className="menu-item" style={{ textAlign: 'left', width: '100%' }} onClick={install} disabled={!deferred}>
      <span className="menu-item-ic" style={{ background: '#16a37e' }}>
        <Icon name="download" size={22} />
      </span>
      <span>
        <strong>Instalar app</strong>
        <br />
        <small>{deferred ? 'Adicionar à tela inicial' : 'Disponível no seu navegador'}</small>
      </span>
    </button>
  );
}
