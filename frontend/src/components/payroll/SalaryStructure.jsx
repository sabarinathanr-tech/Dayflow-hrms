import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ShieldCheck, Info } from 'lucide-react';

const SalaryStructure = ({ salary = {} }) => {
  const basic = Number(salary.basicSalary) || 0;
  const allow = Number(salary.allowances) || 0;
  const deduct = Number(salary.deductions) || 0;
  const net = salary.netSalary || (basic + allow - deduct);

  return (
    <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-dark-750">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Detailed Compensation Breakdown
          </h3>
          <p className="text-xs text-slate-400">Fixed and variable pay components</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Policy</span>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-dark-800/60 border border-dark-700/40">
          <span className="text-slate-300 font-medium">Base Monthly Salary (Fixed)</span>
          <span className="font-mono font-bold text-white">{formatCurrency(basic)}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="text-emerald-300 font-medium">Standard Allowances (HRA + Travel + Medical)</span>
          <span className="font-mono font-bold text-emerald-400">+{formatCurrency(allow)}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <span className="text-rose-300 font-medium">Statutory Deductions (Tax / PF / Insurance)</span>
          <span className="font-mono font-bold text-rose-400">-{formatCurrency(deduct)}</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/40 text-sm">
          <span className="font-bold text-white">Net Disbursable Salary</span>
          <span className="font-mono font-black text-brand-cyan-light text-base">
            {formatCurrency(net)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructure;
