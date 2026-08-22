import api, { getMockStore } from './api';

export const authService = {
  login: async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const payload = response.data?.data || response.data;
      if (payload?.token) {
        localStorage.setItem('dayflow_token', payload.token);
        localStorage.setItem('dayflow_user', JSON.stringify(payload.user));
      }
      return payload;
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        const error = new Error(err.response?.data?.message || 'Please verify your email before signing in.');
        error.code = 'EMAIL_NOT_VERIFIED';
        error.email = email;
        throw error;
      }
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      // If backend is completely unreachable, fallback to local mock store
      const store = getMockStore();
      const user = store.employees.find(e => e.email.toLowerCase() === email.toLowerCase());

      if (user) {
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
      throw new Error(err.message || 'Invalid credentials. Try employee@dayflow.io or hr@dayflow.io');
    }
  },

  register: async ({ employeeId, name, email, password, role }) => {
    try {
      const response = await api.post('/auth/register', { employeeId, name, email, password, role });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      const store = getMockStore();
      const existingEmail = store.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        throw new Error('An account with this email already exists.');
      }
      const existingId = store.employees.find(e => (e.id || '').toLowerCase() === (employeeId || '').toLowerCase());
      if (existingId) {
        throw new Error('An employee with this ID already exists.');
      }

      const generatedName = name && name.trim().length > 0
        ? name.trim()
        : email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Add new employee to mock store with complete data model
      const newEmployee = {
        id: employeeId,
        employeeId: employeeId,
        name: generatedName,
        email,
        role: role || 'Employee',
        designation: role === 'HR' ? 'HR Specialist' : 'Software Engineer',
        department: role === 'HR' ? 'Human Resources' : 'Engineering',
        employmentType: 'Full-Time',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        dateOfBirth: '1995-01-01',
        phone: '+1 (555) 123-4567',
        address: '100 Main Street, San Francisco, CA',
        manager: 'Sarah Jenkins (HR-001)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Dedicated professional passionate about building high quality product experiences.',
          whatILove: 'Collaborating with teammates to achieve organizational goals.',
          skills: role === 'HR' ? ['HR Operations', 'Talent Acquisition', 'Communication'] : ['React.js', 'JavaScript', 'Tailwind CSS', 'Git'],
          certifications: [],
          education: [{ degree: 'B.S. Degree', institution: 'State University', year: '2016 - 2020' }],
          experience: [{ title: role === 'HR' ? 'HR Specialist' : 'Software Engineer', company: 'Dayflow HRMS', period: '2026 - Present' }],
          resumeDoc: { name: `${generatedName.replace(/\s+/g, '_')}_Resume.pdf`, size: '1.2 MB', uploadedDate: new Date().toISOString().split('T')[0] }
        },
        privateInfo: {
          nationality: 'American',
          gender: 'Not specified',
          maritalStatus: 'Single',
          personalEmail: email,
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          emergencyContact: { name: 'Family Contact', phone: '+1 (555) 999-0000', relation: 'Contact' },
          bankDetails: {
            accountNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
            rawAccountNumber: '4920 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
            bankName: 'Silicon Valley Bank',
            ifscCode: 'SVB0002931',
            panNumber: 'DFPAN' + Math.floor(1000 + Math.random() * 9000) + 'X',
            uanNumber: '100' + Date.now().toString().slice(-9),
            employeeCode: employeeId
          }
        },
        salary: {
          basicSalary: 5000,
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
          grossSalary: 8200,
          netSalary: 7600,
          monthlyWage: 7600,
          yearlyWage: 91200,
          currency: 'USD',
          effectiveDate: new Date().toISOString().split('T')[0]
        },
        security: {
          emailVerified: false,
          lastLogin: 'Never',
          activeSessions: 1
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
      const response = await api.post('/auth/verify-email', { email, code });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      if (!code || code.length < 4) {
        throw new Error('Please enter a valid verification code');
      }
      return { success: true, message: 'Email verified successfully! You can now sign in.' };
    }
  },

  resendVerification: async ({ email }) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      return { success: true, message: 'Verification code resent to your email.' };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      return { success: true, message: 'If an account exists, a password reset link has been sent.' };
    }
  },

  resetPassword: async ({ email, token, newPassword }) => {
    try {
      const response = await api.post('/auth/reset-password', { email, token, newPassword });
      return response.data?.data || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      return { success: true, message: 'Password updated successfully.' };
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
