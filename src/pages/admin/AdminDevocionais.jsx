import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'title', label: 'Título', type: 'text', required: true, placeholder: 'Ele cuida de você' },
  { name: 'verse', label: 'Versículo', type: 'textarea', rows: 2, cols: 'full' },
  { name: 'verseRef', label: 'Referência', type: 'text', placeholder: '1 Pedro 5.7' },
  { name: 'author', label: 'Autor', type: 'text', placeholder: 'Equipe IBSB' },
  { name: 'date', label: 'Data', type: 'datetime', required: true },
  { name: 'image', label: 'Imagem do devocional', type: 'image', theme: 'devotional', folder: 'devocionais', hint: 'Envie uma imagem do celular/computador ou deixe vazio para usar a ilustração.' },
  { name: 'text', label: 'Texto do devocional', type: 'textarea', rows: 6, cols: 'full' },
];

export default function AdminDevocionais() {
  const { crud } = useData();
  return (
    <CrudPage
      title="Devocionais"
      subtitle="Publicação diária"
      collection={crud.devotionals}
      fields={FIELDS}
      theme="devotional"
      nameOf={(i) => i.title}
      previewPath={(i) => `/devocionais/${i.id}`}
    />
  );
}
