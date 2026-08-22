import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Clock, LogIn, LogOut, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import useToast from '../../hooks/useToast';
import { formatWorkingHours } from '../../utils/formatDate';

const CheckInOutCard = ({ employeeId, onStatusChange }) => {
  const toast = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusData, setStatusData] = useState({
    checkedIn: false,
    checkedOut: false,
    status: 'Not Checked In',
    checkInTime: null,
    checkOutTime: null,
    workingMinutes: 0
  });
  const [loading, setLoading] = useState(false);

  // Live real-time digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    if (!employeeId) return;
    try {
      const data = await attendanceService.getTodayStatus(employeeId);
      setStatusData(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [employeeId]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.checkIn(employeeId);
      toast.success(res.message || 'Shift started! Check in recorded.');
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast.error(err.message || 'Unable to record check in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.checkOut(employeeId);
      toast.success(res.message || 'Shift completed! Check out recorded.');
      await fetchStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast.error(err.message || 'Unable to record check out.');
    } finally {
      setLoading(false);
    }
  };

  const formattedClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const extraMins = Math.max(0, (statusData.workingMinutes || 0) - 480);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-soft-lg dark:shadow-2xl relative overflow-hidden transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Clock & Date Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-purple dark:text-brand-cyan-light uppercase tracking-wider">
              Shift Attendance Clock
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formattedClock}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-4 py-3.5 px-5 rounded-2xl bg-slate-50 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700/60 shadow-inner">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Status</span>
            <div className="mt-1">
              <Badge
                variant={
                  statusData.checkedOut
                    ? 'approved'
                    : statusData.checkedIn
                    ? 'present'
                    : 'neutral'
                }
                dot
              >
                {statusData.checkedOut
                  ? 'Shift Completed'
                  : statusData.checkedIn
                  ? 'Checked In'
                  : 'Not Checked In'}
              </Badge>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-dark-700 hidden sm:block" />

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Check-In</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block font-mono">
              {statusData.checkInTime || '—'}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-dark-700 hidden sm:block" />

          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Check-Out</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block font-mono">
              {statusData.checkOutTime || '—'}
            </span>
          </div>

          {statusData.workingMinutes > 0 && (
            <>
              <div className="h-8 w-px bg-slate-200 dark:bg-dark-700 hidden sm:block" />
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Worked Time</span>
                <span className="text-xs sm:text-sm font-bold text-brand-purple dark:text-brand-purple-light mt-1 block font-mono">
                  {formatWorkingHours(statusData.workingMinutes)}
                </span>
              </div>
            </>
          )}

          {extraMins > 0 && (
            <>
              <div className="h-8 w-px bg-slate-200 dark:bg-dark-700 hidden sm:block" />
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Extra Hours</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">
                  +{formatWorkingHours(extraMins)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {!statusData.checkedIn ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleCheckIn}
              loading={loading}
              leftIcon={LogIn}
              className="w-full sm:w-auto px-8"
            >
              PUNCH IN
            </Button>
          ) : !statusData.checkedOut ? (
            <Button
              variant="cyan"
              size="lg"
              onClick={handleCheckOut}
              loading={loading}
              leftIcon={LogOut}
              className="w-full sm:w-auto px-8"
            >
              PUNCH OUT
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Shift Logged & Finalized</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOutCard;
