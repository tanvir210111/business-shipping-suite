import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getDashboard);

export default router;
