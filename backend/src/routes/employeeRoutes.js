import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateProfile,
  uploadResume,
  changePassword,
  deleteEmployee
} from '../controllers/employeeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', requireHR, createEmployee);
router.put('/:id', requireHR, updateEmployee);
router.put('/:id/profile', updateProfile);
router.post('/:id/resume', upload.single('file'), uploadResume);
router.put('/:id/change-password', changePassword);
router.delete('/:id', requireHR, deleteEmployee);

export default router;
