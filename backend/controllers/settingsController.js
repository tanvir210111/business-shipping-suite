import bcrypt from 'bcryptjs';
import { query } from '../database/connection.js';

export async function getSettings(req, res) {
  try {
    const userId = req.user.id;
    const settingsRows = await query('SELECT * FROM settings WHERE user_id = ?', [userId]);
    const settings = settingsRows[0] || {
      theme: 'system',
      email_alerts: 1,
      weekly_digest: 1,
      currency: 'USD',
      timezone: 'America/New_York'
    };

    return res.json({ settings, user: req.user });
  } catch (err) {
    console.error('[Settings ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve settings' });
  }
}

export async function updateSettings(req, res) {
  try {
    const userId = req.user.id;
    const { theme, email_alerts, weekly_digest, currency, timezone, name, currentPassword, newPassword } = req.body;

    // Check if settings row exists
    const existing = await query('SELECT id FROM settings WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      await query(`
        UPDATE settings 
        SET theme = COALESCE(?, theme),
            email_alerts = COALESCE(?, email_alerts),
            weekly_digest = COALESCE(?, weekly_digest),
            currency = COALESCE(?, currency),
            timezone = COALESCE(?, timezone),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [theme, email_alerts !== undefined ? (email_alerts ? 1 : 0) : null, weekly_digest !== undefined ? (weekly_digest ? 1 : 0) : null, currency, timezone, userId]);
    } else {
      await query(`
        INSERT INTO settings (user_id, theme, email_alerts, weekly_digest, currency, timezone)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, theme || 'system', email_alerts ? 1 : 0, weekly_digest ? 1 : 0, currency || 'USD', timezone || 'America/New_York']);
    }

    // Update name if provided
    if (name) {
      await query('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
    }

    // Update password if requested
    if (currentPassword && newPassword) {
      const userRows = await query('SELECT password_hash FROM users WHERE id = ?', [userId]);
      const isMatch = await bcrypt.compare(currentPassword, userRows[0].password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match' });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
    }

    return res.json({ message: 'Settings saved successfully' });
  } catch (err) {
    console.error('[Update Settings ERROR]', err);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
}
