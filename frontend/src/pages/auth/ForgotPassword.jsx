import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { isValidEmail } from '../../utils/validation';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid work email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword({ email: email.trim() });
      setSubmitted(true);
      toast.success('Password reset link has been dispatched.');
    } catch (err) {
      setError(err.message || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6 animate-in zoom-in-95">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          If an account exists for <span className="text-brand-cyan-light font-semibold">{email}</span>, we have sent instructions to reset your password.
        </p>
        <Link to="/login">
          <Button variant="secondary" className="w-full" leftIcon={ArrowLeft}>
            Return to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Forgot Password</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Enter your registered email address and we'll send you a password recovery link.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="your.name@company.com"
          leftIcon={Mail}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full"
          rightIcon={Send}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
