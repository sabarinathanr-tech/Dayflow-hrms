import React from 'react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatDate, formatWorkingHours } from '../../utils/formatDate';
import { CalendarCheck } from 'lucide-react';

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
    <div className="w-full overflow-x-auto rounded-2xl border border-dark-700/80 bg-dark-850">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-700/80 bg-dark-800/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            {showEmployee && <th className="py-3.5 px-4 sm:px-6">Employee</th>}
            <th className="py-3.5 px-4 sm:px-6">Date</th>
            <th className="py-3.5 px-4 sm:px-6">Check-In</th>
            <th className="py-3.5 px-4 sm:px-6">Check-Out</th>
            <th className="py-3.5 px-4 sm:px-6">Working Hours</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700/40 text-xs">
          {records.map((rec) => (
            <tr
              key={rec.id}
              className="hover:bg-dark-800/50 transition-colors text-slate-300"
            >
              {showEmployee && (
                <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                  <div>
                    <span className="block font-semibold">{rec.employeeName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{rec.employeeId} · {rec.department}</span>
                  </div>
                </td>
              )}
              <td className="py-3.5 px-4 sm:px-6 font-medium text-white whitespace-nowrap">
                {formatDate(rec.date)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                {rec.checkIn || '—'}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                {rec.checkOut || '—'}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                {rec.workingHours ? formatWorkingHours(rec.workingHours) : '—'}
              </td>
              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                <Badge variant={rec.status} dot>
                  {rec.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
