// ============================================================
// IBSB — Pedido de Oração
// Formulário confidencial. Os pedidos NÃO são públicos.
// ============================================================

import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import { useData } from '../context/DataContext';
import { isValidEmail } from '../utils/format';

const INITIAL = { name: '', email: '', request: '', wantContact: false };

export default function Oracao() {
  const { crud, app } = useData();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  const validate = () => {
    const er = {};
    if (!form.request.trim()) er.request = 'Escreva seu pedido de oração.';
    if (form.email && !isValidEmail(form.email)) er.email = 'Informe um e-mail válido.';
    if (form.wantContact && !form.email) er.email = 'Para receber retorno, informe seu e-mail.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    crud.prayers.add({
      name: form.name.trim(),
      email: form.email.trim(),
      request: form.request.trim(),
      wantContact: form.wantContact,
    });
    setForm(INITIAL);
    setSent(true);
  };

  if (sent) {
    return (
      <>
        <PageHeader title="Pedido de oração" />
        <div className="success-panel">
          <span className="success-icon">
            <Icon name="check" size={34} />
          </span>
          <h2>Pedido recebido</h2>
          <p className="success-text">
            Seu pedido de oração foi recebido. A igreja {app.name} estará orando por você.
          </p>
          <button className="btn btn-outline" onClick={() => setSent(false)}>
            Enviar outro pedido
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Pedido de oração" subtitle="Seu pedido é confidencial" />

      <div className="contact-grid">
        <section className="card" style={{ padding: 20 }}>
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="p-name">Seu nome (opcional)</label>
              <input
                id="p-name"
                className="input"
                type="text"
                placeholder="Como podemos chamar você?"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="p-email">Seu e-mail (opcional)</label>
              <input
                id="p-email"
                className="input"
                type="email"
                placeholder="você@email.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="p-request">Seu pedido de oração</label>
              <textarea
                id="p-request"
                className="textarea"
                placeholder="Conte para nós, em poucas palavras, como podemos orar por você..."
                value={form.request}
                onChange={set('request')}
                rows={5}
              />
              {errors.request && <p className="form-error">{errors.request}</p>}
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.wantContact}
                onChange={set('wantContact')}
              />
              <span>Quero que alguém da igreja entre em contato comigo.</span>
            </label>

            <button type="submit" className="btn btn-primary btn-lg btn-block mt-16">
              <Icon name="send" size={17} /> Enviar pedido de oração
            </button>
          </form>
        </section>

        <section className="card" style={{ padding: 20 }}>
          <h3 className="section-title">Como funciona</h3>
          <div className="live-notes mt-12">
            <div className="live-note">
              <span className="live-note-ic"><Icon name="eye" size={17} /></span>
              <span>
                <strong>Confidencial:</strong> seus pedidos não são exibidos publicamente no
                aplicativo.
              </span>
            </div>
            <div className="live-note">
              <span className="live-note-ic"><Icon name="prayer" size={17} /></span>
              <span>
                <strong>Oração:</strong> a equipe de intercessão da {app.name} ora pelos pedidos
                recebidos.
              </span>
            </div>
            <div className="live-note">
              <span className="live-note-ic"><Icon name="chat" size={17} /></span>
              <span>
                <strong>Contato:</strong> se você quiser, um de nossos líderes pode entrar em
                contato para orar com você.
              </span>
            </div>
            <div className="live-note">
              <span className="live-note-ic"><Icon name="book" size={17} /></span>
              <span>
                <strong>Versículo:</strong> “Orai sem cessar.” — 1 Tessalonicenses 5.17
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
