import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Dayflow DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Dayflow DB] Initial Connection Failed (${config.MONGODB_URI}): ${error.message}`);
    // If remote connection failed, fallback to local MongoDB instance
    if (!config.MONGODB_URI.includes('127.0.0.1') && !config.MONGODB_URI.includes('localhost')) {
      try {
        console.log(`[Dayflow DB] Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/dayflow)...`);
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/dayflow', {
          serverSelectionTimeoutMS: 3000
        });
        console.log(`[Dayflow DB] Local Fallback MongoDB Connected: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`[Dayflow DB] Fallback Connection Error: ${fallbackError.message}`);
      }
    }
    return null;
  }
};
