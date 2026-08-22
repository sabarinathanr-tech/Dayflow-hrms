import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatDate';
import { CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

const LeaveApproval = ({
  isOpen,
  onClose,
  leaveRequest,
  mode = 'approve', // 'approve' or 'reject'
  onConfirm,
  loading = false
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!leaveRequest) return null;

  const isApprove = mode === 'approve';

  const handleAction = async () => {
    if (!isApprove && (!comment || comment.trim().length < 4)) {
      setError('Please provide a reason / comment for rejection.');
      return;
    }
    setError('');
    await onConfirm(leaveRequest.id, { comment: comment.trim() });
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
      subtitle={`Request #${leaveRequest.id} — ${leaveRequest.employeeName}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-dark-800 border border-dark-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Employee:</span>
            <span className="font-bold text-white">{leaveRequest.employeeName} ({leaveRequest.employeeId})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Type:</span>
            <span className="font-semibold text-slate-200">{leaveRequest.leaveType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Dates:</span>
            <span className="font-semibold text-slate-200">
              {formatDate(leaveRequest.startDate)} — {formatDate(leaveRequest.endDate)} ({leaveRequest.days} days)
            </span>
          </div>
          <div className="pt-2 border-t border-dark-750">
            <span className="text-slate-400 font-medium block mb-1">Reason provided:</span>
            <p className="text-slate-300 italic">{leaveRequest.reason}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            {isApprove ? 'Optional Note / Comment' : 'Reason for Rejection *'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError('');
            }}
            placeholder={
              isApprove
                ? 'e.g. Approved. Have a good break!'
                : 'e.g. Insufficient coverage during release week.'
            }
            rows={3}
            className="w-full bg-dark-800 text-slate-100 text-xs rounded-xl p-3 border border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder:text-slate-500"
          />
          {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? 'primary' : 'danger'}
            size="sm"
            onClick={handleAction}
            loading={loading}
            leftIcon={isApprove ? CheckCircle2 : XCircle}
          >
            {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveApproval;
