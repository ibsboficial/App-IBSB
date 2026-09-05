// ============================================================
// IBSB — Configuração central da aplicação
// Logo, nome, endereço, telefone, WhatsApp, Instagram, YouTube,
// cores e demais informações ficam centralizadas aqui.
//
// IMPORTANTE: os dados abaixo são APENAS demonstração.
// Para publicar, ajuste aqui (ou pelo Painel Administrativo,
// que grava as alterações em settings) e em .env.
// ============================================================

import { env } from './env';

export const APP = {
  name: env.churchName || 'IBSB',
  fullName: env.churchFullName || 'Igreja Batista do Sevilha B',
  tagline: 'Jesus, o nosso maior valor',
  // Caminho público para a logo oficial.
  // Troque o arquivo em /public/assets/logo-oficial.svg (ou informe uma URL).
  logoUrl: '/assets/logo-ibsb.svg',
  shortDescription:
    'Aplicativo oficial da Igreja Batista do Sevilha B. Cultos, eventos, pregações e vida com Deus.',
};

export const BRAND = {
  primary: '#1677d6',
  primaryDark: '#0f5fb0',
  primaryLight: '#7cbbef',
  ink: '#0c2540',
  accent: '#e9b34a',
};

// Informações editáveis — o Painel Administrativo atualiza estas
// informações (persistidas em settings) para a igreja.
export const DEFAULT_CHURCH_INFO = {
  // Identidade: nome, slogan e pastor
  identity: {
    name: env.churchName || 'IBSB',
    fullName: env.churchFullName || 'Igreja Batista do Sevilha B',
    tagline: 'Jesus, o nosso maior valor',
    pastorName: '',
    pastorRole: 'Pastor titular',
  },
  // Identidade visual: imagens (logo, banner, fundos, destaques)
  branding: {
    logoLight: '', // logo principal (fundo claro)
    logoDark: '', // logo para fundos escuros
    favicon: '', // ícone do navegador
    homeBackground: '', // imagem de fundo da página inicial
    homeBanner: '', // banner principal (destaque na Home)
    featuredImage: '', // imagens de destaque
    pageImages: {}, // imagens das páginas internas (ex.: { sobre, cultos })
  },
  // Cores principais da identidade visual
  colors: {
    primary: BRAND.primary,
    primaryDark: BRAND.primaryDark,
    primaryLight: BRAND.primaryLight,
    accent: BRAND.accent,
  },
  // Horários dos cultos
  serviceTimes: [],
  about: {
    history: [
      'A Igreja Batista do Sevilha B é uma comunidade cristã em Belo Horizonte, dedicada a anunciar o evangelho de Jesus Cristo e a cuidar de pessoas.',
      'Com amor por Deus e pelo próximo, servimos à comunidade por meio de cultos, redes de discipulado, ações sociais e a Palavra.',
    ],
    mission:
      'Proclamar o evangelho de Jesus Cristo, formar discípulos e servir à comunidade com amor.',
    vision:
      'Ser uma igreja acolhedora e relevante, que transforma vidas pela Palavra e pelo amor de Cristo.',
    values: [
      { title: 'Graça', text: 'Vivemos pela graça de Deus e a estendemos às pessoas.' },
      { title: 'Comunhão', text: 'Caminhamos juntos como família de fé.' },
      { title: 'Santidade', text: 'Buscamos uma vida que honra a Deus em tudo.' },
      { title: 'Missão', text: 'Somos enviados para amar e servir.' },
    ],
    leadership: [
      { role: 'Pastor titular', name: 'A definir', note: 'Informação a ser confirmada pela direção da igreja.' },
      { role: 'Liderança', name: 'A definir', note: 'Informação a ser confirmada pela direção da igreja.' },
    ],
  },
  contact: {
    address: 'Belo Horizonte, MG (endereço a confirmar pela igreja)',
    phone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    facebook: '',
    youtube: '',
    mapUrl: '',
  },
  live: {
    active: false,
    streamUrl: '',
    title: 'Culto ao Vivo — IBSB',
  },
  links: [],
};

export const CONTACT_LINKS = {
  whatsapp: null,
  instagram: null,
  youtube: null,
  phone: null,
  email: null,
  mapUrl: null,
};

export const EVENT_CATEGORIES = [
  'Cultos',
  'Eventos',
  'Rede de Homens',
  'Rede de Mulheres',
  'Geração no Caminho',
  'Rede Kids',
  'Conferências',
];
