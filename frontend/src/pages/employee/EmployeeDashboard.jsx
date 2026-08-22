import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import CheckInOutCard from '../../components/attendance/CheckInOutCard';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LeaveSummary from '../../components/dashboard/LeaveSummary';
import Modal from '../../components/common/Modal';
import LeaveForm from '../../components/leave/LeaveForm';
import {
  CalendarCheck,
  CalendarDays,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { employeeService } from '../../services/employeeService';
import useToast from '../../hooks/useToast';

const EmployeeDashboard = () => {
  const { currentUser, employeeId } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({ paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 });
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [activities, setActivities] = useState([]);

  const loadData = async () => {
    try {
      const emp = await employeeService.getCurrentEmployee();
      setEmployeeData(emp);

      const att = await attendanceService.getMyAttendance();
      setAttendanceRecords(att);

      const balances = await leaveService.getLeaveBalances(emp.id);
      setLeaveBalances(balances);

      // Generate activity log
      const acts = [
        {
          id: 1,
          type: 'attendance',
          message: 'Marked regular shift attendance',
          time: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 2,
          type: 'leave_approved',
          message: 'Paid Time Off request was approved by HR',
          time: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
          id: 3,
          type: 'payroll',
          message: 'Monthly salary slip for August generated',
          time: new Date(Date.now() - 3600000 * 72).toISOString()
        }
      ];
      setActivities(acts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [employeeId]);

  const handleLeaveSubmit = async (formData) => {
    setSubmittingLeave(true);
    try {
      await leaveService.applyLeave(formData);
      toast.success('Leave request submitted! Awaiting HR review.');
      setLeaveModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error('Unable to submit leave request.');
    } finally {
      setSubmittingLeave(false);
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
  const halfDayCount = attendanceRecords.filter((r) => r.status === 'Half Day').length;
  const leaveCount = attendanceRecords.filter((r) => r.status === 'Leave').length;

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, <span className="gradient-text-purple">{firstName}</span> 👋
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })} — Welcome back to your workspace.
          </p>
        </div>

        <button
          onClick={() => setLeaveModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-purple-600 hover:to-fuchsia-600 text-white text-xs font-bold shadow-glow-purple transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Hero Check-In / Check-Out Card */}
      <CheckInOutCard employeeId={employeeId || 'EMP-1001'} onStatusChange={loadData} />

      {/* Monthly Attendance KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Days Present"
          value={presentCount}
          subtitle="This Month"
          icon={CalendarCheck}
          variant="emerald"
        />
        <StatCard
          title="Leave Days"
          value={leaveCount}
          subtitle="Approved PTO & Sick"
          icon={CalendarDays}
          variant="purple"
        />
        <StatCard
          title="Half Days"
          value={halfDayCount}
          subtitle="Partial Shifts"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Net Salary"
          value={`$${employeeData?.salary?.netSalary || '7,200'}`}
          subtitle="Monthly Disbursable"
          icon={CreditCard}
          variant="cyan"
          onClick={() => navigate('/employee/payroll')}
        />
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="My Profile"
            description="View personal details, job roles, and uploaded company documents."
            icon={User}
            onClick={() => navigate('/employee/profile')}
            accent="purple"
          />
          <QuickActionCard
            title="Attendance Calendar"
            description="Inspect daily shift timings, working hours, and monthly calendars."
            icon={CalendarCheck}
            onClick={() => navigate('/employee/attendance')}
            accent="cyan"
          />
          <QuickActionCard
            title="Leave Requests"
            description="Submit new time-off requests and track approval statuses in real time."
            icon={CalendarDays}
            onClick={() => navigate('/employee/leaves')}
            accent="emerald"
          />
          <QuickActionCard
            title="Payroll & Payslips"
            description="View salary structure breakdown and download printable payslips."
            icon={CreditCard}
            onClick={() => navigate('/employee/payroll')}
            accent="purple"
          />
        </div>
      </div>

      {/* Leave Balances & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LeaveSummary
            balances={leaveBalances}
            onApplyClick={() => setLeaveModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity activities={activities} />
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Apply for Time Off"
        subtitle="Submit a new leave request for HR review"
        maxWidth="max-w-lg"
      >
        <LeaveForm onSubmit={handleLeaveSubmit} loading={submittingLeave} />
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;
