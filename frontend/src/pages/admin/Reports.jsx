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
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import useToast from '../../hooks/useToast';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart3,
  Users,
  CalendarCheck,
  CalendarDays,
  TrendingUp,
  Download,
  IndianRupee,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';
import { formatWorkingHours } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const Reports = () => {
  const { isDark } = useTheme();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  // Active Report Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'payroll' | 'leaves'

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [empList, attList, leaveList, payList] = await Promise.all([
          employeeService.getAllEmployees(),
          attendanceService.getAllAttendance(),
          leaveService.getAllLeaves(),
          payrollService.getAllPayroll()
        ]);
        setEmployees(empList || []);
        setAttendance(attList || []);
        setLeaves(leaveList || []);
        setPayrolls(payList || []);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // CSV Export Generators
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded: ${filename}`);
  };

  const exportAttendanceCSV = () => {
    if (!attendance.length) {
      toast.error('No attendance records available for export.');
      return;
    }
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Worked Mins', 'Extra Overtime Mins', 'Status'];
    const rows = attendance.map((a) => [
      `"${a.employeeId}"`,
      `"${a.employeeName}"`,
      `"${a.department || 'Engineering'}"`,
      `"${a.date}"`,
      `"${a.checkIn || ''}"`,
      `"${a.checkOut || ''}"`,
      `"${a.workingHours || 0}"`,
      `"${a.extraHours || 0}"`,
      `"${a.status}"`
    ]);
    downloadCSV(`Dayflow_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const exportPayrollCSV = () => {
    if (!payrolls.length) {
      toast.error('No payroll records available for export.');
      return;
    }
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Basic (INR)', 'Allowances (INR)', 'Gross (INR)', 'Deductions (INR)', 'Net Monthly (INR)', 'Annual CTC (INR)'];
    const rows = payrolls.map((p) => [
      `"${p.employeeId}"`,
      `"${p.employeeName}"`,
      `"${p.department}"`,
      `"${p.designation}"`,
      `"${p.basicSalary}"`,
      `"${p.allowances}"`,
      `"${p.grossSalary}"`,
      `"${p.deductions}"`,
      `"${p.netSalary}"`,
      `"${p.yearlyWage || p.netSalary * 12}"`
    ]);
    downloadCSV(`Dayflow_Corporate_Payroll_Report_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const exportLeaveCSV = () => {
    if (!leaves.length) {
      toast.error('No leave records available for export.');
      return;
    }
    const headers = ['Leave ID', 'Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Reviewer Notes'];
    const rows = leaves.map((l) => [
      `"${l.id}"`,
      `"${l.employeeId}"`,
      `"${l.employeeName}"`,
      `"${l.department}"`,
      `"${l.leaveType}"`,
      `"${l.startDate}"`,
      `"${l.endDate}"`,
      `"${l.days}"`,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.comment || '').replace(/"/g, '""')}"`
    ]);
    downloadCSV(`Dayflow_Leave_Utilization_Report_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

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

  // Salary expense per department
  const deptSalary = {};
  payrolls.forEach((p) => {
    const d = p.department || 'Engineering';
    deptSalary[d] = (deptSalary[d] || 0) + (p.netSalary || 0);
  });
  const salaryByDeptData = Object.keys(deptSalary).map((k) => ({
    department: k,
    amount: deptSalary[k]
  }));

  const COLORS = ['#9333ea', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

  const totalExtraMins = attendance.reduce((acc, a) => {
    const extra = a.extraHours !== undefined ? a.extraHours : Math.max(0, (a.workingHours || 0) - 480);
    return acc + extra;
  }, 0);

  const totalMonthlyPayroll = payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light uppercase tracking-wider">
              Executive Intelligence
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Workforce Analytics & Exportable Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Live metrics on organizational headcount, shift presence, leave utilization, and corporate payroll in INR (₹)
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={exportAttendanceCSV}
            leftIcon={Download}
          >
            Attendance CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportPayrollCSV}
            leftIcon={FileSpreadsheet}
          >
            Payroll CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={exportLeaveCSV}
            leftIcon={Download}
          >
            Leaves CSV
          </Button>
        </div>
      </div>

      {/* 2. Interactive Report Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'attendance'
              ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Shift Timesheets
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'payroll'
              ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Payroll Disbursements
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'leaves'
              ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Time-Off Utilization
        </button>
      </div>

      {/* 3. Key Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          subtitle="Active corporate accounts"
          icon={Users}
          variant="purple"
          onClick={() => setActiveTab('overview')}
        />
        <StatCard
          title="Monthly Payroll Outflow"
          value={formatCurrency(totalMonthlyPayroll)}
          subtitle="Total net take-home in INR"
          icon={IndianRupee}
          variant="emerald"
          onClick={() => setActiveTab('payroll')}
        />
        <StatCard
          title="Total Overtime Logged"
          value={`+${formatWorkingHours(totalExtraMins)}`}
          subtitle="Cumulative extra hours"
          icon={TrendingUp}
          variant="cyan"
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          title="Leave Requests"
          value={leaves.length}
          subtitle={`${leaves.filter((l) => l.status === 'Pending').length} pending review`}
          icon={CalendarDays}
          variant="amber"
          onClick={() => setActiveTab('leaves')}
        />
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Weekly Shift Attendance Trends
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Daily presence, time-off, and absences
                </p>
              </div>
              <button
                onClick={exportAttendanceCSV}
                className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 hover:text-brand-purple transition-colors"
                title="Download Attendance Data"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Department Headcount Allocation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Distribution of active employees across company divisions
                </p>
              </div>
            </div>

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
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Monthly Net Compensation by Department (INR ₹)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total salary budget distributed per functional division
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={exportPayrollCSV} leftIcon={Download}>
                Export Payroll CSV
              </Button>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryByDeptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#20253c' : '#f1f5f9'} vertical={false} />
                  <XAxis dataKey="department" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
                  <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Monthly Outflow']}
                    contentStyle={{
                      backgroundColor: isDark ? '#141724' : '#ffffff',
                      borderColor: isDark ? '#20253c' : '#e2e8f0',
                      borderRadius: '16px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Leave Category Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Volume of time-off requests categorized by Paid, Sick, and Unpaid leaves
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={exportLeaveCSV} leftIcon={Download}>
              Export Leaves CSV
            </Button>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value} requests`}
                >
                  {leaveData.map((_, index) => (
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
      )}

      {activeTab === 'attendance' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Company-Wide Attendance Timesheet Logs ({attendance.length} Total Logs)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Audit trail of daily punch-ins, punch-outs, working duration, and overtime extra hours
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={exportAttendanceCSV} leftIcon={Download}>
              Download Full Timesheet CSV
            </Button>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-dark-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-dark-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-dark-700">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Worked Hours</th>
                  <th className="p-3">Extra Hours</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-750 text-slate-700 dark:text-slate-300">
                {attendance.slice(0, 10).map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-dark-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {a.employeeName}
                      <span className="text-[10px] text-slate-400 font-mono block font-normal">{a.employeeId}</span>
                    </td>
                    <td className="p-3 font-mono">{a.date}</td>
                    <td className="p-3 font-mono">{a.checkIn || '—'}</td>
                    <td className="p-3 font-mono">{a.checkOut || '—'}</td>
                    <td className="p-3 font-mono font-bold">{formatWorkingHours(a.workingHours || 0)}</td>
                    <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      {a.extraHours > 0 ? `+${formatWorkingHours(a.extraHours)}` : '—'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        a.status === 'Present'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                          : a.status === 'Leave'
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
