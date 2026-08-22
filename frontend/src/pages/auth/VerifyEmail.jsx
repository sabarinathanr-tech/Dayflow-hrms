import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../../components/common/Button';
import ThemeToggle from '../../components/common/ThemeToggle';
import {
  MailCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Edit2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();
  const toast = useToast();

  const initialEmail =
    location.state?.email || localStorage.getItem('dayflow_pending_email') || '';
  const initialCode =
    location.state?.code || localStorage.getItem('dayflow_pending_code') || '123456';

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [activeOtp, setActiveOtp] = useState(initialCode);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0); // 0 initial timer so user can click resend right away if needed
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If initial code is available, populate it or prepare autofill
  useEffect(() => {
    if (initialEmail) {
      localStorage.setItem('dayflow_pending_email', initialEmail);
    }
  }, [initialEmail]);

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

  const autofillCode = (otpToFill) => {
    const targetOtp = otpToFill || activeOtp || '123456';
    const digits = targetOtp.slice(0, 6).split('');
    const newCode = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      if (i < 6) newCode[i] = d;
    });
    setCode(newCode);
    setErrorMsg('');
    toast.success(`Autofilled OTP code: ${targetOtp}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = code.join('');
    if (!email) {
      setErrorMsg('Please enter your work email address.');
      setIsEditingEmail(true);
      return;
    }

    if (token.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      toast.error('Please enter the complete 6-digit verification code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await verifyEmail({ email, code: token });
      localStorage.removeItem('dayflow_pending_email');
      localStorage.removeItem('dayflow_pending_code');
      toast.success('Email successfully verified! You can now sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired verification code';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('Please specify your registered email address first.');
      setIsEditingEmail(true);
      return;
    }

    setResending(true);
    setErrorMsg('');
    try {
      const res = await resendVerification({ email });
      const freshCode = res?.code || res?.data?.code || '123456';
      setActiveOtp(freshCode);
      localStorage.setItem('dayflow_pending_code', freshCode);
      autofillCode(freshCode);

      toast.success(`New verification code generated: ${freshCode}`);
      setTimer(15); // 15-second cooldown
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend verification code.';
      setErrorMsg(msg);
      toast.error(msg);
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
            Complete your account activation with the 6-digit verification code.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Target Email Banner with Edit Option */}
      <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Verification Recipient
          </span>
          {isEditingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                localStorage.setItem('dayflow_pending_email', e.target.value);
              }}
              placeholder="Enter your registered email"
              className="mt-1 w-full text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-dark-700 px-2.5 py-1.5 rounded-lg border border-brand-purple/40 focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
              {email || 'No email specified'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsEditingEmail(!isEditingEmail)}
          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white dark:bg-dark-700 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-300 hover:text-brand-purple transition-colors flex items-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditingEmail ? 'Done' : 'Change'}</span>
        </button>
      </div>

      {/* Hackathon / Demo Live OTP Helper Box */}
      <div className="mb-5 p-3.5 rounded-2xl bg-purple-50/80 dark:bg-brand-purple/15 border border-purple-200 dark:border-brand-purple/30 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-brand-purple dark:text-brand-cyan-light font-bold">
            <KeyRound className="w-4 h-4" />
            <span>Verification Code:</span>
            <span className="font-mono text-sm font-black px-2 py-0.5 rounded-md bg-white dark:bg-dark-800 border border-purple-300 dark:border-brand-purple/40">
              {activeOtp || '123456'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => autofillCode(activeOtp)}
            className="px-2.5 py-1 rounded-xl bg-brand-purple text-white text-[10px] font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Autofill</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          ⚡ Demo assistance: You can also use universal bypass code <strong className="font-mono text-slate-700 dark:text-slate-300">123456</strong> anytime.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            className={`font-bold transition-colors flex items-center gap-1 ${
              timer > 0 || resending
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-brand-purple dark:text-brand-purple-light hover:underline'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Sending...' : timer > 0 ? `Resend code in ${timer}s` : 'Resend code now'}</span>
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
