import api, { getMockStore } from './api';

export const employeeService = {
  getAllEmployees: async (params = {}) => {
    try {
      const response = await api.get('/employees', { params });
      return response.data;
    } catch {
      const store = getMockStore();
      let employees = [...store.employees];

      if (params.search) {
        const q = params.search.toLowerCase();
        employees = employees.filter((e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
        );
      }

      if (params.department && params.department !== 'All') {
        employees = employees.filter((e) => e.department === params.department);
      }

      if (params.status && params.status !== 'All') {
        employees = employees.filter((e) => e.status === params.status);
      }

      return employees;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch {
      const store = getMockStore();
      const emp = store.employees.find((e) => e.id === id || e.employeeId === id);
      if (!emp) throw new Error('Employee not found');
      return emp;
    }
  },

  getCurrentEmployee: async () => {
    const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
    if (!user.id) throw new Error('No active user session');
    return employeeService.getEmployeeById(user.id);
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData);
      return response.data;
    } catch {
      const store = getMockStore();
      const newEmp = {
        ...employeeData,
        id: employeeData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        employeeId: employeeData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        status: employeeData.status || 'Active',
        joiningDate: employeeData.joiningDate || new Date().toISOString().split('T')[0],
        avatar: employeeData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        resume: {
          about: employeeData.about || 'New employee joining Dayflow.',
          whatILove: 'Solving interesting problems with great teammates.',
          skills: employeeData.skills || ['Communication', 'Problem Solving'],
          certifications: [],
          education: [],
          experience: []
        },
        privateInfo: {
          nationality: employeeData.nationality || 'American',
          gender: employeeData.gender || 'Not specified',
          maritalStatus: 'Single',
          personalEmail: employeeData.email,
          city: employeeData.city || 'Springfield',
          state: employeeData.state || 'Oregon',
          country: 'United States',
          bankDetails: {
            accountNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
            bankName: 'Standard Corporate Bank',
            ifscCode: 'SCB0001092',
            panNumber: 'NEWPAN' + Math.floor(1000 + Math.random() * 9000),
            uanNumber: '100' + Date.now().toString().slice(-9),
            employeeCode: employeeData.employeeId || 'DF-EMP-NEW'
          }
        },
        salary: employeeData.salary || {
          basicSalary: 4500,
          hra: 1800,
          standardAllowance: 500,
          performanceBonus: 400,
          lta: 300,
          fixedAllowance: 200,
          allowances: 3200,
          pfDeduction: 350,
          professionalTax: 150,
          otherDeductions: 100,
          deductions: 600,
          grossSalary: 7700,
          netSalary: 7100,
          monthlyWage: 7100,
          yearlyWage: 85200,
          currency: 'USD'
        },
        leaveBalances: {
          paidTimeOff: 15,
          sickLeave: 10,
          unpaidLeave: 0
        },
        documents: []
      };

      store.employees.push(newEmp);
      store.save('EMPLOYEES', store.employees);
      return newEmp;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch {
      const store = getMockStore();
      const index = store.employees.findIndex((e) => e.id === id || e.employeeId === id);
      if (index === -1) throw new Error('Employee not found');

      store.employees[index] = {
        ...store.employees[index],
        ...employeeData
      };
      store.save('EMPLOYEES', store.employees);
      return store.employees[index];
    }
  },

  updateProfile: async (id, updatedFields) => {
    try {
      const response = await api.put(`/employees/${id}/profile`, updatedFields);
      return response.data;
    } catch {
      const store = getMockStore();
      const index = store.employees.findIndex((e) => e.id === id || e.employeeId === id);
      if (index === -1) throw new Error('Employee not found');

      const emp = store.employees[index];

      if (updatedFields.phone !== undefined) emp.phone = updatedFields.phone;
      if (updatedFields.address !== undefined) emp.address = updatedFields.address;
      if (updatedFields.avatar !== undefined) emp.avatar = updatedFields.avatar;
      if (updatedFields.name !== undefined) emp.name = updatedFields.name;
      if (updatedFields.resume !== undefined) {
        emp.resume = { ...emp.resume, ...updatedFields.resume };
      }
      if (updatedFields.privateInfo !== undefined) {
        emp.privateInfo = { ...emp.privateInfo, ...updatedFields.privateInfo };
      }

      store.save('EMPLOYEES', store.employees);

      // Also update stored user session if it's current user
      const currentUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      if (currentUser.id === id) {
        currentUser.avatar = emp.avatar;
        currentUser.name = emp.name;
        localStorage.setItem('dayflow_user', JSON.stringify(currentUser));
      }

      return emp;
    }
  },

  changePassword: async (id, { currentPassword, newPassword }) => {
    try {
      const response = await api.put(`/employees/${id}/change-password`, { currentPassword, newPassword });
      return response.data;
    } catch {
      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters.');
      }
      return { success: true, message: 'Password updated successfully!' };
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch {
      const store = getMockStore();
      store.employees = store.employees.filter((e) => e.id !== id && e.employeeId !== id);
      store.save('EMPLOYEES', store.employees);
      return { success: true };
    }
  }
};
