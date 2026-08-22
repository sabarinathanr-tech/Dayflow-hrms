import React from 'react';
import { Clock, CalendarCheck, CalendarDays, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate';

const RecentActivity = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'attendance':
        return { icon: CalendarCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' };
      case 'leave_approved':
        return { icon: CheckCircle2, color: 'text-brand-purple dark:text-brand-purple-light', bg: 'bg-purple-50 dark:bg-brand-purple/10 border-purple-200 dark:border-brand-purple/20' };
      case 'leave_rejected':
        return { icon: XCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' };
      case 'leave_pending':
        return { icon: CalendarDays, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20' };
      case 'payroll':
        return { icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' };
      default:
        return { icon: Clock, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-dark-800 border-slate-200 dark:border-dark-700' };
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Logs</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No recent activity to show.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((item, index) => {
            const config = getIcon(item.type);
            const IconComponent = config.icon;
            return (
              <div
                key={item.id || index}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-dark-800/50 hover:bg-slate-100 dark:hover:bg-dark-800 border border-slate-200/60 dark:border-dark-700/40 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg} ${config.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-mono">
                    {item.time ? formatRelative(item.time) : 'Recently'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
