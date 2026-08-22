import React, { useState, useEffect } from 'react';
import LeaveTable from '../../components/leave/LeaveTable';
import LeaveApproval from '../../components/leave/LeaveApproval';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import useToast from '../../hooks/useToast';
import { CalendarDays, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { leaveService } from '../../services/leaveService';

const LeaveRequests = () => {
  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Approval / Rejection modal
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveService.getAllLeaves({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        leaveType: typeFilter !== 'All' ? typeFilter : undefined
      });
      setLeaves(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load time off requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, typeFilter]);

  const handleApprove = async (id, { comment }) => {
    setActionLoading(true);
    try {
      await leaveService.approveLeave(id, { comment });
      toast.success('Leave request approved! Attendance records updated.');
      setModalOpen(false);
      setSelectedLeave(null);
      await fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to approve request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, { comment }) => {
    setActionLoading(true);
    try {
      await leaveService.rejectLeave(id, { comment });
      toast.success('Leave request rejected with comment.');
      setModalOpen(false);
      setSelectedLeave(null);
      await fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (leave) => {
    setSelectedLeave(leave);
    setModalOpen(true);
  };

  if (loading && leaves.length === 0) {
    return <Loading text="Loading employee leave requests..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Leave Requests Unavailable"
        description={error}
        onRetry={fetchLeaves}
      />
    );
  }

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Leave Requests & Approvals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Review time-off requests, medical certificates, and dispatch approval remarks
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Pending Review</span>
          </div>
        )}
      </div>

      {/* 2. Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider">Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                statusFilter === s
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-purple"
          >
            <option value="All">All Leave Types</option>
            <option value="Paid Time Off">Paid Time Off</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
      </div>

      {/* 3. Requests Table */}
      <LeaveTable
        leaves={leaves}
        showEmployee={true}
        onApprove={openReviewModal}
        onReject={openReviewModal}
      />

      {/* Review Modal */}
      <LeaveApproval
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />
    </div>
  );
};

export default LeaveRequests;
