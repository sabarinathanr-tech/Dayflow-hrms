import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Mail, Phone, MapPin, ArrowUpRight, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const EmployeeCard = ({ employee, onClick }) => {
  if (!employee) return null;

  return (
    <div
      onClick={onClick}
      className="group p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark hover:border-purple-300 dark:hover:border-brand-purple/50 hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header Avatar + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Avatar
            src={employee.avatar}
            name={employee.name}
            size="lg"
            status={employee.status === 'Active' ? 'online' : 'leave'}
          />
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={employee.status} dot size="sm">
              {employee.status}
            </Badge>
            <Badge variant={employee.role === 'HR' ? 'purple' : 'cyan'} size="sm">
              {employee.role}
            </Badge>
          </div>
        </div>

        {/* Name & Title */}
        <div className="space-y-0.5 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-purple dark:group-hover:text-brand-purple-light transition-colors">
              {employee.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{employee.designation}</p>
          <span className="text-[11px] font-semibold text-brand-purple dark:text-brand-cyan-light font-mono block">
            {employee.department} · {employee.employeeId || employee.id}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 py-3 border-t border-slate-100 dark:border-dark-750">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>{employee.phone || '+1 (555) 000-0000'}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>Joined {formatDate(employee.joiningDate)}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-dark-750 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">View Dossier & Payroll</span>
        <span className="font-bold text-brand-purple dark:text-brand-purple-light">Open Profile →</span>
      </div>
    </div>
  );
};

export default EmployeeCard;
