import api, { getMockStore } from './api';

export const attendanceService = {
  getTodayStatus: async (employeeId) => {
    try {
      const response = await api.get('/attendance/today', { params: { employeeId } });
      return response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      const record = store.attendance.find(a => a.employeeId === employeeId && a.date === todayStr);

      if (!record) {
        return {
          checkedIn: false,
          checkedOut: false,
          status: 'Not Checked In',
          checkInTime: null,
          checkOutTime: null,
          workingMinutes: 0
        };
      }

      return {
        checkedIn: Boolean(record.checkIn),
        checkedOut: Boolean(record.checkOut),
        status: record.status,
        checkInTime: record.checkIn,
        checkOutTime: record.checkOut,
        workingMinutes: record.workingHours || 0,
        recordId: record.id
      };
    }
  },

  checkIn: async (employeeId) => {
    try {
      const response = await api.post('/attendance/check-in', { employeeId });
      return response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const emp = store.employees.find(e => e.id === employeeId);
      let recordIndex = store.attendance.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

      if (recordIndex >= 0) {
        if (store.attendance[recordIndex].checkIn) {
          throw new Error('You have already checked in today.');
        }
        store.attendance[recordIndex].checkIn = timeStr;
        store.attendance[recordIndex].status = 'Present';
      } else {
        const newRecord = {
          id: `ATT-${employeeId}-${todayStr}`,
          employeeId,
          employeeName: emp ? emp.name : 'Alex Morgan',
          department: emp ? emp.department : 'Engineering',
          date: todayStr,
          checkIn: timeStr,
          checkOut: null,
          workingHours: 0,
          status: 'Present'
        };
        store.attendance.unshift(newRecord);
      }

      store.save('ATTENDANCE', store.attendance);

      return {
        success: true,
        message: 'Checked in successfully!',
        checkInTime: timeStr,
        status: 'Present'
      };
    }
  },

  checkOut: async (employeeId) => {
    try {
      const response = await api.post('/attendance/check-out', { employeeId });
      return response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const recordIndex = store.attendance.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

      if (recordIndex === -1 || !store.attendance[recordIndex].checkIn) {
        throw new Error('You must check in before checking out.');
      }

      if (store.attendance[recordIndex].checkOut) {
        throw new Error('You have already checked out today.');
      }

      // Calculate working minutes (e.g. from check-in time or default ~8.5 hrs)
      store.attendance[recordIndex].checkOut = timeStr;
      store.attendance[recordIndex].workingHours = 490; // ~8h 10m
      store.attendance[recordIndex].status = 'Present';

      store.save('ATTENDANCE', store.attendance);

      return {
        success: true,
        message: 'Checked out successfully!',
        checkOutTime: timeStr,
        workingMinutes: 490
      };
    }
  },

  getMyAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance/me', { params });
      return response.data;
    } catch {
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      return attendanceService.getEmployeeAttendance(user.id || 'EMP-1001', params);
    }
  },

  getEmployeeAttendance: async (employeeId, params = {}) => {
    try {
      const response = await api.get(`/attendance/${employeeId}`, { params });
      return response.data;
    } catch {
      const store = getMockStore();
      let records = store.attendance.filter(a => a.employeeId === employeeId);

      if (params.month !== undefined && params.year !== undefined) {
        records = records.filter(a => {
          const d = new Date(a.date);
          return d.getMonth() === parseInt(params.month, 10) && d.getFullYear() === parseInt(params.year, 10);
        });
      }

      if (params.status && params.status !== 'All') {
        records = records.filter(a => a.status === params.status);
      }

      return records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  getAllAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance', { params });
      return response.data;
    } catch {
      const store = getMockStore();
      let records = [...store.attendance];

      if (params.date) {
        records = records.filter(a => a.date === params.date);
      }

      if (params.employeeId && params.employeeId !== 'All') {
        records = records.filter(a => a.employeeId === params.employeeId);
      }

      if (params.department && params.department !== 'All') {
        records = records.filter(a => a.department === params.department);
      }

      if (params.status && params.status !== 'All') {
        records = records.filter(a => a.status === params.status);
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        records = records.filter(a =>
          a.employeeName?.toLowerCase().includes(q) ||
          a.employeeId?.toLowerCase().includes(q) ||
          a.department?.toLowerCase().includes(q)
        );
      }

      return records.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }
};
