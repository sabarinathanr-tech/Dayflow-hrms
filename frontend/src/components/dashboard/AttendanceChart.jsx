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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-850 border border-dark-600 p-3 rounded-xl shadow-2xl text-xs">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-semibold text-white">{entry.value}</span>
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
  title = 'Weekly Attendance Overview'
}) => {
  return (
    <div className="p-6 rounded-2xl bg-dark-850 border border-dark-700/80 shadow-card-dark flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">Headcount distribution across the work week</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
            <span className="text-slate-300">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
            <span className="text-slate-300">Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Absent</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#20253c" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#20253c' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#20253c' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Bar dataKey="Present" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Leave" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
