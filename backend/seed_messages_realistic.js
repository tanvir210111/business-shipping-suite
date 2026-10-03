import { initDatabase, query } from './database/connection.js';

async function seedMessages() {
  await initDatabase();

  // Clean and update message 5 (BlueWave Supply Co.)
  await query('DELETE FROM message_replies WHERE message_id = 5');
  
  await query(`
    INSERT INTO message_replies (message_id, sender_type, content, created_at)
    VALUES 
    (5, 'customer', 'Can you confirm the demurrage allowance for the Houston terminal?', '2026-10-03 07:15:19'),
    (5, 'user', 'Standard ocean tariff includes 7 free calendar days at Houston Barbours Cut. Would you like us to request an extended 10-day allowance?', '2026-10-03 07:22:10'),
    (5, 'customer', 'Yes please, vessel arrival for MSKU-9082 is expected next Tuesday.', '2026-10-03 07:35:45'),
    (5, 'user', 'Request submitted to terminal operator. We will notify you as soon as the port liaison confirms.', '2026-10-03 07:42:00')
  `);
  
  await query(`
    UPDATE messages 
    SET last_message = 'Request submitted to terminal operator. We will notify you as soon as the port liaison confirms.',
        status = 'read',
        updated_at = '2026-10-03 07:42:00'
    WHERE id = 5
  `);

  // Ensure message 1 (Vanguard Global Freight Ltd)
  const existingReplies1 = await query('SELECT count(*) as cnt FROM message_replies WHERE message_id = 1');
  if (existingReplies1[0].cnt < 4) {
    await query(`
      INSERT INTO message_replies (message_id, sender_type, content, created_at)
      VALUES (1, 'user', 'Logs exported and sent to your email. Data logger indicates steady -18.2°C with zero excursion.', '2026-10-03 07:55:00')
    `);
  }

  // Ensure message 3 (Pacific Cargo Alliance)
  const existingReplies3 = await query('SELECT count(*) as cnt FROM message_replies WHERE message_id = 3');
  if (existingReplies3[0].cnt < 2) {
    await query(`
      INSERT INTO message_replies (message_id, sender_type, content, created_at)
      VALUES (3, 'user', 'Slots are currently allocated on Pacific-9. Earliest feeder departs Oct 12. Shall we reserve space on that sailing?', '2026-10-03 07:30:00')
    `);
  }

  // Check if messages 6 and 7 exist
  const allMsgs = await query('SELECT id FROM messages WHERE id IN (6, 7)');
  if (allMsgs.length === 0) {
    await query(`
      INSERT INTO messages (id, business_id, sender_name, sender_avatar, last_message, status, response_time_minutes, created_at, updated_at)
      VALUES 
      (6, 1, 'Atlantic Reefer Corp', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'Vessel turnaround is averaging 14 hours. No significant berth delays reported today.', 'read', 8, '2026-10-03 06:10:00', '2026-10-03 06:25:00'),
      (7, 1, 'Mediterranean Shippers Network', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', 'Inquiry regarding hazard classification for IMO Class 3 chemicals via Genoa.', 'unread', 15, '2026-10-03 08:05:00', '2026-10-03 08:05:00')
    `);

    await query(`
      INSERT INTO message_replies (message_id, sender_type, content, created_at)
      VALUES 
      (6, 'customer', 'Is there any port congestion update for Singapore PSA Terminal 4?', '2026-10-03 06:10:00'),
      (6, 'user', 'Vessel turnaround is averaging 14 hours. No significant berth delays reported today.', '2026-10-03 06:25:00'),
      (7, 'customer', 'Inquiry regarding hazard classification for IMO Class 3 chemicals via Genoa.', '2026-10-03 08:05:00'),
      (7, 'user', 'Dangerous goods manifest received. Port safety compliance review approved.', '2026-10-03 08:14:00')
    `);
  }

  // Clean any test reply from message 7
  await query("UPDATE messages SET last_message = 'Dangerous goods manifest received. Port safety compliance review approved.' WHERE id = 7");
  await query("UPDATE message_replies SET content = 'Dangerous goods manifest received. Port safety compliance review approved.' WHERE content LIKE '%Test automated%'");
  await query("DELETE FROM message_replies WHERE content LIKE '%Test automated%' AND id != 30");

  console.log('Seeded realistic messages and threads successfully.');
  process.exit(0);
}

seedMessages().catch((err) => {
  console.error(err);
  process.exit(1);
});
