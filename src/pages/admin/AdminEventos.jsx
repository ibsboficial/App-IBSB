import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Encontro da Rede de Mulheres' },
  { name: 'date', label: 'Data e hora', type: 'datetime', required: true },
  { name: 'time', label: 'Horário (exibição)', type: 'text', placeholder: '15h00' },
  { name: 'location', label: 'Local', type: 'text', placeholder: 'Auditório da IBSB' },
  { name: 'category', label: 'Categoria', type: 'select' },
  { name: 'image', label: 'Imagem do evento', type: 'image', theme: 'gallery', folder: 'eventos', hint: 'Envie uma imagem do celular/computador ou deixe vazio para usar a ilustração.' },
  { name: 'description', label: 'Descrição', type: 'textarea', rows: 4, cols: 'full' },
  { name: 'featured', label: 'Evento em destaque', type: 'checkbox' },
];

export default function AdminEventos() {
  const { crud } = useData();
  return (
    <CrudPage
      title="Eventos"
      subtitle="Eventos, redes e conferências"
      collection={crud.events}
      fields={FIELDS}
      theme="gallery"
      nameOf={(i) => i.title}
      previewPath={(i) => `/eventos/${i.id}`}
    />
  );
}
