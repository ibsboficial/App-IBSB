// ============================================================
// IBSB — CrudPage (CRUD genérico do painel admin)
// Reutilizado para cultos, eventos, pregações, devocionais,
// notícias e galeria.
// ============================================================

import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/UI';
import { MediaImage } from '../../components/ui/Media';
import { formatShort } from '../../utils/dates';
import Field from './Field';

const toLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocal = (local) => {
  if (!local) return null;
  return new Date(local).toISOString();
};

export default function CrudPage({
  title,
  subtitle,
  collection,
  fields,
  theme,
  nameOf,
  previewPath,
  emptyText = 'Nenhum item cadastrado ainda.',
  transformEdit,
  transformSave,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(searchParams.get('novo') === '1');
  const [draft, setDraft] = useState({});
  const [query, setQuery] = useState('');

  const items = collection.all();
  const editing = editingId ? items.find((i) => i.id === editingId) : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => JSON.stringify(i).toLowerCase().includes(q));
  }, [items, query]);

  const openNew = () => {
    setEditingId(null);
    setDraft({});
    setShowForm(true);
    setSearchParams({ novo: '1' }, { replace: true });
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    const d = {};
    fields.forEach((f) => {
      d[f.name] = f.type === 'datetime' ? toLocal(item[f.name]) : item[f.name] ?? '';
    });
    setDraft(transformEdit ? transformEdit(item, d) : d);
    setShowForm(true);
    setSearchParams({}, { replace: true });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft({});
    setSearchParams({}, { replace: true });
  };

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDraft((d) => ({ ...d, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    let data = {};
    fields.forEach((f) => {
      let value = draft[f.name];
      if (f.type === 'datetime') value = fromLocal(value) || '';
      data[f.name] = value;
    });
    if (transformSave) data = transformSave(data);
    if (editingId) {
      collection.update(editingId, data);
    } else {
      collection.add(data);
    }
    closeForm();
  };

  const remove = (item) => {
    const name = nameOf(item);
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) {
      collection.remove(item.id);
      if (editingId === item.id) closeForm();
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">{title}</h1>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Icon name="plus" size={16} /> Novo
          </button>
        )}
      </div>

      {showForm ? (
        <form className="card admin-form" onSubmit={submit}>
          <h3 className="admin-panel-title">
            {editingId ? `Editar ${title}` : `Novo ${title}`}
          </h3>
          <div className="admin-form-grid">
            {fields.map((f) => (
              <Field
                key={f.name}
                field={f}
                value={draft[f.name] ?? ''}
                onChange={set(f.name)}
              />
            ))}
          </div>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="save" size={16} /> Salvar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="field">
            <div className="admin-search">
              <Icon name="search" size={16} />
              <input
                className="input"
                type="search"
                placeholder="Buscar…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="search" title="Nada encontrado" text={emptyText} />
          ) : (
            <div className="admin-list">
              {filtered.map((item) => (
                <div key={item.id} className="admin-list-item">
                  <MediaImage
                    src={item.image}
                    theme={theme}
                    className="admin-thumb"
                    alt=""
                  />
                  <div className="admin-list-info">
                    <strong>{nameOf(item)}</strong>
                    <small>
                      {item.date ? formatShort(item.date) : ''}
                      {item.category ? ` · ${item.category}` : ''}
                      {item.preacher ? ` · ${item.preacher}` : ''}
                    </small>
                  </div>
                  <div className="admin-list-actions">
                    {previewPath && (
                      <Link
                        className="admin-ic-btn"
                        to={previewPath(item)}
                        title="Ver no app"
                        aria-label="Ver no app"
                      >
                        <Icon name="external" size={17} />
                      </Link>
                    )}
                    <button className="admin-ic-btn" onClick={() => openEdit(item)} title="Editar" aria-label="Editar">
                      <Icon name="edit" size={17} />
                    </button>
                    <button className="admin-ic-btn danger" onClick={() => remove(item)} title="Excluir" aria-label="Excluir">
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
