import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or localhost)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads route
app.use('/uploads', express.static(uploadsDir));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dayflow HRMS API Engine is running smoothly.',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount Routes (all registered before server.listen)
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch 404 & Global Errors
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    // Connect MongoDB & run initial seed
    const conn = await connectDB();
    if (conn) {
      await seedDatabase();
    }

    const PORT = config.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Dayflow HRMS Backend Server running on port ${PORT} `);
      console.log(` Healthcheck: http://localhost:${PORT}/api/health    `);
      console.log(`====================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n[Dayflow Backend Error] Port ${PORT} is already in use.`);
        console.error(`Stop the existing Dayflow backend process or configure another port in backend/.env.\n`);
        process.exit(1);
      } else {
        console.error('[Dayflow Backend Server Error]', err);
      }
    });
  } catch (error) {
    console.error('[Dayflow Backend Initialization Error]', error);
    process.exit(1);
  }
};

startServer();

export default app;
