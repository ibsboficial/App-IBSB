// ============================================================
// IBSB — ImageInput (upload de imagem com prévia)
// No modo demo salva como data URL (navegador); no modo Supabase
// envia para o Storage e guarda a URL pública.
// ============================================================

import { useRef, useState } from 'react';
import Icon from '../ui/Icon';
import PlaceholderImage from '../ui/PlaceholderImage';
import { backend } from '../../data/backend';

const MAX_DEMO_MB = 2.5;

export default function ImageInput({
  label,
  value,
  onChange,
  theme = 'image',
  folder = 'branding',
  accept = 'image/*',
  hint,
  className = '',
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (backend.mode === 'demo' && file.size > MAX_DEMO_MB * 1024 * 1024) {
      setError(`No modo demonstração o limite é de ${MAX_DEMO_MB} MB. Para arquivos maiores, ative o Supabase.`);
      return;
    }
    setBusy(true);
    setError('');
    backend
      .uploadImage(file, folder)
      .then((url) => {
        onChange(url);
      })
      .catch((err) => setError(err.message || 'Não foi possível enviar a imagem.'))
      .finally(() => setBusy(false));
  };

  const remove = () => {
    backend.removeImage(value);
    onChange('');
  };

  return (
    <div className={`field image-input-field ${className}`.trim()}>
      <label>{label}</label>
      <div className="image-input-row">
        <div className="image-input-preview">
          {value ? (
            <img src={value} alt="Prévia" />
          ) : (
            <PlaceholderImage theme={theme} />
          )}
        </div>
        <div className="image-input-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <Icon name="upload" size={15} />
            {busy ? 'Enviando…' : value ? 'Alterar' : 'Enviar imagem'}
          </button>
          {value && (
            <button type="button" className="btn btn-outline btn-sm" onClick={remove}>
              <Icon name="trash" size={15} /> Remover
            </button>
          )}
          <input ref={inputRef} type="file" accept={accept} hidden onChange={pick} />
        </div>
      </div>
      {hint && <p className="form-hint">{hint}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
