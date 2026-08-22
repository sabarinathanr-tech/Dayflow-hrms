import express from 'express';
import { getDashboardMetrics } from '../controllers/reportsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireHR } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/dashboard', requireHR, getDashboardMetrics);

export default router;
