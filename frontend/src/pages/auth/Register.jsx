import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { Mail, Lock, Hash, Shield, ArrowRight } from 'lucide-react';
import { isValidEmail, isValidEmployeeId, getPasswordStrength } from '../../utils/validation';

const Register = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (!isValidEmployeeId(formData.employeeId)) {
      newErrors.employeeId = 'Employee ID must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid work email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms of service';
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
      await register({
        employeeId: formData.employeeId.trim().toUpperCase(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });

      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white tracking-tight">Create an Account</h3>
        <p className="text-xs text-slate-400 mt-1">Join Dayflow HRMS to manage your workplace activities.</p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Employee ID"
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g. EMP-2024"
            leftIcon={Hash}
            error={errors.employeeId}
            required
          />

          <Select
            label="Account Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'Employee', label: 'Employee' },
              { value: 'HR', label: 'HR Officer / Admin' }
            ]}
            required
          />
        </div>

        <Input
          label="Work Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.name@company.com"
          leftIcon={Mail}
          error={errors.email}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            leftIcon={Lock}
            error={errors.password}
            required
          />

          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Strength:</span>
                <span className={`font-semibold ${passwordStrength.color}`}>{passwordStrength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.barColor} transition-all duration-300`}
                  style={{ width: passwordStrength.width }}
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

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded bg-dark-800 border-dark-600 text-brand-purple focus:ring-brand-purple focus:ring-offset-dark-900"
            />
            <span className="text-xs text-slate-400 leading-tight">
              I agree to the <span className="text-brand-purple-light underline">Terms of Service</span> and acknowledge the company HR policies.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.agreeTerms}</p>
          )}
        </div>

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

      <div className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-purple-light hover:text-white transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
