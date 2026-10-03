import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import insightsRoutes from './routes/insightsRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import businessRoutes from './routes/businessRoutes.js';

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during local development
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Business Shipping Suite',
    version: '1.0.0',
    currentDate: '2026-10-03',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/businesses', businessRoutes);

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
