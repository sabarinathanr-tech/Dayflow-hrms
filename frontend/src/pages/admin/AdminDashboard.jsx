import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import Modal from '../../components/common/Modal';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Button from '../../components/common/Button';
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
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Key,
  Mail,
  Hash
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

  // Created Employee Credentials Modal
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [credentialsCopied, setCredentialsCopied] = useState(false);

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
      const res = await employeeService.createEmployee(formData);
      toast.success('New employee record & ID created successfully!');
      setAddEmpModalOpen(false);

      const creds = res?.credentials || {
        name: formData.name,
        employeeId: formData.employeeId,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      setCreatedCredentials(creds);
      await fetchAdminData();
    } catch (err) {
      toast.error('Failed to create employee profile.');
    } finally {
      setAddingEmp(false);
    }
  };

  const handleCopyAllCredentials = () => {
    if (!createdCredentials) return;
    const text = `Dayflow HRMS Login Credentials:\nName: ${createdCredentials.name}\nEmployee ID: ${createdCredentials.employeeId}\nWork Email: ${createdCredentials.email}\nInitial Password: ${createdCredentials.password}\nRole: ${createdCredentials.role}\nLogin URL: ${window.location.origin}/login\n(Note: You can update your password anytime in Profile -> Security)`;
    navigator.clipboard.writeText(text);
    setCredentialsCopied(true);
    toast.success('All credentials copied to clipboard!');
    setTimeout(() => setCredentialsCopied(false), 2500);
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
            Workforce summary, employee ID provisioning, and corporate payroll metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddEmpModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-xs font-bold shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2"
            title="Create and provision a new Employee ID"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Employee ID +</span>
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
            title="Create Employee ID"
            description="Provision new employee & credentials"
            icon={UserPlus}
            onClick={() => setAddEmpModalOpen(true)}
            accent="purple"
          />
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

      {/* Add Employee / Create Employee ID Modal */}
      <Modal
        isOpen={addEmpModalOpen}
        onClose={() => setAddEmpModalOpen(false)}
        title="Create & Provision Employee ID"
        subtitle="Generate unique Employee ID and initial auto-password"
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          onSubmit={handleAddEmployeeSubmit}
          loading={addingEmp}
          isEdit={false}
        />
      </Modal>

      {/* Provisioned Credentials Success Modal */}
      <Modal
        isOpen={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title="Employee ID & Account Provisioned"
        subtitle="Share these initial credentials with the new employee"
        maxWidth="max-w-lg"
      >
        {createdCredentials && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {createdCredentials.name} Provisioned Successfully!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Account is active and ready for immediate login.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-700">
                <div className="flex items-center gap-2 text-slate-500 font-sans">
                  <Hash className="w-4 h-4 text-brand-purple" />
                  <span>Employee ID:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {createdCredentials.employeeId}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-700">
                <div className="flex items-center gap-2 text-slate-500 font-sans">
                  <Mail className="w-4 h-4 text-brand-purple" />
                  <span>Work Email:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {createdCredentials.email}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-700">
                <div className="flex items-center gap-2 text-slate-500 font-sans">
                  <Key className="w-4 h-4 text-brand-purple" />
                  <span>Auto Password:</span>
                </div>
                <span className="font-bold text-brand-purple dark:text-brand-purple-light text-sm bg-purple-100 dark:bg-brand-purple/20 px-2 py-0.5 rounded-lg">
                  {createdCredentials.password}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-sans">
                  <ShieldCheck className="w-4 h-4 text-brand-purple" />
                  <span>Role:</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {createdCredentials.role}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/20 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              💡 <strong>Next Step:</strong> The employee can log in on the standard login page using their <strong>Employee ID</strong> or <strong>Email</strong> with this auto-generated password, and can update their password anytime in their profile.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-dark-750">
              <Button
                variant="secondary"
                onClick={handleCopyAllCredentials}
                leftIcon={credentialsCopied ? Check : Copy}
              >
                {credentialsCopied ? 'Copied to Clipboard!' : 'Copy All Credentials'}
              </Button>
              <Button
                variant="primary"
                onClick={() => setCreatedCredentials(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
