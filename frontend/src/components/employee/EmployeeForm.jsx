import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { DEPARTMENTS, EMPLOYMENT_TYPES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validation';
import { Sparkles, Key, Copy, Check, Eye, EyeOff, ShieldCheck, UserPlus, RefreshCw } from 'lucide-react';
import useToast from '../../hooks/useToast';

const generateSecurePassword = (empId = '') => {
  const cleanId = empId.replace(/[^A-Za-z0-9]/g, '') || '2026';
  const specialChars = ['@', '#', '$', '!'];
  const char = specialChars[Math.floor(Math.random() * specialChars.length)];
  const randNum = Math.floor(100 + Math.random() * 900);
  return `Dayflow${char}${cleanId || randNum}`;
};

const generateNextEmployeeId = (role = 'Employee') => {
  const prefix = role === 'HR' ? 'HR' : 'EMP';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randNum}`;
};

const EmployeeForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    employeeId: initialData.employeeId || initialData.id || (!isEdit ? generateNextEmployeeId('Employee') : ''),
    role: initialData.role || 'Employee',
    designation: initialData.designation || 'Software Engineer',
    department: initialData.department || 'Engineering',
    employmentType: initialData.employmentType || 'Full-Time',
    status: initialData.status || 'Active',
    joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
    address: initialData.address || '',
    manager: initialData.manager || 'Sarah Jenkins (HR-001)',
    password: initialData.password || (!isEdit ? 'Dayflow@2026' : ''),
    basicSalary: initialData.salary?.basicSalary || 45000,
    allowances: initialData.salary?.allowances || 22000,
    deductions: initialData.salary?.deductions || 3800
  });

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit && !formData.password) {
      const generated = generateSecurePassword(formData.employeeId);
      setFormData((prev) => ({ ...prev, password: generated }));
    }
  }, [formData.employeeId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'role' && !isEdit) {
        updated.employeeId = generateNextEmployeeId(value);
        updated.password = generateSecurePassword(updated.employeeId);
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegenerateId = () => {
    const newId = generateNextEmployeeId(formData.role);
    const newPass = generateSecurePassword(newId);
    setFormData((prev) => ({ ...prev, employeeId: newId, password: newPass }));
    toast.success(`Generated ID: ${newId}`);
  };

  const handleRegeneratePassword = () => {
    const newPass = generateSecurePassword(formData.employeeId);
    setFormData((prev) => ({ ...prev, password: newPass }));
    toast.success('Generated new secure password!');
  };

  const handleCopyPassword = () => {
    if (!formData.password) return;
    navigator.clipboard.writeText(formData.password);
    setCopied(true);
    toast.success('Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'Full legal name is required';
    if (!formData.email) newErrors.email = 'Work email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Please enter a valid work email';
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.designation) newErrors.designation = 'Job position is required';
    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Initial password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const basic = Number(formData.basicSalary);
    const allow = Number(formData.allowances);
    const ded = Number(formData.deductions);
    const gross = basic + allow;
    const net = gross - ded;

    const payload = {
      ...formData,
      salary: {
        basicSalary: basic,
        hra: Math.round(basic * 0.4),
        standardAllowance: 5000,
        performanceBonus: 3000,
        lta: 2500,
        fixedAllowance: 1500,
        allowances: allow,
        pfDeduction: Math.round(basic * 0.12),
        professionalTax: 200,
        otherDeductions: 500,
        deductions: ded,
        grossSalary: gross,
        netSalary: net,
        monthlyWage: net,
        yearlyWage: net * 12,
        currency: 'INR'
      }
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {!isEdit && (
        <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-brand-purple/10 border border-purple-200/80 dark:border-brand-purple/20 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-purple dark:text-brand-purple-light flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block">HR Corporate Provisioning</span>
            Only HR can create Employee IDs and provision login accounts. The auto-generated initial password can be copied and provided to the employee. Employees can sign in using their ID/Email and later update their password.
          </div>
        </div>
      )}

      {/* 1. Basic Identity */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Basic Identity & HR Employee ID
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Legal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Arjun Kumar"
            error={errors.name}
            required
          />
          <Input
            label="Official Work Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="arjun@dayflow.io"
            error={errors.email}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  className="text-[11px] font-bold text-brand-purple dark:text-brand-purple-light hover:underline flex items-center gap-1"
                  title="Generate unique Employee ID"
                >
                  <RefreshCw className="w-3 h-3" /> Auto-Generate
                </button>
              )}
            </div>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP-1006"
              disabled={isEdit}
              className={`w-full bg-white dark:bg-dark-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-2xl p-3.5 border font-mono font-bold ${
                errors.employeeId
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-dark-600 focus:border-brand-purple focus:ring-brand-purple'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            />
            {errors.employeeId && (
              <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.employeeId}</p>
            )}
          </div>

          <Input
            label="Contact Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* 2. Initial Login Credentials (Auto-Generated by HR) */}
      {!isEdit && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-dark-750">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-brand-purple" />
              <span>Initial Auto-Generated Password</span>
            </h4>
            <button
              type="button"
              onClick={handleRegeneratePassword}
              className="text-[11px] font-bold text-brand-purple dark:text-brand-purple-light hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Regenerate
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dayflow@2026"
                  className="w-full bg-white dark:bg-dark-750 text-slate-900 dark:text-white text-xs font-mono font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-dark-600 focus:outline-none focus:border-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyPassword}
                className="px-3 py-2 rounded-xl bg-purple-100 dark:bg-brand-purple/20 text-brand-purple dark:text-purple-300 hover:bg-purple-200 font-bold flex items-center gap-1.5 transition-colors"
                title="Copy temporary password to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              The employee can use this password to log in and can change it anytime in their profile.
            </p>
          </div>
        </div>
      )}

      {/* 3. Job & Department Assignment */}
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
              { value: 'Employee', label: 'Employee (Standard Access)' },
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

      {/* 4. Compensation */}
      {!isEdit && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-dark-750">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Initial Base Compensation (INR ₹)
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Basic Salary (₹)"
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
            />
            <Input
              label="Allowances (₹)"
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
            />
            <Input
              label="Deductions (₹)"
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
          {isEdit ? 'Save Changes' : 'Create & Provision Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
