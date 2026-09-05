// ============================================================
// IBSB — Ponto de entrada
// ============================================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Registro do Service Worker (PWA). Ignorado em desenvolvimento.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('[IBSB] Service Worker registrado'))
      .catch((err) => console.warn('[IBSB] Falha ao registrar SW:', err));
  });
}
