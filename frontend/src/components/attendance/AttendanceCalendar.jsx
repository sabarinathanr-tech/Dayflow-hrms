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
import { ChevronLeft, ChevronRight, Clock, Calendar, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { formatWorkingHours } from '../../utils/formatDate';

const AttendanceCalendar = ({ records = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));
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
        return 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/30';
      case 'Absent':
        return 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-500/30';
      case 'Half Day':
        return 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/40 hover:bg-amber-100 dark:hover:bg-amber-500/30';
      case 'Leave':
        return 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/40 hover:bg-purple-100 dark:hover:bg-purple-500/30';
      default:
        return 'bg-slate-50 dark:bg-dark-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-dark-700 hover:bg-slate-100 dark:hover:bg-dark-800';
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-2xl">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click on any date to inspect shift logs and extra hours</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-dark-750 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-dark-750 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Color Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-xs text-slate-600 dark:text-slate-300 p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/40 border border-slate-200/80 dark:border-dark-700/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-semibold">Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="font-semibold">Leave / PTO</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="font-semibold">Absent</span>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
              className={`min-h-[64px] sm:min-h-[82px] p-2 rounded-2xl border flex flex-col justify-between text-left transition-all duration-200 ${
                !inMonth
                  ? 'opacity-30 border-transparent bg-slate-50 dark:bg-dark-900/40'
                  : rec
                  ? getStatusColor(rec.status)
                  : 'bg-white dark:bg-dark-800/40 border-slate-200 dark:border-dark-700/40 hover:bg-slate-50 dark:hover:bg-dark-800'
              } ${isCurrentToday ? 'ring-2 ring-brand-purple dark:ring-brand-cyan shadow-md' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isCurrentToday ? 'text-brand-purple dark:text-brand-cyan font-black' : inMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
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
        subtitle="Attendance & Working Hours Log"
        maxWidth="max-w-md"
      >
        {selectedDayRecord ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">Daily Shift Status</span>
              <Badge variant={selectedDayRecord.status} dot size="md">
                {selectedDayRecord.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">Check-In</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {selectedDayRecord.checkIn || '—'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-dark-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">Check-Out</span>
                <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  {selectedDayRecord.checkOut || '—'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-dark-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Standard Hours:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">8h 00m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Total Worked Time:</span>
                <span className="font-mono font-bold text-brand-purple dark:text-brand-purple-light">
                  {selectedDayRecord.workingHours > 0 ? formatWorkingHours(selectedDayRecord.workingHours) : '0h 00m'}
                </span>
              </div>
              {selectedDayRecord.extraHours > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-dark-750">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Extra / Overtime:
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    +{formatWorkingHours(selectedDayRecord.extraHours)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
            No attendance recorded for this date (Weekend or Unlogged Shift).
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttendanceCalendar;
