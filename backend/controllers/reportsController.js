import { query } from '../database/connection.js';
import { resolveDateRange } from '../services/analyticsEngine.js';

export async function getReports(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const reports = await query(`
      SELECT id, business_id, title, date_range, metrics_json, content_types_json, file_format, created_at
      FROM reports
      WHERE business_id = ?
      ORDER BY created_at DESC
    `, [businessId]);

    return res.json({ reports });
  } catch (err) {
    console.error('[Reports ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve reports' });
  }
}

export async function createReport(req, res) {
  try {
    const businessId = parseInt(req.body.businessId || '1', 10);
    const { title, dateRange, metrics, contentTypes } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Report title is required' });
    }

    const metricsJson = JSON.stringify(metrics || ['reach', 'impressions', 'earnings']);
    const contentTypesJson = JSON.stringify(contentTypes || ['all']);

    const result = await query(`
      INSERT INTO reports (business_id, title, date_range, metrics_json, content_types_json, file_format)
      VALUES (?, ?, ?, ?, ?, 'CSV')
    `, [businessId, title, dateRange || 'Last 30 days', metricsJson, contentTypesJson]);

    return res.status(201).json({
      message: 'Report generated successfully',
      reportId: result.insertId
    });
  } catch (err) {
    console.error('[Create Report ERROR]', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
}

export async function exportCsv(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate, metric } = req.query;
    const dates = resolveDateRange(startDate, endDate);

    // Fetch actual database daily analytics
    const rows = await query(`
      SELECT 
        da.date,
        da.reach,
        da.impressions,
        da.engagement,
        da.likes,
        da.comments,
        da.shares,
        da.followers,
        da.new_followers,
        da.video_views,
        da.link_clicks,
        COALESCE(e.amount, 0) AS earnings_usd
      FROM daily_analytics da
      LEFT JOIN earnings e ON da.business_id = e.business_id AND da.date = e.date
      WHERE da.business_id = ? AND da.date BETWEEN ? AND ?
      ORDER BY da.date ASC
    `, [businessId, dates.current.start, dates.current.end]);

    // Build CSV string
    const headers = ['Date', 'Reach', 'Impressions', 'Engagement', 'Likes', 'Comments', 'Shares', 'Followers', 'New Followers', 'Video Views', 'Link Clicks', 'Earnings ($ USD)'];
    let csvContent = headers.join(',') + '\n';

    for (const r of rows) {
      const line = [
        r.date,
        r.reach,
        r.impressions,
        r.engagement,
        r.likes,
        r.comments,
        r.shares,
        r.followers,
        r.new_followers,
        r.video_views,
        r.link_clicks,
        Number(r.earnings_usd).toFixed(2)
      ].join(',');
      csvContent += line + '\n';
    }

    const filename = `business_shipping_suite_report_${dates.current.start}_to_${dates.current.end}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('[Export CSV ERROR]', err);
    return res.status(500).json({ error: 'Failed to export CSV report' });
  }
}
