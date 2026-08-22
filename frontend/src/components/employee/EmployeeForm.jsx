import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { User, Mail, Hash, Phone, MapPin, DollarSign, Save } from 'lucide-react';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validation';

const EmployeeForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'Employee',
    department: 'Engineering',
    designation: '',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
    dateOfBirth: '',
    basicSalary: '5000',
    allowances: '800',
    deductions: '300'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        employeeId: initialData.employeeId || initialData.id || '',
        role: initialData.role || 'Employee',
        department: initialData.department || 'Engineering',
        designation: initialData.designation || '',
        employmentType: initialData.employmentType || 'Full-Time',
        status: initialData.status || 'Active',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        phone: initialData.phone || '',
        address: initialData.address || '',
        dateOfBirth: initialData.dateOfBirth || '',
        basicSalary: initialData.salary?.basicSalary?.toString() || '5000',
        allowances: initialData.salary?.allowances?.toString() || '800',
        deductions: initialData.salary?.deductions?.toString() || '300'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim() || !isValidEmail(formData.email)) newErrors.email = 'Valid work email is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const basic = Number(formData.basicSalary) || 0;
    const allow = Number(formData.allowances) || 0;
    const deduct = Number(formData.deductions) || 0;

    const payload = {
      ...formData,
      salary: {
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: basic + allow - deduct,
        currency: 'USD',
        effectiveDate: formData.joiningDate
      }
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Elena Rostova"
          leftIcon={User}
          error={errors.name}
          required
        />

        <Input
          label="Work Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@dayflow.io"
          leftIcon={Mail}
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Input
          label="Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="EMP-1006"
          leftIcon={Hash}
          disabled={isEdit}
          error={errors.employeeId}
          required
        />

        <Select
          label="System Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: 'Employee', label: 'Employee' },
            { value: 'HR', label: 'HR Officer / Admin' }
          ]}
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

      {/* Organization Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          required
        />

        <Input
          label="Designation / Title"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Senior Software Engineer"
          error={errors.designation}
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Input
          label="Joining Date"
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          leftIcon={Phone}
        />

        <Input
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Residential Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Street address, City, State, ZIP"
        leftIcon={MapPin}
      />

      {/* Initial Salary Setup (Admin Only) */}
      <div className="p-4 rounded-2xl bg-dark-800/80 border border-dark-700 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-brand-purple-light" />
          Salary Structure (Monthly)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Basic Salary ($)"
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            required
          />
          <Input
            label="Allowances ($)"
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            required
          />
          <Input
            label="Deductions ($)"
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full mt-2"
        leftIcon={Save}
      >
        {isEdit ? 'Save Changes' : 'Create Employee Profile'}
      </Button>
    </form>
  );
};

export default EmployeeForm;
