import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [employees, todayAttendance, leaves, payrolls] = await Promise.all([
      Employee.find(),
      Attendance.find({ date: todayStr }),
      LeaveRequest.find(),
      Payroll.find()
    ]);

    const totalHeadcount = employees.length;
    const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
    const onLeaveToday = todayAttendance.filter((a) => a.status === 'Leave').length;
    const absentToday = Math.max(0, totalHeadcount - presentToday - onLeaveToday);
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

    // Department breakdown
    const deptCounts = {};
    employees.forEach((e) => {
      const d = e.department || 'Other';
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });

    // Leave type breakdown
    const leaveCounts = { 'Paid Time Off': 0, 'Sick Leave': 0, 'Unpaid Leave': 0 };
    leaves.forEach((l) => {
      if (leaveCounts[l.leaveType] !== undefined) {
        leaveCounts[l.leaveType] += 1;
      }
    });

    const totalPayroll = payrolls.reduce((acc, p) => acc + (p.netSalary || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalHeadcount,
        presentToday,
        onLeaveToday,
        absentToday,
        pendingLeaves,
        deptCounts,
        leaveCounts,
        totalPayroll
      }
    });
  } catch (error) {
    next(error);
  }
};
