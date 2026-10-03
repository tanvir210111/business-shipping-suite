import { query } from '../database/connection.js';

export async function getBusinesses(req, res) {
  try {
    const businesses = await query(`
      SELECT b.id, b.name, b.logo, b.timezone, b.currency
      FROM businesses b
      JOIN business_users bu ON b.id = bu.business_id
      WHERE bu.user_id = ?
    `, [req.user.id]);

    // For each business, fetch associated channels/pages
    const result = [];
    for (const b of businesses) {
      const pages = await query(`
        SELECT id, business_id, name, handle, category, followers, avatar
        FROM pages
        WHERE business_id = ?
      `, [b.id]);

      result.push({
        ...b,
        pages
      });
    }

    return res.json({ businesses: result });
  } catch (err) {
    console.error('[Business ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve businesses' });
  }
}
