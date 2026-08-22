import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, MessageSquare } from 'lucide-react';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/formatDate';

const LeaveCalendar = ({ leaves = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getLeavesForDate = (date) => {
    return leaves.filter((l) => {
      try {
        const s = parseISO(l.startDate);
        const e = parseISO(l.endDate);
        return isWithinInterval(date, { start: s, end: e });
      } catch {
        return false;
      }
    });
  };

  const handleLeaveClick = (leave) => {
    setSelectedLeave(leave);
    setModalOpen(true);
  };

  const getLeaveColorClass = (type) => {
    switch (type) {
      case 'Sick Leave':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'Paid Time Off':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30';
      case 'Unpaid Leave':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      default:
        return 'bg-brand-purple/20 text-brand-purple-light border-brand-purple/40';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-dark-850 border border-dark-700/80 shadow-2xl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Leave Calendar — {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-xs text-slate-400">Scheduled time-off events and statuses</p>
        </div>

        <div className="flex items-center rounded-xl bg-dark-800 border border-dark-700 p-0.5">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-750 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-750 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-5 text-xs text-slate-300 p-3 rounded-xl bg-dark-800/40 border border-dark-700/50">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leave Types:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Paid Time Off (PTO)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Sick Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Unpaid Leave</span>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, idx) => {
          const activeLeaves = getLeavesForDate(day);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={idx}
              className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-xl border flex flex-col justify-between text-left transition-colors ${
                !inMonth
                  ? 'opacity-30 border-transparent bg-dark-900/40'
                  : 'bg-dark-800/40 border-dark-700/50'
              }`}
            >
              <span className={`text-xs font-bold ${inMonth ? 'text-slate-200' : 'text-slate-600'}`}>
                {format(day, 'd')}
              </span>

              <div className="space-y-1 mt-1">
                {activeLeaves.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleLeaveClick(l)}
                    className={`w-full text-left p-1 rounded-lg border text-[10px] font-semibold truncate transition-colors ${getLeaveColorClass(
                      l.leaveType
                    )}`}
                    title={`${l.leaveType} (${l.status})`}
                  >
                    <span className="truncate block">{l.leaveType}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Leave Request Details"
        subtitle="Time Off Information"
        maxWidth="max-w-md"
      >
        {selectedLeave && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-800 border border-dark-700">
              <span className="text-slate-400 font-medium">Leave Status</span>
              <Badge variant={selectedLeave.status} dot size="md">
                {selectedLeave.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-dark-800/60 border border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Type</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{selectedLeave.leaveType}</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/60 border border-dark-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                <span className="text-sm font-bold text-brand-purple-light mt-0.5 block">{selectedLeave.days} Days</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-800/60 border border-dark-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dates</span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                {formatDate(selectedLeave.startDate)} — {formatDate(selectedLeave.endDate)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-dark-800/60 border border-dark-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reason</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.comment && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-300 uppercase font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> HR Reviewer Note
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">{selectedLeave.comment}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveCalendar;
