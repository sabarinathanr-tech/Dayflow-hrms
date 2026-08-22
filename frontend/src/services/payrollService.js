import api, { getMockStore } from './api';

export const payrollService = {
  getMyPayroll: async () => {
    try {
      const response = await api.get('/payroll/me');
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (!data) throw new Error('Payroll record not found');
      return data;
    } catch {
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      return payrollService.getEmployeePayroll(user.employeeId || user.id || 'EMP-1001');
    }
  },

  getEmployeePayroll: async (employeeId) => {
    try {
      const response = await api.get(`/payroll/${employeeId}`);
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (!data) throw new Error('Payroll record not found');
      return data;
    } catch {
      const store = getMockStore();
      const emp = store.employees.find((e) => e.id === employeeId || e.employeeId === employeeId);
      if (!emp) throw new Error('Employee not found');

      const raw = emp.salary || {};
      const basic = Number(raw.basicSalary) || 4500;
      const hra = Number(raw.hra) || Math.round(basic * 0.4);
      const stdAllow = Number(raw.standardAllowance) || 500;
      const perfBonus = Number(raw.performanceBonus) || 400;
      const lta = Number(raw.lta) || 300;
      const fixedAllow = Number(raw.fixedAllowance) || 200;
      const allowances = raw.allowances !== undefined ? Number(raw.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

      const pf = Number(raw.pfDeduction) || 350;
      const profTax = Number(raw.professionalTax) || 150;
      const otherDeduct = Number(raw.otherDeductions) || 100;
      const deductions = raw.deductions !== undefined ? Number(raw.deductions) : (pf + profTax + otherDeduct);

      const gross = basic + allowances;
      const net = raw.netSalary || (gross - deductions);
      const monthly = net;
      const yearly = monthly * 12;

      const structuredSalary = {
        basicSalary: basic,
        hra,
        standardAllowance: stdAllow,
        performanceBonus: perfBonus,
        lta,
        fixedAllowance: fixedAllow,
        allowances,
        pfDeduction: pf,
        professionalTax: profTax,
        otherDeductions: otherDeduct,
        deductions,
        grossSalary: gross,
        netSalary: net,
        monthlyWage: monthly,
        yearlyWage: yearly,
        currency: raw.currency || 'USD',
        effectiveDate: raw.effectiveDate || emp.joiningDate
      };

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        salary: structuredSalary,
        history: [
          { month: 'August 2026', gross, deductions, net, status: 'Paid', date: '2026-08-01' },
          { month: 'July 2026', gross, deductions, net, status: 'Paid', date: '2026-07-01' },
          { month: 'June 2026', gross, deductions, net, status: 'Paid', date: '2026-06-01' }
        ]
      };
    }
  },

  getAllPayroll: async () => {
    try {
      const response = await api.get('/payroll');
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      const store = getMockStore();
      return store.employees.map((emp) => {
        const raw = emp.salary || {};
        const basic = Number(raw.basicSalary) || 4500;
        const hra = Number(raw.hra) || Math.round(basic * 0.4);
        const stdAllow = Number(raw.standardAllowance) || 500;
        const perfBonus = Number(raw.performanceBonus) || 400;
        const lta = Number(raw.lta) || 300;
        const fixedAllow = Number(raw.fixedAllowance) || 200;
        const allowances = raw.allowances !== undefined ? Number(raw.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

        const pf = Number(raw.pfDeduction) || 350;
        const profTax = Number(raw.professionalTax) || 150;
        const otherDeduct = Number(raw.otherDeductions) || 100;
        const deductions = raw.deductions !== undefined ? Number(raw.deductions) : (pf + profTax + otherDeduct);

        const gross = basic + allowances;
        const net = raw.netSalary || (gross - deductions);
        const monthly = net;
        const yearly = monthly * 12;

        return {
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          designation: emp.designation,
          avatar: emp.avatar,
          basicSalary: basic,
          hra,
          standardAllowance: stdAllow,
          performanceBonus: perfBonus,
          lta,
          fixedAllowance: fixedAllow,
          allowances,
          pfDeduction: pf,
          professionalTax: profTax,
          otherDeductions: otherDeduct,
          deductions,
          grossSalary: gross,
          netSalary: net,
          monthlyWage: monthly,
          yearlyWage: yearly,
          currency: raw.currency || 'USD',
          lastUpdated: raw.effectiveDate || emp.joiningDate
        };
      });
    }
  },

  updateSalaryStructure: async (employeeId, salaryData) => {
    try {
      const response = await api.put(`/payroll/${employeeId}`, salaryData);
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch {
      const basic = Number(salaryData.basicSalary) || 0;
      const hra = Number(salaryData.hra) || Math.round(basic * 0.4);
      const stdAllow = Number(salaryData.standardAllowance) || 0;
      const perfBonus = Number(salaryData.performanceBonus) || 0;
      const lta = Number(salaryData.lta) || 0;
      const fixedAllow = Number(salaryData.fixedAllowance) || 0;
      const allowances = salaryData.allowances !== undefined ? Number(salaryData.allowances) : (hra + stdAllow + perfBonus + lta + fixedAllow);

      const pf = Number(salaryData.pfDeduction) || 0;
      const profTax = Number(salaryData.professionalTax) || 0;
      const otherDeduct = Number(salaryData.otherDeductions) || 0;
      const deductions = salaryData.deductions !== undefined ? Number(salaryData.deductions) : (pf + profTax + otherDeduct);

      const gross = basic + allowances;
      const net = gross - deductions;
      const monthly = net;
      const yearly = monthly * 12;

      const store = getMockStore();
      const empIndex = store.employees.findIndex((e) => e.id === employeeId || e.employeeId === employeeId);
      if (empIndex === -1) throw new Error('Employee not found');

      const todayStr = new Date().toISOString().split('T')[0];
      const updatedSalary = {
        basicSalary: basic,
        hra,
        standardAllowance: stdAllow,
        performanceBonus: perfBonus,
        lta,
        fixedAllowance: fixedAllow,
        allowances,
        pfDeduction: pf,
        professionalTax: profTax,
        otherDeductions: otherDeduct,
        deductions,
        grossSalary: gross,
        netSalary: net,
        monthlyWage: monthly,
        yearlyWage: yearly,
        currency: store.employees[empIndex].salary?.currency || 'USD',
        effectiveDate: todayStr
      };

      store.employees[empIndex].salary = updatedSalary;

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
