import { query } from '../database/connection.js';

export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await query(`
      SELECT id, title, message, type, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return res.json({
      notifications,
      unreadCount
    });
  } catch (err) {
    console.error('[Notifications ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
}

export async function markAsRead(req, res) {
  try {
    const notifId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    await query(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [notifId, userId]);
    return res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('[Mark Read ERROR]', err);
    return res.status(500).json({ error: 'Failed to update notification' });
  }
}

export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;
    await query(`UPDATE notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('[Mark All Read ERROR]', err);
    return res.status(500).json({ error: 'Failed to mark all as read' });
  }
}

export async function deleteNotification(req, res) {
  try {
    const notifId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    await query(`DELETE FROM notifications WHERE id = ? AND user_id = ?`, [notifId, userId]);
    return res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('[Delete Notif ERROR]', err);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
}
