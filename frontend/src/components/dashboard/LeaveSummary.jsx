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
      color: 'text-brand-purple-light',
      bg: 'bg-brand-purple/10 border-brand-purple/20',
      bar: 'bg-brand-purple'
    },
    {
      title: 'Sick Leave',
      days: balances.sickLeave ?? 8,
      total: 12,
      icon: HeartPulse,
      color: 'text-brand-cyan-light',
      bg: 'bg-brand-cyan/10 border-brand-cyan/20',
      bar: 'bg-brand-cyan'
    },
    {
      title: 'Unpaid Leave',
      days: balances.unpaidLeave ?? 0,
      total: 10,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      bar: 'bg-amber-400'
    }
  ];

  return (
    <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Time Off Balances</h3>
          <p className="text-xs text-slate-400">Available leave entitlements for 2026</p>
        </div>
        {onApplyClick && (
          <button
            onClick={onApplyClick}
            className="text-xs font-semibold text-brand-purple-light hover:text-white transition-colors"
          >
            Apply Leave +
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
              className="p-4 rounded-xl bg-dark-800/60 border border-dark-700/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg border ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Days Left
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-white">{item.days}</span>
                  <span className="text-xs text-slate-400">/ {item.total}</span>
                </div>
                <p className="text-xs font-medium text-slate-300 mb-2">{item.title}</p>
                <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
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
