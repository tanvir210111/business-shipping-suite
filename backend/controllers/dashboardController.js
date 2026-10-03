import { getAnalyticsSummary } from '../services/analyticsEngine.js';
import { query } from '../database/connection.js';

export async function getDashboard(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const pageId = req.query.pageId ? parseInt(req.query.pageId, 10) : null;
    const { startDate, endDate } = req.query;

    // Fetch primary analytics and comparison
    const analytics = await getAnalyticsSummary({
      businessId,
      pageId,
      startDate,
      endDate,
      comparison: true
    });

    // Fetch top 5 recent high-performing shipping campaigns/content
    const topContent = await query(`
      SELECT 
        c.id, c.title, c.content_type, c.thumbnail, c.published_at,
        cm.reach, cm.views, cm.engagement, cm.earnings
      FROM content c
      JOIN content_metrics cm ON c.id = cm.content_id
      WHERE c.business_id = ?
      ORDER BY cm.reach DESC
      LIMIT 5
    `, [businessId]);

    // Fetch latest 5 activity/notifications
    const recentAlerts = await query(`
      SELECT id, title, message, type, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [req.user.id]);

    // Active fleet shipping channels
    const channels = await query(`
      SELECT id, name, handle, category, followers, avatar
      FROM pages
      WHERE business_id = ?
    `, [businessId]);

    return res.json({
      dates: analytics.dates,
      kpis: analytics.kpis,
      timeseries: analytics.timeseries,
      topContent,
      recentAlerts,
      channels,
      systemHealth: {
        fleetScore: 98.4,
        onTimeRate: '99.1%',
        telemetryOnline: true,
        lastSync: '2026-10-03 12:00:00'
      }
    });
  } catch (err) {
    console.error('[Dashboard ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve dashboard analytics' });
  }
}
