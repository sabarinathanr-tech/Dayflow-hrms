import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true
    },
    employeeName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      default: 'Engineering'
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    checkIn: {
      type: String, // "09:00 AM"
      default: null
    },
    checkOut: {
      type: String, // "06:00 PM"
      default: null
    },
    checkInTime: {
      type: Date,
      default: null
    },
    checkOutTime: {
      type: Date,
      default: null
    },
    workingHours: {
      type: Number, // duration in minutes
      default: 0
    },
    standardHours: {
      type: Number, // standard 480 minutes (8 hrs)
      default: 480
    },
    extraHours: {
      type: Number, // overtime in minutes
      default: 0
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Leave'],
      default: 'Present'
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index so one employee has only one record per date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
