// ============================================================
// IBSB — Env loader
// Centraliza a leitura de variáveis de ambiente do Vite.
// Nenhuma chave/segredo é commitada: tudo vem de .env.
// ============================================================

const read = (key, fallback = '') => {
  const value = import.meta.env[key];
  return value === undefined || value === '' ? fallback : value;
};

const bool = (key, fallback = false) => {
  const value = read(key, fallback ? 'true' : 'false');
  return value === 'true' || value === '1';
};

export const env = {
  dataMode: read('VITE_DATA_MODE', 'demo'),
  supabaseUrl: read('VITE_SUPABASE_URL'),
  supabaseAnonKey: read('VITE_SUPABASE_ANON_KEY'),
  churchName: read('VITE_CHURCH_NAME', 'IBSB'),
  churchFullName: read('VITE_CHURCH_FULL_NAME', 'Igreja Batista do Sevilha B'),
  adminEmail: read('VITE_ADMIN_EMAIL', 'admin@ibsb.com.br'),
  adminPassword: read('VITE_ADMIN_PASSWORD', 'ibsb-admin'),
  liveUrl: read('VITE_LIVE_URL'),
  liveActive: bool('VITE_LIVE_ACTIVE'),
  youtubeApiKey: read('VITE_YOUTUBE_API_KEY'),
  youtubeChannelId: read('VITE_YOUTUBE_CHANNEL_ID'),
};
