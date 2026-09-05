import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Aviso importante' },
  { name: 'date', label: 'Data', type: 'datetime', required: true },
  { name: 'image', label: 'Imagem da notícia', type: 'image', theme: 'news', folder: 'noticias', hint: 'Envie uma imagem do celular/computador ou deixe vazio para usar a ilustração.' },
  { name: 'text', label: 'Texto do aviso', type: 'textarea', rows: 5, cols: 'full' },
];

export default function AdminNoticias() {
  const { crud } = useData();
  return (
    <CrudPage
      title="Notícias e avisos"
      subtitle="Comunicados oficiais"
      collection={crud.news}
      fields={FIELDS}
      theme="news"
      nameOf={(i) => i.title}
      previewPath={(i) => `/noticias/${i.id}`}
    />
  );
}
