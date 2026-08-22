import React from 'react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatDate, formatWorkingHours } from '../../utils/formatDate';
import { CalendarCheck, Clock, TrendingUp } from 'lucide-react';

const AttendanceTable = ({ records = [], showEmployee = false }) => {
  if (!records || records.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No attendance records"
        description="There are no attendance records logged for the selected period."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white dark:bg-dark-850 shadow-card-light dark:shadow-card-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-800/60 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            {showEmployee && <th className="py-3.5 px-4 sm:px-6">Employee</th>}
            <th className="py-3.5 px-4 sm:px-6">Date</th>
            <th className="py-3.5 px-4 sm:px-6">Check-In</th>
            <th className="py-3.5 px-4 sm:px-6">Check-Out</th>
            <th className="py-3.5 px-4 sm:px-6">Worked Hours</th>
            <th className="py-3.5 px-4 sm:px-6">Extra / Overtime</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-dark-700/40 text-xs">
          {records.map((rec) => {
            const workedMins = rec.workingHours || 0;
            const extraMins = rec.extraHours !== undefined ? rec.extraHours : Math.max(0, workedMins - 480);

            return (
              <tr
                key={rec.id}
                className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors text-slate-700 dark:text-slate-300"
              >
                {showEmployee && (
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                    <div>
                      <span className="block">{rec.employeeName}</span>
                      <span className="text-[11px] text-slate-400 font-mono font-normal">
                        {rec.employeeId} · {rec.department}
                      </span>
                    </div>
                  </td>
                )}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatDate(rec.date)}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                  {rec.checkIn || '—'}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                  {rec.checkOut || '—'}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap font-medium">
                  {workedMins > 0 ? formatWorkingHours(workedMins) : '—'}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                  {extraMins > 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatWorkingHours(extraMins)}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                  <Badge variant={rec.status} dot>
                    {rec.status}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
