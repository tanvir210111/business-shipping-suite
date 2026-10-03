import express from 'express';
import {
  getOverview,
  getResults,
  getReach,
  getEngagement,
  getFollowers,
  getContentInsights,
  getVideoInsights,
  getMessagesInsights,
  getEarnings,
  getAudience
} from '../controllers/insightsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/overview', getOverview);
router.get('/results', getResults);
router.get('/reach', getReach);
router.get('/engagement', getEngagement);
router.get('/followers', getFollowers);
router.get('/content', getContentInsights);
router.get('/video', getVideoInsights);
router.get('/messages', getMessagesInsights);
router.get('/earnings', getEarnings);
router.get('/audience', getAudience);

export default router;
