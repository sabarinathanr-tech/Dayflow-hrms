import React from 'react';
import { Clock, CalendarCheck, CalendarDays, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate';

const RecentActivity = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'attendance':
        return { icon: CalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'leave_approved':
        return { icon: CheckCircle2, color: 'text-brand-purple-light', bg: 'bg-brand-purple/10 border-brand-purple/20' };
      case 'leave_rejected':
        return { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
      case 'leave_pending':
        return { icon: CalendarDays, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
      case 'payroll':
        return { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      default:
        return { icon: Clock, color: 'text-slate-400', bg: 'bg-dark-800 border-dark-700' };
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight">Recent Activity</h3>
        <span className="text-xs text-slate-500">Live logs</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No recent activity to show.
        </div>
      ) : (
        <div className="space-y-3.5">
          {activities.map((item, index) => {
            const config = getIcon(item.type);
            const IconComponent = config.icon;
            return (
              <div
                key={item.id || index}
                className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-dark-700/40 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg} ${config.color}`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 leading-snug">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
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
