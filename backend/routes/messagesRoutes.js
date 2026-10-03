import express from 'express';
import { getConversations, getThread, sendReply } from '../controllers/messagesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getConversations);
router.get('/:id/thread', getThread);
router.post('/:id/reply', sendReply);

export default router;
