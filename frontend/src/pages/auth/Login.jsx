import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DayflowLogo from '../../components/common/DayflowLogo';
import ThemeToggle from '../../components/common/ThemeToggle';
import { Mail, Lock, ArrowRight, UserCheck, Shield, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
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
      newErrors.email = 'Please enter a valid work email';
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

      const userRole = data.user.role?.toUpperCase();
      const defaultPath = (userRole === 'HR' || userRole === 'ADMIN') ? '/admin/dashboard' : '/employee/dashboard';
      const fromPath = location.state?.from?.pathname;
      const targetPath = fromPath && !fromPath.includes('/login') && !fromPath.includes('/register') ? fromPath : defaultPath;

      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to Dayflow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your corporate credentials to access your workspace.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs leading-relaxed animate-in fade-in">
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
                className="w-4 h-4 rounded bg-white dark:bg-dark-800 border-slate-300 dark:border-dark-600 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-brand-purple hover:text-brand-magenta dark:text-brand-purple-light dark:hover:text-white transition-colors font-medium"
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
          Sign In to Workspace
        </Button>
      </form>

      {/* Demo Credentials Quick Switcher for Hackathon Judges */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-dark-750">
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 text-center">
          ⚡ Hackathon Quick Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleAutofill('employee')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-purple" />
            <span>Employee Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleAutofill('hr')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-magenta" />
            <span>HR Admin Demo</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have account access?{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Contact your HR Administrator
        </span>
      </div>
    </div>
  );
};

export default Login;
