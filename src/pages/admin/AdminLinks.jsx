// ============================================================
// IBSB — Admin: Links
// Links úteis (WhatsApp, Instagram, YouTube, formulários etc.)
// ============================================================

import { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/ui/UI';

export default function AdminLinks() {
  const { crud, settings } = useData();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  const links = settings?.links || [];
  const save = () => {
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (!cleanTitle || !cleanUrl) return;
    let next;
    if (editingId) {
      next = links.map((l) => (l.id === editingId ? { ...l, title: cleanTitle, url: cleanUrl } : l));
    } else {
      next = [...links, { id: 'l_' + Math.random().toString(36).slice(2, 9), title: cleanTitle, url: cleanUrl }];
    }
    crud.settings.update({ links: next });
    setTitle('');
    setUrl('');
    setEditingId(null);
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setTitle(link.title);
    setUrl(link.url);
  };

  const remove = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Excluir este link?')) {
      crud.settings.update({ links: links.filter((l) => l.id !== id) });
      if (editingId === id) {
        setEditingId(null);
        setTitle('');
        setUrl('');
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Links</h1>
          <p className="muted small">Links úteis exibidos no aplicativo.</p>
        </div>
      </div>

      <form
        className="card admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <h3 className="admin-panel-title">{editingId ? 'Editar link' : 'Novo link'}</h3>
        <div className="admin-form-grid">
          <div className="field">
            <label>Título</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Formulário de cadastro" required />
          </div>
          <div className="field">
            <label>URL</label>
            <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" required />
          </div>
        </div>
        <div className="admin-form-actions">
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setTitle(''); setUrl(''); }}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            <Icon name="save" size={16} /> Salvar
          </button>
        </div>
      </form>

      {links.length === 0 ? (
        <EmptyState icon="external" title="Nenhum link cadastrado" text="Adicione links úteis para a igreja." />
      ) : (
        <div className="admin-list">
          {links.map((l) => (
            <div key={l.id} className="admin-list-item">
              <div className="admin-list-info">
                <strong>{l.title}</strong>
                <small>{l.url}</small>
              </div>
              <div className="admin-list-actions">
                <a className="admin-ic-btn" href={l.url} target="_blank" rel="noreferrer" title="Abrir" aria-label="Abrir">
                  <Icon name="external" size={17} />
                </a>
                <button className="admin-ic-btn" onClick={() => startEdit(l)} title="Editar" aria-label="Editar">
                  <Icon name="edit" size={17} />
                </button>
                <button className="admin-ic-btn danger" onClick={() => remove(l.id)} title="Excluir" aria-label="Excluir">
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
