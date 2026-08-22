import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';
import { Calendar, Clock, MessageSquare, Check, X } from 'lucide-react';

const LeaveRequestCard = ({
  leave,
  isAdmin = false,
  onApprove,
  onReject
}) => {
  return (
    <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark flex flex-col justify-between hover:border-dark-600 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {isAdmin && (
              <span className="text-xs font-bold text-white block mb-0.5">
                {leave.employeeName}
              </span>
            )}
            <h4 className="text-sm font-semibold text-slate-200">{leave.leaveType}</h4>
          </div>
          <Badge variant={leave.status} dot size="sm">
            {leave.status}
          </Badge>
        </div>

        <div className="space-y-1.5 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formatDate(leave.startDate)} — {formatDate(leave.endDate)} ({leave.days} days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Applied on {formatDate(leave.appliedOn)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-dark-800/60 p-2.5 rounded-xl border border-dark-700/60 leading-relaxed mb-3">
          "{leave.reason}"
        </p>

        {leave.comment && (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 mb-3">
            <span className="text-[10px] text-cyan-300 uppercase font-semibold flex items-center gap-1 mb-0.5">
              <MessageSquare className="w-3 h-3" /> HR Comment
            </span>
            <span>{leave.comment}</span>
          </div>
        )}
      </div>

      {isAdmin && leave.status === 'Pending' && (
        <div className="flex items-center gap-2 pt-3 border-t border-dark-750">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onApprove(leave)}
            leftIcon={Check}
            className="flex-1 py-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onReject(leave)}
            leftIcon={X}
            className="flex-1 py-1.5 text-xs"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestCard;
