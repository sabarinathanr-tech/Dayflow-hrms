import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LeaveSummary from '../../components/dashboard/LeaveSummary';
import LeaveTable from '../../components/leave/LeaveTable';
import LeaveForm from '../../components/leave/LeaveForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { Plus, CalendarDays, Filter, Clock } from 'lucide-react';
import { leaveService } from '../../services/leaveService';

const MyLeaves = () => {
  const { employeeId } = useAuth();
  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLeaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const myLeaves = await leaveService.getMyLeaves();
      setLeaves(myLeaves || []);

      const b = await leaveService.getLeaveBalances(employeeId);
      setBalances(b || { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load time off records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [employeeId]);

  const handleApplyLeave = async (formData) => {
    setApplying(true);
    try {
      await leaveService.applyLeave(formData);
      toast.success('Time off request submitted to HR for approval!');
      setApplyModalOpen(false);
      await fetchLeaveData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit leave request.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loading text="Loading your time off entitlements and history..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load time off"
        description={error}
        onRetry={fetchLeaveData}
      />
    );
  }

  const filteredLeaves = leaves.filter(
    (l) => statusFilter === 'All' || l.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* 1. Time Off Balances Overview Card */}
      <LeaveSummary
        balances={balances}
        onApplyClick={() => setApplyModalOpen(true)}
      />

      {/* 2. Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            My Time Off History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Track submitted leave requests, doctor certificates, and HR approval remarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-bold">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  statusFilter === status
                    ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setApplyModalOpen(true)}
            leftIcon={Plus}
          >
            Request Time Off
          </Button>
        </div>
      </div>

      {/* 3. Leave Requests Table */}
      <LeaveTable leaves={filteredLeaves} showEmployee={false} />

      {/* Apply Time Off Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a leave request for HR administrator review"
        maxWidth="max-w-lg"
      >
        <LeaveForm
          balances={balances}
          onSubmit={handleApplyLeave}
          onCancel={() => setApplyModalOpen(false)}
          loading={applying}
        />
      </Modal>
    </div>
  );
};

export default MyLeaves;
