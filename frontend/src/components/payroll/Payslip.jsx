import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Sparkles, Printer, Download, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import useToast from '../../hooks/useToast';

const Payslip = ({
  employee = {},
  salary = {},
  payPeriod = 'August 2026',
  referenceNo = 'PAY-2026-08'
}) => {
  const toast = useToast();

  const basic = Number(salary.basicSalary) || 0;
  const allow = Number(salary.allowances) || 0;
  const deduct = Number(salary.deductions) || 0;
  const net = salary.netSalary || (basic + allow - deduct);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Payslip download initiated.');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-dark-700/80 shadow-2xl text-slate-200 max-w-2xl mx-auto space-y-6">
      {/* Payslip Header */}
      <div className="flex items-start justify-between pb-6 border-b border-dark-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center shadow-glow-purple">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Dayflow HRMS</h2>
            <p className="text-[11px] text-brand-cyan-light font-mono">OFFICIAL SALARY DISBURSEMENT SLIP</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Pay Period</span>
          <span className="text-sm font-bold text-white block mt-0.5">{payPeriod}</span>
          <span className="text-[10px] text-slate-500 font-mono">Ref: {referenceNo}</span>
        </div>
      </div>

      {/* Employee Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-dark-850/80 border border-dark-700/60 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Employee Name</span>
          <span className="font-bold text-white mt-0.5 block">{employee.name || employee.employeeName || 'Alex Morgan'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Employee ID</span>
          <span className="font-mono text-brand-purple-light font-semibold mt-0.5 block">{employee.id || employee.employeeId || 'EMP-1001'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Department</span>
          <span className="text-slate-200 font-medium mt-0.5 block">{employee.department || 'Engineering'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Designation</span>
          <span className="text-slate-200 font-medium mt-0.5 block">{employee.designation || 'Senior Engineer'}</span>
        </div>
      </div>

      {/* Earnings & Deductions Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Earnings */}
        <div className="p-4 rounded-2xl bg-dark-850 border border-dark-700/60 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-dark-750">
            Earnings
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Basic Monthly Pay</span>
              <span className="font-mono font-medium text-slate-200">{formatCurrency(basic)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">House Rent Allowance</span>
              <span className="font-mono font-medium text-slate-200">{formatCurrency(allow * 0.6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Special & Travel Allowance</span>
              <span className="font-mono font-medium text-slate-200">{formatCurrency(allow * 0.4)}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-dark-750 flex justify-between font-bold text-xs">
            <span className="text-white">Total Gross Earnings</span>
            <span className="font-mono text-emerald-400">+{formatCurrency(basic + allow)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="p-4 rounded-2xl bg-dark-850 border border-dark-700/60 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider pb-2 border-b border-dark-750">
            Deductions
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Income Tax (TDS / PAYE)</span>
              <span className="font-mono font-medium text-slate-200">{formatCurrency(deduct * 0.7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provident Fund / 401(k)</span>
              <span className="font-mono font-medium text-slate-200">{formatCurrency(deduct * 0.3)}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-dark-750 flex justify-between font-bold text-xs">
            <span className="text-white">Total Deductions</span>
            <span className="font-mono text-rose-400">-{formatCurrency(deduct)}</span>
          </div>
        </div>
      </div>

      {/* Net Pay Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 border border-brand-purple/40 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-purple-light uppercase tracking-wider block">
            Net Disbursed Amount
          </span>
          <span className="text-[11px] text-slate-400">Credited to primary corporate payroll account</span>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-white font-mono">
          {formatCurrency(net)}
        </span>
      </div>

      {/* Footer & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dark-700/60 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verified & Digitally Signed by People Operations</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} leftIcon={Printer}>
            Print
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload} leftIcon={Download}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
