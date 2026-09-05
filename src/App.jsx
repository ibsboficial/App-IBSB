// ============================================================
// IBSB — App (rotas)
// HashRouter: compatível com hospedagem estática, PWA e
// Capacitor (Android/Google Play).
// ============================================================

import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import BrandTheme from './components/brand/BrandTheme';
import AppShell from './components/layout/AppShell';

import Home from './pages/Home/Home';
import Cultos from './pages/cultos/Cultos';
import CultoDetail from './pages/cultos/CultoDetail';
import Eventos from './pages/eventos/Eventos';
import EventoDetail from './pages/eventos/EventoDetail';
import Conteudos from './pages/conteudos/Conteudos';
import Pregacoes from './pages/conteudos/Pregacoes';
import PregacaoDetail from './pages/conteudos/PregacaoDetail';
import Devocionais from './pages/conteudos/Devocionais';
import DevocionalDetail from './pages/conteudos/DevocionalDetail';
import AoVivo from './pages/conteudos/AoVivo';
import Biblia from './pages/conteudos/Biblia';
import Igreja from './pages/igreja/Igreja';
import Sobre from './pages/igreja/Sobre';
import Redes from './pages/igreja/Redes';
import Noticias from './pages/igreja/Noticias';
import NoticiaDetail from './pages/igreja/NoticiaDetail';
import Galeria from './pages/igreja/Galeria';
import Contato from './pages/igreja/Contato';
import Oracao from './pages/Oracao';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCultos from './pages/admin/AdminCultos';
import AdminEventos from './pages/admin/AdminEventos';
import AdminPregacoes from './pages/admin/AdminPregacoes';
import AdminDevocionais from './pages/admin/AdminDevocionais';
import AdminNoticias from './pages/admin/AdminNoticias';
import AdminFotos from './pages/admin/AdminFotos';
import AdminLinks from './pages/admin/AdminLinks';
import AdminOracoes from './pages/admin/AdminOracoes';
import AdminIgreja from './pages/admin/AdminIgreja';
import AdminVisual from './pages/admin/AdminVisual';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrandTheme />
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/cultos" element={<Cultos />} />
              <Route path="/cultos/:id" element={<CultoDetail />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/eventos/:id" element={<EventoDetail />} />
              <Route path="/conteudos" element={<Conteudos />} />
              <Route path="/pregacoes" element={<Pregacoes />} />
              <Route path="/pregacoes/:id" element={<PregacaoDetail />} />
              <Route path="/devocionais" element={<Devocionais />} />
              <Route path="/devocionais/:id" element={<DevocionalDetail />} />
              <Route path="/ao-vivo" element={<AoVivo />} />
              <Route path="/biblia" element={<Biblia />} />
              <Route path="/igreja" element={<Igreja />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/redes" element={<Redes />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/noticias/:id" element={<NoticiaDetail />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/galeria/:albumId" element={<Galeria />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/oracao" element={<Oracao />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="cultos" element={<AdminCultos />} />
              <Route path="eventos" element={<AdminEventos />} />
              <Route path="pregacoes" element={<AdminPregacoes />} />
              <Route path="devocionais" element={<AdminDevocionais />} />
              <Route path="noticias" element={<AdminNoticias />} />
              <Route path="fotos" element={<AdminFotos />} />
              <Route path="links" element={<AdminLinks />} />
              <Route path="oracoes" element={<AdminOracoes />} />
              <Route path="igreja" element={<AdminIgreja />} />
              <Route path="visual" element={<AdminVisual />} />
            </Route>
          </Routes>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
}
