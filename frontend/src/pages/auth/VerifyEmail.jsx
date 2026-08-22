import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { MailCheck, KeyRound, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const registeredEmail = location.state?.email || 'your.email@company.com';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.trim().length < 4) {
      setError('Please enter a valid verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyEmail({ email: registeredEmail, code: code.trim() });
      setIsSuccess(true);
      toast.success('Email successfully verified! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid verification code';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await authService.resendVerification({ email: registeredEmail });
      toast.success('A fresh verification code was sent to your inbox.');
      setCountdown(60);
    } catch (err) {
      toast.error('Unable to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Email Verified!</h3>
        <p className="text-xs text-slate-400 mb-6">
          Your Dayflow account is now verified and active. Redirecting you to sign in...
        </p>
        <Link to="/login">
          <Button variant="primary" className="w-full">
            Proceed to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light flex items-center justify-center mx-auto mb-3">
          <MailCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Verify Your Email</h3>
        <p className="text-xs text-slate-400 mt-1">
          We sent a verification code to:
        </p>
        <p className="text-xs font-semibold text-brand-cyan-light mt-0.5">{registeredEmail}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 123456"
          leftIcon={KeyRound}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full"
          rightIcon={ArrowRight}
        >
          Verify Account
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Didn't receive the code?</span>
          {countdown > 0 ? (
            <span className="text-slate-500 font-mono">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-brand-purple-light hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
          )}
        </div>

        <Link to="/login" className="text-slate-400 hover:text-slate-200 transition-colors">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
