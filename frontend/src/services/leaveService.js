import api, { getMockStore } from './api';

export const leaveService = {
  getMyLeaves: async () => {
    try {
      const response = await api.get('/leaves/me');
      return response.data;
    } catch {
      const store = getMockStore();
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      const empId = user.id || 'EMP-1001';
      return store.leaves.filter(l => l.employeeId === empId).sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
    }
  },

  getLeaveBalances: async (employeeId) => {
    try {
      const response = await api.get(`/leaves/balances/${employeeId}`);
      return response.data;
    } catch {
      const store = getMockStore();
      const emp = store.employees.find(e => e.id === employeeId || e.employeeId === employeeId);
      return emp?.leaveBalances || { paidTimeOff: 14, sickLeave: 8, unpaidLeave: 0 };
    }
  },

  applyLeave: async ({ leaveType, startDate, endDate, reason }) => {
    try {
      const response = await api.post('/leaves', { leaveType, startDate, endDate, reason });
      return response.data;
    } catch {
      const store = getMockStore();
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      const emp = store.employees.find(e => e.id === user.id) || store.employees[0];

      // Calculate days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const newLeave = {
        id: `LEV-${Date.now().toString().slice(-4)}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        leaveType,
        startDate,
        endDate,
        days: days || 1,
        reason: reason || 'Personal reasons',
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
        reviewedBy: null,
        reviewedOn: null,
        comment: null
      };

      store.leaves.unshift(newLeave);
      store.save('LEAVES', store.leaves);

      // Add notification for HR
      const notif = {
        id: `NOTIF-${Date.now()}`,
        userId: 'HR-001',
        title: 'New Leave Request',
        message: `${emp.name} applied for ${leaveType} (${startDate} to ${endDate}).`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      store.notifications.unshift(notif);
      store.save('NOTIFICATIONS', store.notifications);

      return newLeave;
    }
  },

  getAllLeaves: async (params = {}) => {
    try {
      const response = await api.get('/leaves', { params });
      return response.data;
    } catch {
      const store = getMockStore();
      let list = [...store.leaves];

      if (params.status && params.status !== 'All') {
        list = list.filter(l => l.status === params.status);
      }
      if (params.leaveType && params.leaveType !== 'All') {
        list = list.filter(l => l.leaveType === params.leaveType);
      }
      if (params.employeeId && params.employeeId !== 'All') {
        list = list.filter(l => l.employeeId === params.employeeId);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(l =>
          l.employeeName?.toLowerCase().includes(q) ||
          l.employeeId?.toLowerCase().includes(q) ||
          l.department?.toLowerCase().includes(q) ||
          l.reason?.toLowerCase().includes(q)
        );
      }

      return list.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
    }
  },

  approveLeave: async (id, { comment = '' } = {}) => {
    try {
      const response = await api.put(`/leaves/${id}/approve`, { comment });
      return response.data;
    } catch {
      const store = getMockStore();
      const leaveIndex = store.leaves.findIndex(l => l.id === id);
      if (leaveIndex === -1) throw new Error('Leave request not found');

      const leave = store.leaves[leaveIndex];
      const reviewer = JSON.parse(localStorage.getItem('dayflow_user') || '{}');

      leave.status = 'Approved';
      leave.reviewedBy = reviewer.name || 'Sarah Jenkins (HR)';
      leave.reviewedOn = new Date().toISOString().split('T')[0];
      leave.comment = comment || 'Approved by HR';

      // Deduct balance
      const empIndex = store.employees.findIndex(e => e.id === leave.employeeId);
      if (empIndex !== -1 && store.employees[empIndex].leaveBalances) {
        const balances = store.employees[empIndex].leaveBalances;
        if (leave.leaveType === 'Sick Leave' && balances.sickLeave) {
          balances.sickLeave = Math.max(0, balances.sickLeave - leave.days);
        } else if (leave.leaveType === 'Paid Time Off' && balances.paidTimeOff) {
          balances.paidTimeOff = Math.max(0, balances.paidTimeOff - leave.days);
        }
      }

      // Add 'Leave' records to attendance calendar for those dates
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const dateStr = cur.toISOString().split('T')[0];
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const existingAttIndex = store.attendance.findIndex(a => a.employeeId === leave.employeeId && a.date === dateStr);
          if (existingAttIndex >= 0) {
            store.attendance[existingAttIndex].status = 'Leave';
            store.attendance[existingAttIndex].checkIn = null;
            store.attendance[existingAttIndex].checkOut = null;
          } else {
            store.attendance.unshift({
              id: `ATT-${leave.employeeId}-${dateStr}`,
              employeeId: leave.employeeId,
              employeeName: leave.employeeName,
              department: leave.department,
              date: dateStr,
              checkIn: null,
              checkOut: null,
              workingHours: 0,
              status: 'Leave'
            });
          }
        }
        cur.setDate(cur.getDate() + 1);
      }

      // Add notification for the employee
      store.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: leave.employeeId,
        title: 'Leave Approved',
        message: `Your ${leave.leaveType} request for ${leave.startDate} to ${leave.endDate} has been approved.`,
        type: 'success',
        timestamp: new Date().toISOString(),
        isRead: false
      });

      store.save('LEAVES', store.leaves);
      store.save('EMPLOYEES', store.employees);
      store.save('ATTENDANCE', store.attendance);
      store.save('NOTIFICATIONS', store.notifications);

      return leave;
    }
  },

  rejectLeave: async (id, { comment = '' } = {}) => {
    try {
      const response = await api.put(`/leaves/${id}/reject`, { comment });
      return response.data;
    } catch {
      const store = getMockStore();
      const leaveIndex = store.leaves.findIndex(l => l.id === id);
      if (leaveIndex === -1) throw new Error('Leave request not found');

      const leave = store.leaves[leaveIndex];
      const reviewer = JSON.parse(localStorage.getItem('dayflow_user') || '{}');

      leave.status = 'Rejected';
      leave.reviewedBy = reviewer.name || 'Sarah Jenkins (HR)';
      leave.reviewedOn = new Date().toISOString().split('T')[0];
      leave.comment = comment || 'Request cannot be accommodated at this time.';

      // Add notification for the employee
      store.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: leave.employeeId,
        title: 'Leave Rejected',
        message: `Your ${leave.leaveType} request for ${leave.startDate} to ${leave.endDate} was rejected. Note: ${leave.comment}`,
        type: 'error',
        timestamp: new Date().toISOString(),
        isRead: false
      });

      store.save('LEAVES', store.leaves);
      store.save('NOTIFICATIONS', store.notifications);

      return leave;
    }
  }
};
