import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Mail, Phone, Building2, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const EmployeeCard = ({ employee, onView, onEdit }) => {
  return (
    <div className="p-5 rounded-2xl bg-dark-850 border border-dark-700/80 hover:border-dark-600 shadow-card-dark transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={employee.avatar}
              name={employee.name}
              size="md"
              status={employee.status === 'Active' ? 'online' : 'leave'}
            />
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-purple-light transition-colors">
                {employee.name}
              </h4>
              <span className="text-xs text-slate-400 block">{employee.designation}</span>
              <span className="text-[10px] text-slate-400 font-mono">{employee.id || employee.employeeId}</span>
            </div>
          </div>
          <Badge variant={employee.status} dot size="sm">
            {employee.status}
          </Badge>
        </div>

        <div className="space-y-2 py-3 border-y border-dark-750/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{employee.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Joined {formatDate(employee.joiningDate)}</span>
          </div>
        </div>
      </div>

      <div className="pt-3.5 flex items-center justify-end gap-2">
        <Link
          to={`/admin/employees/${employee.id || employee.employeeId}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple-light hover:text-white px-3 py-1.5 rounded-xl hover:bg-brand-purple/10 border border-transparent hover:border-brand-purple/30 transition-all"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default EmployeeCard;
