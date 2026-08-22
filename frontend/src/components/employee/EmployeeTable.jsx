import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { Users, Eye, Edit3, Trash2 } from 'lucide-react';

const EmployeeTable = ({
  employees = [],
  onView,
  onEdit,
  onDelete
}) => {
  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try adjusting your search criteria or add a new team member."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 dark:border-dark-700/80 bg-white dark:bg-dark-850 shadow-card-light dark:shadow-card-dark">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-800/60 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Employee</th>
            <th className="py-3.5 px-4 sm:px-6">Department</th>
            <th className="py-3.5 px-4 sm:px-6">Job Position</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
            <th className="py-3.5 px-4 sm:px-6">Joined Date</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-dark-700/40 text-slate-700 dark:text-slate-300">
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <Avatar src={emp.avatar} name={emp.name} size="sm" />
                  <div>
                    <span className="block font-bold">{emp.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block font-normal">
                      {emp.employeeId || emp.id} · {emp.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">
                {emp.department}
              </td>
              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                {emp.designation}
              </td>
              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                <Badge variant={emp.status} dot>
                  {emp.status}
                </Badge>
              </td>
              <td className="py-3.5 px-4 sm:px-6 font-mono whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDate(emp.joiningDate)}
              </td>
              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(emp)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-dark-750 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors"
                    title="View Employee Dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(emp)}
                    className="p-1.5 rounded-xl bg-purple-50 dark:bg-brand-purple/10 text-brand-purple dark:text-purple-400 hover:bg-purple-100 transition-colors"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {onDelete && emp.id !== 'HR-001' && (
                    <button
                      onClick={() => onDelete(emp)}
                      className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                      title="Deactivate & Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
