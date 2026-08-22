import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import LeaveSummary from '../../components/dashboard/LeaveSummary';
import CheckInOutCard from '../../components/attendance/CheckInOutCard';
import Modal from '../../components/common/Modal';
import LeaveForm from '../../components/leave/LeaveForm';
import Loading from '../../components/common/Loading';
import useToast from '../../hooks/useToast';
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  User,
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { formatWorkingHours } from '../../utils/formatDate';

const EmployeeDashboard = () => {
  const { currentUser, employeeId } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({ paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingLeave, setApplyingLeave] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const attData = await attendanceService.getMyAttendance();
      setAttendance(attData || []);

      const balances = await leaveService.getLeaveBalances(employeeId);
      setLeaveBalances(balances || { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });

      const myLeaves = await leaveService.getMyLeaves();
      const pending = myLeaves.filter((l) => l.status === 'Pending').length;
      setPendingLeavesCount(pending);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [employeeId]);

  const handleApplyLeaveSubmit = async (formData) => {
    setApplyingLeave(true);
    try {
      await leaveService.applyLeave(formData);
      toast.success('Time off request submitted to HR for approval!');
      setApplyModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to submit leave request.');
    } finally {
      setApplyingLeave(false);
    }
  };

  if (loading) {
    return <Loading text="Loading your Dayflow workspace..." />;
  }

  // Calculate metrics
  const presentDays = attendance.filter((a) => a.status === 'Present').length;
  const totalWorkedMinutes = attendance.reduce((acc, a) => acc + (a.workingHours || 0), 0);
  const totalExtraMinutes = attendance.reduce((acc, a) => {
    const extra = a.extraHours !== undefined ? a.extraHours : Math.max(0, (a.workingHours || 0) - 480);
    return acc + extra;
  }, 0);

  // Mock recent activities
  const recentActivities = [
    { id: 1, type: 'attendance', message: 'Checked in at 09:02 AM today', time: new Date().toISOString() },
    { id: 2, type: 'leave_approved', message: 'Paid Time Off (3 days) approved by HR', time: new Date(Date.now() - 3600000 * 48).toISOString() },
    { id: 3, type: 'payroll', message: 'August 2026 Payslip generated & available', time: new Date(Date.now() - 3600000 * 96).toISOString() }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-soft-lg dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light uppercase tracking-wider">
                Employee Workspace
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Good morning, {currentUser?.name || 'Team Member'} 👋
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              You are currently scheduled for regular working hours. Track your shift punch and time off below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-xs font-bold shadow-glow-purple hover:opacity-95 transition-all"
            >
              Request Time Off +
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Real-Time Check-In Widget */}
      <CheckInOutCard employeeId={employeeId} onStatusChange={fetchDashboardData} />

      {/* 3. Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Present Days"
          value={`${presentDays} Days`}
          subtitle="This billing cycle"
          icon={CalendarCheck}
          variant="emerald"
          onClick={() => navigate('/employee/attendance')}
        />
        <StatCard
          title="PTO Balance"
          value={`${leaveBalances.paidTimeOff ?? 14} Days`}
          subtitle="Annual allowance remaining"
          icon={CalendarDays}
          variant="purple"
          onClick={() => navigate('/employee/time-off')}
        />
        <StatCard
          title="Total Extra Hours"
          value={`+${formatWorkingHours(totalExtraMinutes)}`}
          subtitle="Overtime logged"
          icon={TrendingUp}
          variant="cyan"
          onClick={() => navigate('/employee/attendance')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingLeavesCount}
          subtitle={pendingLeavesCount > 0 ? 'Awaiting HR decision' : 'All requests reviewed'}
          icon={Clock}
          variant="amber"
          onClick={() => navigate('/employee/time-off')}
        />
      </div>

      {/* 4. Quick Actions Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <QuickActionCard
            title="Timesheets"
            description="View daily punch logs and calendar views"
            icon={CalendarCheck}
            onClick={() => navigate('/employee/attendance')}
            accent="purple"
          />
          <QuickActionCard
            title="Apply Time Off"
            description="Submit leave with medical certificates"
            icon={CalendarDays}
            onClick={() => setApplyModalOpen(true)}
            accent="cyan"
          />
          <QuickActionCard
            title="My Profile"
            description="Update skills, resume & private info"
            icon={User}
            onClick={() => navigate('/employee/profile')}
            accent="purple"
          />
          <QuickActionCard
            title="Compensation"
            description="Read-only salary breakdown & payslips"
            icon={CreditCard}
            onClick={() => navigate('/employee/payroll')}
            accent="emerald"
          />
        </div>
      </div>

      {/* 5. Charts & Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AttendanceChart title="My Weekly Shift Presence" />
        </div>
        <div className="lg:col-span-5">
          <LeaveSummary
            balances={leaveBalances}
            onApplyClick={() => setApplyModalOpen(true)}
          />
        </div>
      </div>

      {/* 6. Recent Activity Feed */}
      <RecentActivity activities={recentActivities} />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a leave request for HR administrator review"
        maxWidth="max-w-lg"
      >
        <LeaveForm
          balances={leaveBalances}
          onSubmit={handleApplyLeaveSubmit}
          onCancel={() => setApplyModalOpen(false)}
          loading={applyingLeave}
        />
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
