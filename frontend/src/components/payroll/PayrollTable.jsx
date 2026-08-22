import React from 'react';
import Avatar from '../common/Avatar';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CreditCard, Edit3, Eye, FileText } from 'lucide-react';

const PayrollTable = ({
  payrollList = [],
  onEdit,
  onViewPayslip
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white dark:bg-dark-850 shadow-card-light dark:shadow-card-dark">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-800/60 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Employee</th>
            <th className="py-3.5 px-4 sm:px-6">Basic Salary</th>
            <th className="py-3.5 px-4 sm:px-6">Allowances</th>
            <th className="py-3.5 px-4 sm:px-6">Gross Pay</th>
            <th className="py-3.5 px-4 sm:px-6">Deductions</th>
            <th className="py-3.5 px-4 sm:px-6">Net Take-Home</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-dark-700/40 text-slate-700 dark:text-slate-300">
          {payrollList.map((emp) => (
            <tr
              key={emp.id || emp.employeeId}
              className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <Avatar src={emp.avatar} name={emp.employeeName} size="sm" />
                  <div>
                    <span>{emp.employeeName}</span>
                    <span className="text-[11px] text-slate-400 font-mono block font-normal">
                      {emp.employeeId} · {emp.department}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                {formatCurrency(emp.basicSalary, emp.currency)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(emp.allowances, emp.currency)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap font-bold">
                {formatCurrency(emp.grossSalary, emp.currency)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap text-rose-600 dark:text-rose-400">
                -{formatCurrency(emp.deductions, emp.currency)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap font-black text-slate-900 dark:text-white text-sm">
                {formatCurrency(emp.netSalary, emp.currency)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onViewPayslip(emp)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-dark-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors"
                    title="View Printable Payslip"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(emp)}
                    className="p-1.5 rounded-xl bg-purple-50 dark:bg-brand-purple/10 border border-purple-200 dark:border-brand-purple/20 text-brand-purple dark:text-purple-400 hover:bg-purple-100 transition-colors"
                    title="Edit Salary Structure"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
