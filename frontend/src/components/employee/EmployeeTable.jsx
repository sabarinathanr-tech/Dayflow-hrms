import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { Eye, Edit3, Trash2, Users } from 'lucide-react';

const EmployeeTable = ({
  employees = [],
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
    <div className="w-full overflow-x-auto rounded-2xl border border-dark-700/80 bg-dark-850 shadow-card-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-700/80 bg-dark-800/60 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Employee</th>
            <th className="py-3.5 px-4 sm:px-6">ID</th>
            <th className="py-3.5 px-4 sm:px-6">Department</th>
            <th className="py-3.5 px-4 sm:px-6">Designation</th>
            <th className="py-3.5 px-4 sm:px-6">Status</th>
            <th className="py-3.5 px-4 sm:px-6">Joined Date</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700/40 text-xs">
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="hover:bg-dark-800/50 transition-colors text-slate-300 group"
            >
              <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={emp.avatar}
                    name={emp.name}
                    size="sm"
                    status={emp.status === 'Active' ? 'online' : 'leave'}
                  />
                  <div>
                    <span className="block font-semibold group-hover:text-brand-purple-light transition-colors">
                      {emp.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{emp.email}</span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-400 whitespace-nowrap">
                {emp.id || emp.employeeId}
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-medium text-slate-200">
                {emp.department}
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-300">
                {emp.designation}
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                <Badge variant={emp.status} dot>
                  {emp.status}
                </Badge>
              </td>

              <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-400">
                {formatDate(emp.joiningDate)}
              </td>

              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    to={`/admin/employees/${emp.id || emp.employeeId}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-dark-750 transition-colors"
                    title="View Employee Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-purple-light hover:bg-dark-750 transition-colors"
                      title="Edit Employee"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(emp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Employee"
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
