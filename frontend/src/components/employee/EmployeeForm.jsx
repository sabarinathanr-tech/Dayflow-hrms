import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validation';

const EmployeeForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    employeeId: initialData.employeeId || initialData.id || '',
    role: initialData.role || 'Employee',
    designation: initialData.designation || '',
    department: initialData.department || 'Engineering',
    employmentType: initialData.employmentType || 'Full-Time',
    status: initialData.status || 'Active',
    joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
    address: initialData.address || '',
    manager: initialData.manager || 'Sarah Jenkins (HR-001)',
    basicSalary: initialData.salary?.basicSalary || 4500,
    allowances: initialData.salary?.allowances || 2000,
    deductions: initialData.salary?.deductions || 500
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Work email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid work email';
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.designation) newErrors.designation = 'Job position is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      salary: {
        basicSalary: Number(formData.basicSalary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
        netSalary: Number(formData.basicSalary) + Number(formData.allowances) - Number(formData.deductions),
        monthlyWage: Number(formData.basicSalary) + Number(formData.allowances) - Number(formData.deductions),
        yearlyWage: (Number(formData.basicSalary) + Number(formData.allowances) - Number(formData.deductions)) * 12,
        currency: 'USD'
      }
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Basic Identity
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            error={errors.name}
            required
          />
          <Input
            label="Work Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            error={errors.email}
            required
          />
          <Input
            label="Employee ID / Token"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="EMP-1006"
            error={errors.employeeId}
            required
            disabled={isEdit}
          />
          <Input
            label="Contact Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-dark-750">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Job & Department Assignment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Job Position / Title"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Software Engineer"
            error={errors.designation}
            required
          />
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            required
          />
          <Select
            label="System Role Authorization"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'Employee', label: 'Employee (Standard User)' },
              { value: 'HR', label: 'HR Officer / Administrator' }
            ]}
            required
          />
          <Select
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))}
            required
          />
          <Input
            label="Date of Joining"
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            required
          />
        </div>
      </div>

      {!isEdit && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-dark-750">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Initial Base Compensation
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Basic Salary ($)"
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
            />
            <Input
              label="Allowances ($)"
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
            />
            <Input
              label="Deductions ($)"
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-dark-750">
        <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
          {isEdit ? 'Save Changes' : 'Create Employee Record'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
