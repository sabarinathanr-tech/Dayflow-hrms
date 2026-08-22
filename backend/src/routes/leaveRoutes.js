import express from 'express';
import {
  getMyLeaves,
  getLeaveBalances,
  applyLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave
} from '../controllers/leaveController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/me', getMyLeaves);
router.get('/balances/:employeeId?', getLeaveBalances);
router.post('/', upload.single('attachment'), applyLeave);
router.get('/', requireHR, getAllLeaves);
router.put('/:id/approve', requireHR, approveLeave);
router.put('/:id/reject', requireHR, rejectLeave);

export default router;
