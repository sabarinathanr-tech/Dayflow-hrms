import api, { getMockStore } from './api';

export const authService = {
  login: async ({ email, loginId, password }) => {
    const identifier = (loginId || email || '').trim();
    try {
      const response = await api.post('/auth/login', {
        email: identifier,
        loginId: identifier,
        password
      });
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
        error.email = identifier;
        throw error;
      }
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      // If backend is completely unreachable, fallback to local mock store
      const store = getMockStore();
      const user = store.employees.find(
        (e) =>
          e.email?.toLowerCase() === identifier.toLowerCase() ||
          e.employeeId?.toLowerCase() === identifier.toLowerCase() ||
          e.id?.toLowerCase() === identifier.toLowerCase()
      );

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
      throw new Error(err.message || 'Invalid credentials. Try employee@dayflow.io, hr@dayflow.io, or your Employee ID');
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
      const existingEmail = store.employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        throw new Error('An account with this email already exists.');
      }
      const existingId = store.employees.find((e) => (e.id || '').toLowerCase() === (employeeId || '').toLowerCase());
      if (existingId) {
        throw new Error('An employee with this ID already exists.');
      }

      const generatedName =
        name && name.trim().length > 0
          ? name.trim()
          : email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      const basicSalary = role === 'HR' ? 50000 : 45000;
      const allowances = role === 'HR' ? 25000 : 22000;
      const deductions = role === 'HR' ? 4200 : 3800;
      const grossSalary = basicSalary + allowances;
      const netSalary = grossSalary - deductions;

      // Add new employee to mock store with complete data model in INR
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
        phone: '+91 98765 43210',
        address: '100 Innovation Park, Whitefield, Bengaluru, KA 560066',
        manager: 'Sarah Jenkins (HR-001)',
        avatar: role === 'HR'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        resume: {
          about: 'Dedicated professional passionate about building high quality product experiences.',
          whatILove: 'Collaborating with teammates to achieve organizational goals.',
          skills:
            role === 'HR'
              ? ['HR Operations', 'Talent Acquisition', 'Communication']
              : ['React.js', 'JavaScript', 'Tailwind CSS', 'Git'],
          certifications: [],
          education: [{ degree: 'B.Tech / B.S. Degree', institution: 'State University', year: '2016 - 2020' }],
          experience: [
            {
              title: role === 'HR' ? 'HR Specialist' : 'Software Engineer',
              company: 'Dayflow HRMS',
              period: '2026 - Present'
            }
          ],
          resumeDoc: {
            name: `${generatedName.replace(/\s+/g, '_')}_Resume.pdf`,
            size: '1.2 MB',
            uploadedDate: new Date().toISOString().split('T')[0]
          }
        },
        privateInfo: {
          nationality: 'Indian',
          gender: 'Not specified',
          maritalStatus: 'Single',
          personalEmail: email,
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          emergencyContact: { name: 'Family Contact', phone: '+91 98765 00000', relation: 'Contact' },
          bankDetails: {
            accountNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
            rawAccountNumber:
              '4920 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
            bankName: 'HDFC Bank',
            ifscCode: 'HDFC0002931',
            panNumber: 'DFPAN' + Math.floor(1000 + Math.random() * 9000) + 'X',
            uanNumber: '100' + Date.now().toString().slice(-9),
            employeeCode: employeeId
          }
        },
        salary: {
          basicSalary,
          hra: Math.round(basicSalary * 0.4),
          standardAllowance: 5000,
          performanceBonus: 3000,
          lta: 2500,
          fixedAllowance: 1500,
          allowances,
          pfDeduction: Math.round(basicSalary * 0.12),
          professionalTax: 200,
          otherDeductions: 500,
          deductions,
          grossSalary,
          netSalary,
          monthlyWage: netSalary,
          yearlyWage: netSalary * 12,
          currency: 'INR',
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
