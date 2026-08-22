import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { MailCheck, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();
  const toast = useToast();

  const email = location.state?.email || 'your-email@company.com';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInput = (index, value) => {
    setErrorMsg('');
    if (value.length > 1) {
      // Handle paste of whole code
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 1) {
        const newCode = [...code];
        digits.forEach((d, i) => {
          if (i < 6) newCode[i] = d;
        });
        setCode(newCode);
        const nextIdx = Math.min(5, digits.length);
        const target = document.getElementById(`code-${nextIdx}`);
        if (target) target.focus();
        return;
      }
      value = value.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const digits = pasted.split('');
      const newCode = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) newCode[i] = d;
      });
      setCode(newCode);
      const target = document.getElementById(`code-${Math.min(5, digits.length)}`);
      if (target) target.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = code.join('');
    if (token.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      toast.error('Please enter the full 6-digit verification code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await verifyEmail({ email, code: token });
      toast.success('Email successfully verified! Welcome to Dayflow.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid verification token';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setErrorMsg('');
    try {
      await resendVerification({ email });
      toast.success('New verification code sent to your email.');
      setTimer(60);
    } catch (err) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Verify Work Email
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We sent a 6-digit verification code to <strong className="text-slate-700 dark:text-slate-300 font-semibold">{email}</strong>
          </p>
        </div>
        <ThemeToggle />
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-black font-mono rounded-2xl bg-white dark:bg-dark-800 text-slate-900 dark:text-white border border-slate-200 dark:border-dark-600 hover:border-slate-300 dark:hover:border-dark-500 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 shadow-sm transition-all outline-none"
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full"
          rightIcon={ArrowRight}
        >
          Verify & Continue
        </Button>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-dark-750">
          <span>Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`font-bold transition-colors ${
              timer > 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-brand-purple dark:text-brand-purple-light hover:underline'
            }`}
          >
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend code now'}
          </button>
        </div>

        <div className="text-center pt-1">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-purple dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmail;
