import express from 'express';
import { getReports, createReport, exportCsv } from '../controllers/reportsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getReports);
router.post('/generate', createReport);
router.get('/export-csv', exportCsv);

export default router;
