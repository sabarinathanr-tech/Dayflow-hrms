import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import EmployeeSearch from '../../components/employee/EmployeeSearch';
import EmployeeTable from '../../components/employee/EmployeeTable';
import EmployeeCard from '../../components/employee/EmployeeCard';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { UserPlus, LayoutGrid, LayoutList } from 'lucide-react';
import { employeeService } from '../../services/employeeService';

const Employees = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees({
        search,
        department,
        status
      });
      setEmployees(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, status]);

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmployee(emp);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, formData);
        toast.success('Employee updated successfully!');
      } else {
        await employeeService.createEmployee(formData);
        toast.success('New employee added successfully!');
      }
      setFormModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      toast.error('Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDelete = (emp) => {
    setDeletingEmployee(emp);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    try {
      await employeeService.deleteEmployee(deletingEmployee.id);
      toast.success(`Employee ${deletingEmployee.name} removed.`);
      setDeleteDialogOpen(false);
      await fetchEmployees();
    } catch (err) {
      toast.error('Unable to delete employee.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Employee Directory ({employees.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse corporate workforce records, job designations, and profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-dark-700/80">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={UserPlus}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <EmployeeSearch
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
        onReset={() => {
          setSearch('');
          setDepartment('All');
          setStatus('All');
        }}
      />

      {/* Employee List */}
      {loading ? (
        <Loading text="Loading employee records..." />
      ) : viewMode === 'table' ? (
        <EmployeeTable
          employees={employees}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onEdit={() => handleOpenEdit(emp)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}
        subtitle={editingEmployee ? `Updating ${editingEmployee.name}` : 'Create a new employee profile'}
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleFormSubmit}
          loading={formLoading}
          isEdit={Boolean(editingEmployee)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message={`Are you sure you want to delete ${deletingEmployee?.name}? This action removes their attendance and payroll history.`}
        confirmText="Delete Record"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Employees;
