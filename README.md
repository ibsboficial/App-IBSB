# IBSB — Aplicativo oficial da Igreja Batista do Sevilha B

Aplicativo web responsivo com experiência mobile, preparado para PWA,
Android (Capacitor) e publicação futura na Google Play.

> **Atenção:** todos os conteúdos de demonstração são **fictícios** e marcados como
> demonstração. As informações oficiais devem ser cadastradas pela igreja pelo
> Painel Administrativo ou pelo arquivo de configuração central.

## Funcionalidades

- **Início**: boas-vindas, próximo culto com contagem regressiva, última pregação,
  devocional, próximo evento, pedido de oração, status de transmissão ao vivo e
  atalhos (Bíblia, cultos, eventos, oração, contato).
- **Navegação inferior (celular)**: Início, Cultos, Conteúdos, Igreja e Menu.
- **Cultos**: agenda com nome, data, horário, local e detalhes.
- **Eventos**: categorias (Cultos, Eventos, Rede de Homens, Rede de Mulheres,
  Geração no Caminho, Rede Kids, Conferências).
- **Pregações**: título, pregador, data, descrição e link do vídeo (integração
  futura com YouTube).
- **Devocionais**: título, versículo, texto, autor e data.
- **Ao Vivo**: exibe "Não estamos ao vivo neste momento" quando não há
  transmissão (integrado ao YouTube).
- **Pedidos de oração**: formulário confidencial (não são públicos). Confirmação:
  "Seu pedido de oração foi recebido. A igreja IBSB estará orando por você."
- **Bíblia**: interface preparada para integração futura com API bíblica.
- **Redes da Igreja**, **Notícias e avisos**, **Galeria**, **Sobre a IBSB** e **Contato**.
- **Painel Administrativo** protegido por autenticação com CRUD de cultos,
  eventos, pregações, devocionais, notícias, galeria, links e informações da igreja.

## Tecnologias

- React 18 + Vite 5
- React Router (hash routing — compatível com PWA estático e Capacitor)
- CSS puro com design tokens (CSS variables)
- PWA: manifest, ícones, service worker (cache offline)
- Banco: camada de dados abstrata — hoje `localStorage`, pronta para Supabase
  (gratuito) ou Firebase

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # build de produção em /dist
npm run preview    # pré-visualização do build
npm run icons      # regenera os ícones PWA (placeholders)
```

### Credenciais do painel admin (demonstração)

```
E-mail: admin@ibsb.com.br
Senha:  ibsb-admin
```

Defina `VITE_ADMIN_EMAIL` e `VITE_ADMIN_PASSWORD` no arquivo `.env` para alterar.

## Estrutura

```
public/            # assets estáticos, PWA (manifest, sw.js, icons), logo
scripts/           # geração de ícones PWA
src/
  config/          # configuração central (logo, nome, contato, cores) + env
  context/         # AuthContext e DataContext (dados + CRUD global)
  data/            # camada de dados (backend.js, db.js local, supabase.js, mock)
  components/      # UI reutilizável, cards, layout (header, bottom nav, footer)
  pages/           # páginas públicas e painel administrativo
  styles/          # design tokens e estilos
  utils/           # datas, formatação, validação
docs/
  supabase.sql     # esquema SQL para ativar o Supabase (banco + RLS + auth)
  CAPACITOR.md     # guia para gerar o app Android (Google Play)
```

## Configuração central

`src/config/appConfig.js` concentra nome, logo, tagline e cores.
O Painel Administrativo (`/admin/igreja`) edita contato, transmissão ao vivo e o
conteúdo de "Sobre" — tudo persistido localmente em modo demo.

### Logo oficial

Substitua o arquivo `public/assets/logo-ibsb.svg` pela logo oficial da IBSB
(mantendo o mesmo nome). O app atualiza sozinho. Até lá, é exibido um placeholder.

## Publicar o site oficial (produção)

Este guia leva o app do modo demonstração para o site oficial: os visitantes
acessam pelo link público e as suas edições (logo, endereço, fotos etc.) ficam
salvas no Supabase e valem para todos, em qualquer dispositivo.

### O que você vai precisar (as duas contas são gratuitas)

1. **Hospedagem do site** — o app é um site estático. Use Vercel, Netlify ou
   Cloudflare Pages (este guia usa Netlify/Vercel).
2. **Supabase** — banco de dados + login do admin + armazenamento das imagens.

### Etapa 1 — Ativar o Supabase (faz uma vez)

1. Crie um projeto gratuito em https://supabase.com (guarde a URL do projeto e a
   **anon key**).
2. Em **SQL Editor**, rode o conteúdo de `docs/supabase.sql`. Ele cria as tabelas,
   ativa a segurança (RLS) e as políticas de leitura pública e escrita de admin.
3. Crie o bucket de imagens: em **Storage → New bucket**, nome `ibsb`, marcando
   **Public**. (Se preferir, descomente as linhas de Storage no fim do
   `docs/supabase.sql` antes de rodar — o efeito é o mesmo.)
4. Crie seu usuário administrador: em **Authentication → Users → Add user**,
   informe o e-mail e a senha que você usará no painel.
   - Este usuário vale só para produção. No modo demo a senha é a do `.env`.

### Etapa 2 — Configurar e gerar o site

1. Copie `.env.example` para `.env` e preencha:

   ```env
   VITE_DATA_MODE=supabase
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
   ```

2. Instale e gere o site:

   ```bash
   npm install
   npm run build
   ```

3. A pasta `dist/` gerada é o site pronto para publicar.

### Etapa 3 — Publicar (exemplo com Vercel ou Netlify)

- **Vercel**: `npx vercel` na raiz do projeto (build: `npm run build`, output `dist`).
- **Netlify**: arraste a pasta `dist/` em https://app.netlify.com/drop, ou conecte o
  repositório com build `npm run build` e publish directory `dist`.
- O app usa rotas com `#` (hash) — não precisa de nenhuma regra de redirect.
- Você pode apontar um domínio próprio (ex.: `ibsb.com.br`) nas configurações da
  plataforma. O certificado HTTPS é automático.

### Etapa 4 — Acessar e administrar

1. Abra o link público do site (ex.: `https://seu-site.netlify.app`).
2. Menu → **Área do administrador** (ou `#/admin/login`) → entre com o e-mail e a
   senha criados no Supabase (Etapa 1.4).
3. **Logo, favicon, cores, banners e imagens das páginas** → menu **Identidade
   visual** (`#/admin/visual`). Use **Enviar/Alterar/Remover** em cada imagem e
   clique em **Salvar**.
4. **Endereço, telefone, WhatsApp, redes, horários dos cultos, pastor, textos
   "Sobre" e YouTube ao vivo** → menu **Informações** (`#/admin/igreja`).

Depois de salvar, as mudanças aparecem imediatamente para todos os visitantes.
As imagens são enviadas ao Storage do Supabase (pasta `ibsb`).

### Observações

- Nenhuma chave secreta fica no código publicado: a anon key do Supabase é pública
  por design; a segurança é feita pelas regras do banco (RLS) do `docs/supabase.sql`.
- Pedidos de oração são protegidos: o visitante só insere; só o admin lê.
- O nome/logo padrão do `manifest` e do `index.html` servem de "primeira tela"
  antes do app carregar; se quiser, atualize `public/manifest.webmanifest` e
  `index.html` com os dados oficiais.
- Para testar mudanças sem afetar o site oficial, mantenha um `.env` com
  `VITE_DATA_MODE=demo` rodando em `npm run dev` no seu computador.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha (ver `.env.example` para a lista
completa). Nunca commite valores reais de chaves.

## Próximos passos (integrações previstas)

- YouTube Data API para pregações e transmissões
- API bíblica licenciada para a aba Bíblia
- Notificações push (Web Push + FCM)
- App Android via Capacitor — ver `docs/CAPACITOR.md`
