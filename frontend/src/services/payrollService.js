import api, { getMockStore } from './api';

export const payrollService = {
  getMyPayroll: async () => {
    try {
      const response = await api.get('/payroll/me');
      return response.data;
    } catch {
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      return payrollService.getEmployeePayroll(user.id || 'EMP-1001');
    }
  },

  getEmployeePayroll: async (employeeId) => {
    try {
      const response = await api.get(`/payroll/${employeeId}`);
      return response.data;
    } catch {
      const store = getMockStore();
      const emp = store.employees.find(e => e.id === employeeId || e.employeeId === employeeId);
      if (!emp) throw new Error('Employee not found');

      const salary = emp.salary || {
        basicSalary: 6000,
        allowances: 1000,
        deductions: 400,
        netSalary: 6600,
        currency: 'USD',
        effectiveDate: emp.joiningDate
      };

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        salary,
        history: [
          { month: 'August 2026', basic: salary.basicSalary, allowances: salary.allowances, deductions: salary.deductions, net: salary.netSalary, status: 'Paid', date: '2026-08-01' },
          { month: 'July 2026', basic: salary.basicSalary, allowances: salary.allowances, deductions: salary.deductions, net: salary.netSalary, status: 'Paid', date: '2026-07-01' },
          { month: 'June 2026', basic: salary.basicSalary, allowances: salary.allowances, deductions: salary.deductions, net: salary.netSalary, status: 'Paid', date: '2026-06-01' }
        ]
      };
    }
  },

  getAllPayroll: async () => {
    try {
      const response = await api.get('/payroll');
      return response.data;
    } catch {
      const store = getMockStore();
      return store.employees.map(emp => {
        const sal = emp.salary || {
          basicSalary: 5000,
          allowances: 800,
          deductions: 300,
          netSalary: 5500,
          currency: 'USD'
        };
        return {
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          designation: emp.designation,
          avatar: emp.avatar,
          basicSalary: sal.basicSalary,
          allowances: sal.allowances,
          deductions: sal.deductions,
          netSalary: sal.netSalary || (sal.basicSalary + sal.allowances - sal.deductions),
          currency: sal.currency || 'USD',
          lastUpdated: sal.effectiveDate || emp.joiningDate
        };
      });
    }
  },

  updateSalaryStructure: async (employeeId, { basicSalary, allowances, deductions }) => {
    const basic = Number(basicSalary) || 0;
    const allow = Number(allowances) || 0;
    const deduct = Number(deductions) || 0;
    const net = basic + allow - deduct;

    try {
      const response = await api.put(`/payroll/${employeeId}`, {
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: net
      });
      return response.data;
    } catch {
      const store = getMockStore();
      const empIndex = store.employees.findIndex(e => e.id === employeeId || e.employeeId === employeeId);
      if (empIndex === -1) throw new Error('Employee not found');

      const todayStr = new Date().toISOString().split('T')[0];
      const updatedSalary = {
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: net,
        currency: store.employees[empIndex].salary?.currency || 'USD',
        effectiveDate: todayStr
      };

      store.employees[empIndex].salary = updatedSalary;

      // Add notification
      store.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: employeeId,
        title: 'Salary Structure Updated',
        message: `Your revised salary structure has been updated by HR. Effective date: ${todayStr}`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false
      });

      store.save('EMPLOYEES', store.employees);
      store.save('NOTIFICATIONS', store.notifications);

      return updatedSalary;
    }
  }
};
