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

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha (ver `.env.example` para a lista
completa). Nunca commite valores reais de chaves.

## Próximos passos (integrações previstas)

- Supabase — para que as edições do painel valham para todos os visitantes:
  1. Crie um projeto gratuito em supabase.com
  2. Rode `docs/supabase.sql` no SQL Editor
  3. Crie o usuário admin em **Authentication → Users**
  4. No `.env`: `VITE_DATA_MODE=supabase`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  5. `npm run build` e publique de novo
- YouTube Data API para pregações e transmissões
- API bíblica licenciada para a aba Bíblia
- Notificações push (Web Push + FCM)
- App Android via Capacitor — ver `docs/CAPACITOR.md`
