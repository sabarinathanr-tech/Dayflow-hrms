import React from 'react';

const Badge = ({ children, variant = 'neutral', size = 'md', dot = false, className = '' }) => {
  const normalized = (variant || '').toLowerCase().replace(/[\s-_]/g, '');

  const styles = {
    present: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    absent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    halfday: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    leave: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    pending: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    onleave: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    paidtimeoff: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    sickleave: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    unpaidleave: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-brand-purple/15 text-purple-300 border-brand-purple/30',
    cyan: 'bg-brand-cyan/15 text-cyan-300 border-brand-cyan/30',
    neutral: 'bg-dark-750 text-slate-300 border-dark-600'
  }[normalized] || 'bg-dark-750 text-slate-300 border-dark-600';

  const dotColors = {
    present: 'bg-emerald-400',
    absent: 'bg-rose-400',
    halfday: 'bg-amber-400',
    leave: 'bg-purple-400',
    pending: 'bg-cyan-400',
    approved: 'bg-emerald-400',
    rejected: 'bg-rose-400',
    active: 'bg-emerald-400',
    inactive: 'bg-slate-400',
    onleave: 'bg-purple-400'
  }[normalized] || 'bg-slate-400';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};

export default Badge;
