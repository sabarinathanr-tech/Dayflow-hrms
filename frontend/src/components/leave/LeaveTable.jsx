import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { CalendarDays, Check, X, MessageSquare } from 'lucide-react';

const LeaveTable = ({
  leaves = [],
  isAdmin = false,
  onApprove,
  onReject,
  onViewDetails
}) => {
  if (!leaves || leaves.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No leave requests"
        description="There are no leave requests found for this filter."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-dark-700/80 bg-dark-850 shadow-card-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-700/80 bg-dark-800/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            {isAdmin && <th className="py-3.5 px-4 sm:px-6">Employee</th>}
            <th className="py-3.5 px-4 sm:px-6">Leave Type</th>
            <th className="py-3.5 px-4 sm:px-6">Dates</th>
            <th className="py-3.5 px-4 sm:px-6">Duration</th>
            <th className="py-3.5 px-4 sm:px-6">Reason</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
            {isAdmin && <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700/40 text-xs">
          {leaves.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-dark-800/50 transition-colors text-slate-300"
            >
              {isAdmin && (
                <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                  <div>
                    <span className="block font-semibold">{item.employeeName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.employeeId} · {item.department}
                    </span>
                  </div>
                </td>
              )}

              <td className="py-3.5 px-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                {item.leaveType}
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                <span className="text-slate-200">
                  {formatDate(item.startDate)} — {formatDate(item.endDate)}
                </span>
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-medium text-slate-200">
                {item.days} {item.days === 1 ? 'day' : 'days'}
              </td>

              <td className="py-3.5 px-4 sm:px-6 max-w-xs truncate" title={item.reason}>
                <span className="truncate block">{item.reason}</span>
                {item.comment && (
                  <span className="text-[11px] text-brand-cyan-light flex items-center gap-1 mt-0.5">
                    <MessageSquare className="w-3 h-3" />
                    HR: {item.comment}
                  </span>
                )}
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                <Badge variant={item.status} dot>
                  {item.status}
                </Badge>
              </td>

              {isAdmin && (
                <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                  {item.status === 'Pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onApprove(item)}
                        leftIcon={Check}
                        className="py-1 px-2.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-none border-none"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onReject(item)}
                        leftIcon={X}
                        className="py-1 px-2.5 text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium italic">
                      Reviewed by {item.reviewedBy?.split(' ')[0] || 'HR'}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
