import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Clock, Users, CheckCircle } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-dark-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-brand-purple selection:text-white">
      {/* Ambient background glow & grid lines */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2438_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Main container */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left branding banner (visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-dark-900/60 border border-dark-700/80 backdrop-blur-xl shadow-2xl h-full min-h-[560px]">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center shadow-glow-purple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">Dayflow</h1>
                <p className="text-[11px] text-brand-cyan font-medium">HR MANAGEMENT SYSTEM</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              Every workday,<br />
              <span className="gradient-text-purple">perfectly aligned.</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-8">
              Seamlessly unify attendance tracking, leave requests, employee profiles, and payroll in one powerful dark-mode interface.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Real-time Attendance</h4>
                  <p className="text-[11px] text-slate-400">One-click check-in/out with calendar status analytics.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-brand-purple/10 text-purple-400 border border-brand-purple/20 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Instant Leave Approvals</h4>
                  <p className="text-[11px] text-slate-400">Connected hero flow between employee requests & HR decisions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-brand-cyan/10 text-cyan-400 border border-brand-cyan/20 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Role-Based Security</h4>
                  <p className="text-[11px] text-slate-400">Isolated views and protected salary structures for Employees and HR.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-dark-750 flex items-center justify-between text-[11px] text-slate-500">
            <span>© 2026 Dayflow HRMS</span>
            <span className="text-brand-cyan-light font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Right Auth Card Form */}
        <div className="w-full lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-dark-900/80 border border-dark-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Mobile Header Logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center shadow-glow-purple">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Dayflow HRMS</span>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
