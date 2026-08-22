import api, { getMockStore } from './api';

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const parts = timeString.trim().split(' ');
  if (parts.length < 2) return 0;
  const [time, modifier] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + (minutes || 0);
};

export const attendanceService = {
  getTodayStatus: async (employeeId) => {
    try {
      const response = await api.get('/attendance/today', { params: { employeeId } });
      return response.data?.data !== undefined ? response.data.data : response.data;
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
          workingMinutes: 0,
          extraHours: 0
        };
      }

      let workingMins = record.workingHours || 0;
      if (record.checkIn && record.checkOut) {
        const inMins = parseTimeToMinutes(record.checkIn);
        const outMins = parseTimeToMinutes(record.checkOut);
        let diff = outMins - inMins;
        if (diff < 0) diff += 1440;
        workingMins = Math.max(1, diff);
      }

      return {
        checkedIn: Boolean(record.checkIn),
        checkedOut: Boolean(record.checkOut),
        status: record.status,
        checkInTime: record.checkIn,
        checkOutTime: record.checkOut,
        workingMinutes: workingMins,
        extraHours: Math.max(0, workingMins - 480),
        recordId: record.id
      };
    }
  },

  checkIn: async (employeeId) => {
    try {
      const response = await api.post('/attendance/check-in', { employeeId });
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const emp = store.employees.find(e => e.id === employeeId || e.employeeId === employeeId);
      let recordIndex = store.attendance.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

      if (recordIndex >= 0) {
        store.attendance[recordIndex].checkIn = timeStr;
        store.attendance[recordIndex].checkOut = null;
        store.attendance[recordIndex].workingHours = 0;
        store.attendance[recordIndex].extraHours = 0;
        store.attendance[recordIndex].status = 'Present';
      } else {
        const newRecord = {
          id: `ATT-${employeeId}-${todayStr}`,
          employeeId,
          employeeName: emp ? emp.name : 'Employee',
          department: emp ? emp.department : 'Engineering',
          date: todayStr,
          checkIn: timeStr,
          checkOut: null,
          workingHours: 0,
          extraHours: 0,
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
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const recordIndex = store.attendance.findIndex(a => a.employeeId === employeeId && a.date === todayStr);

      if (recordIndex === -1 || !store.attendance[recordIndex].checkIn) {
        throw new Error('You must check in before checking out.');
      }

      const rec = store.attendance[recordIndex];
      const checkInMins = parseTimeToMinutes(rec.checkIn);
      const checkOutMins = parseTimeToMinutes(timeStr);
      let actualMinutes = checkOutMins - checkInMins;
      if (actualMinutes < 0) actualMinutes += 1440;
      if (actualMinutes === 0) actualMinutes = 1;

      rec.checkOut = timeStr;
      rec.workingHours = actualMinutes;
      rec.extraHours = Math.max(0, actualMinutes - 480);
      rec.status = 'Present';

      store.save('ATTENDANCE', store.attendance);

      return {
        success: true,
        message: 'Checked out successfully!',
        checkOutTime: timeStr,
        workingMinutes: actualMinutes,
        extraHours: rec.extraHours
      };
    }
  },

  resetToday: async (employeeId) => {
    try {
      const response = await api.post('/attendance/reset-today', { employeeId });
      return response.data?.data !== undefined ? response.data.data : response.data;
    } catch {
      const store = getMockStore();
      const todayStr = new Date().toISOString().split('T')[0];
      store.attendance = store.attendance.filter(a => !(a.employeeId === employeeId && a.date === todayStr));
      store.save('ATTENDANCE', store.attendance);
      return { success: true, message: 'Shift reset successfully.' };
    }
  },

  getMyAttendance: async (params = {}) => {
    try {
      const response = await api.get('/attendance/me', { params });
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      const user = JSON.parse(localStorage.getItem('dayflow_user') || '{}');
      return attendanceService.getEmployeeAttendance(user.employeeId || user.id || 'EMP-1001', params);
    }
  },

  getEmployeeAttendance: async (employeeId, params = {}) => {
    try {
      const response = await api.get(`/attendance/${employeeId}`, { params });
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (Array.isArray(data)) return data;
      return [];
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
      const data = response.data?.data !== undefined ? response.data.data : response.data;
      if (Array.isArray(data)) return data;
      return [];
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
