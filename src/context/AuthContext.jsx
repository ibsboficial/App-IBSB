// ============================================================
// IBSB — AuthContext
// Autenticação do painel administrativo.
// - Modo demo: valida email/senha contra variáveis de ambiente
//   (VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD), sessão em localStorage.
// - Modo supabase: usa o Supabase Auth (email/senha).
// Senhas nunca são gravadas em código; apenas a sessão.
// ============================================================

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { backend } from '../data/backend';
import { db } from '../data/db';
import { env } from '../config/env';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() =>
    backend.mode === 'demo' ? db.auth.get() : null,
  );
  const [ready, setReady] = useState(backend.mode === 'demo');

  useEffect(() => {
    if (backend.mode !== 'supabase') return;
    let cancelled = false;
    backend
      .authGetSession()
      .then((s) => {
        if (cancelled) return;
        setSession(s);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ email, password }) => {
    if (backend.mode === 'supabase') {
      const res = await backend.authSignIn({ email, password });
      if (res.ok) setSession(res.session);
      return res;
    }
    const ok =
      email.trim().toLowerCase() === env.adminEmail.toLowerCase() &&
      password === env.adminPassword;
    if (!ok) return { ok: false, error: 'E-mail ou senha inválidos.' };
    const sess = { user: email.trim().toLowerCase(), at: new Date().toISOString() };
    db.auth.set(sess);
    setSession(sess);
    return { ok: true };
  };

  const logout = async () => {
    await backend.authSignOut();
    db.auth.clear();
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAdmin: Boolean(session),
      authReady: ready,
      login,
      logout,
    }),
    [session, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
