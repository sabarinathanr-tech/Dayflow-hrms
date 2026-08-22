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
import useToast from '../../hooks/useToast';
import { UserPlus, LayoutGrid, List, Users } from 'lucide-react';
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

  // Delete Confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees({ search, department, status });
      setEmployees(data || []);
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
      await employeeService.createEmployee(formData);
      toast.success('Employee created successfully!');
      setAddModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      toast.error('Failed to create employee profile.');
    } finally {
      setAddingLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    setDeletingLoading(true);
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
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
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onClick={() => navigate(`/admin/employees/${emp.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onView={(emp) => navigate(`/admin/employees/${emp.id}`)}
          onEdit={(emp) => navigate(`/admin/employees/${emp.id}`)}
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
          onSubmit={handleAddEmployeeSubmit}
          loading={addingLoading}
          isEdit={false}
        />
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
