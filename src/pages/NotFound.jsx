import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { EmptyState } from '../components/ui/UI';

export default function NotFound() {
  return (
    <div style={{ padding: '30px 0' }}>
      <EmptyState
        icon="search"
        title="Página não encontrada"
        text="O endereço que você tentou acessar não existe ou foi movido."
        action={
          <Link to="/" className="btn btn-primary mt-12">
            <Icon name="home" size={16} /> Voltar ao início
          </Link>
        }
      />
    </div>
  );
}
