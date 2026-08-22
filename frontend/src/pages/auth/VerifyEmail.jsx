import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import { MailCheck, ArrowRight, RotateCcw } from 'lucide-react';

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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInput = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = code.join('');
    if (token.length < 6) {
      toast.error('Please enter the full 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(token);
      toast.success('Email successfully verified! Welcome to Dayflow.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Invalid verification token');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await resendVerification(email);
      toast.success('New verification code sent to your email.');
      setTimer(60);
    } catch (err) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Verify Work Email
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We sent a 6-digit verification code to <strong>{email}</strong>
          </p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2">
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
              className="w-11 h-12 text-center text-lg font-black font-mono rounded-2xl bg-white dark:bg-dark-800 text-slate-900 dark:text-white border border-slate-200 dark:border-dark-600 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple shadow-sm transition-all"
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
      </form>
    </div>
  );
};

export default VerifyEmail;
