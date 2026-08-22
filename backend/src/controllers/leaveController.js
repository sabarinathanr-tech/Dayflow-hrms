import { LeaveRequest } from '../models/LeaveRequest.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { Notification } from '../models/Notification.js';
import { logAudit } from '../utils/auditLogger.js';
import { sendLeaveStatusEmail } from '../services/emailService.js';

export const getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const leaves = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveBalances = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId || req.user.employeeId;
    const emp = await Employee.findOne({
      $or: [{ employeeId }, { id: employeeId }]
    });

    const balances = emp?.leaveBalances || {
      paidTimeOff: 14,
      sickLeave: 8,
      unpaidLeave: 0
    };

    res.status(200).json({
      success: true,
      data: balances
    });
  } catch (error) {
    next(error);
  }
};

export const applyLeave = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const { leaveType, startDate, endDate, reason, attachment } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave type, start date, end date, and reason are all required.',
        code: 'MISSING_FIELDS'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date.',
        code: 'INVALID_DATE_RANGE'
      });
    }

    // Check for overlapping active leaves
    const overlap = await LeaveRequest.findOne({
      employeeId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: `You already have an active leave request (${overlap.leaveType}: ${overlap.startDate} to ${overlap.endDate}) during this timeframe.`,
        code: 'OVERLAPPING_LEAVE'
      });
    }

    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    const emp = await Employee.findOne({ employeeId });

    let attachData = attachment || null;
    if (req.file) {
      attachData = {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        size: `${(req.file.size / 1024).toFixed(1)} KB`,
        type: req.file.mimetype
      };
    }

    const leave = await LeaveRequest.create({
      employeeId,
      employeeName: emp ? emp.name : req.user.name,
      department: emp ? emp.department : 'Engineering',
      leaveType,
      startDate,
      endDate,
      days: diffDays,
      reason,
      attachment: attachData,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    });

    // Send Notification to HR
    await Notification.create({
      userId: 'HR-001',
      title: 'New Leave Application',
      message: `${emp ? emp.name : req.user.name} applied for ${leaveType} (${startDate} to ${endDate})${attachData ? ' with Medical Certificate' : ''}.`,
      type: 'warning',
      timestamp: new Date().toISOString()
    });

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'LEAVE_APPLY',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      metadata: { leaveType, startDate, endDate, days: diffDays },
      req
    });

    res.status(201).json({
      success: true,
      message: 'Time off request submitted to HR for approval!',
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeaves = async (req, res, next) => {
  try {
    const { status, leaveType, employeeId, search } = req.query;
    const filter = {};

    if (status && status !== 'All') filter.status = status;
    if (leaveType && leaveType !== 'All') filter.leaveType = leaveType;
    if (employeeId && employeeId !== 'All') filter.employeeId = employeeId;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { employeeName: regex },
        { employeeId: regex },
        { department: regex },
        { reason: regex }
      ];
    }

    const leaves = await LeaveRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

export const approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment = 'Approved by HR' } = req.body;

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
        code: 'NOT_FOUND'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This leave request is already marked as ${leave.status}.`,
        code: 'ALREADY_PROCESSED'
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    leave.status = 'Approved';
    leave.reviewedBy = req.user.name || 'HR Admin';
    leave.reviewedOn = todayStr;
    leave.comment = comment;
    await leave.save();

    // Deduct employee leave balances
    const emp = await Employee.findOne({ employeeId: leave.employeeId });
    if (emp && emp.leaveBalances) {
      if (leave.leaveType === 'Sick Leave' && emp.leaveBalances.sickLeave) {
        emp.leaveBalances.sickLeave = Math.max(0, emp.leaveBalances.sickLeave - leave.days);
      } else if (leave.leaveType === 'Paid Time Off' && emp.leaveBalances.paidTimeOff) {
        emp.leaveBalances.paidTimeOff = Math.max(0, emp.leaveBalances.paidTimeOff - leave.days);
      }
      await emp.save();
    }

    // Populate attendance calendar dates for these days
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const cur = new Date(start);

    while (cur <= end) {
      const dateStr = cur.toISOString().split('T')[0];
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        await Attendance.findOneAndUpdate(
          { employeeId: leave.employeeId, date: dateStr },
          {
            employeeId: leave.employeeId,
            employeeName: leave.employeeName,
            department: leave.department,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            workingHours: 0,
            standardHours: 480,
            extraHours: 0,
            status: 'Leave'
          },
          { upsert: true, new: true }
        );
      }
      cur.setDate(cur.getDate() + 1);
    }

    // Send notification to employee
    await Notification.create({
      userId: leave.employeeId,
      title: 'Leave Approved',
      message: `Your ${leave.leaveType} request for ${leave.startDate} to ${leave.endDate} has been approved by HR.`,
      type: 'success',
      timestamp: new Date().toISOString()
    });

    if (emp?.email) {
      sendLeaveStatusEmail(emp.email, {
        employeeName: leave.employeeName,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days,
        status: 'Approved',
        reason: comment,
        reviewerName: req.user.name || 'HR Management'
      }).catch((err) => console.error('[Dayflow Email] Leave approval email error:', err));
    }

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'LEAVE_APPROVE',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      metadata: { employeeId: leave.employeeId, days: leave.days, leaveType: leave.leaveType, comment },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully!',
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

export const rejectLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment = 'Unable to approve request at this time.' } = req.body;

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.',
        code: 'NOT_FOUND'
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This leave request is already marked as ${leave.status}.`,
        code: 'ALREADY_PROCESSED'
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    leave.status = 'Rejected';
    leave.reviewedBy = req.user.name || 'HR Admin';
    leave.reviewedOn = todayStr;
    leave.comment = comment;
    await leave.save();

    const emp = await Employee.findOne({ employeeId: leave.employeeId });

    await Notification.create({
      userId: leave.employeeId,
      title: 'Leave Request Rejected',
      message: `Your ${leave.leaveType} request for ${leave.startDate} to ${leave.endDate} was not approved. Note: ${comment}`,
      type: 'error',
      timestamp: new Date().toISOString()
    });

    if (emp?.email) {
      sendLeaveStatusEmail(emp.email, {
        employeeName: leave.employeeName,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days,
        status: 'Rejected',
        reason: comment,
        reviewerName: req.user.name || 'HR Management'
      }).catch((err) => console.error('[Dayflow Email] Leave reject email error:', err));
    }

    await logAudit({
      actorId: req.user.employeeId,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: 'LEAVE_REJECT',
      entity: 'LeaveRequest',
      entityId: leave._id.toString(),
      metadata: { employeeId: leave.employeeId, comment },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Leave request rejected with comment.',
      data: leave
    });
  } catch (error) {
    next(error);
  }
};
