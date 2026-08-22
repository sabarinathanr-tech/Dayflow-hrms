import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import CheckInOutCard from '../../components/attendance/CheckInOutCard';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import AttendanceFilters from '../../components/attendance/AttendanceFilters';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { Calendar, List, Clock, TrendingUp } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';

const MyAttendance = () => {
  const { employeeId } = useAuth();
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'table' | 'weekly'
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getMyAttendance();
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  if (loading) {
    return <Loading text="Loading your attendance records..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load attendance"
        description={error}
        onRetry={fetchAttendance}
      />
    );
  }

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      !search ||
      r.date.includes(search) ||
      r.status.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Real-Time Punch Widget */}
      <CheckInOutCard employeeId={employeeId} onStatusChange={fetchAttendance} />

      {/* 2. Key Metrics & Extra Hours Summary */}
      <AttendanceStats records={records} />

      {/* 3. View Switcher & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Attendance Timesheet Logs
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Daily check-in logs, total duration, and overtime records
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Month Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Timesheet Table</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <AttendanceFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      {/* 4. Calendar or Table View */}
      {viewMode === 'calendar' ? (
        <AttendanceCalendar records={filteredRecords} />
      ) : (
        <AttendanceTable records={filteredRecords} showEmployee={false} />
      )}
    </div>
  );
};

export default MyAttendance;
