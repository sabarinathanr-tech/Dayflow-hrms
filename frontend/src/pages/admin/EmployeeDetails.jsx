import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import EmployeeProfileCard from '../../components/employee/EmployeeProfileCard';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import LeaveTable from '../../components/leave/LeaveTable';
import SalaryStructure from '../../components/payroll/SalaryStructure';
import SalaryCard from '../../components/payroll/SalaryCard';
import SalaryForm from '../../components/payroll/SalaryForm';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import {
  ArrowLeft,
  User,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Edit3,
  DollarSign
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'leaves' | 'payroll'
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit employee modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);

  // Edit salary modal
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const emp = await employeeService.getEmployeeById(id);
      setEmployee(emp);

      const att = await attendanceService.getEmployeeAttendance(emp.id);
      setAttendance(att);

      const allLeaves = await leaveService.getAllLeaves({ employeeId: emp.id });
      setLeaves(allLeaves);
    } catch (err) {
      setError(err.message || 'Employee not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleEditEmployee = async (formData) => {
    setEditingLoading(true);
    try {
      await employeeService.updateEmployee(employee.id, formData);
      toast.success('Employee profile updated!');
      setEditModalOpen(false);
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to update employee details.');
    } finally {
      setEditingLoading(false);
    }
  };

  const handleUpdateSalary = async (salaryData) => {
    setSalaryLoading(true);
    try {
      await payrollService.updateSalaryStructure(employee.id, salaryData);
      toast.success('Salary structure updated successfully!');
      setSalaryModalOpen(false);
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to update salary structure.');
    } finally {
      setSalaryLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Loading employee record..." />;
  }

  if (error || !employee) {
    return (
      <ErrorState
        title="Employee record unavailable"
        description={error || 'Could not find details for this employee.'}
        onRetry={fetchDetails}
      />
    );
  }

  const sal = employee.salary || {
    basicSalary: 6000,
    allowances: 1000,
    deductions: 400,
    netSalary: 6600
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/employees"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSalaryModalOpen(true)}
            leftIcon={DollarSign}
          >
            Edit Salary Structure
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditModalOpen(true)}
            leftIcon={Edit3}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <EmployeeProfileCard employee={employee} isSelf={false} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-700/80 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Overview & Compensation', icon: User },
          { id: 'attendance', label: `Attendance Logs (${attendance.length})`, icon: CalendarCheck },
          { id: 'leaves', label: `Leave History (${leaves.length})`, icon: CalendarDays },
          { id: 'payroll', label: 'Payroll Details', icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <SalaryCard
            basicSalary={sal.basicSalary}
            allowances={sal.allowances}
            deductions={sal.deductions}
            netSalary={sal.netSalary}
          />
          <SalaryStructure salary={sal} />
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceCalendar records={attendance} />
          <AttendanceTable records={attendance} />
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Time Off History</h3>
          <LeaveTable leaves={leaves} isAdmin={false} />
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <SalaryCard
            basicSalary={sal.basicSalary}
            allowances={sal.allowances}
            deductions={sal.deductions}
            netSalary={sal.netSalary}
          />
          <SalaryStructure salary={sal} />
        </div>
      )}

      {/* Edit Employee Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Employee Information"
        subtitle={`Updating profile for ${employee.name}`}
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          initialData={employee}
          onSubmit={handleEditEmployee}
          loading={editingLoading}
          isEdit={true}
        />
      </Modal>

      {/* Edit Salary Modal */}
      <Modal
        isOpen={salaryModalOpen}
        onClose={() => setSalaryModalOpen(false)}
        title="Adjust Salary Structure"
        subtitle="Modify base compensation, allowances and deductions"
        maxWidth="max-w-md"
      >
        <SalaryForm
          initialData={sal}
          onSubmit={handleUpdateSalary}
          loading={salaryLoading}
          employeeName={employee.name}
        />
      </Modal>
    </div>
  );
};

export default EmployeeDetails;
