import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LeaveSummary from '../../components/dashboard/LeaveSummary';
import LeaveTable from '../../components/leave/LeaveTable';
import LeaveCalendar from '../../components/leave/LeaveCalendar';
import LeaveForm from '../../components/leave/LeaveForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { PlusCircle, CalendarDays, LayoutList } from 'lucide-react';
import { leaveService } from '../../services/leaveService';

const MyLeaves = () => {
  const { employeeId } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'calendar'
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const list = await leaveService.getMyLeaves();
      setLeaves(list);

      const bal = await leaveService.getLeaveBalances(employeeId || 'EMP-1001');
      setBalances(bal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [employeeId]);

  const handleApplyLeave = async (formData) => {
    setSubmitting(true);
    try {
      await leaveService.applyLeave(formData);
      toast.success('Leave application submitted successfully! Status is Pending.');
      setApplyModalOpen(false);
      await fetchLeaveData();
    } catch (err) {
      toast.error('Unable to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Leave & Time Off Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Apply for time-off, check remaining entitlements, and track approval status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-dark-700/80">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Requests</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setApplyModalOpen(true)}
            leftIcon={PlusCircle}
          >
            Apply Leave
          </Button>
        </div>
      </div>

      {/* Leave Balances Header Cards */}
      <LeaveSummary balances={balances} onApplyClick={() => setApplyModalOpen(true)} />

      {/* Content */}
      {loading ? (
        <Loading text="Loading leave requests..." />
      ) : activeTab === 'requests' ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Submitted Time-Off Requests ({leaves.length})
          </h3>
          <LeaveTable leaves={leaves} isAdmin={false} />
        </div>
      ) : (
        <LeaveCalendar leaves={leaves} />
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a new request for HR review"
        maxWidth="max-w-lg"
      >
        <LeaveForm onSubmit={handleApplyLeave} loading={submitting} />
      </Modal>
    </div>
  );
};

export default MyLeaves;
