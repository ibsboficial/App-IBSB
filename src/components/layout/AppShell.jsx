// ============================================================
// IBSB — AppShell: header + conteúdo + navegação inferior
// ============================================================

import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function AppShell() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <div className="page">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
