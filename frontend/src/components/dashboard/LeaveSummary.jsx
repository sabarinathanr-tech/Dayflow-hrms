import React from 'react';
import { Calendar, HeartPulse, ShieldAlert } from 'lucide-react';

const LeaveSummary = ({
  balances = { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 },
  onApplyClick
}) => {
  const cards = [
    {
      title: 'Paid Time Off',
      days: balances.paidTimeOff ?? 14,
      total: 20,
      icon: Calendar,
      color: 'text-brand-purple dark:text-brand-purple-light',
      bg: 'bg-purple-50 dark:bg-brand-purple/10 border-purple-200 dark:border-brand-purple/20',
      bar: 'bg-brand-purple'
    },
    {
      title: 'Sick Leave',
      days: balances.sickLeave ?? 8,
      total: 12,
      icon: HeartPulse,
      color: 'text-cyan-600 dark:text-brand-cyan-light',
      bg: 'bg-cyan-50 dark:bg-brand-cyan/10 border-cyan-200 dark:border-brand-cyan/20',
      bar: 'bg-brand-cyan'
    },
    {
      title: 'Unpaid Leave',
      days: balances.unpaidLeave ?? 0,
      total: 10,
      icon: ShieldAlert,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
      bar: 'bg-amber-500'
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Time Off Balances</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available leave entitlements for 2026</p>
        </div>
        {onApplyClick && (
          <button
            onClick={onApplyClick}
            className="text-xs font-bold text-brand-purple hover:text-brand-magenta dark:text-brand-purple-light dark:hover:text-white transition-colors"
          >
            Apply Time Off +
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          const pct = Math.min(100, Math.round((item.days / item.total) * 100));
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Days Left
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{item.days}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {item.total}</span>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{item.title}</p>
                <div className="w-full bg-slate-200 dark:bg-dark-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveSummary;
