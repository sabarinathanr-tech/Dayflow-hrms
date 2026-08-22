import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, Users, CalendarCheck, CalendarDays, TrendingUp, DollarSign } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { formatWorkingHours } from '../../utils/formatDate';

const Reports = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [empList, attList, leaveList] = await Promise.all([
          employeeService.getAllEmployees(),
          attendanceService.getAllAttendance(),
          leaveService.getAllLeaves()
        ]);
        setEmployees(empList || []);
        setAttendance(attList || []);
        setLeaves(leaveList || []);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loading text="Generating corporate analytics & reports..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Reports Unavailable"
        description={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Department distribution
  const deptCounts = {};
  employees.forEach((e) => {
    const d = e.department || 'Other';
    deptCounts[d] = (deptCounts[d] || 0) + 1;
  });
  const deptData = Object.keys(deptCounts).map((k) => ({
    name: k,
    value: deptCounts[k]
  }));

  // Leave types distribution
  const leaveCounts = { 'Paid Time Off': 0, 'Sick Leave': 0, 'Unpaid Leave': 0 };
  leaves.forEach((l) => {
    if (leaveCounts[l.leaveType] !== undefined) {
      leaveCounts[l.leaveType] += 1;
    }
  });
  const leaveData = Object.keys(leaveCounts).map((k) => ({
    name: k,
    value: leaveCounts[k]
  }));

  // Weekly attendance summary data
  const attendanceWeekly = [
    { day: 'Mon', Present: 28, Absent: 1, Leave: 2 },
    { day: 'Tue', Present: 30, Absent: 0, Leave: 1 },
    { day: 'Wed', Present: 27, Absent: 2, Leave: 2 },
    { day: 'Thu', Present: 29, Absent: 1, Leave: 1 },
    { day: 'Fri', Present: 26, Absent: 2, Leave: 3 }
  ];

  const COLORS = ['#9333ea', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

  const totalExtraMins = attendance.reduce((acc, a) => {
    const extra = a.extraHours !== undefined ? a.extraHours : Math.max(0, (a.workingHours || 0) - 480);
    return acc + extra;
  }, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Reports & Workforce Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Comprehensive real-time reports on headcount distribution, shift presence, and time-off utilization
        </p>
      </div>

      {/* 2. Key Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          subtitle="All departments"
          icon={Users}
          variant="purple"
        />
        <StatCard
          title="Total Overtime Logged"
          value={`+${formatWorkingHours(totalExtraMins)}`}
          subtitle="Cumulative extra hours"
          icon={TrendingUp}
          variant="cyan"
        />
        <StatCard
          title="Total Leave Requests"
          value={leaves.length}
          subtitle="Approved & pending"
          icon={CalendarDays}
          variant="amber"
        />
        <StatCard
          title="Average Shift Hours"
          value="8.8h"
          subtitle="Per employee / day"
          icon={CalendarCheck}
          variant="emerald"
        />
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            Weekly Shift Attendance Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            Daily distribution of on-duty presence, leaves, and absences
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#20253c' : '#f1f5f9'} vertical={false} />
                <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#141724' : '#ffffff',
                    borderColor: isDark ? '#20253c' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Present" fill="#9333ea" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Leave" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
            Department Headcount Allocation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            Distribution of active employees across company divisions
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#141724' : '#ffffff',
                    borderColor: isDark ? '#20253c' : '#e2e8f0',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
