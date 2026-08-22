import express from 'express';
import {
  getTodayStatus,
  checkIn,
  checkOut,
  getMyAttendance,
  getEmployeeAttendance,
  getAllAttendance
} from '../controllers/attendanceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/today', getTodayStatus);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/me', getMyAttendance);
router.get('/:employeeId', getEmployeeAttendance);
router.get('/', requireHR, getAllAttendance);

export default router;
