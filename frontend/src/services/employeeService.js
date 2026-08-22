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
        employees = employees.filter(e => 
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
        );
      }

      if (params.department && params.department !== 'All') {
        employees = employees.filter(e => e.department === params.department);
      }

      if (params.status && params.status !== 'All') {
        employees = employees.filter(e => e.status === params.status);
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
      const emp = store.employees.find(e => e.id === id || e.employeeId === id);
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
        status: employeeData.status || 'Active',
        joiningDate: employeeData.joiningDate || new Date().toISOString().split('T')[0],
        salary: employeeData.salary || {
          basicSalary: 5000,
          allowances: 800,
          deductions: 300,
          netSalary: 5500,
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
      const index = store.employees.findIndex(e => e.id === id || e.employeeId === id);
      if (index === -1) throw new Error('Employee not found');

      store.employees[index] = {
        ...store.employees[index],
        ...employeeData
      };
      store.save('EMPLOYEES', store.employees);
      return store.employees[index];
    }
  },

  updateProfile: async (id, { phone, address, avatar }) => {
    try {
      const response = await api.put(`/employees/${id}/profile`, { phone, address, avatar });
      return response.data;
    } catch {
      const store = getMockStore();
      const index = store.employees.findIndex(e => e.id === id || e.employeeId === id);
      if (index === -1) throw new Error('Employee not found');

      if (phone !== undefined) store.employees[index].phone = phone;
      if (address !== undefined) store.employees[index].address = address;
      if (avatar !== undefined) store.employees[index].avatar = avatar;

      store.save('EMPLOYEES', store.employees);

      // Also update stored user session if it's the current user
      const currentUser = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      if (currentUser.id === id) {
        currentUser.avatar = store.employees[index].avatar;
        localStorage.setItem('dayflow_user', JSON.stringify(currentUser));
      }

      return store.employees[index];
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch {
      const store = getMockStore();
      store.employees = store.employees.filter(e => e.id !== id && e.employeeId !== id);
      store.save('EMPLOYEES', store.employees);
      return { success: true };
    }
  }
};
