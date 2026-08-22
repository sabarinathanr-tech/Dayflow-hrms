import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ShieldCheck, Info } from 'lucide-react';

const SalaryStructure = ({ salary = {} }) => {
  const basic = Number(salary.basicSalary) || 0;
  const hra = Number(salary.hra) || Math.round(basic * 0.4);
  const stdAllow = Number(salary.standardAllowance) || 500;
  const perfBonus = Number(salary.performanceBonus) || 400;
  const lta = Number(salary.lta) || 300;
  const fixedAllow = Number(salary.fixedAllowance) || 200;
  const allowances = salary.allowances !== undefined ? Number(salary.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

  const pf = Number(salary.pfDeduction) || 350;
  const profTax = Number(salary.professionalTax) || 150;
  const otherDeduct = Number(salary.otherDeductions) || 100;
  const deductions = salary.deductions !== undefined ? Number(salary.deductions) : (pf + profTax + otherDeduct);

  const gross = basic + allowances;
  const net = salary.netSalary || (gross - deductions);
  const monthly = net;
  const yearly = monthly * 12;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-dark-700/80">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Detailed Salary Structure Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Standard compensation components configured under corporate HR policies
          </p>
        </div>
        {salary.effectiveDate && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono self-start sm:self-auto">
            Effective: {formatDate(salary.effectiveDate)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Earnings & Allowances
          </h4>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-dark-750">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Basic Salary</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(basic)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">House Rent Allowance (HRA)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(hra)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Standard Allowance</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(stdAllow)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Performance Bonus</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(perfBonus)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Leave Travel Allowance (LTA)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(lta)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Fixed Allowance</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(fixedAllow)}</span>
            </div>
          </div>
          <div className="flex justify-between pt-2 text-xs font-black text-emerald-600 dark:text-emerald-400 border-t border-slate-200 dark:border-dark-700">
            <span>Gross Monthly Earnings</span>
            <span className="font-mono">{formatCurrency(gross)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Statutory Deductions
          </h4>
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-dark-750">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Provident Fund (PF)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(pf)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Professional Tax (PT)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(profTax)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600 dark:text-slate-300">Other Deductions & Insurance</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(otherDeduct)}</span>
            </div>
          </div>
          <div className="flex justify-between pt-2 text-xs font-black text-rose-600 dark:text-rose-400 border-t border-slate-200 dark:border-dark-700">
            <span>Total Deductions</span>
            <span className="font-mono">-{formatCurrency(deductions)}</span>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-purple dark:text-brand-purple-light block">
                Net Monthly Take-Home
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {formatCurrency(net)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Annualized CTC</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                {formatCurrency(yearly)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStructure;
