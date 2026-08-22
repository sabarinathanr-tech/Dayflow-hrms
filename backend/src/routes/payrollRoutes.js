import express from 'express';
import {
  getMyPayroll,
  getEmployeePayroll,
  getAllPayroll,
  updateSalaryStructure
} from '../controllers/payrollController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/me', getMyPayroll);
router.get('/:employeeId', getEmployeePayroll);
router.get('/', requireHR, getAllPayroll);
router.put('/:employeeId', requireHR, updateSalaryStructure);

export default router;
