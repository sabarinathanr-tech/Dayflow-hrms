import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const parseDateSafe = (date) => {
  if (!date) return null;
  if (date instanceof Date) return isValid(date) ? date : null;
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    if (isValid(parsed)) return parsed;
    const nativeParsed = new Date(date);
    return isValid(nativeParsed) ? nativeParsed : null;
  }
  return null;
};

export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  const d = parseDateSafe(date);
  if (!d) return '—';
  try {
    return format(d, formatStr);
  } catch {
    return '—';
  }
};

export const formatTime = (date, formatStr = 'hh:mm a') => {
  const d = parseDateSafe(date);
  if (!d) return '—';
  try {
    return format(d, formatStr);
  } catch {
    return '—';
  }
};

export const formatDateTime = (date) => {
  const d = parseDateSafe(date);
  if (!d) return '—';
  try {
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  const d = parseDateSafe(date);
  if (!d) return '—';
  try {
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const formatWorkingHours = (minutes) => {
  if (!minutes && minutes !== 0) return '—';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
};
