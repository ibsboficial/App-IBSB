import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Culto de Celebração' },
  { name: 'date', label: 'Data e hora', type: 'datetime', required: true },
  { name: 'time', label: 'Horário (exibição)', type: 'text', placeholder: '19h30' },
  { name: 'location', label: 'Local', type: 'text', placeholder: 'Templo da IBSB' },
  { name: 'image', label: 'Imagem do culto', type: 'image', theme: 'service', folder: 'cultos', hint: 'Envie uma imagem do celular/computador ou deixe vazio para usar a ilustração.' },
  { name: 'category', label: 'Categoria', type: 'select', options: ['Cultos'] },
  { name: 'description', label: 'Descrição', type: 'textarea', rows: 4, cols: 'full' },
  { name: 'featured', label: 'Culto em destaque', type: 'checkbox' },
];

export default function AdminCultos() {
  const { crud } = useData();
  return (
    <CrudPage
      title="Cultos"
      subtitle="Cadastre os cultos da igreja"
      collection={crud.services}
      fields={FIELDS}
      theme="service"
      nameOf={(i) => i.title}
      previewPath={(i) => `/cultos/${i.id}`}
    />
  );
}
