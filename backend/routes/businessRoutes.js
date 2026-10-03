import express from 'express';
import { getBusinesses } from '../controllers/businessController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getBusinesses);

export default router;
