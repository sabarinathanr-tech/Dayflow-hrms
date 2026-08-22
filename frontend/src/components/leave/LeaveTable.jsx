import React, { useState } from 'react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import DocViewerModal from '../common/DocViewerModal';
import { formatDate } from '../../utils/formatDate';
import { CalendarDays, CheckCircle2, XCircle, FileText, Download, Eye } from 'lucide-react';

const LeaveTable = ({
  leaves = [],
  showEmployee = false,
  onApprove,
  onReject
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  if (!leaves || leaves.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No time off requests"
        description="No leave requests found for this filter."
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white dark:bg-dark-850 shadow-card-light dark:shadow-card-dark">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-800/60 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              {showEmployee && <th className="py-3.5 px-4 sm:px-6">Employee</th>}
              <th className="py-3.5 px-4 sm:px-6">Type</th>
              <th className="py-3.5 px-4 sm:px-6">Dates</th>
              <th className="py-3.5 px-4 sm:px-6">Duration</th>
              <th className="py-3.5 px-4 sm:px-6">Reason</th>
              <th className="py-3.5 px-4 sm:px-6">Attachment</th>
              <th className="py-3.5 px-4 sm:px-6">Status</th>
              {(onApprove || onReject) && <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-700/40 text-xs">
            {leaves.map((leave) => (
              <tr
                key={leave._id || leave.id}
                className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors text-slate-700 dark:text-slate-300"
              >
                {showEmployee && (
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    <div>
                      <span>{leave.employeeName}</span>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {leave.employeeId} · {leave.department}
                      </span>
                    </div>
                  </td>
                )}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                  {leave.leaveType}
                </td>
                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                  {formatDate(leave.startDate)}
                  {leave.startDate !== leave.endDate && ` → ${formatDate(leave.endDate)}`}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold whitespace-nowrap text-slate-800 dark:text-slate-200 font-mono">
                  {leave.days} {leave.days === 1 ? 'day' : 'days'}
                </td>
                <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                  <p className="truncate text-slate-600 dark:text-slate-300" title={leave.reason}>
                    {leave.reason}
                  </p>
                  {leave.comment && (
                    <p className="text-[11px] text-brand-purple dark:text-brand-purple-light italic truncate mt-0.5" title={leave.comment}>
                      Note: {leave.comment}
                    </p>
                  )}
                </td>
                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                  {leave.attachment ? (
                    <button
                      type="button"
                      onClick={() => setSelectedAttachment({
                        ...leave.attachment,
                        title: `${leave.employeeName} - ${leave.leaveType} Document`
                      })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/20 text-brand-purple dark:text-brand-purple-light hover:bg-purple-100 dark:hover:bg-brand-purple/20 font-bold transition-all hover:scale-105"
                      title={`Click to view and download ${leave.attachment.name}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[110px]">{leave.attachment.name}</span>
                      <Eye className="w-3 h-3 opacity-60 ml-0.5" />
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                  <Badge variant={leave.status} dot>
                    {leave.status}
                  </Badge>
                </td>
                {(onApprove || onReject) && (
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    {leave.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        {onApprove && (
                          <button
                            onClick={() => onApprove(leave)}
                            className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                            title="Approve Request"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {onReject && (
                          <button
                            onClick={() => onReject(leave)}
                            className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium italic">Reviewed</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive PDF & Document Viewer Modal */}
      <DocViewerModal
        isOpen={Boolean(selectedAttachment)}
        onClose={() => setSelectedAttachment(null)}
        doc={selectedAttachment}
        title="Time-Off Attached Document"
      />
    </>
  );
};

export default LeaveTable;
