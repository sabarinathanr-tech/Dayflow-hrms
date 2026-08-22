import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { formatWorkingHours } from '../../utils/formatDate';

const AttendanceCalendar = ({ records = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // August 2026 default
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getRecordForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.find((r) => r.date === dateStr);
  };

  const handleDayClick = (day) => {
    const rec = getRecordForDate(day);
    setSelectedDate(day);
    setSelectedDayRecord(rec || null);
    setModalOpen(true);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'Absent':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30';
      case 'Half Day':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30';
      case 'Leave':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30';
      default:
        return 'bg-dark-800/40 text-slate-500 border-dark-700 hover:bg-dark-800';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-dark-850 border border-dark-700/80 shadow-2xl">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-xs text-slate-400">Click on any date to inspect shift logs</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-xs font-semibold text-slate-300 border border-dark-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl bg-dark-800 border border-dark-700 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-750 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-750 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Color Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-xs text-slate-300 p-3 rounded-xl bg-dark-800/40 border border-dark-700/50">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Leave / PTO</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span>Absent</span>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, idx) => {
          const rec = getRecordForDate(day);
          const inMonth = isSameMonth(day, currentMonth);
          const isCurrentToday = isToday(day);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`min-h-[64px] sm:min-h-[82px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all duration-200 ${
                !inMonth
                  ? 'opacity-30 border-transparent bg-dark-900/40'
                  : rec
                  ? getStatusColor(rec.status)
                  : 'bg-dark-800/40 border-dark-700/40 hover:bg-dark-800 hover:border-dark-600'
              } ${isCurrentToday ? 'ring-2 ring-brand-cyan shadow-glow-cyan' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isCurrentToday ? 'text-brand-cyan font-black' : inMonth ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {rec && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current hidden sm:block" />
                )}
              </div>

              {rec ? (
                <div className="mt-1">
                  <span className="text-[10px] font-bold block truncate">{rec.status}</span>
                  {rec.checkIn && (
                    <span className="text-[9px] font-mono opacity-80 block truncate hidden sm:block">
                      {rec.checkIn}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-3" />
              )}
            </button>
          );
        })}
      </div>

      {/* Date Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Shift Details'}
        subtitle="Attendance Log Details"
        maxWidth="max-w-md"
      >
        {selectedDayRecord ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-700">
              <span className="text-xs text-slate-400 font-semibold uppercase">Daily Status</span>
              <Badge variant={selectedDayRecord.status} dot size="md">
                {selectedDayRecord.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-dark-800/60 border border-dark-700/60">
                <span className="text-[11px] text-slate-400 block font-semibold uppercase">Check-In</span>
                <span className="text-sm font-bold text-white font-mono mt-1 block">
                  {selectedDayRecord.checkIn || '—'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-800/60 border border-dark-700/60">
                <span className="text-[11px] text-slate-400 block font-semibold uppercase">Check-Out</span>
                <span className="text-sm font-bold text-white font-mono mt-1 block">
                  {selectedDayRecord.checkOut || '—'}
                </span>
              </div>
            </div>

            {selectedDayRecord.workingHours > 0 && (
              <div className="p-3.5 rounded-xl bg-dark-800/60 border border-dark-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Logged Working Time:</span>
                <span className="text-sm font-bold text-brand-purple-light font-mono">
                  {formatWorkingHours(selectedDayRecord.workingHours)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            No attendance recorded for this date (Weekend or Unlogged Shift).
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttendanceCalendar;
