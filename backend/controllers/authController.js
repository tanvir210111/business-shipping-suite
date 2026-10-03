import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/connection.js';

export async function login(req, res) {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const secret = process.env.JWT_SECRET || 'business_shipping_suite_jwt_secret_key_2026_super_secure!';
    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    // Set HTTP-only cookie if desired
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      created_at: user.created_at,
      last_login: new Date().toISOString()
    };

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[Auth Login ERROR]', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
}

export async function getMe(req, res) {
  try {
    const user = req.user;
    
    // Get user's businesses
    const businesses = await query(`
      SELECT b.id, b.name, b.logo, b.timezone, b.currency, bu.role
      FROM businesses b
      JOIN business_users bu ON b.id = bu.business_id
      WHERE bu.user_id = ?
    `, [user.id]);

    // Get user's settings
    const settingsRows = await query('SELECT * FROM settings WHERE user_id = ?', [user.id]);
    const settings = settingsRows[0] || { theme: 'system', email_alerts: 1, weekly_digest: 1 };

    return res.json({
      user,
      businesses,
      settings
    });
  } catch (err) {
    console.error('[Auth GetMe ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Simulated secure reset
  return res.json({
    message: 'If an account exists for this email, password reset instructions have been dispatched.'
  });
}
