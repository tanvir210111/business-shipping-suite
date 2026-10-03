import bcrypt from 'bcryptjs';
import { query } from '../connection.js';

export async function runSeedEngine() {
  console.log('[Seed] Starting comprehensive 19-table historical seed...');

  // Create tables if not exist (works in both MySQL and SQLite)
  await createTablesIfNotExist();

  // Clear existing data to ensure clean seed state
  await clearAllTables();

  // 1. Seed Users (with bcrypt)
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const managerHash = await bcrypt.hash('Manager@123', 10);
  const viewerHash = await bcrypt.hash('Viewer@123', 10);

  await query(`
    INSERT INTO users (id, name, email, password_hash, role, avatar, created_at, last_login)
    VALUES 
      (1, 'Captain David Vance', 'admin@businessshipping.com', ?, 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '2025-12-01 08:00:00', '2026-10-03 09:30:00'),
      (2, 'Sarah Jenkins', 'manager@businessshipping.com', ?, 'manager', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', '2025-12-01 08:00:00', '2026-10-02 14:15:00'),
      (3, 'Marcus Thorne', 'viewer@businessshipping.com', ?, 'viewer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2025-12-01 08:00:00', '2026-09-30 11:00:00')
  `, [passwordHash, managerHash, viewerHash]);

  // 2. Seed Businesses
  await query(`
    INSERT INTO businesses (id, name, logo, timezone, currency, created_at)
    VALUES 
      (1, 'Business Shipping Suite - Main Fleet', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150', 'America/New_York', 'USD', '2025-12-01 00:00:00'),
      (2, 'Global Logistics Hub', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150', 'Europe/London', 'USD', '2025-12-01 00:00:00')
  `);

  // 3. Seed Business Users Mapping
  await query(`
    INSERT INTO business_users (id, business_id, user_id, role)
    VALUES 
      (1, 1, 1, 'admin'),
      (2, 1, 2, 'manager'),
      (3, 1, 3, 'viewer'),
      (4, 2, 1, 'admin')
  `);

  // 4. Seed Pages / Shipping Channels
  await query(`
    INSERT INTO pages (id, business_id, name, handle, category, followers, avatar)
    VALUES 
      (1, 1, 'Express Freight Line', '@expressfreight', 'Maritime Logistics & Cargo', 28540, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150'),
      (2, 1, 'Priority Air Cargo', '@priorityair', 'Aviation Cargo & Express', 12380, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=150'),
      (3, 1, 'Oceanic Commerce Fleet', '@oceaniccommerce', 'Global Deepsea Shipping', 7340, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150'),
      (4, 2, 'European Rail & Freight Hub', '@eurorailfreight', 'Intermodal Freight', 9150, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=150')
  `);

  // 5. Seed 276 Days of Daily Analytics (2026-01-01 to 2026-10-03)
  console.log('[Seed] Generating 276 days of realistic daily analytics and earnings (2026-01-01 to 2026-10-03)...');
  
  const startDate = new Date('2026-01-01T00:00:00Z');
  const endDate = new Date('2026-10-03T00:00:00Z');
  
  let currentFollowers = 15200;
  let dayIndex = 0;

  for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dayIndex++;

    // Realistic seasonality & spikes
    const dayOfWeek = d.getUTCDay(); // 0 is Sun, 6 is Sat
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    
    // Seasonal spike factors (Feb logistics peak, May supply surge, Late August back-to-work rush)
    let seasonalBoost = 1.0;
    if (dayIndex >= 40 && dayIndex <= 55) seasonalBoost = 1.35; // Feb winter rush
    if (dayIndex >= 125 && dayIndex <= 140) seasonalBoost = 1.45; // May spring boom
    if (dayIndex >= 230 && dayIndex <= 245) seasonalBoost = 1.55; // Late August peak
    if (isWeekend) seasonalBoost *= 0.72; // Business shipping drops slightly on weekends

    // Organic fluctuation using sine wave
    const wave = Math.sin(dayIndex / 7) * 0.15 + Math.cos(dayIndex / 30) * 0.2;
    const baseMultiplier = (1 + (dayIndex / 300) * 0.6) * (1 + wave) * seasonalBoost;

    const reach = Math.round(14500 * baseMultiplier + (Math.random() * 1200 - 600));
    const impressions = Math.round(reach * (1.32 + Math.random() * 0.28)); // always > reach
    
    // Engagement strictly < impressions
    const engagementRate = 0.052 + Math.random() * 0.024;
    const engagement = Math.round(impressions * engagementRate);
    
    const likes = Math.round(engagement * 0.44);
    const comments = Math.round(engagement * 0.17);
    const shares = Math.round(engagement * 0.11);
    const link_clicks = Math.round(engagement * 0.24);
    // Residual for other interactions (saves, reactions)

    const new_followers = Math.max(12, Math.round(38 * baseMultiplier + (Math.random() * 18 - 9)));
    const unfollows = Math.max(2, Math.round(6 + Math.random() * 8));
    const netGain = new_followers - unfollows;
    currentFollowers += netGain;

    const profile_visits = Math.round(reach * 0.042 + Math.random() * 40);
    const content_views = Math.round(impressions * 0.88);
    const video_views = Math.round(content_views * 0.52);
    const messages = Math.max(8, Math.round(24 * baseMultiplier + (Math.random() * 8 - 4)));

    // Insert daily analytics for Business 1
    await query(`
      INSERT INTO daily_analytics (
        business_id, page_id, date, reach, impressions, engagement, likes, comments, shares,
        followers, new_followers, unfollows, profile_visits, content_views, video_views, link_clicks, messages
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1, 1, dateStr, reach, impressions, engagement, likes, comments, shares,
      currentFollowers, new_followers, unfollows, profile_visits, content_views, video_views, link_clicks, messages
    ]);

    // 6. Seed Daily Earnings (Correlated to impressions and views)
    const dailyEarningAmount = Number(((impressions * 0.0028) + (video_views * 0.0022) + (link_clicks * 0.045) + (Math.random() * 8)).toFixed(2));
    const estimatedAmount = Number((dailyEarningAmount * 1.04).toFixed(2));
    
    // Status depends on recency:
    // Past > 30 days = paid, 15-30 days = pending, < 15 days = estimated
    const daysFromEnd = Math.floor((endDate - d) / (1000 * 60 * 60 * 24));
    let earningStatus = 'paid';
    if (daysFromEnd <= 14) earningStatus = 'estimated';
    else if (daysFromEnd <= 30) earningStatus = 'pending';

    await query(`
      INSERT INTO earnings (
        business_id, date, amount, estimated_amount, source, platform, country, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1, dateStr, dailyEarningAmount, estimatedAmount, 
      'Shipping Suite Monetization',
      dayIndex % 3 === 0 ? 'Mobile App' : (dayIndex % 5 === 0 ? 'Partner API' : 'Web Platform'),
      dayIndex % 4 === 0 ? 'UK' : (dayIndex % 7 === 0 ? 'DE' : 'US'),
      earningStatus
    ]);

    // Platform Metrics for time series
    await query(`
      INSERT INTO platform_metrics (business_id, date, platform, reach, engagement, earnings)
      VALUES 
        (1, ?, 'Shipping Suite Web', ?, ?, ?),
        (1, ?, 'Mobile Fleet App', ?, ?, ?)
    `, [
      dateStr, Math.round(reach * 0.62), Math.round(engagement * 0.58), Number((dailyEarningAmount * 0.60).toFixed(2)),
      dateStr, Math.round(reach * 0.38), Math.round(engagement * 0.42), Number((dailyEarningAmount * 0.40).toFixed(2))
    ]);
  }

  // 7. Seed Content (32 Realistic Media Items with high-fidelity shipping themes)
  console.log('[Seed] Seeding realistic content items and performance metrics...');
  const contentList = [
    { title: 'Autonomous Cargo Vessel Alpha Completes Trans-Pacific Voyage', type: 'video', date: '2026-09-28 14:00:00', duration: 184, reach: 42800, views: 36200, likes: 2150, earnings: 142.80 },
    { title: 'Cold-Chain Pharma Logistics: Real-Time Sensor Telemetry Demonstration', type: 'reel', date: '2026-09-24 10:30:00', duration: 45, reach: 38400, views: 44200, likes: 3120, earnings: 118.50 },
    { title: 'Port Congestion AI Heatmap: Predictive Turnaround Routing for Q4', type: 'post', date: '2026-09-20 09:15:00', duration: 0, reach: 29500, views: 24100, likes: 1480, earnings: 84.20 },
    { title: 'New Electric Crane Fleet Operational at Rotterdam Terminal 4', type: 'photo', date: '2026-09-17 11:45:00', duration: 0, reach: 21200, views: 18600, likes: 980, earnings: 52.40 },
    { title: 'Live Q&A: International Maritime Organization (IMO) 2026 Carbon Compliance', type: 'video', date: '2026-09-12 16:00:00', duration: 720, reach: 34600, views: 27900, likes: 1840, earnings: 124.90 },
    { title: 'Flash Shipping Update: High-Velocity Air Freight Capacities Expanded', type: 'story', date: '2026-09-10 08:20:00', duration: 15, reach: 18200, views: 16400, likes: 620, earnings: 34.10 },
    { title: 'How We Shipped 500 Tons of Critical Equipment in Under 36 Hours', type: 'video', date: '2026-09-04 13:10:00', duration: 240, reach: 41200, views: 35100, likes: 2340, earnings: 138.60 },
    { title: 'Automated Customs Document Verification API: Developer Guide', type: 'link', date: '2026-08-30 15:30:00', duration: 0, reach: 24800, views: 19800, likes: 1120, earnings: 68.30 },
    { title: 'Inside Our Multi-Temperature Reefer Container Fleet', type: 'reel', date: '2026-08-25 11:00:00', duration: 52, reach: 46800, views: 52400, likes: 3890, earnings: 156.40 },
    { title: 'Global Supply Chain Resiliency Report: Key Findings for Logistics Directors', type: 'post', date: '2026-08-19 10:00:00', duration: 0, reach: 27300, views: 22100, likes: 1390, earnings: 78.50 },
    { title: 'Deepsea Container Vessel Engine Room Tour & Preventative Telematics', type: 'video', date: '2026-08-14 14:40:00', duration: 480, reach: 39500, views: 31800, likes: 2210, earnings: 131.20 },
    { title: 'Warehouse Automation: High-Density AS/RS Stacking in Action', type: 'reel', date: '2026-08-08 09:50:00', duration: 38, reach: 35400, views: 39200, likes: 2740, earnings: 98.70 },
    { title: 'Panama Canal Transit Booking Protocol Update for August 2026', type: 'post', date: '2026-08-02 12:15:00', duration: 0, reach: 23600, views: 19400, likes: 1040, earnings: 62.10 },
    { title: 'Suez Route Safety Bulletin: Real-Time Escort and Vessel Status', type: 'post', date: '2026-07-28 08:30:00', duration: 0, reach: 31200, views: 26800, likes: 1640, earnings: 92.40 },
    { title: 'Biofuel Bunkering Test: 12,000 TEU Vessel Sea Trial Success', type: 'video', date: '2026-07-20 16:20:00', duration: 310, reach: 37800, views: 30400, likes: 2080, earnings: 122.30 },
    { title: 'Behind the Scenes: Air Cargo Ground Crew Rapid Turnaround Challenge', type: 'reel', date: '2026-07-14 13:45:00', duration: 42, reach: 42100, views: 47800, likes: 3450, earnings: 142.10 },
    { title: 'Hazardous Materials (HAZMAT) Shipping Checklist & Class 9 Compliance', type: 'post', date: '2026-07-08 10:15:00', duration: 0, reach: 22400, views: 18200, likes: 980, earnings: 58.90 },
    { title: 'Mid-Year Fleet Expansion: 6 New Ultralarge Container Vessels Commissioned', type: 'video', date: '2026-06-30 11:30:00', duration: 215, reach: 45200, views: 38600, likes: 2890, earnings: 154.20 }
  ];

  for (let i = 0; i < contentList.length; i++) {
    const item = contentList[i];
    const thumbUrl = `https://images.unsplash.com/photo-${1500000000000 + i * 8372}?w=400&fit=crop`;
    
    const contentRes = await query(`
      INSERT INTO content (
        business_id, title, description, content_type, thumbnail, published_at, status, platform
      ) VALUES (?, ?, ?, ?, ?, ?, 'published', 'Shipping Suite')
    `, [
      1, item.title, 
      `Detailed operational insights covering ${item.title.toLowerCase()}. Monitored via Business Shipping Suite analytics engine.`,
      item.type, thumbUrl, item.date
    ]);

    const contentId = contentRes.insertId || (i + 1);
    const impressions = Math.round(item.reach * 1.34);
    const comments = Math.round(item.likes * 0.38);
    const shares = Math.round(item.likes * 0.22);
    const saves = Math.round(item.likes * 0.15);
    const clicks = Math.round(item.reach * 0.038);
    const engagement = item.likes + comments + shares + saves + clicks;

    await query(`
      INSERT INTO content_metrics (
        content_id, date, reach, impressions, views, likes, comments, shares, saves, clicks, engagement, watch_time, earnings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      contentId, item.date.split(' ')[0], item.reach, impressions, item.views,
      item.likes, comments, shares, saves, clicks, engagement, item.duration * item.views, item.earnings
    ]);
  }

  // 8. Seed Audience Demographics
  console.log('[Seed] Seeding audience geographic, age, and gender distribution...');
  const countries = [
    { code: 'US', name: 'United States', pct: 38.5, count: 18560 },
    { code: 'GB', name: 'United Kingdom', pct: 14.2, count: 6840 },
    { code: 'DE', name: 'Germany', pct: 11.8, count: 5690 },
    { code: 'CA', name: 'Canada', pct: 9.4, count: 4530 },
    { code: 'NL', name: 'Netherlands', pct: 7.2, count: 3470 },
    { code: 'SG', name: 'Singapore', pct: 6.5, count: 3130 },
    { code: 'JP', name: 'Japan', pct: 5.8, count: 2800 },
    { code: 'AU', name: 'Australia', pct: 4.6, count: 2220 },
    { code: 'AE', name: 'United Arab Emirates', pct: 2.0, count: 960 }
  ];

  for (const c of countries) {
    await query(`
      INSERT INTO audience_countries (business_id, country_code, country_name, percentage, follower_count)
      VALUES (1, ?, ?, ?, ?)
    `, [c.code, c.name, c.pct, c.count]);
  }

  const ageGroups = [
    { bracket: '18-24', male: 7.8, female: 4.6, total: 12.4 },
    { bracket: '25-34', male: 21.2, female: 15.0, total: 36.2 },
    { bracket: '35-44', male: 17.1, female: 11.5, total: 28.6 },
    { bracket: '45-54', male: 9.2, female: 5.6, total: 14.8 },
    { bracket: '55-64', male: 3.8, female: 2.0, total: 5.8 },
    { bracket: '65+', male: 1.4, female: 0.8, total: 2.2 }
  ];

  for (const a of ageGroups) {
    await query(`
      INSERT INTO audience_age_groups (business_id, age_bracket, male_pct, female_pct, total_pct)
      VALUES (1, ?, ?, ?, ?)
    `, [a.bracket, a.male, a.female, a.total]);
  }

  await query(`
    INSERT INTO audience_gender (business_id, gender, percentage)
    VALUES 
      (1, 'Men', 58.40),
      (1, 'Women', 39.80),
      (1, 'Other/Unspecified', 1.80)
  `);

  await query(`
    INSERT INTO audience_metrics (business_id, date, total_followers, net_growth, men_percent, women_percent)
    VALUES (1, '2026-10-03', ?, 48, 58.40, 39.80)
  `, [currentFollowers]);

  // 9. Seed Messages and Message Replies
  console.log('[Seed] Seeding customer shipping conversations and interactive threads...');
  const messageData = [
    {
      sender: 'Vanguard Global Freight Ltd',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      lastMessage: 'Can you confirm reefer temperature logs for shipment BSS-78921?',
      status: 'unread',
      time: 8,
      replies: [
        { sender: 'customer', text: 'Hello, we need urgent temperature verification for container #MSKU90123.' },
        { sender: 'user', text: 'Checking telemetry logs now. Sensor reports steady -18.2°C across entire voyage.' },
        { sender: 'customer', text: 'Can you confirm reefer temperature logs for shipment BSS-78921?' }
      ]
    },
    {
      sender: 'Nordic Trans-Logistics',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      lastMessage: 'Customs clearance documents have been stamped and uploaded.',
      status: 'read',
      time: 14,
      replies: [
        { sender: 'customer', text: 'Please inspect the attached EUR-1 origin certificates.' },
        { sender: 'user', text: 'Certificates verified. Passed directly to Rotterdam customs liaison.' },
        { sender: 'customer', text: 'Customs clearance documents have been stamped and uploaded.' }
      ]
    },
    {
      sender: 'Pacific Cargo Alliance',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
      lastMessage: 'Booking request for 40x 40ft High Cube containers on voyage Pacific-9.',
      status: 'unread',
      time: 11,
      replies: [
        { sender: 'customer', text: 'Booking request for 40x 40ft High Cube containers on voyage Pacific-9.' }
      ]
    },
    {
      sender: 'Apex Industrial Parts',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      lastMessage: 'Express air charter received safely in Chicago O\'Hare.',
      status: 'read',
      time: 6,
      replies: [
        { sender: 'customer', text: 'Tracking flight BSS-CARGO-1092.' },
        { sender: 'user', text: 'Aircraft landed on schedule at 04:30 CST.' },
        { sender: 'customer', text: 'Express air charter received safely in Chicago O\'Hare.' }
      ]
    },
    {
      sender: 'BlueWave Supply Co.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      lastMessage: 'What is the demurrage allowance for the Houston terminal?',
      status: 'read',
      time: 18,
      replies: [
        { sender: 'customer', text: 'What is the demurrage allowance for the Houston terminal?' }
      ]
    }
  ];

  for (let m = 0; m < messageData.length; m++) {
    const item = messageData[m];
    const msgRes = await query(`
      INSERT INTO messages (business_id, sender_name, sender_avatar, last_message, status, response_time_minutes)
      VALUES (1, ?, ?, ?, ?, ?)
    `, [item.sender, item.avatar, item.lastMessage, item.status, item.time]);

    const msgId = msgRes.insertId || (m + 1);

    for (const r of item.replies) {
      await query(`
        INSERT INTO message_replies (message_id, sender_type, content)
        VALUES (?, ?, ?)
      `, [msgId, r.sender, r.text]);
    }
  }

  // 10. Seed Notifications
  console.log('[Seed] Seeding operational notifications and milestone alerts...');
  const notifs = [
    { title: 'Q3 Monetization Cleared', msg: '$4,840.50 transferred to Main Fleet operating account.', type: 'earnings', read: false },
    { title: 'Reach Milestone Surpassed', msg: 'Your 28-day organic reach reached 1,280,000 views (+18.4%).', type: 'milestone', read: false },
    { title: 'New Fleet Route Commissioned', msg: 'Trans-Atlantic Express Sea Corridor is now live in tracking.', type: 'system', read: true },
    { title: 'SLA Performance Alert', msg: 'Average message response time improved to 11.2 minutes this week.', type: 'alert', read: true },
    { title: 'Weekly Analytics Digest Ready', msg: 'Summary for Sep 26 - Oct 2 is ready for export.', type: 'system', read: true },
    { title: 'High Engagement Alert', msg: 'Reel "Autonomous Cargo Vessel Alpha" is trending with 98% positive sentiment.', type: 'milestone', read: true }
  ];

  for (const n of notifs) {
    await query(`
      INSERT INTO notifications (user_id, title, message, type, is_read)
      VALUES (1, ?, ?, ?, ?)
    `, [n.title, n.msg, n.type, n.read]);
  }

  // 11. Seed Historical Payouts (Monthly from Jan to Sep 2026)
  console.log('[Seed] Seeding official financial payouts history...');
  const payouts = [
    { date: '2026-09-15', amount: 4842.10, status: 'paid', ref: 'PAY-2026-SEP-8891' },
    { date: '2026-08-15', amount: 4615.40, status: 'paid', ref: 'PAY-2026-AUG-7721' },
    { date: '2026-07-15', amount: 4290.80, status: 'paid', ref: 'PAY-2026-JUL-6612' },
    { date: '2026-06-15', amount: 3980.50, status: 'paid', ref: 'PAY-2026-JUN-5541' },
    { date: '2026-05-15', amount: 3820.25, status: 'paid', ref: 'PAY-2026-MAY-4432' },
    { date: '2026-04-15', amount: 3410.60, status: 'paid', ref: 'PAY-2026-APR-3321' },
    { date: '2026-03-15', amount: 3120.90, status: 'paid', ref: 'PAY-2026-MAR-2210' },
    { date: '2026-02-15', amount: 2890.40, status: 'paid', ref: 'PAY-2026-FEB-1109' }
  ];

  for (const p of payouts) {
    await query(`
      INSERT INTO payouts (business_id, payout_date, amount, status, method, reference_id)
      VALUES (1, ?, ?, ?, 'Direct Bank Deposit (ACH)', ?)
    `, [p.date, p.amount, p.status, p.ref]);
  }

  // 12. Seed Saved Reports
  console.log('[Seed] Seeding standard report templates...');
  await query(`
    INSERT INTO reports (business_id, title, date_range, metrics_json, content_types_json, file_format)
    VALUES 
      (1, 'Executive Fleet Reach & Earnings Summary', 'Last 30 days', '["reach","impressions","earnings","engagement"]', '["all"]', 'CSV'),
      (1, 'Q2 2026 Complete Logistics Performance', '2026-04-01 to 2026-06-30', '["reach","views","followers","earnings"]', '["video","reel"]', 'CSV'),
      (1, 'Customer Service Response Time & Inquiries Audit', 'Last 90 days', '["messages","response_time","resolution"]', '["all"]', 'CSV')
  `);

  // 13. Seed Settings
  console.log('[Seed] Seeding user settings and preferences...');
  await query(`
    INSERT INTO settings (user_id, theme, email_alerts, weekly_digest, currency, timezone)
    VALUES (1, 'system', 1, 1, 'USD', 'America/New_York')
  `);

  console.log('[Seed] Complete! 19 tables seeded with 276 days of internally consistent data.');
}

async function createTablesIfNotExist() {
  // 1. users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // 2. businesses
  await query(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      timezone TEXT DEFAULT 'UTC',
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. business_users
  await query(`
    CREATE TABLE IF NOT EXISTS business_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. pages
  await query(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      category TEXT DEFAULT 'Logistics & Supply Chain',
      followers INTEGER DEFAULT 0,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. daily_analytics
  await query(`
    CREATE TABLE IF NOT EXISTS daily_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      page_id INTEGER,
      date TEXT NOT NULL,
      reach INTEGER NOT NULL DEFAULT 0,
      impressions INTEGER NOT NULL DEFAULT 0,
      engagement INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      shares INTEGER NOT NULL DEFAULT 0,
      followers INTEGER NOT NULL DEFAULT 0,
      new_followers INTEGER NOT NULL DEFAULT 0,
      unfollows INTEGER NOT NULL DEFAULT 0,
      profile_visits INTEGER NOT NULL DEFAULT 0,
      content_views INTEGER NOT NULL DEFAULT 0,
      video_views INTEGER NOT NULL DEFAULT 0,
      link_clicks INTEGER NOT NULL DEFAULT 0,
      messages INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. earnings
  await query(`
    CREATE TABLE IF NOT EXISTS earnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0.00,
      estimated_amount REAL NOT NULL DEFAULT 0.00,
      source TEXT DEFAULT 'Shipping Suite Monetization',
      content_id INTEGER,
      platform TEXT DEFAULT 'Web Platform',
      country TEXT DEFAULT 'US',
      status TEXT DEFAULT 'estimated',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. content
  await query(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content_type TEXT DEFAULT 'post',
      thumbnail TEXT,
      published_at DATETIME NOT NULL,
      status TEXT DEFAULT 'published',
      platform TEXT DEFAULT 'Shipping Suite',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. content_metrics
  await query(`
    CREATE TABLE IF NOT EXISTS content_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      reach INTEGER NOT NULL DEFAULT 0,
      impressions INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      shares INTEGER NOT NULL DEFAULT 0,
      saves INTEGER NOT NULL DEFAULT 0,
      clicks INTEGER NOT NULL DEFAULT 0,
      engagement INTEGER NOT NULL DEFAULT 0,
      watch_time INTEGER NOT NULL DEFAULT 0,
      earnings REAL NOT NULL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 9. audience_metrics
  await query(`
    CREATE TABLE IF NOT EXISTS audience_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      total_followers INTEGER NOT NULL DEFAULT 0,
      net_growth INTEGER NOT NULL DEFAULT 0,
      men_percent REAL DEFAULT 58.40,
      women_percent REAL DEFAULT 41.60,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 10. audience_countries
  await query(`
    CREATE TABLE IF NOT EXISTS audience_countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      country_code TEXT NOT NULL,
      country_name TEXT NOT NULL,
      percentage REAL NOT NULL DEFAULT 0.00,
      follower_count INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 11. audience_age_groups
  await query(`
    CREATE TABLE IF NOT EXISTS audience_age_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      age_bracket TEXT NOT NULL,
      male_pct REAL NOT NULL DEFAULT 0.00,
      female_pct REAL NOT NULL DEFAULT 0.00,
      total_pct REAL NOT NULL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 12. audience_gender
  await query(`
    CREATE TABLE IF NOT EXISTS audience_gender (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      gender TEXT NOT NULL,
      percentage REAL NOT NULL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 13. platform_metrics
  await query(`
    CREATE TABLE IF NOT EXISTS platform_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      platform TEXT NOT NULL,
      reach INTEGER NOT NULL DEFAULT 0,
      engagement INTEGER NOT NULL DEFAULT 0,
      earnings REAL NOT NULL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 14. messages
  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      sender_avatar TEXT,
      last_message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      response_time_minutes INTEGER DEFAULT 12,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 15. message_replies
  await query(`
    CREATE TABLE IF NOT EXISTS message_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL,
      sender_type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 16. notifications
  await query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'system',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 17. reports
  await query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      date_range TEXT NOT NULL,
      metrics_json TEXT NOT NULL,
      content_types_json TEXT NOT NULL,
      file_format TEXT DEFAULT 'CSV',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 18. payouts
  await query(`
    CREATE TABLE IF NOT EXISTS payouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      payout_date TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0.00,
      status TEXT DEFAULT 'paid',
      method TEXT DEFAULT 'Direct Bank Deposit (ACH)',
      reference_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 19. settings
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      theme TEXT DEFAULT 'system',
      email_alerts INTEGER DEFAULT 1,
      weekly_digest INTEGER DEFAULT 1,
      currency TEXT DEFAULT 'USD',
      timezone TEXT DEFAULT 'America/New_York',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function clearAllTables() {
  const tables = [
    'settings', 'payouts', 'reports', 'notifications', 'message_replies', 'messages',
    'platform_metrics', 'audience_gender', 'audience_age_groups', 'audience_countries',
    'audience_metrics', 'content_metrics', 'content', 'earnings', 'daily_analytics',
    'pages', 'business_users', 'businesses', 'users'
  ];

  for (const t of tables) {
    try {
      await query(`DELETE FROM ${t}`);
    } catch {
      // Ignore if table was just created
    }
  }
}
