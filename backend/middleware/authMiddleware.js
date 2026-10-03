import jwt from 'jsonwebtoken';
import { query } from '../database/connection.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'business_shipping_suite_jwt_secret_key_2026_super_secure!';
    const decoded = jwt.verify(token, secret);
    
    // Fetch user
    const users = await query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
    }

    req.user = users[0];
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
}
