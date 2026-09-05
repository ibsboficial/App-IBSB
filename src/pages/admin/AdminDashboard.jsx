// ============================================================
// IBSB — Admin Dashboard (visão geral)
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { backend } from '../../data/backend';

export default function AdminDashboard() {
  const { services, events, sermons, devotionals, news, gallery, prayers, settings, reload } = useData();
  const { logout } = useAuth();
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');

  const upcoming = services.filter((s) => new Date(s.date) >= new Date());
  const pendingPrayers = prayers.filter((p) => !p.status || p.status === 'new');
  const totalContent =
    services.length + events.length + sermons.length + devotionals.length + news.length + gallery.length;

  const importDemo = async () => {
    setImporting(true);
    setImportMsg('');
    try {
      const n = await backend.importDemo();
      await reload();
      setImportMsg(
        n > 0
          ? `Dados de demonstração importados (${n} itens).`
          : 'As tabelas já contêm dados; nada foi importado.',
      );
    } catch (err) {
      setImportMsg(`Erro ao importar: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const cards = [
    { to: '/admin/cultos', icon: 'church', label: 'Cultos', value: services.length, sub: `${upcoming.length} próximos`, color: '#1677d6' },
    { to: '/admin/eventos', icon: 'calendar', label: 'Eventos', value: events.length, color: '#6a5bd8' },
    { to: '/admin/pregacoes', icon: 'mic', label: 'Pregações', value: sermons.length, color: '#254c8f' },
    { to: '/admin/devocionais', icon: 'book', label: 'Devocionais', value: devotionals.length, color: '#12a185' },
    { to: '/admin/noticias', icon: 'bell', label: 'Notícias', value: news.length, color: '#d99a24' },
    { to: '/admin/fotos', icon: 'image', label: 'Álbuns de fotos', value: gallery.length, color: '#6a5bd8' },
    { to: '/admin/oracoes', icon: 'prayer', label: 'Pedidos de oração', value: prayers.length, sub: `${pendingPrayers.length} novos`, color: '#d96ba6' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Visão geral</h1>
          <p className="muted small">Gerencie os conteúdos do aplicativo.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={logout}>
          <Icon name="logout" size={15} /> Sair
        </button>
      </div>

      <div className="admin-stats-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="admin-stat-card">
            <span className="admin-stat-ic" style={{ background: c.color + '18', color: c.color }}>
              <Icon name={c.icon} size={22} />
            </span>
            <span className="admin-stat-value">{c.value}</span>
            <span className="admin-stat-label">{c.label}</span>
            {c.sub && <span className="admin-stat-sub">{c.sub}</span>}
          </Link>
        ))}
      </div>

      <div className="admin-cols">
        <section className="card admin-panel">
          <h3 className="admin-panel-title">Ações rápidas</h3>
          <div className="admin-quick">
            <Link to="/admin/cultos?novo=1" className="btn btn-primary btn-sm">
              <Icon name="plus" size={15} /> Novo culto
            </Link>
            <Link to="/admin/eventos?novo=1" className="btn btn-primary btn-sm">
              <Icon name="plus" size={15} /> Novo evento
            </Link>
            <Link to="/admin/igreja" className="btn btn-outline btn-sm">
              <Icon name="settings" size={15} /> Informações da igreja
            </Link>
            <Link to="/" className="btn btn-outline btn-sm">
              <Icon name="external" size={15} /> Ver app público
            </Link>
          </div>
        </section>

        <section className="card admin-panel">
          <h3 className="admin-panel-title">Transmissão ao vivo</h3>
          <div className="admin-live-row">
            <span className={`admin-live-state ${settings?.live?.active ? 'is-on' : ''}`}>
              {settings?.live?.active ? 'Ativa' : 'Inativa'}
            </span>
            <Link to="/admin/igreja" className="section-link">
              Configurar <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        </section>
      </div>

      <section className="card admin-panel">
        <h3 className="admin-panel-title">Armazenamento</h3>
        <div className="admin-live-row">
          <span className={`admin-live-state ${backend.isSupabase ? 'is-on' : ''}`}>
            {backend.isSupabase ? 'Supabase conectado' : 'Demonstração (navegador)'}
          </span>
          {backend.isSupabase ? (
            <span className="tiny muted">Alterações valem para todos os visitantes.</span>
          ) : (
            <span className="tiny muted">
              Alterações ficam salvas apenas neste navegador.
            </span>
          )}
        </div>
        {backend.isSupabase && totalContent === 0 && (
          <div className="admin-import-row" style={{ marginTop: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={importDemo} disabled={importing}>
              <Icon name="download" size={15} /> {importing ? 'Importando…' : 'Importar dados de demonstração'}
            </button>
          </div>
        )}
        {importMsg && <p className="tiny muted" style={{ marginTop: 8 }}>{importMsg}</p>}
      </section>

      <section className="card admin-panel">
        <h3 className="admin-panel-title">Últimos pedidos de oração</h3>
        {pendingPrayers.length === 0 ? (
          <p className="muted small">Nenhum pedido novo.</p>
        ) : (
          <div className="admin-prayer-list">
            {pendingPrayers.slice(0, 4).map((p) => (
              <div key={p.id} className="admin-prayer-item">
                <strong>{p.name || 'Anônimo'}</strong>
                <p className="small muted">{p.request}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
