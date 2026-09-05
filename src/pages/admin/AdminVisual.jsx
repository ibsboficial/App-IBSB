// ============================================================
// IBSB — Admin: Identidade Visual
// Logos, favicon, fundos, banners, imagens de destaque/páginas
// e cores principais. Imagens são enviadas ao Storage (ou salvas
// como data URL no modo demo) e passam a valer para todos.
// ============================================================

import { useEffect, useState } from 'react';
import Icon from '../../components/ui/Icon';
import ImageInput from '../../components/admin/ImageInput';
import { useData } from '../../context/DataContext';

const PAGE_IMAGES = [
  { key: 'sobre', label: 'Página Sobre' },
  { key: 'cultos', label: 'Página Cultos' },
  { key: 'eventos', label: 'Página Eventos' },
  { key: 'pregacoes', label: 'Página Pregações' },
  { key: 'devocionais', label: 'Página Devocionais' },
  { key: 'noticias', label: 'Página Notícias' },
  { key: 'galeria', label: 'Página Galeria' },
  { key: 'contato', label: 'Página Contato' },
];

const COLOR_FIELDS = [
  { key: 'primary', label: 'Cor principal' },
  { key: 'primaryDark', label: 'Cor principal (escura)' },
  { key: 'primaryLight', label: 'Cor principal (clara)' },
  { key: 'accent', label: 'Cor de destaque' },
];

const brandingState = (s) => {
  const b = s.branding || {};
  return {
    logoLight: b.logoLight || '',
    logoDark: b.logoDark || '',
    favicon: b.favicon || '',
    homeBackground: b.homeBackground || '',
    homeBanner: b.homeBanner || '',
    featuredImage: b.featuredImage || '',
    pageImages: { ...(b.pageImages || {}) },
  };
};

const colorsState = (s, app) => ({
  primary: s.colors?.primary || app.colors.primary,
  primaryDark: s.colors?.primaryDark || app.colors.primaryDark,
  primaryLight: s.colors?.primaryLight || app.colors.primaryLight,
  accent: s.colors?.accent || app.colors.accent,
});

export default function AdminVisual() {
  const { crud, settings, app } = useData();
  const s = settings || {};

  const [branding, setBranding] = useState(() => brandingState(s));
  const [colors, setColors] = useState(() => colorsState(s, app));

  // Configurações chegam de forma assíncrona (contexto): sincroniza o
  // formulário quando carregam para não abrir vazio em #/admin/visual.
  useEffect(() => {
    if (!settings) return;
    setBranding(brandingState(settings));
    setColors(colorsState(settings, app));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const setBrandingImg = (key) => (url) => setBranding((v) => ({ ...v, [key]: url }));
  const setPageImage = (key) => (url) =>
    setBranding((v) => ({ ...v, pageImages: { ...v.pageImages, [key]: url } }));
  const setColor = (key) => (e) => setColors((c) => ({ ...c, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await crud.settings.update({ branding, colors });
      setMessage('Identidade visual salva com sucesso!');
    } catch (err) {
      setMessage(`Erro ao salvar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-title">Identidade Visual</h1>
          <p className="muted small">
            Logos, banners, fundos e cores. Envie imagens do celular ou computador — elas passam a valer para todos os visitantes.
          </p>
        </div>
      </div>

      {message && <div className="admin-toast" role="status">{message}</div>}

      <form className="card admin-form" onSubmit={save}>
        <h3 className="admin-panel-title">Logo</h3>
        <div className="admin-form-grid">
          <ImageInput
            label="Logo principal (fundo claro)"
            value={branding.logoLight}
            onChange={setBrandingImg('logoLight')}
            theme="logo"
            folder="branding"
            hint="Usada no topo do aplicativo e nas áreas claras."
            className="full"
          />
          <ImageInput
            label="Logo para fundos escuros"
            value={branding.logoDark}
            onChange={setBrandingImg('logoDark')}
            theme="logo"
            folder="branding"
            hint="Usada sobre o fundo azul da página inicial, quando enviada."
            className="full"
          />
          <ImageInput
            label="Favicon (ícone do navegador)"
            value={branding.favicon}
            onChange={setBrandingImg('favicon')}
            theme="logo"
            folder="branding"
            accept="image/png,image/svg+xml,image/x-icon"
            hint="Recomendado: quadrado, até 512×512."
            className="full"
          />
        </div>

        <h3 className="admin-panel-title">Página inicial</h3>
        <div className="admin-form-grid">
          <ImageInput
            label="Imagem de fundo da página inicial"
            value={branding.homeBackground}
            onChange={setBrandingImg('homeBackground')}
            theme="worship"
            folder="branding"
            hint="Fica como fundo do topo da Home (azul atual é o padrão)."
            className="full"
          />
          <ImageInput
            label="Banner principal"
            value={branding.homeBanner}
            onChange={setBrandingImg('homeBanner')}
            theme="worship"
            folder="branding"
            hint="Imagem em destaque exibida na Home, abaixo dos atalhos."
            className="full"
          />
          <ImageInput
            label="Imagem de destaque (pregação em evidência)"
            value={branding.featuredImage}
            onChange={setBrandingImg('featuredImage')}
            theme="sermon"
            folder="branding"
            hint="Usada como imagem da última pregação quando ela não tem foto."
            className="full"
          />
        </div>

        <h3 className="admin-panel-title">Imagens das páginas internas</h3>
        <div className="admin-form-grid">
          {PAGE_IMAGES.map((p) => (
            <ImageInput
              key={p.key}
              label={p.label}
              value={branding.pageImages[p.key] || ''}
              onChange={setPageImage(p.key)}
              theme={p.key}
              folder="paginas"
              hint="Banner exibido no topo da página."
            />
          ))}
        </div>

        <h3 className="admin-panel-title">Cores principais</h3>
        <div className="admin-form-grid">
          {COLOR_FIELDS.map((c) => (
            <div className="field" key={c.key}>
              <label>{c.label}</label>
              <div className="color-row">
                <input type="color" className="color-input" value={colors[c.key]} onChange={setColor(c.key)} />
                <input
                  className="input"
                  value={colors[c.key]}
                  onChange={setColor(c.key)}
                  placeholder="#1677d6"
                />
              </div>
            </div>
          ))}
          <p className="form-hint" style={{ gridColumn: '1 / -1' }}>
            As cores são aplicadas automaticamente em botões, destaques e fundos do aplicativo.
          </p>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Icon name="save" size={16} /> {saving ? 'Salvando…' : 'Salvar identidade visual'}
          </button>
        </div>
      </form>
    </div>
  );
}
