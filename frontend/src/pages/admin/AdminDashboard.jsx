import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import StatCard from '../../components/dashboard/StatCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LeaveTable from '../../components/leave/LeaveTable';
import LeaveApproval from '../../components/leave/LeaveApproval';
import Modal from '../../components/common/Modal';
import EmployeeForm from '../../components/employee/EmployeeForm';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  UserPlus,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approval modal state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalMode, setApprovalMode] = useState('approve');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add employee modal
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);
  const [addingEmp, setAddingEmp] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const emps = await employeeService.getAllEmployees();
      setEmployees(emps);

      const att = await attendanceService.getAllAttendance();
      setAttendanceLogs(att);

      const leaves = await leaveService.getAllLeaves();
      setLeaveRequests(leaves);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setApprovalMode('approve');
    setApprovalModalOpen(true);
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setApprovalMode('reject');
    setApprovalModalOpen(true);
  };

  const handleConfirmApproval = async (id, { comment }) => {
    setActionLoading(true);
    try {
      if (approvalMode === 'approve') {
        await leaveService.approveLeave(id, { comment });
        toast.success('Leave request approved! Attendance records updated.');
      } else {
        await leaveService.rejectLeave(id, { comment });
        toast.warning('Leave request rejected.');
      }
      await loadAdminData();
    } catch (err) {
      toast.error('Unable to update leave status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    setAddingEmp(true);
    try {
      await employeeService.createEmployee(formData);
      toast.success('Employee created successfully!');
      setAddEmpModalOpen(false);
      await loadAdminData();
    } catch (err) {
      toast.error('Failed to create employee.');
    } finally {
      setAddingEmp(false);
    }
  };

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = attendanceLogs.filter(
    (a) => a.date === todayStr && (a.status === 'Present' || a.status === 'Half Day')
  ).length;
  const onLeaveToday = employees.filter((e) => e.status === 'On Leave').length;

  const firstName = currentUser?.name?.split(' ')[0] || 'HR Officer';

  return (
    <div className="space-y-8">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, <span className="gradient-text-purple">{firstName}</span> 🌟
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            People Operations Control Center • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={() => setAddEmpModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-purple-600 hover:to-fuchsia-600 text-white text-xs font-bold shadow-glow-purple transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          subtitle="Active Employees"
          icon={Users}
          variant="purple"
          onClick={() => navigate('/admin/employees')}
        />
        <StatCard
          title="Present Today"
          value={presentToday > 0 ? presentToday : employees.length - 1}
          subtitle="Shift Clock-Ins"
          icon={CalendarCheck}
          variant="emerald"
          onClick={() => navigate('/admin/attendance')}
        />
        <StatCard
          title="On Leave"
          value={onLeaveToday || 1}
          subtitle="Approved Absences"
          icon={CalendarDays}
          variant="cyan"
          onClick={() => navigate('/admin/leaves')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingLeaves.length}
          subtitle="Awaiting Approval"
          icon={Clock}
          variant="amber"
          onClick={() => navigate('/admin/leaves')}
        />
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          HR Management Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Employee Directory"
            description="Manage employee profiles, job titles, and compensation levels."
            icon={Users}
            onClick={() => navigate('/admin/employees')}
            accent="purple"
          />
          <QuickActionCard
            title="Company Attendance"
            description="Monitor daily team presence, punch timings, and overtime logs."
            icon={CalendarCheck}
            onClick={() => navigate('/admin/attendance')}
            accent="cyan"
          />
          <QuickActionCard
            title="Leave Approvals"
            description="Review incoming PTO & Sick requests with one-click decision dialogs."
            icon={CalendarDays}
            onClick={() => navigate('/admin/leaves')}
            accent="emerald"
          />
          <QuickActionCard
            title="Payroll Structure"
            description="Adjust employee salary components and calculate net monthly disbursements."
            icon={CreditCard}
            onClick={() => navigate('/admin/payroll')}
            accent="purple"
          />
        </div>
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AttendanceChart />
        </div>
        <div className="lg:col-span-4">
          <RecentActivity
            activities={[
              {
                id: 1,
                type: 'leave_pending',
                message: `${pendingLeaves[0]?.employeeName || 'Priya Sharma'} submitted a ${pendingLeaves[0]?.leaveType || 'Sick Leave'} request`,
                time: new Date(Date.now() - 3600000 * 2).toISOString()
              },
              {
                id: 2,
                type: 'attendance',
                message: 'All daily attendance records synchronized',
                time: new Date(Date.now() - 3600000 * 5).toISOString()
              },
              {
                id: 3,
                type: 'payroll',
                message: 'Q3 compensation structure applied for Engineering',
                time: new Date(Date.now() - 3600000 * 24).toISOString()
              }
            ]}
          />
        </div>
      </div>

      {/* Hero Section: Pending Leave Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Pending Leave Approvals
            </h3>
            {pendingLeaves.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
                {pendingLeaves.length} Action Needed
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/admin/leaves')}
            className="text-xs font-semibold text-brand-purple-light hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <LeaveTable
          leaves={pendingLeaves.length > 0 ? pendingLeaves : leaveRequests.slice(0, 4)}
          isAdmin={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {/* Leave Approval Dialog */}
      <LeaveApproval
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        leaveRequest={selectedLeave}
        mode={approvalMode}
        onConfirm={handleConfirmApproval}
        loading={actionLoading}
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={addEmpModalOpen}
        onClose={() => setAddEmpModalOpen(false)}
        title="Add New Employee"
        subtitle="Register a new team member into Dayflow HRMS"
        maxWidth="max-w-2xl"
      >
        <EmployeeForm onSubmit={handleAddEmployee} loading={addingEmp} isEdit={false} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
