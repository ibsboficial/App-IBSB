// ============================================================
// IBSB — Admin Login (protegido)
// Em produção, usar Supabase Auth (preparado em data/supabase.js).
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { backend } from '../../data/backend';
import { env } from '../../config/env';

export default function AdminLogin() {
  const { login, isAdmin, authReady } = useAuth();
  const { app } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authReady) {
    return (
      <div className="admin-login-wrap">
        <p className="muted">Carregando…</p>
      </div>
    );
  }

  if (isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login({ email, password });
    if (res.ok) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <span className="admin-login-logo">
          <svg viewBox="0 0 48 48" width="52" height="52">
            <rect x="1" y="1" width="46" height="46" rx="13" fill="#1677d6" />
            <path d="M22 9h4v11h11v4H26v11h-4V24H11v-4h11z" fill="#fff" />
            <circle cx="36" cy="10" r="5" fill="#e9b34a" />
          </svg>
        </span>
        <h1 className="admin-login-title">Painel administrativo</h1>
        <p className="admin-login-sub">
          Acesso restrito · {app.fullName}
        </p>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="a-email">E-mail</label>
            <input
              id="a-email"
              className="input"
              type="email"
              placeholder="admin@ibsb.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="a-pass">Senha</label>
            <input
              id="a-pass"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-error" role="alert">
              <Icon name="x" size={15} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {backend.mode === 'demo' && (
          <p className="tiny muted center" style={{ marginTop: 16 }}>
            Demonstração: use <strong>{env.adminEmail}</strong> / <strong>{env.adminPassword}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
