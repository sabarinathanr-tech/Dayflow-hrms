import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import Select from '../common/Select';
import { DEPARTMENTS } from '../../utils/constants';

const EmployeeSearch = ({
  search = '',
  onSearchChange,
  department = 'All',
  onDepartmentChange,
  status = 'All',
  onStatusChange,
  onReset
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-dark-850 border border-dark-700/80 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Text Search */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Search Employees
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, ID, role..."
              className="w-full bg-dark-800 text-slate-100 text-sm rounded-xl pl-9 pr-4 py-2 border border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder:text-slate-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Department Filter */}
        <Select
          label="Department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          options={[
            { value: 'All', label: 'All Departments' },
            ...DEPARTMENTS.map((d) => ({ value: d, label: d }))
          ]}
        />

        {/* Status Filter */}
        <Select
          label="Employment Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Active', label: 'Active' },
            { value: 'On Leave', label: 'On Leave' },
            { value: 'Inactive', label: 'Inactive' }
          ]}
        />
      </div>

      {onReset && (search || department !== 'All' || status !== 'All') && (
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;
