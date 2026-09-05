// ============================================================
// IBSB — Utilitários de data e formatação
// ============================================================

const pad = (n) => String(n).padStart(2, '0');

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

export const parseDate = (value) => (value ? new Date(value) : new Date());

export const formatFull = (value) => {
  const d = parseDate(value);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
};

export const formatShort = (value) => {
  const d = parseDate(value);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const formatTime = (value) => {
  const d = parseDate(value);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// "3º dom" / "ter, 12 ago"
export const dayNumber = (value) => {
  const d = parseDate(value);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};

export const monthDay = (value) => {
  const d = parseDate(value);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

// Contagem regressiva "em 3 dias" / "hoje" / "amanhã"
export const relativeDay = (value, now = new Date()) => {
  const target = parseDate(value);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diff = Math.round((day - today) / (24 * 60 * 60 * 1000));
  if (diff < 0) return `há ${Math.abs(diff)} ${Math.abs(diff) === 1 ? 'dia' : 'dias'}`;
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'amanhã';
  if (diff < 30) return `em ${diff} dias`;
  if (diff < 365) {
    const months = Math.round(diff / 30);
    return `em ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  return dayNumber(value);
};

export const isFuture = (value) => new Date(value) > new Date();

export function countdownTo(value) {
  const target = parseDate(value);
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

export const addMinutes = (isoValue, minutes) => {
  const d = parseDate(isoValue);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
};
