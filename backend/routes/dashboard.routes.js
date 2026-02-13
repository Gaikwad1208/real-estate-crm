import express from 'express';
import { getDashboardStats, getRecentActivities } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activities', getRecentActivities);

export default router;