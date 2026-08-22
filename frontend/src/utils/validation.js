export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'text-slate-500', barColor: 'bg-slate-700' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Very Weak', color: 'text-rose-400', barColor: 'bg-rose-500', width: '20%' };
  } else if (score === 2) {
    return { score: 2, label: 'Weak', color: 'text-amber-400', barColor: 'bg-amber-500', width: '40%' };
  } else if (score === 3) {
    return { score: 3, label: 'Fair', color: 'text-yellow-400', barColor: 'bg-yellow-500', width: '60%' };
  } else if (score === 4) {
    return { score: 4, label: 'Good', color: 'text-cyan-400', barColor: 'bg-cyan-500', width: '80%' };
  } else {
    return { score: 5, label: 'Strong', color: 'text-emerald-400', barColor: 'bg-emerald-500', width: '100%' };
  }
};

export const isValidEmployeeId = (id) => {
  if (!id || typeof id !== 'string') return false;
  // Allows alphanumeric IDs like EMP-001, EMP102, 1001, etc.
  return id.trim().length >= 3;
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // optional
  return /^[\d\s()+-]{7,20}$/.test(phone.trim());
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
