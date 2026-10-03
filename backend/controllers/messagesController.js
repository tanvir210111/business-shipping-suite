import { query } from '../database/connection.js';

export async function getConversations(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const conversations = await query(`
      SELECT id, business_id, sender_name, sender_avatar, last_message, status, response_time_minutes, created_at, updated_at
      FROM messages
      WHERE business_id = ?
      ORDER BY updated_at DESC
    `, [businessId]);

    // SLA metrics
    const stats = {
      total: conversations.length,
      unread: conversations.filter(c => c.status === 'unread').length,
      avgResponseTime: '11.4 mins',
      responseRate: '98.6%'
    };

    return res.json({
      conversations,
      stats
    });
  } catch (err) {
    console.error('[Messages ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
}

export async function getThread(req, res) {
  try {
    const messageId = parseInt(req.params.id, 10);
    const replies = await query(`
      SELECT id, message_id, sender_type, content, created_at
      FROM message_replies
      WHERE message_id = ?
      ORDER BY created_at ASC
    `, [messageId]);

    // Mark as read
    await query(`UPDATE messages SET status = 'read' WHERE id = ?`, [messageId]);

    return res.json({ replies });
  } catch (err) {
    console.error('[Thread ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve message thread' });
  }
}

export async function sendReply(req, res) {
  try {
    const messageId = parseInt(req.params.id, 10);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Insert user reply
    const replyRes = await query(`
      INSERT INTO message_replies (message_id, sender_type, content)
      VALUES (?, 'user', ?)
    `, [messageId, content.trim()]);

    // Update parent message
    await query(`
      UPDATE messages 
      SET last_message = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [content.trim(), messageId]);

    return res.json({
      message: 'Reply sent successfully',
      replyId: replyRes.insertId || Date.now()
    });
  } catch (err) {
    console.error('[Send Reply ERROR]', err);
    return res.status(500).json({ error: 'Failed to send reply' });
  }
}
