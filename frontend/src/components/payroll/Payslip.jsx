import React from 'react';
import DayflowLogo from '../common/DayflowLogo';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

const Payslip = ({
  employee = {},
  salary = {},
  month = 'August 2026'
}) => {
  const basic = Number(salary.basicSalary) || 4500;
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Payslip Card */}
      <div
        id="payslip-document"
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 shadow-xl space-y-6 text-slate-900 dark:text-slate-100 print:border-none print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-dark-750">
          <div>
            <DayflowLogo size="md" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Dayflow Global Inc. · 100 Innovation Blvd, CA
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-black uppercase tracking-wider text-brand-purple dark:text-brand-cyan-light block">
              Official Salary Statement
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
              Pay Period: {month}
            </span>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200/80 dark:border-dark-700/60 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee Name</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{employee.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee ID</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{employee.employeeId || 'EMP-1001'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{employee.department}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Designation</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{employee.designation}</span>
          </div>
        </div>

        {/* Detailed Earnings vs Deductions Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Earnings */}
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider pb-1.5 border-b border-slate-200 dark:border-dark-700">
              Earnings & Allowances
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Basic Salary</span>
              <span className="font-mono font-bold">{formatCurrency(basic)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>House Rent Allowance (HRA)</span>
              <span className="font-mono font-bold">{formatCurrency(hra)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Standard Allowance</span>
              <span className="font-mono font-bold">{formatCurrency(stdAllow)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Performance Bonus</span>
              <span className="font-mono font-bold">{formatCurrency(perfBonus)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Leave Travel Allowance</span>
              <span className="font-mono font-bold">{formatCurrency(lta)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Fixed Allowance</span>
              <span className="font-mono font-bold">{formatCurrency(fixedAllow)}</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              <span>Gross Earnings</span>
              <span className="font-mono">{formatCurrency(gross)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider pb-1.5 border-b border-slate-200 dark:border-dark-700">
              Statutory Deductions
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Provident Fund (PF)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(pf)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Professional Tax (PT)</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(profTax)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-dark-800">
              <span>Other Deductions & Insurance</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(otherDeduct)}</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-rose-600 dark:text-rose-400 text-sm">
              <span>Total Deductions</span>
              <span className="font-mono">-{formatCurrency(deductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Take-Home Highlight */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-purple dark:text-brand-purple-light block">
              Net Disbursed Amount
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {formatCurrency(net)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bank Transfer Processed</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-200 dark:border-dark-750 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Confidential · System Generated via Dayflow HRMS</span>
          <span className="font-mono">Authorized Signature / Stamp</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 print:hidden">
        <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={Printer}>
          Print / Download PDF
        </Button>
      </div>
    </div>
  );
};

export default Payslip;
