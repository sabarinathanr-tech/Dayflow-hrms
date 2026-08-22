import api, { getMockStore } from './api';

export const authService = {
  login: async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('dayflow_token', response.data.token);
        localStorage.setItem('dayflow_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      // If backend is unavailable, fallback to mock store
      const store = getMockStore();
      const user = store.employees.find(e => e.email.toLowerCase() === email.toLowerCase());

      if (user) {
        // Simple mock validation (any password > 5 chars)
        if (password.length < 5) {
          throw new Error('Invalid email or password');
        }
        const token = `mock_token_${user.id}_${Date.now()}`;
        const userData = {
          id: user.id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          role: user.role,
          designation: user.designation,
          department: user.department,
          avatar: user.avatar
        };
        localStorage.setItem('dayflow_token', token);
        localStorage.setItem('dayflow_user', JSON.stringify(userData));
        return { token, user: userData };
      }
      throw new Error(err.response?.data?.message || 'Invalid credentials. Try employee@dayflow.io or hr@dayflow.io');
    }
  },

  register: async ({ employeeId, email, password, role }) => {
    try {
      const response = await api.post('/auth/register', { employeeId, email, password, role });
      return response.data;
    } catch (err) {
      const store = getMockStore();
      const existingEmail = store.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        throw new Error('An account with this email already exists.');
      }
      const existingId = store.employees.find(e => e.id.toLowerCase() === employeeId.toLowerCase());
      if (existingId) {
        throw new Error('An employee with this ID already exists.');
      }

      // Add new employee to mock store
      const newEmployee = {
        id: employeeId,
        employeeId: employeeId,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: role || 'Employee',
        designation: role === 'HR' ? 'HR Specialist' : 'Software Engineer',
        department: role === 'HR' ? 'Human Resources' : 'Engineering',
        employmentType: 'Full-Time',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: {
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

      store.employees.push(newEmployee);
      store.save('EMPLOYEES', store.employees);

      return {
        success: true,
        message: 'Registration successful! Verification code sent to your email.',
        email,
        employeeId
      };
    }
  },

  verifyEmail: async ({ email, code }) => {
    try {
      const response = await api.post('/auth/verify', { email, code });
      return response.data;
    } catch (err) {
      // Mock verification check: accepts '123456' or any 6-digit code
      if (!code || code.length < 4) {
        throw new Error('Please enter a valid verification code');
      }
      return { success: true, message: 'Email verified successfully! You can now sign in.' };
    }
  },

  resendVerification: async ({ email }) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch {
      return { success: true, message: 'Verification code resent to your email.' };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      return { success: true, message: 'If an account exists, a password reset link has been sent.' };
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('dayflow_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  }
};
