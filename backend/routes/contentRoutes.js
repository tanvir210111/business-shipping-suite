import express from 'express';
import { getContent } from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// General content list with filters
router.get('/', getContent);

// Dedicated type endpoints
router.get('/posts', (req, res, next) => { req.query.contentType = 'post'; next(); }, getContent);
router.get('/reels', (req, res, next) => { req.query.contentType = 'reel'; next(); }, getContent);
router.get('/stories', (req, res, next) => { req.query.contentType = 'story'; next(); }, getContent);
router.get('/videos', (req, res, next) => { req.query.contentType = 'video'; next(); }, getContent);

export default router;
