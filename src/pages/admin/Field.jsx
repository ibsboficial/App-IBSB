// ============================================================
// IBSB — Campo de formulário do painel admin
// ============================================================

import { useRef, useState } from 'react';
import { EVENT_CATEGORIES } from '../../config/appConfig';
import ImageInput from '../../components/admin/ImageInput';
import Icon from '../../components/ui/Icon';
import { backend } from '../../data/backend';

export default function Field({ field, value, onChange }) {
  const { label, type = 'text', required, placeholder, hint, options = [], cols } = field;

  if (type === 'textarea') {
    return (
      <div className="field" style={cols ? { gridColumn: '1 / -1' } : undefined}>
        <label>{label}</label>
        <textarea
          className="textarea"
          rows={field.rows || 4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <ImageInput
        label={label}
        value={value}
        onChange={(url) => onChange({ target: { value: url } })}
        theme={field.theme || 'image'}
        folder={field.folder || 'conteudo'}
        hint={hint}
        className={cols ? 'full' : ''}
      />
    );
  }

  if (type === 'photos') {
    return (
      <PhotoField
        label={label}
        value={value}
        onChange={onChange}
        hint={hint}
        rows={field.rows || 6}
      />
    );
  }

  if (type === 'select') {
    return (
      <div className="field">
        <label>{label}</label>
        <select className="select" value={value} onChange={onChange} required={required}>
          <option value="">Selecione…</option>
          {(options.length ? options : EVENT_CATEGORIES).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="field">
        <label className="checkbox-row">
          <input type="checkbox" checked={Boolean(value)} onChange={onChange} />
          <span>{label}</span>
        </label>
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  return (
    <div className="field">
      <label>{label}</label>
      <input
        className="input"
        type={type === 'datetime' ? 'datetime-local' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}

// Campo de múltiplas fotos (texto + upload em lote).
function PhotoField({ label, value, onChange, hint, rows }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const addPhotos = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const lines = [];
      for (const file of files) {
        const url = await backend.uploadImage(file, 'galeria');
        lines.push(url);
      }
      const current = String(value || '').trim();
      onChange({ target: { value: current ? current + '\n' + lines.join('\n') : lines.join('\n') } });
    } catch (err) {
      setError(err.message || 'Não foi possível enviar as fotos.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <div className="admin-upload-row">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Icon name="upload" size={15} />
          {busy ? 'Enviando…' : 'Enviar fotos'}
        </button>
        <span className="tiny muted">Selecione uma ou mais fotos do celular ou computador.</span>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} />
      </div>
      <textarea
        className="textarea"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={'Uma foto por linha, no formato:\nURL | legenda (opcional)'}
      />
      {hint && <p className="form-hint">{hint}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
