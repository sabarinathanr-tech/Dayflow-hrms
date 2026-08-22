import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import Select from '../common/Select';
import { DEPARTMENTS } from '../../utils/constants';

const AttendanceFilters = ({
  search = '',
  onSearchChange,
  status = 'All',
  onStatusChange,
  department = 'All',
  onDepartmentChange,
  employees = [],
  selectedEmployee = 'All',
  onEmployeeChange,
  onReset
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 mb-6 space-y-4 shadow-card-light dark:shadow-card-dark">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search input */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Search Records
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, ID, dept..."
              className="w-full bg-white dark:bg-dark-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl pl-9 pr-4 py-2 border border-slate-200 dark:border-dark-600 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status filter */}
        <Select
          label="Shift Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Present', label: 'Present' },
            { value: 'Half Day', label: 'Half Day' },
            { value: 'Leave', label: 'Leave' },
            { value: 'Absent', label: 'Absent' }
          ]}
        />

        {/* Department filter */}
        {onDepartmentChange && (
          <Select
            label="Department"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            options={[
              { value: 'All', label: 'All Departments' },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d }))
            ]}
          />
        )}

        {/* Employee selector (for admin) */}
        {onEmployeeChange && (
          <Select
            label="Employee"
            value={selectedEmployee}
            onChange={(e) => onEmployeeChange(e.target.value)}
            options={[
              { value: 'All', label: 'All Employees' },
              ...employees.map((emp) => ({
                value: emp.id,
                label: `${emp.name} (${emp.id})`
              }))
            ]}
          />
        )}
      </div>

      {onReset && (search || status !== 'All' || department !== 'All' || selectedEmployee !== 'All') && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-purple dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;
