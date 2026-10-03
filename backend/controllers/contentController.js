import { query } from '../database/connection.js';

export async function getContent(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const contentType = req.query.contentType || req.query.type || 'all';
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'date';
    const order = (req.query.order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const offset = (page - 1) * limit;

    let baseSql = `
      FROM content c
      JOIN content_metrics cm ON c.id = cm.content_id
      WHERE c.business_id = ?
    `;
    const params = [businessId];

    if (contentType !== 'all') {
      baseSql += ` AND c.content_type = ?`;
      params.push(contentType);
    }

    if (search.trim()) {
      baseSql += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    // Count total
    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;
    const countRows = await query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Sorting column mapping
    let sortCol = 'c.published_at';
    if (sortBy === 'reach') sortCol = 'cm.reach';
    else if (sortBy === 'views') sortCol = 'cm.views';
    else if (sortBy === 'likes') sortCol = 'cm.likes';
    else if (sortBy === 'clicks') sortCol = 'cm.clicks';
    else if (sortBy === 'earnings') sortCol = 'cm.earnings';
    else if (sortBy === 'engagement') sortCol = 'cm.engagement';

    const dataSql = `
      SELECT 
        c.id, c.business_id, c.title, c.description, c.content_type, c.thumbnail,
        c.published_at, c.status, c.platform,
        cm.reach, cm.impressions, cm.views, cm.likes, cm.comments, cm.shares,
        cm.saves, cm.clicks, cm.engagement, cm.watch_time, cm.earnings
      ${baseSql}
      ORDER BY ${sortCol} ${order}
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const items = await query(dataSql, dataParams);

    return res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('[Content ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve content records' });
  }
}
