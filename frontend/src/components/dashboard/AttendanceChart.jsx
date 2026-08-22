import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-600 p-3 rounded-2xl shadow-xl text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300 py-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceChart = ({
  data = [
    { day: 'Mon', Present: 28, Absent: 1, Leave: 2 },
    { day: 'Tue', Present: 30, Absent: 0, Leave: 1 },
    { day: 'Wed', Present: 27, Absent: 2, Leave: 2 },
    { day: 'Thu', Present: 29, Absent: 1, Leave: 1 },
    { day: 'Fri', Present: 26, Absent: 2, Leave: 3 }
  ],
  title = 'Weekly Shift Attendance'
}) => {
  const { isDark } = useTheme();

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Headcount presence across the work week</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Absent</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#20253c' : '#f1f5f9'} vertical={false} />
            <XAxis
              dataKey="day"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#20253c' : '#e2e8f0' }}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#20253c' : '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }} />
            <Bar dataKey="Present" fill="#9333ea" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Leave" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Absent" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
