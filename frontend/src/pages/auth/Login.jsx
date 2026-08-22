import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock, LogIn, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
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
      const data = await login({
        email: formData.email,
        password: formData.password
      });

      toast.success(`Welcome back, ${data.user.name}!`);

      // Determine redirect path
      const userRole = data.user.role?.toUpperCase();
      const defaultPath = (userRole === 'HR' || userRole === 'ADMIN') ? '/admin/dashboard' : '/employee/dashboard';
      const fromPath = location.state?.from?.pathname;
      const targetPath = fromPath && !fromPath.includes('/login') ? fromPath : defaultPath;

      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo autofill helper
  const handleAutofill = (role) => {
    if (role === 'employee') {
      setFormData({
        email: 'employee@dayflow.io',
        password: 'password123',
        rememberMe: true
      });
    } else {
      setFormData({
        email: 'hr@dayflow.io',
        password: 'password123',
        rememberMe: true
      });
    }
    setErrors({});
    setApiError('');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Sign In to Dayflow</h3>
        <p className="text-xs text-slate-400 mt-1">Enter your work credentials to access your workspace.</p>
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed animate-in fade-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
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
            placeholder="••••••••"
            leftIcon={Lock}
            error={errors.password}
            required
          />
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-dark-800 border-dark-600 text-brand-purple focus:ring-brand-purple focus:ring-offset-dark-900"
              />
              <span className="text-xs text-slate-400">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-purple-light hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
          rightIcon={ArrowRight}
        >
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="mt-6 pt-5 border-t border-dark-750/80">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
          ⚡ Hackathon Quick Demo Access
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleAutofill('employee')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-600 hover:border-brand-cyan text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Employee Login</span>
          </button>
          <button
            type="button"
            onClick={() => handleAutofill('hr')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-600 hover:border-brand-purple text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-purple-light" />
            <span>HR Admin Login</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-purple-light hover:text-white transition-colors">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
