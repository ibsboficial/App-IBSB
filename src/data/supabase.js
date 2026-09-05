// ============================================================
// IBSB — Integração Supabase (camada real de produção)
// ------------------------------------------------------------
// Para ativar:
//   1. Crie um projeto gratuito em https://supabase.com
//   2. Rode o script /docs/supabase.sql no SQL Editor
//   3. No .env: VITE_DATA_MODE=supabase,
//      VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
//   4. Crie o usuário admin em Supabase Auth (email/senha).
//
// As chaves "anon" são públicas por design (ficam no .env);
// a segurança é feita por Row Level Security (RLS) no banco.
// A autenticação do painel usa o Supabase Auth.
// ============================================================

const nowIso = () => new Date().toISOString();

export const supabaseAvailable = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );

let client = null;

export async function getClient() {
  if (!supabaseAvailable()) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.',
    );
  }
  if (!client) {
    // Import dinâmico: a lib só entra no bundle quando o modo
    // supabase for usado. No modo demo o app continua leve.
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  }
  return client;
}

const err = (e) => (e && e.message ? e.message : 'Erro ao acessar o Supabase');

// --- Coleções genéricas ----------------------------------------
// O id é gerado pelo banco (gen_random_uuid() default).

export async function collectionAll(name) {
  const { data, error } = await getClient()
    .from(name)
    .select('*')
    .order('createdAt', { ascending: true });
  if (error) throw new Error(err(error));
  return data || [];
}

export async function collectionById(name, id) {
  const { data, error } = await getClient()
    .from(name)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(err(error));
  return data;
}

export async function collectionInsert(name, data) {
  const record = { createdAt: nowIso(), ...data };
  const { data: row, error } = await getClient()
    .from(name)
    .insert(record)
    .select()
    .single();
  if (error) throw new Error(err(error));
  return row;
}

export async function collectionUpdate(name, id, data) {
  const patch = { ...data, updatedAt: nowIso() };
  const { data: row, error } = await getClient()
    .from(name)
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(err(error));
  return row;
}

export async function collectionRemove(name, id) {
  const { error } = await getClient().from(name).delete().eq('id', id);
  if (error) throw new Error(err(error));
  return true;
}

export async function collectionReplaceAll(name, list) {
  const { error: del } = await getClient().from(name).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (del) throw new Error(err(del));
  const rows = list.map((item) => ({ createdAt: nowIso(), ...item }));
  const { error } = await getClient().from(name).insert(rows);
  if (error) throw new Error(err(error));
  return list;
}

// --- Configurações da igreja ----------------------------------
// Tabela settings com uma única linha (id = 1), payload em jsonb.

export async function settingsGet() {
  const { data, error } = await getClient()
    .from('settings')
    .select('data')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw new Error(err(error));
  return data ? data.data : null;
}

export async function settingsSet(value) {
  const { data, error } = await getClient()
    .from('settings')
    .upsert({ id: 1, data: value, updatedAt: nowIso() }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw new Error(err(error));
  return data.data;
}

// --- Autenticação (Supabase Auth) ------------------------------

export async function authSignIn(email, password) {
  const { data, error } = await getClient().auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    const msg = /invalid login credentials/i.test(error.message)
      ? 'E-mail ou senha inválidos.'
      : err(error);
    return { ok: false, error: msg };
  }
  return { ok: true, session: { user: data.user?.email || email } };
}

export async function authSignOut() {
  const { error } = await getClient().auth.signOut();
  if (error) throw new Error(err(error));
}

export async function authGetSession() {
  const { data } = await getClient().auth.getSession();
  const s = data.session;
  return s ? { user: s.user?.email || '' } : null;
}

// --- Storage (imagens) -----------------------------------------
// Bucket "ibsb" (público). Veja /docs/supabase.sql para as políticas.

export const STORAGE_BUCKET = 'ibsb';

export async function uploadImage(file, folder = 'uploads') {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeExt = /^(png|jpe?g|gif|webp|svg|avif)$/.test(ext) ? ext : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const { error } = await getClient()
    .storage.from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || 'image/jpeg' });
  if (error) throw new Error(err(error));
  const { data } = getClient().storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Remove um arquivo pelo caminho relativo dentro do bucket.
export async function removeUpload(path) {
  if (!path || !path.includes(STORAGE_BUCKET)) return;
  const clean = path.split(`${STORAGE_BUCKET}/`)[1];
  if (!clean) return;
  const { error } = await getClient().storage.from(STORAGE_BUCKET).remove([clean]);
  if (error) throw new Error(err(error));
}
