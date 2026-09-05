import { useData } from '../../context/DataContext';
import CrudPage from './CrudPage';

const FIELDS = [
  { name: 'eventName', label: 'Nome do evento', type: 'text', required: true },
  { name: 'date', label: 'Data', type: 'datetime', required: true },
  {
    name: 'photos',
    label: 'Fotos',
    type: 'photos',
    rows: 6,
    hint: 'Envie as fotos pelo botão acima. Uma foto por linha, no formato: URL | legenda (opcional).',
  },
];

const parsePhotos = (text) =>
  String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, caption] = line.split('|').map((s) => s.trim());
      return { id: 'f_' + Math.random().toString(36).slice(2, 9), url, caption: caption || '' };
    });

const toText = (photos) =>
  (photos || []).map((p) => `${p.url}${p.caption ? ' | ' + p.caption : ''}`).join('\n');

export default function AdminFotos() {
  const { crud } = useData();

  return (
    <CrudPage
      title="Galeria de fotos"
      subtitle="Organize as fotos por eventos"
      collection={crud.gallery}
      fields={FIELDS}
      theme="gallery"
      nameOf={(i) => i.eventName}
      previewPath={(i) => `/galeria/${i.id}`}
      emptyText="Nenhum álbum cadastrado ainda."
      transformEdit={(item, d) => ({ eventName: item.eventName, date: d.date, photos: toText(item.photos) })}
      transformSave={(data) => ({ ...data, photos: parsePhotos(data.photos) })}
    />
  );
}
