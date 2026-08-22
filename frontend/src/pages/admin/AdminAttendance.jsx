import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import AttendanceFilters from '../../components/attendance/AttendanceFilters';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import useToast from '../../hooks/useToast';
import { Calendar, List, Download, Clock, TrendingUp, CalendarCheck } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';

const AdminAttendance = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const empList = await employeeService.getAllEmployees();
      setEmployees(empList || []);

      const attList = await attendanceService.getAllAttendance({
        search,
        status,
        department,
        employeeId: selectedEmployee
      });
      setAttendance(attList || []);
    } catch (err) {
      setError(err.message || 'Failed to load company attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, department, selectedEmployee]);

  const handleExportCSV = () => {
    if (!attendance.length) {
      toast.error('No attendance records to export.');
      return;
    }
    const headers = ['Employee ID,Employee Name,Department,Date,Check In,Check Out,Worked Minutes,Extra Minutes,Status\n'];
    const rows = attendance.map((a) =>
      `"${a.employeeId}","${a.employeeName}","${a.department}","${a.date}","${a.checkIn || ''}","${a.checkOut || ''}","${a.workingHours || 0}","${a.extraHours || 0}","${a.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Attendance_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance CSV exported successfully!');
  };

  if (loading && attendance.length === 0) {
    return <Loading text="Loading company attendance shift logs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Attendance Logs Unavailable"
        description={error}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Company Attendance Timesheets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Monitor daily employee check-ins, shift completions, standard vs extra overtime hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timesheet Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar Grid</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={Download}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 2. Key Presence & Overtime Metrics */}
      <AttendanceStats records={attendance} />

      {/* 3. Filter Bar */}
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
          fetchData();
        }}
      />

      {/* 4. Attendance Table / Calendar */}
      {viewMode === 'table' ? (
        <AttendanceTable records={attendance} showEmployee={true} />
      ) : (
        <AttendanceCalendar records={attendance} />
      )}
    </div>
  );
};

export default AdminAttendance;
