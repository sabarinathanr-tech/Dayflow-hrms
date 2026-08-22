import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import Modal from '../../components/common/Modal';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Loading from '../../components/common/Loading';
import useToast from '../../hooks/useToast';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  BarChart3,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { formatWorkingHours } from '../../utils/formatDate';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Add employee modal
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);
  const [addingEmp, setAddingEmp] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const empList = await employeeService.getAllEmployees();
      setEmployees(empList || []);

      const attList = await attendanceService.getAllAttendance();
      setAttendance(attList || []);

      const leaveList = await leaveService.getAllLeaves();
      setLeaves(leaveList || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddEmployeeSubmit = async (formData) => {
    setAddingEmp(true);
    try {
      await employeeService.createEmployee(formData);
      toast.success('New employee record created successfully!');
      setAddEmpModalOpen(false);
      await fetchAdminData();
    } catch (err) {
      toast.error('Failed to create employee profile.');
    } finally {
      setAddingEmp(false);
    }
  };

  if (loading) {
    return <Loading text="Loading HR administration dashboard..." />;
  }

  // Calculate KPIs
  const totalHeadcount = employees.length;
  const presentToday = employees.filter((e) => e.status === 'Active').length - 1;
  const onLeaveToday = employees.filter((e) => e.status === 'On Leave').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  const totalExtraMins = attendance.reduce((acc, a) => {
    const extra = a.extraHours !== undefined ? a.extraHours : Math.max(0, (a.workingHours || 0) - 480);
    return acc + extra;
  }, 0);

  const recentActivities = [
    { id: 1, type: 'leave_pending', message: 'Priya Sharma requested Sick Leave with Medical Certificate', time: new Date().toISOString() },
    { id: 2, type: 'attendance', message: 'Daily attendance shift logs finalized for Engineering team', time: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 3, type: 'payroll', message: 'Monthly payroll structures verified for Q3 distribution', time: new Date(Date.now() - 3600000 * 24).toISOString() }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-soft-lg dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light uppercase tracking-wider">
              Executive HR Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good morning, {currentUser?.name || 'HR Administrator'} 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Workforce summary, pending shift authorizations, and corporate payroll metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddEmpModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-xs font-bold shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee +</span>
          </button>
        </div>
      </div>

      {/* 2. Core Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={totalHeadcount}
          subtitle="Active corporate accounts"
          icon={Users}
          variant="purple"
          onClick={() => navigate('/admin/employees')}
        />
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle="On-duty shifts"
          icon={CalendarCheck}
          variant="emerald"
          onClick={() => navigate('/admin/attendance')}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves}
          subtitle={pendingLeaves > 0 ? 'Requires your review' : 'All requests processed'}
          icon={Clock}
          variant="amber"
          onClick={() => navigate('/admin/time-off')}
        />
        <StatCard
          title="Total Extra Hours"
          value={`+${formatWorkingHours(totalExtraMins)}`}
          subtitle="Cumulative overtime"
          icon={TrendingUp}
          variant="cyan"
          onClick={() => navigate('/admin/attendance')}
        />
      </div>

      {/* 3. Quick Actions */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">HR Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <QuickActionCard
            title="Workforce Directory"
            description="Manage employee profiles & records"
            icon={Users}
            onClick={() => navigate('/admin/employees')}
            accent="purple"
          />
          <QuickActionCard
            title="Leave Approvals"
            description="Review time-off & medical certs"
            icon={CalendarDays}
            onClick={() => navigate('/admin/time-off')}
            accent="cyan"
          />
          <QuickActionCard
            title="Attendance Logs"
            description="Inspect shifts & overtime tracking"
            icon={CalendarCheck}
            onClick={() => navigate('/admin/attendance')}
            accent="purple"
          />
          <QuickActionCard
            title="Corporate Payroll"
            description="Adjust salary structures & tax items"
            icon={CreditCard}
            onClick={() => navigate('/admin/payroll')}
            accent="emerald"
          />
        </div>
      </div>

      {/* 4. Shift Chart & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AttendanceChart title="Company-Wide Shift Attendance Trends" />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={addEmpModalOpen}
        onClose={() => setAddEmpModalOpen(false)}
        title="Add New Employee"
        subtitle="Create an employee profile with position and compensation details"
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          onSubmit={handleAddEmployeeSubmit}
          loading={addingEmp}
          isEdit={false}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
