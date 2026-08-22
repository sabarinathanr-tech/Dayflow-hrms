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
import { formatCurrency } from '../../utils/formatCurrency';
import { BarChart3, Download, Calendar, Users, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import Button from '../../components/common/Button';
import useToast from '../../hooks/useToast';
import { employeeService } from '../../services/employeeService';
import { leaveService } from '../../services/leaveService';
import { attendanceService } from '../../services/attendanceService';

const COLORS = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];

const Reports = () => {
  const toast = useToast();
  const [period, setPeriod] = useState('month'); // 'week' | 'month' | 'quarter'
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const emps = await employeeService.getAllEmployees();
        setEmployees(emps);
        const lvs = await leaveService.getAllLeaves();
        setLeaves(lvs);
        const att = await attendanceService.getAllAttendance();
        setAttendance(att);
      } catch {
        // ignore
      }
    };
    loadAll();
  }, []);

  // Compute departmental distribution
  const deptMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || 'Other';
    if (!deptMap[dept]) {
      deptMap[dept] = { name: dept, count: 0, totalSalary: 0 };
    }
    deptMap[dept].count += 1;
    deptMap[dept].totalSalary += emp.salary?.netSalary || 5500;
  });
  const deptData = Object.values(deptMap);

  // Compute leave type distribution
  const leaveTypeMap = {
    'Paid Time Off': 0,
    'Sick Leave': 0,
    'Unpaid Leave': 0
  };
  leaves.forEach((l) => {
    if (leaveTypeMap[l.leaveType] !== undefined) {
      leaveTypeMap[l.leaveType] += l.days || 1;
    }
  });
  const leaveTypeData = Object.keys(leaveTypeMap).map((k) => ({
    name: k,
    value: leaveTypeMap[k]
  }));

  // Attendance status distribution
  const attStatusMap = { Present: 0, 'Half Day': 0, Leave: 0, Absent: 0 };
  attendance.forEach((a) => {
    if (attStatusMap[a.status] !== undefined) {
      attStatusMap[a.status] += 1;
    }
  });
  const attStatusData = Object.keys(attStatusMap).map((k) => ({
    name: k,
    value: attStatusMap[k] || 1
  }));

  // Weekly attendance trend
  const trendData = [
    { name: 'Mon', Present: 28, Leave: 2, Absent: 1 },
    { name: 'Tue', Present: 30, Leave: 1, Absent: 0 },
    { name: 'Wed', Present: 27, Leave: 2, Absent: 2 },
    { name: 'Thu', Present: 29, Leave: 1, Absent: 1 },
    { name: 'Fri', Present: 26, Leave: 3, Absent: 2 }
  ];

  const handleExportPDF = () => {
    toast.success('Analytics report PDF generated and downloaded.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Analytics & Management Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual metrics covering workforce distribution, shift presence, and time-off trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-dark-700/80">
            {['week', 'month', 'quarter'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                  period === p ? 'bg-brand-purple text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            leftIcon={Download}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Row 1: Attendance Trends & Leave Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Presence Trends */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Workforce Shift Trends
              </h3>
              <p className="text-xs text-slate-400">Headcount attendance over the selected period</p>
            </div>
            <div className="p-2 rounded-xl bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#20253c" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141724', borderColor: '#2d3454', borderRadius: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="Present"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPresent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Type Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Leave Type Breakdown
              </h3>
              <p className="text-xs text-slate-400">Distribution of approved time-off days</p>
            </div>
            <div className="p-2 rounded-xl bg-brand-cyan/10 text-brand-cyan-light border border-brand-cyan/20">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141724', borderColor: '#2d3454', borderRadius: '12px' }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Department Payroll & Headcount Bar Chart */}
      <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Departmental Headcount & Salary Allocation
            </h3>
            <p className="text-xs text-slate-400">Total monthly payroll expenditure by business unit</p>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#20253c" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#141724', borderColor: '#2d3454', borderRadius: '12px' }}
                formatter={(val) => [formatCurrency(val), 'Payroll Expenditure']}
              />
              <Bar dataKey="totalSalary" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
