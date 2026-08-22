import React from 'react';
import { CalendarCheck, Clock, UserX, HeartHandshake, TrendingUp } from 'lucide-react';
import { formatWorkingHours } from '../../utils/formatDate';

const AttendanceStats = ({ records = [] }) => {
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const halfDayCount = records.filter((r) => r.status === 'Half Day').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  const totalExtraMins = records.reduce((acc, r) => {
    const extra = r.extraHours !== undefined ? r.extraHours : Math.max(0, (r.workingHours || 0) - 480);
    return acc + extra;
  }, 0);

  const stats = [
    { label: 'Present Days', value: presentCount, icon: CalendarCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
    { label: 'Half Days', value: halfDayCount, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
    { label: 'Leaves / PTO', value: leaveCount, icon: HeartHandshake, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20' },
    { label: 'Total Extra Hours', value: `+${formatWorkingHours(totalExtraMins)}`, icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 flex items-center justify-between shadow-card-light dark:shadow-card-dark"
          >
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {s.label}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {s.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-2xl border ${s.bg} ${s.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStats;
