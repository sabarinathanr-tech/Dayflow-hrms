import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  const uri = config.MONGODB_URI;

  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('YOUR_ATLAS_PASSWORD')) {
    console.warn('\n⚠️ [Dayflow DB Warning] Your MongoDB URI in backend/.env contains a password placeholder.');
    console.warn('   Please replace <password> with your actual MongoDB Atlas database user password.\n');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Dayflow DB] MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Dayflow DB] MongoDB Connection Error: ${error.message}`);
    // If remote connection failed and local is requested
    if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.warn('[Dayflow DB] Local MongoDB is not running. Please start mongod or configure MongoDB Atlas in backend/.env');
    }
    return null;
  }
};
