import api, { getMockStore } from './api';

export const reportsService = {
  getDashboardMetrics: async () => {
    try {
      const response = await api.get('/reports/dashboard');
      return response.data?.data || response.data;
    } catch {
      const store = getMockStore();
      const totalHeadcount = store.employees.length;
      const deptCounts = {};
      store.employees.forEach((e) => {
        const d = e.department || 'Other';
        deptCounts[d] = (deptCounts[d] || 0) + 1;
      });

      const leaveCounts = { 'Paid Time Off': 0, 'Sick Leave': 0, 'Unpaid Leave': 0 };
      store.leaves.forEach((l) => {
        if (leaveCounts[l.leaveType] !== undefined) {
          leaveCounts[l.leaveType] += 1;
        }
      });

      const totalPayroll = store.employees.reduce((acc, e) => acc + (e.salary?.netSalary || 0), 0);

      return {
        totalHeadcount,
        presentToday: Math.max(1, totalHeadcount - 1),
        onLeaveToday: 1,
        absentToday: 0,
        pendingLeaves: store.leaves.filter((l) => l.status === 'Pending').length,
        deptCounts,
        leaveCounts,
        totalPayroll
      };
    }
  },

  getAttendanceReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/attendance', { params });
      return response.data?.data || response.data;
    } catch {
      const store = getMockStore();
      return store.attendance;
    }
  },

  getPayrollReport: async () => {
    try {
      const response = await api.get('/reports/payroll');
      return response.data?.data || response.data;
    } catch {
      const store = getMockStore();
      return store.employees.map((e) => ({
        employeeId: e.id,
        employeeName: e.name,
        department: e.department,
        designation: e.designation,
        basicSalary: e.salary?.basicSalary || 0,
        allowances: e.salary?.allowances || 0,
        deductions: e.salary?.deductions || 0,
        grossSalary: e.salary?.grossSalary || 0,
        netSalary: e.salary?.netSalary || 0,
        currency: e.salary?.currency || 'INR'
      }));
    }
  },

  getLeaveReport: async () => {
    try {
      const response = await api.get('/reports/leaves');
      return response.data?.data || response.data;
    } catch {
      const store = getMockStore();
      return store.leaves;
    }
  }
};
