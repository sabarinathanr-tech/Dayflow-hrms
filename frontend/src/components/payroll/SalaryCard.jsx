import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../common/Badge';

const SalaryCard = ({
  basicSalary = 0,
  allowances = 0,
  deductions = 0,
  netSalary = 0,
  currency = 'USD',
  effectiveDate
}) => {
  const calculatedNet = netSalary || (Number(basicSalary) + Number(allowances) - Number(deductions));

  return (
    <div className="p-6 rounded-3xl bg-dark-850 border border-dark-700/80 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Net Monthly Pay
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatCurrency(calculatedNet, currency)}
            </h2>
            <span className="text-xs font-bold text-emerald-400">/ Month</span>
          </div>
          {effectiveDate && (
            <p className="text-xs text-slate-400 mt-1">Effective from {effectiveDate}</p>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-magenta text-white shadow-glow-purple flex items-center justify-center">
          <Wallet className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-dark-750 relative z-10">
        <div className="p-4 rounded-2xl bg-dark-800/80 border border-dark-700/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Basic Salary</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-xl font-bold text-white mt-1 block">
            {formatCurrency(basicSalary, currency)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800/80 border border-dark-700/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Allowances</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">
            +{formatCurrency(allowances, currency)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800/80 border border-dark-700/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase">Deductions</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-xl font-bold text-rose-400 mt-1 block">
            -{formatCurrency(deductions, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalaryCard;
