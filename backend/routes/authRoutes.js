import express from 'express';
import { login, logout, getMe, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);
router.post('/forgot-password', forgotPassword);

export default router;
