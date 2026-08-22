import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
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
    leaveType: {
      type: String,
      enum: ['Paid Time Off', 'Sick Leave', 'Unpaid Leave'],
      required: true
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    endDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    days: {
      type: Number,
      required: true,
      default: 1
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    attachment: {
      name: { type: String, default: null },
      url: { type: String, default: null },
      size: { type: String, default: null },
      type: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true
    },
    appliedOn: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    reviewedBy: {
      type: String,
      default: null
    },
    reviewedOn: {
      type: String,
      default: null
    },
    comment: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
