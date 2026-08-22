import React from 'react';
import { Outlet } from 'react-router-dom';
import DayflowLogo from '../components/common/DayflowLogo';
import { CheckCircle2, ShieldCheck, Clock, Users, Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-dark-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/10 dark:bg-brand-purple/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cyan/10 dark:bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2438_1px,transparent_1px)] [background-size:24px_24px] opacity-30 dark:opacity-20 pointer-events-none" />

      {/* Main container */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left branding banner (visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-dark-700/80 shadow-soft-lg dark:shadow-2xl backdrop-blur-xl h-full min-h-[580px] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-xl dark:hover:shadow-[0_20px_45px_-15px_rgba(168,85,247,0.15)] hover:border-slate-300 dark:hover:border-dark-600">
          <div>
            <div className="mb-8">
              <DayflowLogo size="lg" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
              Every workday,<br />
              <span className="gradient-text-purple">perfectly aligned.</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              The modern, unified Human Resource Management platform built for seamless shift tracking, instant time-off approvals, employee profiles, and accurate payroll.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Real-Time Shift Timesheets</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">One-click punch with standard and extra overtime hour tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple dark:text-purple-400 border border-brand-purple/20 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Time-Off & Medical Attachments</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Connected leave requests with medical certificates and instant approvals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Protected Salary Structure</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Transparent employee payslips & admin compensation management.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-dark-750 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>© 2026 Dayflow HRMS</span>
            <span className="font-semibold text-brand-purple dark:text-brand-cyan-light font-mono">Enterprise v1.2</span>
          </div>
        </div>

        {/* Right Auth Card Form */}
        <div className="w-full lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-dark-900/90 border border-slate-200 dark:border-dark-700/80 rounded-3xl p-6 sm:p-8 shadow-soft-lg dark:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-xl dark:hover:shadow-[0_20px_45px_-15px_rgba(168,85,247,0.2)] hover:border-slate-300 dark:hover:border-dark-600">
            {/* Mobile Header Logo */}
            <div className="flex lg:hidden items-center justify-center mb-6">
              <DayflowLogo size="md" />
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
