# Business Shipping Suite
*Production-Quality Business Analytics & Insights Platform*

---

## Overview
**Business Shipping Suite** is a full-featured, enterprise-grade business analytics and insights platform designed specifically for commercial shipping fleets, maritime logistics operations, air cargo channels, and intermodal transport networks. 

Inspired by the visual density, information architecture, navigation patterns, and analytical workflows of modern business suites (such as Meta Business Suite Insights), it delivers a completely independent, custom-branded experience with zero proprietary dependencies.

---

## Demo Credentials
- **URL**: `http://localhost:5173/login`
- **Email**: `admin@businessshipping.com`
- **Password**: `Password123!`
*(A 1-click **Auto-fill** button is available directly on the login card).*

---

## Key Features & Screen Inventory

### 1. Authentication (`/login`)
- Dedicated, centered login card with maritime branding.
- Email & password validation, show/hide password toggle.
- Remember Me persistent sessions (30-day JWT) & password reset flow.
- Bcrypt password hashing and JWT authorization header validation.

### 2. Main Executive Dashboard (`/dashboard`)
- 12 real-time KPI cards: Estimated Earnings, Total Earnings, Total Reach, Impressions, Engagement, Total Followers, New Followers, Content Views, Video Views, Link Clicks, Customer Inquiries, Profile Visits.
- Interactive Recharts Area Timeline tracking daily reach and impressions.
- Top-performing shipping campaigns table with format pills and earnings yields.
- Live fleet channel summary with subscriber tallies.

### 3. Insights Hub (`/insights/*`)
Comprises 10 distinct, fully-interactive analytics views:
1. **Overview** (`/insights/overview`): Executive summaries, dual-axis Reach vs. Earnings trendline, and shipping benchmark comparisons.
2. **Results** (`/insights/results`): Target progress bars (Quarterly Reach, Follower milestone, Monetization objective, Inquiries SLA) and strategic milestones.
3. **Reach** (`/insights/reach`): Daily reach area chart, organic vs. promoted breakdown, and catalyst spike event logs.
4. **Engagement** (`/insights/engagement`): Engagement rate calculations and stacked interactions breakdown (likes, comments, shares, link clicks).
5. **Followers** (`/insights/followers`): Cumulative follower curve and daily new joins vs. churn stacked bars.
6. **Content Analytics** (`/insights/content`): Format efficiency matrix (Reels, Videos, Posts, Stories) and sortable performance table.
7. **Video Insights** (`/insights/video`): Total watch minutes, 3s views, 1m views, and 7-stage audience retention curve.
8. **Messages Insights** (`/insights/messages`): Response time SLA (< 15 mins), response rate %, and 24-hour inquiry heatmap.
9. **Earnings & Monetization** (`/insights/earnings`): Total & estimated revenue, channel revenue split donut chart, and payout disbursements history table.
10. **Audience Demographics** (`/insights/audience`): Geographic market bars, age & gender pyramids, and regional subscriber breakdown.

### 4. Global Date Range & Comparison System
- Presets: `Today`, `Yesterday`, `Last 7 days`, `Last 14 days`, `Last 28 days`, `Last 30 days`, `Last 90 days`, `This month`, `Last month`, `This quarter`, `Last quarter`, `This year`, `Custom Range`.
- **Previous Period Comparison**: Dynamically queries the database for the immediately preceding equivalent timespan and computes exact percentage deltas.
- **Anchor Date**: `2026-10-03` with 276 days of internally consistent daily data starting from `2026-01-01`.

### 5. Content Management Hub (`/content`, `/content/posts`, `/content/reels`, `/content/stories`, `/content/videos`)
- Filterable tabs, search input, column sorting (Reach, Views, Engagement, Earnings, Date), rows per page selection (10, 25, 50, 100), and detailed popup modal.

### 6. Customer Shipping Inquiries (`/messages`)
- Two-pane conversation view with unread badges, conversation history, and real-time response reply composer.

### 7. Reports & Real CSV Export (`/reports`)
- Report template generator with metric selection checkboxes.
- Streaming `.csv` export directly from MySQL / SQLite database rows.

### 8. Notifications & Alerts (`/notifications`)
- Full notifications management: filter by type, mark individual as read, mark all read, delete.

### 9. Settings (`/settings`)
- 4 configuration tabs: User Profile, Fleet & Regional Preferences (Currency, Timezone), Alert Subscriptions, and Password / Security.

---

## Database Architecture (19 Relational Tables)

1. `users` — Administrator & manager accounts with bcrypt hashes.
2. `businesses` — Primary fleet entities.
3. `business_users` — Role-based access control mappings.
4. `pages` — Individual shipping channels & fleet handles.
5. `daily_analytics` — 276 consecutive daily records (2026-01-01 to 2026-10-03).
6. `earnings` — Daily financial yields and monetization transactions.
7. `content` — Published shipping posts, reels, stories, and videos.
8. `content_metrics` — Per-content reach, views, watch time, and earnings.
9. `audience_metrics` — High-level subscriber growth and gender split timeline.
10. `audience_countries` — Country-level follower distribution.
11. `audience_age_groups` — Age bracket demographics.
12. `audience_gender` — Gender breakdown.
13. `platform_metrics` — Web, Mobile, and Partner API metrics.
14. `messages` — Customer inquiry conversation threads.
15. `message_replies` — Multi-turn chat replies.
16. `notifications` — Operational and monetization alerts.
17. `reports` — Saved report templates.
18. `payouts` — Monthly settlement records.
19. `settings` — User preferences, theme, and alert thresholds.

---

## Quick Start & Local Execution

### 1. Backend
```bash
cd backend
npm.cmd install
npm.cmd run seed      # Populates all 19 tables with 2026-01-01 -> 2026-10-03 historical data
npm.cmd start         # Starts backend API on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm.cmd install
npm.cmd run dev       # Starts Vite dev server on http://localhost:5173
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.
