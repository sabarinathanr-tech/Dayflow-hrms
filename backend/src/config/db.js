import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  const uri = config.MONGODB_URI;

  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('YOUR_ATLAS_PASSWORD')) {
    console.warn('\n⚠️ [Dayflow DB Warning] Your MONGODB_URI in backend/.env contains a password placeholder (<db_password>).');
    console.warn('   Please replace <db_password> with your actual MongoDB Atlas database user password.\n');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Dayflow DB] MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Dayflow DB] Connection Error (${uri.replace(/:([^:@]+)@/, ':****@')}): ${error.message}`);
    // If remote connection failed, fallback to local MongoDB instance
    if (!uri.includes('127.0.0.1') && !uri.includes('localhost')) {
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
