// ============================================================
// IBSB — Dados de demonstração
// ATENÇÃO: Conteúdo FICTÍCIO para demonstração. Não representa
// informações oficiais da IBSB. Substitua pelo conteúdo real
// via Painel Administrativo ou pelo backend (Supabase).
//
// As datas são geradas relativas a "hoje" para que o app sempre
// exiba cultos e eventos futuros durante a demonstração.
// ============================================================

const DAY = 24 * 60 * 60 * 1000;

const iso = (offsetDays, hour = 9, minute = 0) => {
  const d = new Date(Date.now() + offsetDays * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const seedServices = () => [
  {
    id: 'c1',
    title: 'Culto de Celebração',
    date: iso(1, 19, 30),
    time: '19h30',
    location: 'Templo da IBSB',
    image: 'service',
    description:
      'Um momento de adoração, Palavra e comunhão para toda a família. Venha celebrar a Deus conosco!',
    category: 'Cultos',
    featured: true,
  },
  {
    id: 'c2',
    title: 'Culto de Oração',
    date: iso(2, 19, 30),
    time: '19h30',
    location: 'Templo da IBSB',
    image: 'service',
    description:
      'Noite dedicada à oração e intercessão pela igreja, pela cidade e pelas famílias.',
    category: 'Cultos',
    featured: false,
  },
  {
    id: 'c3',
    title: 'Culto Dominical',
    date: iso(5, 18, 0),
    time: '18h00',
    location: 'Templo da IBSB',
    image: 'service',
    description:
      'Culto de celebração com Escola Bíblica, louvor e ministração da Palavra.',
    category: 'Cultos',
    featured: false,
  },
  {
    id: 'c4',
    title: 'Culto de Santa Ceia',
    date: iso(12, 19, 0),
    time: '19h00',
    location: 'Templo da IBSB',
    image: 'service',
    description: 'Celebração da Ceia do Senhor com toda a igreja.',
    category: 'Cultos',
    featured: false,
  },
];

export const seedEvents = () => [
  {
    id: 'e1',
    title: 'Encontro da Rede de Mulheres',
    date: iso(3, 15, 0),
    time: '15h00',
    location: 'Auditório da IBSB',
    description: 'Tarde de comunhão, louvor e Palavra para as mulheres da igreja e convidadas.',
    image: 'women',
    category: 'Rede de Mulheres',
    featured: true,
  },
  {
    id: 'e2',
    title: 'Café da Rede de Homens',
    date: iso(4, 8, 30),
    time: '08h30',
    location: 'Templo da IBSB',
    description: 'Café da manhã com testemunhos e estudo bíblico para os homens.',
    image: 'men',
    category: 'Rede de Homens',
    featured: false,
  },
  {
    id: 'e3',
    title: 'Culto Geração no Caminho',
    date: iso(6, 19, 30),
    time: '19h30',
    location: 'Templo da IBSB',
    description: 'Encontro dos jovens com louvor, palavra e momentos especiais.',
    image: 'youth',
    category: 'Geração no Caminho',
    featured: false,
  },
  {
    id: 'e4',
    title: 'Escolinha Rede Kids',
    date: iso(5, 18, 0),
    time: '18h00',
    location: 'Templo da IBSB',
    description: 'Ministério infantil com atividades, louvor e ensino bíblico.',
    image: 'kids',
    category: 'Rede Kids',
    featured: false,
  },
  {
    id: 'e5',
    title: 'Conferência de Missões',
    date: iso(19, 19, 0),
    time: '19h00',
    location: 'Templo da IBSB',
    description: 'Semana especial dedicada a missões, com convidados e intercessão.',
    image: 'conference',
    category: 'Conferências',
    featured: true,
  },
  {
    id: 'e6',
    title: 'Tarde de Louvor e Adoração',
    date: iso(9, 17, 0),
    time: '17h00',
    location: 'Templo da IBSB',
    description: 'Tarde de adoração espontânea e ministração.',
    image: 'worship',
    category: 'Eventos',
    featured: false,
  },
];

export const seedSermons = () => [
  {
    id: 'p1',
    title: 'Inversão de Valores',
    preacher: 'Pr. A definir',
    date: iso(-2, 18, 0),
    image: 'sermon',
    description:
      'Uma mensagem sobre a verdadeira escala de valores do Reino de Deus. (Pregação de demonstração.)',
    passage: 'Mateus 6.19-34',
    videoUrl: '',
    duration: '00:00',
  },
  {
    id: 'p2',
    title: 'O Deus que Restaura',
    preacher: 'Pr. A definir',
    date: iso(-9, 18, 0),
    image: 'sermon',
    description:
      'Quando tudo parece perdido, Deus é quem restaura o que foi quebrado. (Pregação de demonstração.)',
    passage: 'Joel 2.25',
    videoUrl: '',
    duration: '00:00',
  },
  {
    id: 'p3',
    title: 'Caminhando com Fé',
    preacher: 'Pr. A definir',
    date: iso(-16, 18, 0),
    image: 'sermon',
    description:
      'A fé não é a ausência de dúvida, mas a certeza de quem nos sustenta. (Pregação de demonstração.)',
    passage: 'Hebreus 11.1',
    videoUrl: '',
    duration: '00:00',
  },
];

export const seedDevotionals = () => [
  {
    id: 'd1',
    title: 'Ele cuida de você',
    verse: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
    verseRef: '1 Pedro 5.7',
    text: 'Deus se importa com cada detalhe da sua vida. Entregue a Ele hoje aquilo que tem pesado no seu coração e descanse no cuidado do Pai.',
    author: 'Equipe IBSB',
    date: iso(-1, 6, 0),
    image: 'devotional',
  },
  {
    id: 'd2',
    title: 'O Pão da Vida',
    verse: 'Eu sou o pão da vida; aquele que vem a mim não terá fome.',
    verseRef: 'João 6.35',
    text: 'Muitas coisas tentam saciar a nossa alma, mas somente Cristo satisfaz. Hoje, alimente-se da Palavra e encontre Nele a verdadeira vida.',
    author: 'Equipe IBSB',
    date: iso(-2, 6, 0),
    image: 'devotional',
  },
  {
    id: 'd3',
    title: 'Semeie a Palavra',
    verse: 'Pelo que também semente de Deus em seu coração... a fé vem pelo ouvir a palavra de Deus.',
    verseRef: 'Romanos 10.17',
    text: 'A Palavra de Deus é semente viva. Quanto mais a ouvimos e meditamos, mais a nossa fé cresce e frutifica.',
    author: 'Equipe IBSB',
    date: iso(-3, 6, 0),
    image: 'devotional',
  },
];

export const seedNews = () => [
  {
    id: 'n1',
    title: 'Feriadão de confraternização (demonstração)',
    date: iso(-4, 10, 0),
    image: 'news',
    text: 'Aviso de demonstração: informe aqui avisos e comunicados oficiais da igreja, como alterações de horários, batismos e campanhas.',
  },
  {
    id: 'n2',
    title: 'Nova série de pregações em breve (demonstração)',
    date: iso(-6, 10, 0),
    image: 'news',
    text: 'Aviso de demonstração: fique atento aos próximos cultos para conhecer a nova série que está por vir.',
  },
];

export const seedGallery = () => [
  {
    id: 'g1',
    eventName: 'Culto de Celebração',
    date: iso(-7, 12, 0),
    photos: [
      { id: 'f1', url: 'worship', caption: 'Momento de louvor' },
      { id: 'f2', url: 'people', caption: 'Igreja reunida' },
      { id: 'f3', url: 'bible', caption: 'Palavra' },
      { id: 'f4', url: 'community', caption: 'Comunhão' },
    ],
  },
  {
    id: 'g2',
    eventName: 'Encontro de Jovens',
    date: iso(-14, 12, 0),
    photos: [
      { id: 'f5', url: 'youth', caption: 'Geração no Caminho' },
      { id: 'f6', url: 'worship', caption: 'Louvor' },
    ],
  },
];

export const seedNetworks = () => [
  {
    id: 'r1',
    title: 'Rede de Homens',
    icon: 'men',
    color: '#1677d6',
    description:
      'Espaço de comunhão, amizade e discipulado para homens. Cultivamos um caráter cristão e amizades que fortalecem a fé.',
  },
  {
    id: 'r2',
    title: 'Rede de Mulheres',
    icon: 'women',
    color: '#d96ba6',
    description:
      'Comunhão, oração e cuidado entre as mulheres da igreja. Um lugar seguro para crescer juntas na fé.',
  },
  {
    id: 'r3',
    title: 'Geração no Caminho',
    icon: 'youth',
    color: '#16a37e',
    description:
      'Ministério de jovens: louvor, Palavra e propósito. Uma geração que caminha com Deus e impacta a sua geração.',
  },
  {
    id: 'r4',
    title: 'Rede Kids',
    icon: 'kids',
    color: '#e99a3a',
    description:
      'Ministério infantil com amor, alegria e ensino bíblico. Cuidamos das crianças com dedicação e segurança.',
  },
];

// Utilidades para coleções de demonstração
export const DEMO = {
  services: seedServices,
  events: seedEvents,
  sermons: seedSermons,
  devotionals: seedDevotionals,
  news: seedNews,
  gallery: seedGallery,
  networks: seedNetworks,
};
