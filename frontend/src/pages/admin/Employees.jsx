import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeCard from '../../components/employee/EmployeeCard';
import EmployeeTable from '../../components/employee/EmployeeTable';
import EmployeeSearch from '../../components/employee/EmployeeSearch';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import useToast from '../../hooks/useToast';
import { UserPlus, LayoutGrid, List, Users, CheckCircle2, Copy, Check, Key, ShieldCheck, Mail, Hash, User } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

const Employees = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');

  // Add Employee Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);

  // Created Employee Credentials Modal
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [credentialsCopied, setCredentialsCopied] = useState(false);

  // Delete Confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees({ search, department, status });
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load employee directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department, status]);

  const handleSearchSubmit = () => {
    fetchEmployees();
  };

  const handleAddEmployee = async (formData) => {
    setAddingLoading(true);
    try {
      const res = await employeeService.createEmployee(formData);
      toast.success('Employee created and provisioned successfully!');
      setAddModalOpen(false);

      const creds = res?.credentials || {
        name: formData.name,
        employeeId: formData.employeeId,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      setCreatedCredentials(creds);
      await fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to create employee profile.');
    } finally {
      setAddingLoading(false);
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

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    setDeletingLoading(true);
    try {
      await employeeService.deleteEmployee(employeeToDelete.employeeId || employeeToDelete.id);
      toast.success(`Employee ${employeeToDelete.name} record removed.`);
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      await fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee.');
    } finally {
      setDeletingLoading(false);
    }
  };

  if (loading && employees.length === 0) {
    return <Loading text="Loading employee directory..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Directory Unavailable"
        description={error}
        onRetry={fetchEmployees}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage corporate workforce, job assignments, and compensation structures
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            leftIcon={UserPlus}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <EmployeeSearch
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
        onReset={() => {
          setSearch('');
          setDepartment('All');
          setStatus('All');
          fetchEmployees();
        }}
      />

      {/* 3. Employee Grid or Table View */}
      {employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Employees Found"
          description="No employee records match the current filter or search criteria."
          actionLabel="Add New Employee"
          onAction={() => setAddModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.employeeId || emp.id || emp._id}
              employee={emp}
              onClick={() => navigate(`/admin/employees/${emp.employeeId || emp.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onView={(emp) => navigate(`/admin/employees/${emp.employeeId || emp.id}`)}
          onEdit={(emp) => navigate(`/admin/employees/${emp.employeeId || emp.id}`)}
          onDelete={(emp) => {
            setEmployeeToDelete(emp);
            setDeleteConfirmOpen(true);
          }}
        />
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Employee"
        subtitle="Create an employee profile with position and compensation details"
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          onSubmit={handleAddEmployee}
          loading={addingLoading}
          isEdit={false}
        />
      </Modal>

      {/* Provisioned Credentials Success Modal */}
      <Modal
        isOpen={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title="Employee Account Provisioned"
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Deactivate & Delete Record"
        message={`Are you sure you want to remove the employee record for ${employeeToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Record"
        type="danger"
        loading={deletingLoading}
      />
    </div>
  );
};

export default Employees;
