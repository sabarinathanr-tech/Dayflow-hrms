import express from 'express';
import {
  getDashboardMetrics,
  getAttendanceReport,
  getPayrollReport,
  getLeaveReport
} from '../controllers/reportsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/dashboard', requireHR, getDashboardMetrics);
router.get('/attendance', requireHR, getAttendanceReport);
router.get('/payroll', requireHR, getPayrollReport);
router.get('/leaves', requireHR, getLeaveReport);

export default router;
