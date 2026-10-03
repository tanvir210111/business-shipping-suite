import { query } from '../database/connection.js';

export async function globalSearch(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const businessId = parseInt(req.query.businessId || '1', 10);

    if (!q || q.length < 2) {
      return res.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

    // 1. Search Content
    const content = await query(`
      SELECT id, title, content_type, '/content' AS route
      FROM content
      WHERE business_id = ? AND (title LIKE ? OR description LIKE ?)
      LIMIT 5
    `, [businessId, searchTerm, searchTerm]);

    // 2. Search Reports
    const reports = await query(`
      SELECT id, title, file_format, '/reports' AS route
      FROM reports
      WHERE business_id = ? AND title LIKE ?
      LIMIT 3
    `, [businessId, searchTerm]);

    // 3. Search Pages / Channels
    const pages = await query(`
      SELECT id, name, handle, '/insights' AS route
      FROM pages
      WHERE business_id = ? AND (name LIKE ? OR handle LIKE ?)
      LIMIT 3
    `, [businessId, searchTerm, searchTerm]);

    // 4. Quick Navigation matches
    const navItems = [
      { title: 'Insights Overview', route: '/insights/overview', category: 'Navigation' },
      { title: 'Earnings & Monetization', route: '/insights/earnings', category: 'Navigation' },
      { title: 'Audience Demographics', route: '/insights/audience', category: 'Navigation' },
      { title: 'Reach Analytics', route: '/insights/reach', category: 'Navigation' },
      { title: 'Engagement Metrics', route: '/insights/engagement', category: 'Navigation' },
      { title: 'Video Performance', route: '/insights/video', category: 'Navigation' },
      { title: 'Messages & Customer Support', route: '/messages', category: 'Navigation' }
    ].filter(n => n.title.toLowerCase().includes(q.toLowerCase()));

    return res.json({
      query: q,
      results: {
        content: content.map(c => ({ title: c.title, type: c.content_type, route: `/content` })),
        reports: reports.map(r => ({ title: r.title, type: 'Report', route: `/reports` })),
        pages: pages.map(p => ({ title: p.name, type: 'Channel', route: `/insights` })),
        navigation: navItems
      }
    });
  } catch (err) {
    console.error('[Search ERROR]', err);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}
