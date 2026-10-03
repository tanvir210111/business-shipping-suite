import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.post('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
