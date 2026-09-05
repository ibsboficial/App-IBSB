// ============================================================
// IBSB — Contagem regressiva para o próximo culto
// ============================================================

import { useEffect, useState } from 'react';
import { countdownTo } from '../../utils/dates';

export default function Countdown({ date }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = date ? new Date(date) - now : 0;
  if (diff <= 0) return null;

  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const parts = [
    { v: days, l: 'dias' },
    { v: hours, l: 'horas' },
    { v: minutes, l: 'min' },
    { v: seconds, l: 'seg' },
  ];

  return (
    <div className="countdown" role="timer">
      {parts.map((p, i) => (
        <div key={i} className="countdown-cell">
          <span className="countdown-value">{String(p.v).padStart(2, '0')}</span>
          <span className="countdown-label">{p.l}</span>
        </div>
      ))}
    </div>
  );
}
