import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const formatTimeString = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const parts = timeString.trim().split(' ');
  if (parts.length < 2) return 0;
  const [time, modifier] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
};

export const getTodayStatus = async (req, res, next) => {
  try {
    const employeeId = req.query.employeeId || req.user.employeeId;
    const todayStr = getTodayDateStr();

    const record = await Attendance.findOne({ employeeId, date: todayStr });

    if (!record) {
      return res.status(200).json({
        success: true,
        data: {
          checkedIn: false,
          checkedOut: false,
          status: 'Not Checked In',
          checkInTime: null,
          checkOutTime: null,
          workingMinutes: 0,
          extraHours: 0
        }
      });
    }

    // Always ensure workingMinutes reflects exact clock interval if both exist
    let workingMins = record.workingHours || 0;
    if (record.checkIn && record.checkOut) {
      const inMins = parseTimeToMinutes(record.checkIn);
      const outMins = parseTimeToMinutes(record.checkOut);
      let diff = outMins - inMins;
      if (diff < 0) diff += 1440;
      workingMins = Math.max(1, diff);
    }

    res.status(200).json({
      success: true,
      data: {
        checkedIn: Boolean(record.checkIn),
        checkedOut: Boolean(record.checkOut),
        status: record.status,
        checkInTime: record.checkIn,
        checkOutTime: record.checkOut,
        workingMinutes: workingMins,
        extraHours: Math.max(0, workingMins - 480),
        recordId: record._id
      }
    });
  } catch (error) {
    next(error);
  }
};

export const checkIn = async (req, res, next) => {
  try {
    const employeeId = req.body.employeeId || req.user.employeeId;
    const todayStr = getTodayDateStr();
    const now = new Date();
    const timeStr = formatTimeString(now);

    const emp = await Employee.findOne({ employeeId });
    let record = await Attendance.findOne({ employeeId, date: todayStr });

    if (record && record.checkIn && !record.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today.',
        code: 'ALREADY_CHECKED_IN'
      });
    }

    if (record) {
      record.checkIn = timeStr;
      record.checkInTime = now;
      record.checkOut = null;
      record.checkOutTime = null;
      record.workingHours = 0;
      record.extraHours = 0;
      record.status = 'Present';
      await record.save();
    } else {
      record = await Attendance.create({
        employeeId,
        employeeName: emp ? emp.name : req.user.name,
        department: emp ? emp.department : 'Engineering',
        date: todayStr,
        checkIn: timeStr,
        checkInTime: now,
        checkOut: null,
        checkOutTime: null,
        workingHours: 0,
        standardHours: 480,
        extraHours: 0,
        status: 'Present'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Checked in successfully! Shift timer active.',
      data: {
        checkInTime: timeStr,
        status: 'Present',
        date: todayStr
      }
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const employeeId = req.body.employeeId || req.user.employeeId;
    const todayStr = getTodayDateStr();
    const now = new Date();
    const timeStr = formatTimeString(now);

    const record = await Attendance.findOne({ employeeId, date: todayStr });

    if (!record || !record.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'You must check in before checking out.',
        code: 'NOT_CHECKED_IN'
      });
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today.',
        code: 'ALREADY_CHECKED_OUT'
      });
    }

    record.checkOut = timeStr;
    record.checkOutTime = now;

    // Calculate EXACT clock difference between check-in and check-out
    const checkInMins = parseTimeToMinutes(record.checkIn);
    const checkOutMins = parseTimeToMinutes(timeStr);
    let minutesWorked = checkOutMins - checkInMins;
    if (minutesWorked < 0) minutesWorked += 1440;
    if (minutesWorked === 0) minutesWorked = 1;

    record.workingHours = minutesWorked;
    record.extraHours = Math.max(0, minutesWorked - (record.standardHours || 480));
    record.status = 'Present';

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully!',
      data: {
        checkOutTime: timeStr,
        workingMinutes: record.workingHours,
        extraHours: record.extraHours,
        status: record.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resetTodayAttendance = async (req, res, next) => {
  try {
    const employeeId = req.body.employeeId || req.user.employeeId;
    const todayStr = getTodayDateStr();

    await Attendance.findOneAndDelete({ employeeId, date: todayStr });

    res.status(200).json({
      success: true,
      message: 'Today shift reset successfully for testing.'
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const { status } = req.query;

    const filter = { employeeId };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeAttendance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.query;

    const filter = { employeeId };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (req, res, next) => {
  try {
    const { date, status, department, employeeId, search } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (status && status !== 'All') filter.status = status;
    if (department && department !== 'All') filter.department = department;
    if (employeeId && employeeId !== 'All') filter.employeeId = employeeId;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { employeeName: regex },
        { employeeId: regex },
        { department: regex }
      ];
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};
