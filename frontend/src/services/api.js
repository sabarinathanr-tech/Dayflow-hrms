import axios from 'axios';
import { INITIAL_EMPLOYEES, INITIAL_LEAVES, INITIAL_NOTIFICATIONS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Intercept requests to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if on login or register page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('dayflow_token');
        localStorage.removeItem('dayflow_user');
      }
    }
    return Promise.reject(error);
  }
);

// Local Storage-backed Dynamic Mock Engine for Seamless Hackathon Demo
const STORAGE_KEYS = {
  EMPLOYEES: 'dayflow_mock_employees',
  ATTENDANCE: 'dayflow_mock_attendance',
  LEAVES: 'dayflow_mock_leaves',
  NOTIFICATIONS: 'dayflow_mock_notifications'
};

export const getMockStore = () => {
  let employees = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || 'null');
  if (!employees) {
    employees = INITIAL_EMPLOYEES;
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }

  let leaves = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES) || 'null');
  if (!leaves) {
    leaves = INITIAL_LEAVES;
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }

  let notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || 'null');
  if (!notifications) {
    notifications = INITIAL_NOTIFICATIONS;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  let attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || 'null');
  if (!attendance) {
    // Generate initial 30-day realistic attendance for Alex Morgan (EMP-1001) & others
    attendance = [];
    const today = new Date();
    employees.forEach(emp => {
      for (let i = 0; i < 28; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayOfWeek = d.getDay();
        const dateStr = d.toISOString().split('T')[0];
        
        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Skip today initially for check-in demo
        if (i === 0) continue;

        let status = 'Present';
        let checkIn = '09:02 AM';
        let checkOut = '06:05 PM';
        let workingHours = 543; // 9h 3m

        if (i === 3) {
          status = 'Half Day';
          checkIn = '09:15 AM';
          checkOut = '01:30 PM';
          workingHours = 255;
        } else if (i === 7) {
          status = 'Leave';
          checkIn = null;
          checkOut = null;
          workingHours = 0;
        } else if (i === 12 && emp.id === 'EMP-1004') {
          status = 'Absent';
          checkIn = null;
          checkOut = null;
          workingHours = 0;
        }

        attendance.push({
          id: `ATT-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          date: dateStr,
          checkIn,
          checkOut,
          workingHours,
          status
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }

  return {
    employees,
    leaves,
    attendance,
    notifications,
    save: (key, data) => {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
    }
  };
};

export default api;
