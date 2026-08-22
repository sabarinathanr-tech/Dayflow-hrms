import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import DocViewerModal from '../common/DocViewerModal';
import { formatDate } from '../../utils/formatDate';
import { CheckCircle2, XCircle, FileText, Calendar, MessageSquare, AlertCircle, Eye, Download } from 'lucide-react';

const LeaveApproval = ({
  isOpen,
  onClose,
  leave,
  onApprove,
  onReject,
  loading = false
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showDocModal, setShowDocModal] = useState(false);

  if (!leave) return null;

  const leaveId = leave._id || leave.id;

  const handleSubmit = (type) => {
    if (type === 'reject' && (!comment || comment.trim().length < 3)) {
      setError('Please provide a reason or note for rejection.');
      return;
    }
    setError('');
    if (type === 'approve') {
      onApprove(leaveId, { comment });
    } else {
      onReject(leaveId, { comment });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Review Time Off Request"
        subtitle={`Request #${leaveId || 'Pending'}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs">
          {/* Employee Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700/80 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{leave.employeeName}</h4>
              <p className="text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {leave.employeeId} · {leave.department}
              </p>
            </div>
            <Badge variant={leave.leaveType} dot>
              {leave.leaveType}
            </Badge>
          </div>

          {/* Date & Duration Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/50 border border-slate-200 dark:border-dark-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                Dates
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/50 border border-slate-200 dark:border-dark-700/60">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                Requested Days
              </span>
              <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light mt-1 block font-mono">
                {leave.days} {leave.days === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          {/* Reason Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/50 border border-slate-200 dark:border-dark-700/60">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">
              Reason Given by Employee
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{leave.reason}</p>
          </div>

          {/* Medical Certificate / Attachment View if Present */}
          {leave.attachment && (
            <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-brand-purple dark:text-brand-purple-light flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-900 dark:text-white block truncate">
                    {leave.attachment.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Medical Certificate ({leave.attachment.size})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(true)}
                className="px-2.5 py-1 rounded-xl bg-brand-purple text-white text-[11px] font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
                title="Click to view full PDF or download"
              >
                <Eye className="w-3 h-3" />
                <span>View & Download</span>
              </button>
            </div>
          )}

          {/* Reviewer Note / Decision Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              HR Decision Notes / Reason
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError('');
              }}
              placeholder="Add comments or instructions for the employee..."
              className="w-full bg-white dark:bg-dark-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-2xl p-3 border border-slate-200 dark:border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            {error && <p className="mt-1 text-xs text-rose-500 font-semibold">{error}</p>}
          </div>

          {/* Decision Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-dark-750">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleSubmit('reject')}
              loading={loading}
              leftIcon={XCircle}
            >
              Reject Request
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit('approve')}
              loading={loading}
              leftIcon={CheckCircle2}
            >
              Approve Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Embedded Document Viewer for Attached Document */}
      {leave.attachment && (
        <DocViewerModal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          doc={{
            ...leave.attachment,
            title: `${leave.employeeName} - Medical Certificate`
          }}
          title="Attached Medical Certificate"
        />
      )}
    </>
  );
};

export default LeaveApproval;
