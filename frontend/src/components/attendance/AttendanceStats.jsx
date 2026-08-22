import React from 'react';
import { CalendarCheck, Clock, UserX, HeartHandshake } from 'lucide-react';
import { formatWorkingHours } from '../../utils/formatDate';

const AttendanceStats = ({ records = [] }) => {
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const halfDayCount = records.filter((r) => r.status === 'Half Day').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  const totalWorkingMins = records.reduce((acc, r) => acc + (r.workingHours || 0), 0);
  const avgMins = records.length > 0 ? Math.round(totalWorkingMins / records.length) : 0;

  const stats = [
    { label: 'Present Days', value: presentCount, icon: CalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Half Days', value: halfDayCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Leaves / PTO', value: leaveCount, icon: HeartHandshake, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Absences', value: absentCount, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-dark-850 border border-dark-700/80 flex items-center justify-between shadow-card-dark"
          >
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {s.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
                {s.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border ${s.bg} ${s.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStats;
