import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    type: {
      type: String,
      default: 'system'
    },
    message: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  {
    timestamps: true
  }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
