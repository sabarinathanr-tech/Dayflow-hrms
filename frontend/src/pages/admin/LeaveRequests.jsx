import React, { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import LeaveTable from '../../components/leave/LeaveTable';
import LeaveApproval from '../../components/leave/LeaveApproval';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import { Search, RotateCcw, CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { leaveService } from '../../services/leaveService';
import { LEAVE_TYPES } from '../../utils/constants';

const LeaveRequests = () => {
  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Approval Modal State
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalMode, setApprovalMode] = useState('approve');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getAllLeaves({
        search,
        status: statusFilter,
        leaveType: typeFilter
      });
      setLeaves(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [search, statusFilter, typeFilter]);

  const handleApproveClick = (leave) => {
    setSelectedLeave(leave);
    setApprovalMode('approve');
    setModalOpen(true);
  };

  const handleRejectClick = (leave) => {
    setSelectedLeave(leave);
    setApprovalMode('reject');
    setModalOpen(true);
  };

  const handleConfirmDecision = async (id, { comment }) => {
    setActionLoading(true);
    try {
      if (approvalMode === 'approve') {
        await leaveService.approveLeave(id, { comment });
        toast.success(`Leave request for ${selectedLeave?.employeeName} approved!`);
      } else {
        await leaveService.rejectLeave(id, { comment });
        toast.warning(`Leave request for ${selectedLeave?.employeeName} rejected.`);
      }
      await fetchLeaves();
    } catch (err) {
      toast.error('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Leave Requests & Approvals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, or reject employee time-off applications with custom remarks.
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-3 gap-3.5">
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Pending'
              ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_-3px_rgba(245,158,11,0.25)]'
              : 'bg-dark-850 border-dark-700/80 hover:border-dark-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-1 block">{pendingCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Approved'
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]'
              : 'bg-dark-850 border-dark-700/80 hover:border-dark-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-1 block">{approvedCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Rejected'
              ? 'bg-rose-500/10 border-rose-500/40 shadow-[0_0_15px_-3px_rgba(244,63,94,0.25)]'
              : 'bg-dark-850 border-dark-700/80 hover:border-dark-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-1 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-dark-850 border border-dark-700/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Search Requests
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by employee, reason..."
                className="w-full bg-dark-800 text-slate-100 text-sm rounded-xl pl-9 pr-4 py-2 border border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <Select
            label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending Only' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' }
            ]}
          />

          <Select
            label="Leave Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Leave Types' },
              { value: LEAVE_TYPES.SICK_LEAVE, label: 'Sick Leave' },
              { value: LEAVE_TYPES.PAID_TIME_OFF, label: 'Paid Time Off' },
              { value: LEAVE_TYPES.UNPAID_LEAVE, label: 'Unpaid Leave' }
            ]}
          />
        </div>

        {(search || statusFilter !== 'All' || typeFilter !== 'All') && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setTypeFilter('All');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Leave Requests Table */}
      {loading ? (
        <Loading text="Loading leave requests..." />
      ) : (
        <LeaveTable
          leaves={leaves}
          isAdmin={true}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
        />
      )}

      {/* Decision Dialog */}
      <LeaveApproval
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leaveRequest={selectedLeave}
        mode={approvalMode}
        onConfirm={handleConfirmDecision}
        loading={actionLoading}
      />
    </div>
  );
};

export default LeaveRequests;
