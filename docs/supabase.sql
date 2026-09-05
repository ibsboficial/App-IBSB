-- ============================================================
-- IBSB — Esquema SQL para o Supabase (plano gratuito)
-- ------------------------------------------------------------
-- Para ativar:
--   1. Crie um projeto em https://supabase.com
--   2. Rode este script no SQL Editor
--   3. No .env: VITE_DATA_MODE=supabase,
--      VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
--   4. Crie o usuário admin no Supabase Auth (Authentication →
--      Users → Add user), com o e-mail/senha do painel.
--   5. (Opcional) No painel do app, use "Importar dados de
--      demonstração" para popular as tabelas.
--
-- Regras RLS: leitura pública dos conteúdos; escrita apenas
-- para usuários autenticados. Os pedidos de oração NUNCA são
-- públicos: qualquer pessoa pode ENVIAR, mas só autenticados
-- podem ler.
-- ============================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  time text,
  location text,
  image text,
  description text,
  category text default 'Cultos',
  featured boolean default false,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  time text,
  location text,
  image text,
  description text,
  category text,
  featured boolean default false,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  preacher text,
  date timestamptz not null,
  passage text,
  duration text,
  image text,
  "videoUrl" text,
  description text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists public.devotionals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  verse text,
  "verseRef" text,
  author text,
  date timestamptz not null,
  image text,
  text text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  image text,
  text text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  "eventName" text not null,
  date timestamptz,
  photos jsonb default '[]'::jsonb,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

-- Pedidos de oração: PRIVADOS
create table if not exists public.prayers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  request text not null,
  "wantContact" boolean default false,
  status text default 'new',
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

-- Configurações da igreja: uma única linha (id = 1) com o
-- objeto completo de settings em jsonb.
create table if not exists public.settings (
  id integer primary key default 1,
  data jsonb default '{}'::jsonb,
  "updatedAt" timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.services enable row level security;
alter table public.events enable row level security;
alter table public.sermons enable row level security;
alter table public.devotionals enable row level security;
alter table public.news enable row level security;
alter table public.gallery enable row level security;
alter table public.prayers enable row level security;
alter table public.settings enable row level security;

-- Leitura pública dos conteúdos (visível a todos no app)
create policy "conteudos_leitura_publica" on public.services
  for select using (true);
create policy "conteudos_leitura_publica" on public.events
  for select using (true);
create policy "conteudos_leitura_publica" on public.sermons
  for select using (true);
create policy "conteudos_leitura_publica" on public.devotionals
  for select using (true);
create policy "conteudos_leitura_publica" on public.news
  for select using (true);
create policy "conteudos_leitura_publica" on public.gallery
  for select using (true);
create policy "conteudos_leitura_publica" on public.settings
  for select using (true);

-- Escrita somente por usuários autenticados (painel admin)
create policy "admin_escrita" on public.services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.sermons
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.devotionals
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.news
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.gallery
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_escrita" on public.settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Pedidos de oração: NUNCA públicos
-- - qualquer pessoa (anônima) pode ENVIAR um pedido
-- - somente autenticados podem ler/atualizar
create policy "oracao_inserir_publico" on public.prayers
  for insert with check (true);
create policy "oracao_admin_somente" on public.prayers
  for select using (auth.role() = 'authenticated');
create policy "oracao_admin_atualiza" on public.prayers
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage (fotos do app) — bucket "ibsb"
-- insert into storage.buckets (id, name) values ('ibsb', 'ibsb');
-- create policy "storage_public_read" on storage.objects
--   for select using (bucket_id = 'ibsb');
-- create policy "storage_admin_write" on storage.objects
--   for insert with check (bucket_id = 'ibsb' and auth.role() = 'authenticated');
