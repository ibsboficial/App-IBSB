import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Inversão de Valores' },
  { name: 'preacher', label: 'Pregador', type: 'text', placeholder: 'Pr. …' },
  { name: 'date', label: 'Data do culto', type: 'datetime', required: true },
  { name: 'passage', label: 'Texto bíblico', type: 'text', placeholder: 'Mateus 6.19-34' },
  { name: 'duration', label: 'Duração', type: 'text', placeholder: '42 min' },
  { name: 'image', label: 'Imagem da pregação', type: 'image', theme: 'sermon', folder: 'pregacoes', hint: 'Envie uma imagem do celular/computador ou deixe vazio para usar a ilustração.' },
  {
    name: 'videoUrl',
    label: 'Link do vídeo (YouTube/Vimeo)',
    type: 'text',
    hint: 'Cole o link de incorporação do vídeo. Integração futura com YouTube API.',
  },
  { name: 'description', label: 'Descrição', type: 'textarea', rows: 4, cols: 'full' },
];

export default function AdminPregacoes() {
  const { crud } = useData();
  return (
    <CrudPage
      title="Pregações"
      subtitle="Mensagens dos cultos"
      collection={crud.sermons}
      fields={FIELDS}
      theme="sermon"
      nameOf={(i) => i.title}
      previewPath={(i) => `/pregacoes/${i.id}`}
    />
  );
}
