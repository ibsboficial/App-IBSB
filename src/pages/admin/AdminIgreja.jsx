// ============================================================
// IBSB — Admin: Configurações da Igreja
// Identidade, contato, horários dos cultos, textos institucionais
// e transmissão ao vivo. Tudo editável sem programar.
// ============================================================

import { useEffect, useState } from 'react';
import Icon from '../../components/ui/Icon';
import { useData } from '../../context/DataContext';
import { normalizeUrl } from '../../utils/format';

const newTime = () => ({ id: 'st_' + Math.random().toString(36).slice(2, 9), title: '', day: '', time: '' });

const identityState = (s, app) => ({
  name: s.identity?.name || app.name,
  fullName: s.identity?.fullName || app.fullName,
  tagline: s.identity?.tagline || app.tagline,
  pastorName: s.identity?.pastorName || '',
  pastorRole: s.identity?.pastorRole || 'Pastor titular',
});

const contactState = (s) => ({
  address: s.contact?.address || '',
  phone: s.contact?.phone || '',
  whatsapp: s.contact?.whatsapp || '',
  email: s.contact?.email || '',
  instagram: s.contact?.instagram || '',
  facebook: s.contact?.facebook || '',
  youtube: s.contact?.youtube || '',
  mapUrl: s.contact?.mapUrl || '',
});

const liveState = (s, app) => ({
  active: Boolean(s.live?.active),
  streamUrl: s.live?.streamUrl || '',
  title: s.live?.title || `Culto ao Vivo — ${app.name}`,
});

const aboutState = (s) => ({
  history: Array.isArray(s.about?.history) ? s.about.history.join('\n\n') : s.about?.history || '',
  mission: s.about?.mission || '',
  vision: s.about?.vision || '',
  values: (s.about?.values || []).map((v) => `${v.title} | ${v.text}`).join('\n'),
  leadership: (s.about?.leadership || []).map((l) => `${l.name} | ${l.role}`).join('\n'),
});

export default function AdminIgreja() {
  const { crud, settings, app } = useData();
  const s = settings || {};

  const [identity, setIdentity] = useState(() => identityState(s, app));
  const [contact, setContact] = useState(() => contactState(s));
  const [live, setLive] = useState(() => liveState(s, app));
  const [about, setAbout] = useState(() => aboutState(s));
  const [serviceTimes, setServiceTimes] = useState(
    () => (s.serviceTimes && s.serviceTimes.length ? s.serviceTimes.map((t) => ({ ...t })) : []),
  );

  // As configurações chegam de forma assíncrona (contexto): se a tela for
  // aberta (ou recarregada) antes de carregarem, o formulário é sincronizado
  // aqui — evita campos vazios ao abrir direto o endereço #/admin/igreja.
  useEffect(() => {
    if (!settings) return;
    setIdentity(identityState(settings, app));
    setContact(contactState(settings));
    setLive(liveState(settings, app));
    setAbout(aboutState(settings));
    setServiceTimes(
      settings.serviceTimes && settings.serviceTimes.length
        ? settings.serviceTimes.map((t) => ({ ...t }))
        : [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const setField = (setter) => (k) => (e) =>
    setter((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setIdentityField = setField(setIdentity);
  const setContactField = setField(setContact);
  const setLiveField = setField(setLive);
  const setAboutField = setField(setAbout);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const nextAbout = {
        history: about.history.split('\n\n').map((t) => t.trim()).filter(Boolean),
        mission: about.mission.trim(),
        vision: about.vision.trim(),
        values: about.values
          .split('\n').map((l) => l.trim()).filter(Boolean)
          .map((line) => {
            const [title, ...rest] = line.split('|');
            return { title: (title || '').trim(), text: rest.join('|').trim() };
          }),
        leadership: about.leadership
          .split('\n').map((l) => l.trim()).filter(Boolean)
          .map((line) => {
            const [name, role] = line.split('|');
            return { name: (name || '').trim(), role: (role || '').trim(), note: '' };
          }),
      };
      const nextIdentity = {
        ...identity,
        name: identity.name.trim(),
        fullName: identity.fullName.trim(),
        tagline: identity.tagline.trim(),
      };
      const nextContact = { ...contact, instagram: normalizeUrl(contact.instagram), facebook: normalizeUrl(contact.facebook), youtube: normalizeUrl(contact.youtube) };
      await crud.settings.update({
        identity: nextIdentity,
        contact: nextContact,
        live,
        about: nextAbout,
        serviceTimes: serviceTimes.filter((t) => t.title || t.day || t.time),
      });
      setMessage('Configurações salvas com sucesso!');
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
          <h1 className="admin-title">Configurações da Igreja</h1>
          <p className="muted small">
            Nome, contato, horários dos cultos, textos institucionais e transmissão ao vivo.
          </p>
        </div>
      </div>

      {message && (
        <div className="admin-toast" role="status">
          {message}
        </div>
      )}

      <form className="card admin-form" onSubmit={save}>
        <h3 className="admin-panel-title">Identidade</h3>
        <div className="admin-form-grid">
          <div className="field">
            <label>Nome curto</label>
            <input className="input" value={identity.name} onChange={setIdentityField('name')} placeholder="IBSB" />
          </div>
          <div className="field">
            <label>Nome completo</label>
            <input className="input" value={identity.fullName} onChange={setIdentityField('fullName')} placeholder="Igreja Batista do Sevilha B" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Slogan / frase</label>
            <input className="input" value={identity.tagline} onChange={setIdentityField('tagline')} placeholder="Jesus, o nosso maior valor" />
          </div>
          <div className="field">
            <label>Nome do pastor</label>
            <input className="input" value={identity.pastorName} onChange={setIdentityField('pastorName')} placeholder="Pr. …" />
          </div>
          <div className="field">
            <label>Cargo do pastor</label>
            <input className="input" value={identity.pastorRole} onChange={setIdentityField('pastorRole')} placeholder="Pastor titular" />
          </div>
        </div>

        <h3 className="admin-panel-title">Contato</h3>
        <div className="admin-form-grid">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Endereço completo</label>
            <input className="input" value={contact.address} onChange={setContactField('address')} placeholder="Endereço completo da igreja" />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input className="input" value={contact.phone} onChange={setContactField('phone')} placeholder="(31) 0000-0000" />
          </div>
          <div className="field">
            <label>WhatsApp</label>
            <input className="input" value={contact.whatsapp} onChange={setContactField('whatsapp')} placeholder="(31) 99999-9999" />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input className="input" type="email" value={contact.email} onChange={setContactField('email')} placeholder="contato@…" />
          </div>
          <div className="field">
            <label>Link do mapa</label>
            <input className="input" value={contact.mapUrl} onChange={setContactField('mapUrl')} placeholder="https://maps.google.com/…" />
          </div>
          <div className="field">
            <label>Instagram</label>
            <input className="input" value={contact.instagram} onChange={setContactField('instagram')} placeholder="@ibsb" />
          </div>
          <div className="field">
            <label>Facebook</label>
            <input className="input" value={contact.facebook} onChange={setContactField('facebook')} placeholder="@ibsb" />
          </div>
          <div className="field">
            <label>YouTube</label>
            <input className="input" value={contact.youtube} onChange={setContactField('youtube')} placeholder="https://youtube.com/@…" />
          </div>
        </div>

        <h3 className="admin-panel-title">Horários dos cultos</h3>
        <div className="service-times-editor">
          {serviceTimes.map((t, i) => (
            <div key={t.id} className="service-time-row">
              <input
                className="input"
                value={t.title}
                onChange={(e) => setServiceTimes((list) => list.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                placeholder="Título (ex.: Culto de Celebração)"
              />
              <input
                className="input"
                value={t.day}
                onChange={(e) => setServiceTimes((list) => list.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))}
                placeholder="Dia (ex.: Domingo)"
              />
              <input
                className="input"
                value={t.time}
                onChange={(e) => setServiceTimes((list) => list.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
                placeholder="Horário (ex.: 19h30)"
              />
              <button
                type="button"
                className="admin-ic-btn danger"
                onClick={() => setServiceTimes((list) => list.filter((x) => x.id !== t.id))}
                title="Remover horário"
                aria-label="Remover horário"
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setServiceTimes((l) => [...l, newTime()])}>
            <Icon name="plus" size={15} /> Adicionar horário
          </button>
          <p className="form-hint">Os horários aparecem na página "A Igreja".</p>
        </div>

        <h3 className="admin-panel-title">Transmissão ao vivo</h3>
        <div className="admin-form-grid">
          <div className="field">
            <label className="checkbox-row">
              <input type="checkbox" checked={live.active} onChange={setLiveField('active')} />
              <span>Transmissão ativa agora</span>
            </label>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Link de incorporação (YouTube Live / Vimeo)</label>
            <input className="input" value={live.streamUrl} onChange={setLiveField('streamUrl')} placeholder="https://www.youtube.com/embed/…" />
            <p className="form-hint">
              Para YouTube, use o link de incorporação (embed).
            </p>
          </div>
        </div>

        <h3 className="admin-panel-title">Sobre a igreja (textos institucionais)</h3>
        <div className="admin-form-grid">
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>História</label>
            <textarea className="textarea" rows={5} value={about.history} onChange={setAboutField('history')} placeholder="Um parágrafo por linha em branco." />
          </div>
          <div className="field">
            <label>Missão</label>
            <textarea className="textarea" rows={3} value={about.mission} onChange={setAboutField('mission')} />
          </div>
          <div className="field">
            <label>Visão</label>
            <textarea className="textarea" rows={3} value={about.vision} onChange={setAboutField('vision')} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Valores</label>
            <textarea className="textarea" rows={4} value={about.values} onChange={setAboutField('values')} placeholder={'Um por linha, no formato:\nGraça | Vivemos pela graça de Deus.'} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Liderança</label>
            <textarea className="textarea" rows={3} value={about.leadership} onChange={setAboutField('leadership')} placeholder={'Um por linha, no formato:\nNome | Cargo'} />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Icon name="save" size={16} /> {saving ? 'Salvando…' : 'Salvar informações'}
          </button>
        </div>
      </form>
    </div>
  );
}
