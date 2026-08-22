import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { Mail, Lock, User, Hash, ArrowRight, ShieldCheck } from 'lucide-react';
import { isValidEmail, evaluatePasswordStrength } from '../../utils/validation';

const Register = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Work email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid work email';
    }
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID / Invitation code is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      // Role is fixed by policy: Employee
      await register({
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        password: formData.password,
        role: 'Employee'
      });

      toast.success('Account setup completed successfully!');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = evaluatePasswordStrength(formData.password);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Complete Account Setup
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Activate your Dayflow employee profile using your invited email.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Legal Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          leftIcon={User}
          error={errors.name}
          required
        />

        <Input
          label="Work Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          leftIcon={Mail}
          error={errors.email}
          required
        />

        <Input
          label="Assigned Employee ID / Token"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="e.g. EMP-1006"
          leftIcon={Hash}
          error={errors.employeeId}
          required
        />

        <div>
          <Input
            label="Create Secure Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            leftIcon={Lock}
            error={errors.password}
            required
          />
          {formData.password && (
            <div className="mt-1.5 space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400">Strength:</span>
                <span className={passwordStrength.color}>{passwordStrength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.bg} transition-all duration-300`}
                  style={{ width: `${passwordStrength.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          leftIcon={Lock}
          error={errors.confirmPassword}
          required
        />

        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-purple flex-shrink-0" />
          <span>Assigned Role: <strong>Employee</strong> (Managed by HR Admin)</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
          rightIcon={ArrowRight}
        >
          Activate Employee Profile
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an active account?{' '}
        <Link
          to="/login"
          className="text-brand-purple dark:text-brand-purple-light font-bold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
