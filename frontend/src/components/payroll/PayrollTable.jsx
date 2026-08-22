import React from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Edit3, FileText, DollarSign } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const PayrollTable = ({
  records = [],
  onEditSalary,
  onViewPayslip
}) => {
  if (!records || records.length === 0) {
    return (
      <EmptyState
        icon={DollarSign}
        title="No payroll records"
        description="There are no payroll records available."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-dark-700/80 bg-dark-850 shadow-card-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-700/80 bg-dark-800/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Employee</th>
            <th className="py-3.5 px-4 sm:px-6">Basic Pay</th>
            <th className="py-3.5 px-4 sm:px-6">Allowances</th>
            <th className="py-3.5 px-4 sm:px-6">Deductions</th>
            <th className="py-3.5 px-4 sm:px-6">Net Salary</th>
            <th className="py-3.5 px-4 sm:px-6">Last Updated</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700/40 text-xs">
          {records.map((item) => (
            <tr
              key={item.employeeId}
              className="hover:bg-dark-800/50 transition-colors text-slate-300 group"
            >
              <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                <div className="flex items-center gap-3">
                  <Avatar src={item.avatar} name={item.employeeName} size="sm" />
                  <div>
                    <span className="block font-semibold group-hover:text-brand-purple-light transition-colors">
                      {item.employeeName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.employeeId} · {item.department}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap">
                {formatCurrency(item.basicSalary, item.currency)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 font-mono text-emerald-400 whitespace-nowrap">
                +{formatCurrency(item.allowances, item.currency)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 font-mono text-rose-400 whitespace-nowrap">
                -{formatCurrency(item.deductions, item.currency)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white whitespace-nowrap">
                {formatCurrency(item.netSalary, item.currency)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 text-slate-400 whitespace-nowrap">
                {formatDate(item.lastUpdated)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewPayslip(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-dark-750 transition-colors"
                    title="View Payslip"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditSalary(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-purple-light hover:bg-dark-750 transition-colors"
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
