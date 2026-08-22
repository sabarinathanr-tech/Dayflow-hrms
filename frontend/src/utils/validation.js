export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'text-slate-400', bg: 'bg-slate-300 dark:bg-slate-700', percentage: 0 };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Very Weak', color: 'text-rose-500', bg: 'bg-rose-500', percentage: 20 };
  } else if (score === 2) {
    return { score: 2, label: 'Weak', color: 'text-amber-500', bg: 'bg-amber-500', percentage: 40 };
  } else if (score === 3) {
    return { score: 3, label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500', percentage: 60 };
  } else if (score === 4) {
    return { score: 4, label: 'Good', color: 'text-cyan-500', bg: 'bg-cyan-500', percentage: 80 };
  } else {
    return { score: 5, label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500', percentage: 100 };
  }
};

export const evaluatePasswordStrength = getPasswordStrength;

export const isValidEmployeeId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return id.trim().length >= 3;
};

export const isValidPhone = (phone) => {
  if (!phone) return true;
  return /^[\d\s()+-]{7,20}$/.test(phone.trim());
};

export const isLeaveRangeValid = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
};

export const validateLeaveDates = (startDate, endDate) => {
  if (!startDate) return 'Start date is required';
  if (!endDate) return 'End date is required';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime())) return 'Invalid start date';
  if (isNaN(end.getTime())) return 'Invalid end date';
  if (end < start) return 'End date cannot be before start date';
  return null;
};
