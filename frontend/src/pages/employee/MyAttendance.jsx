import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import CheckInOutCard from '../../components/attendance/CheckInOutCard';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import AttendanceFilters from '../../components/attendance/AttendanceFilters';
import Loading from '../../components/common/Loading';
import { Calendar, ListFilter, CalendarDays, LayoutList } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';

const MyAttendance = () => {
  const { employeeId } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'table'
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getMyAttendance();
      setRecords(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  const filteredRecords = records.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchSearch =
      !search ||
      r.date.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Attendance & Timesheets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your daily shift logs, check-in hours, and monthly calendar status.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-dark-700/80">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-brand-purple text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-brand-purple text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Log Table</span>
          </button>
        </div>
      </div>

      {/* Hero Check-in Widget */}
      <CheckInOutCard employeeId={employeeId || 'EMP-1001'} onStatusChange={fetchAttendance} />

      {/* Attendance Stats Cards */}
      <AttendanceStats records={records} />

      {/* View Display */}
      {loading ? (
        <Loading text="Loading attendance timesheets..." />
      ) : activeTab === 'calendar' ? (
        <AttendanceCalendar records={records} />
      ) : (
        <div className="space-y-4">
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
          <AttendanceTable records={filteredRecords} />
        </div>
      )}
    </div>
  );
};

export default MyAttendance;
