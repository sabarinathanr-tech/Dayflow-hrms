import React from 'react';

const Badge = ({ children, variant = 'neutral', size = 'md', dot = false, className = '' }) => {
  const normalized = (variant || '').toLowerCase().replace(/[\s-_]/g, '');

  const styles = {
    present: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    absent: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
    halfday: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    leave: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
    pending: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
    approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    rejected: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
    active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/30',
    onleave: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
    paidtimeoff: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    sickleave: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
    unpaidleave: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    purple: 'bg-purple-50 dark:bg-brand-purple/15 text-brand-purple dark:text-purple-300 border-purple-200 dark:border-brand-purple/30',
    cyan: 'bg-cyan-50 dark:bg-brand-cyan/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-brand-cyan/30',
    neutral: 'bg-slate-100 dark:bg-dark-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-600'
  }[normalized] || 'bg-slate-100 dark:bg-dark-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-600';

  const dotColors = {
    present: 'bg-emerald-500',
    absent: 'bg-rose-500',
    halfday: 'bg-amber-500',
    leave: 'bg-purple-500',
    pending: 'bg-cyan-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-rose-500',
    active: 'bg-emerald-500',
    inactive: 'bg-slate-400',
    onleave: 'bg-purple-500'
  }[normalized] || 'bg-slate-400';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${styles} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};

export default Badge;
