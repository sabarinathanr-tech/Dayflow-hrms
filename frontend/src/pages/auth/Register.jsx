import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import {
  Mail,
  Lock,
  User,
  Hash,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { isValidEmail, evaluatePasswordStrength } from '../../utils/validation';

const Register = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'Employee', // 'Employee' | 'HR'
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let err = '';
    if (field === 'name') {
      if (!value || value.trim().length < 2) err = 'Full legal name is required';
    } else if (field === 'email') {
      if (!value) err = 'Work email address is required';
      else if (!isValidEmail(value)) err = 'Please enter a valid work email (e.g. name@company.com)';
    } else if (field === 'employeeId') {
      if (!value || value.trim().length < 2) err = 'Employee ID is required (e.g. EMP-1006)';
    } else if (field === 'password') {
      if (!value) err = 'Password is required';
      else if (value.length < 6) err = 'Password must be at least 6 characters';
    } else if (field === 'confirmPassword') {
      if (!value) err = 'Please confirm your password';
      else if (value !== formData.password) err = 'Passwords do not match';
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
    return !err;
  };

  const validateAll = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Full legal name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Work email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid work email address';
    }
    if (!formData.employeeId || formData.employeeId.trim().length < 2) {
      newErrors.employeeId = 'Employee ID is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      employeeId: true,
      password: true,
      confirmPassword: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setApiError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        password: formData.password,
        role: formData.role
      });

      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = evaluatePasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Dayflow Account
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register your workplace account and set up your credentials.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Employee ID */}
        <Input
          label="Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          onBlur={() => handleBlur('employeeId')}
          placeholder="e.g. EMP-1006 or HR-002"
          leftIcon={Hash}
          error={touched.employeeId ? errors.employeeId : ''}
          required
        />

        {/* 2. Full Name */}
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
          placeholder="Jane Doe"
          leftIcon={User}
          error={touched.name ? errors.name : ''}
          required
        />

        {/* 3. Work Email */}
        <Input
          label="Work Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          placeholder="name@company.com"
          leftIcon={Mail}
          error={touched.email ? errors.email : ''}
          required
        />

        {/* 4. Role Selection (Employee vs HR) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Select Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'Employee' }))}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 text-left ${
                formData.role === 'Employee'
                  ? 'bg-purple-50/80 dark:bg-brand-purple/15 border-brand-purple text-brand-purple dark:text-white shadow-sm ring-1 ring-brand-purple'
                  : 'bg-white dark:bg-dark-800/80 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-600'
              }`}
            >
              <div
                className={`p-2 rounded-xl border ${
                  formData.role === 'Employee'
                    ? 'bg-brand-purple text-white border-brand-purple/30'
                    : 'bg-slate-100 dark:bg-dark-750 border-slate-200 dark:border-dark-700 text-slate-500'
                }`}
              >
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold block leading-tight">Employee</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Punch & Time Off</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'HR' }))}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 text-left ${
                formData.role === 'HR'
                  ? 'bg-purple-50/80 dark:bg-brand-purple/15 border-brand-purple text-brand-purple dark:text-white shadow-sm ring-1 ring-brand-purple'
                  : 'bg-white dark:bg-dark-800/80 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-600'
              }`}
            >
              <div
                className={`p-2 rounded-xl border ${
                  formData.role === 'HR'
                    ? 'bg-brand-purple text-white border-brand-purple/30'
                    : 'bg-slate-100 dark:bg-dark-750 border-slate-200 dark:border-dark-700 text-slate-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold block leading-tight">HR Admin</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Full Management</span>
              </div>
            </button>
          </div>
        </div>

        {/* 5. Password & Strength */}
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            placeholder="Min 6 characters"
            leftIcon={Lock}
            error={touched.password ? errors.password : ''}
            required
          />
          {formData.password && (
            <div className="mt-2 space-y-1.5 animate-in fade-in">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400">Password Strength:</span>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.bg} transition-all duration-300`}
                  style={{ width: `${passwordStrength.percentage}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                <span className={formData.password.length >= 6 ? 'text-emerald-500 font-bold' : ''}>
                  • 6+ chars
                </span>
                <span className={/[A-Z]/.test(formData.password) ? 'text-emerald-500 font-bold' : ''}>
                  • Uppercase
                </span>
                <span className={/[0-9]/.test(formData.password) ? 'text-emerald-500 font-bold' : ''}>
                  • Number
                </span>
                <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-emerald-500 font-bold' : ''}>
                  • Symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Confirm Password */}
        <div>
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            placeholder="Re-enter your password"
            leftIcon={Lock}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
            required
          />
          {formData.confirmPassword && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] animate-in fade-in">
              {passwordsMatch ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : passwordsMismatch ? (
                <span className="text-rose-500 flex items-center gap-1 font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
          rightIcon={ArrowRight}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-purple dark:text-brand-purple-light font-bold hover:underline transition-colors ml-1"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
