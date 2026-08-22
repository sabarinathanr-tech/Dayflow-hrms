import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

const SalaryCard = ({
  basicSalary = 0,
  allowances = 0,
  deductions = 0,
  netSalary = 0,
  currency = 'USD'
}) => {
  const gross = Number(basicSalary) + Number(allowances);
  const net = netSalary || (gross - Number(deductions));
  const yearly = net * 12;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Net Salary Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Net Monthly Pay
          </span>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 border border-purple-200 dark:border-brand-purple/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
          {formatCurrency(net, currency)}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Final take-home amount</p>
      </div>

      {/* Annual CTC */}
      <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Annualized Package
          </span>
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-brand-purple dark:text-brand-purple-light font-mono">
          {formatCurrency(yearly, currency)}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium font-mono">Monthly × 12 months</p>
      </div>

      {/* Gross Salary */}
      <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Gross Earnings
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
          {formatCurrency(gross, currency)}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Basic + total allowances</p>
      </div>

      {/* Deductions */}
      <div className="p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Deductions
          </span>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
          -{formatCurrency(deductions, currency)}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Statutory taxes & PF</p>
      </div>
    </div>
  );
};

export default SalaryCard;
