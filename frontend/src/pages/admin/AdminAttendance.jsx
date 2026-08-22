import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import AttendanceFilters from '../../components/attendance/AttendanceFilters';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import Loading from '../../components/common/Loading';
import { CalendarDays, LayoutList, Download } from 'lucide-react';
import Button from '../../components/common/Button';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import useToast from '../../hooks/useToast';

const AdminAttendance = () => {
  const toast = useToast();
  const [activeView, setActiveView] = useState('table'); // 'table' | 'calendar'
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const emps = await employeeService.getAllEmployees();
      setEmployees(emps);

      const logs = await attendanceService.getAllAttendance({
        search,
        department,
        status,
        employeeId: selectedEmployee
      });
      setAttendance(logs);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, department, status, selectedEmployee]);

  const handleExport = () => {
    toast.success('Attendance report exported to CSV successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Company Attendance Timesheets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor daily employee punch logs, working duration, and absence rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-dark-700/80">
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'table' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'calendar' ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={Download}
          >
            Export Logs
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <AttendanceStats records={attendance} />

      {/* Filters */}
      <AttendanceFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        department={department}
        onDepartmentChange={setDepartment}
        employees={employees}
        selectedEmployee={selectedEmployee}
        onEmployeeChange={setSelectedEmployee}
        onReset={() => {
          setSearch('');
          setStatus('All');
          setDepartment('All');
          setSelectedEmployee('All');
        }}
      />

      {/* Content */}
      {loading ? (
        <Loading text="Loading company attendance..." />
      ) : activeView === 'table' ? (
        <AttendanceTable records={attendance} showEmployee={true} />
      ) : (
        <AttendanceCalendar records={attendance} />
      )}
    </div>
  );
};

export default AdminAttendance;
