import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Clock, LogIn, LogOut, CheckCircle, Sparkles } from 'lucide-react';
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

  // Fetch today's initial status
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
      toast.success(res.message || 'Checked in successfully!');
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
      toast.success(res.message || 'Checked out successfully!');
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

  return (
    <div className="p-6 rounded-3xl bg-dark-850 border border-dark-700/80 shadow-2xl relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Clock & Date Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-brand-cyan-light uppercase tracking-wider">
              Today's Attendance
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            {formattedClock}
          </div>
          <p className="text-xs text-slate-400 font-medium">{formattedDate}</p>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-4 py-3 px-5 rounded-2xl bg-dark-800/80 border border-dark-700/60">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-semibold">Status</span>
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
                  ? 'Completed'
                  : statusData.checkedIn
                  ? 'Checked In'
                  : 'Not Checked In'}
              </Badge>
            </div>
          </div>

          <div className="h-8 w-px bg-dark-700 hidden sm:block" />

          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-semibold">Check-In</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              {statusData.checkInTime || '—'}
            </span>
          </div>

          <div className="h-8 w-px bg-dark-700 hidden sm:block" />

          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-semibold">Check-Out</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              {statusData.checkOutTime || '—'}
            </span>
          </div>

          {statusData.workingMinutes > 0 && (
            <>
              <div className="h-8 w-px bg-dark-700 hidden sm:block" />
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-semibold">Working Hours</span>
                <span className="text-sm font-bold text-brand-purple-light mt-1 block">
                  {formatWorkingHours(statusData.workingMinutes)}
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
              CHECK IN
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
              CHECK OUT
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Shift Completed for Today</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOutCard;
