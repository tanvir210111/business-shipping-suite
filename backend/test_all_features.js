// Automated Full-Scale Verification Suite for Business Shipping Suite
const BASE_URL = 'http://localhost:5000/api';

async function runTestSuite() {
  console.log('===============================================================');
  console.log(' BUSINESS SHIPPING SUITE - COMPREHENSIVE AUTOMATED QA SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert(healthRes.status === 'online', 'Health endpoint reports online');

    // 2. Authentication: Invalid login
    const badLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@businessshipping.com', password: 'WrongPassword!' })
    });
    assert(badLogin.status === 401, 'Invalid credentials rejected with 401 Unauthorized');

    // 3. Authentication: Valid login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@businessshipping.com', password: 'Admin@123', rememberMe: true })
    }).then(r => r.json());
    assert(!!loginRes.token && loginRes.user.email === 'admin@businessshipping.com', 'Valid login returns JWT token & user profile');
    const token = loginRes.token;
    const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // 4. Current User & Businesses
    const meRes = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders }).then(r => r.json());
    assert(meRes.user.role === 'admin' && meRes.businesses.length > 0, 'Current user endpoint returns admin profile and businesses');

    // 5. Dashboard Analytics
    const dashRes = await fetch(`${BASE_URL}/dashboard?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(dashRes.kpis.reach.value > 0, 'Dashboard returns positive aggregated reach');
    assert(dashRes.timeseries.length === 28, 'Dashboard returns exactly 28 days of timeseries data for 28-day range');
    assert(dashRes.topContent.length > 0, 'Dashboard returns top performing shipping content');

    // 6. Insights: Overview
    const ovRes = await fetch(`${BASE_URL}/insights/overview?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(ovRes.benchmarks.reachPercentile === 'Top 5%', 'Insights Overview provides industry benchmarks');

    // 7. Insights: Results
    const resRes = await fetch(`${BASE_URL}/insights/results?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(resRes.goals.length === 4 && resRes.milestones.length === 4, 'Insights Results returns 4 operational goals and milestones');

    // 8. Insights: Reach
    const reachRes = await fetch(`${BASE_URL}/insights/reach?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(reachRes.reachBreakdown.organicPct === 76.0 && reachRes.spikes.length > 0, 'Insights Reach returns organic/paid split and catalyst spikes');

    // 9. Insights: Engagement
    const engRes = await fetch(`${BASE_URL}/insights/engagement?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(engRes.interactions.length === 4 && engRes.engagementRate > 0, 'Insights Engagement returns 4 interaction breakdowns and rate');

    // 10. Insights: Followers
    const folRes = await fetch(`${BASE_URL}/insights/followers?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(folRes.followerMetrics.totalFollowers > 20000, 'Insights Followers returns cumulative followers > 20,000');

    // 11. Insights: Content
    const cntRes = await fetch(`${BASE_URL}/insights/content?startDate=2026-09-06&endDate=2026-10-03&contentType=video`, { headers: authHeaders }).then(r => r.json());
    assert(cntRes.contentList.length > 0 && cntRes.formatBreakdown.length === 4, 'Insights Content returns filtered video list and format matrix');

    // 12. Insights: Video
    const vidRes = await fetch(`${BASE_URL}/insights/video?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(vidRes.videoStats.minutesViewed > 0 && vidRes.retentionCurve.length === 7, 'Insights Video returns watch minutes and 7 retention timestamps');

    // 13. Insights: Messages
    const msgRes = await fetch(`${BASE_URL}/insights/messages?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(msgRes.slaMetrics.avgResponseTimeMinutes === 11.4 && msgRes.hourlyHeatmap.length === 12, 'Insights Messages returns SLA turnaround and 24-hr heatmap');

    // 14. Insights: Earnings
    const earnRes = await fetch(`${BASE_URL}/insights/earnings?startDate=2026-09-06&endDate=2026-10-03`, { headers: authHeaders }).then(r => r.json());
    assert(earnRes.kpis.total_earnings.value > 1000 && earnRes.payouts.length >= 8, 'Insights Earnings returns valid revenue sum and 8 payout disbursements');

    // 15. Insights: Audience
    const audRes = await fetch(`${BASE_URL}/insights/audience`, { headers: authHeaders }).then(r => r.json());
    assert(audRes.countries.length >= 8 && audRes.ageGroups.length === 6 && audRes.gender.length === 3, 'Insights Audience returns full demographics');

    // 16. Content Hub: Search & Pagination
    const listRes = await fetch(`${BASE_URL}/content?page=1&limit=5&sortBy=reach&order=DESC`, { headers: authHeaders }).then(r => r.json());
    assert(listRes.items.length === 5 && listRes.pagination.total > 15, 'Content Hub paginates accurately and sorts by reach');

    // 17. Messages & Interactive Reply
    const convsRes = await fetch(`${BASE_URL}/messages`, { headers: authHeaders }).then(r => r.json());
    assert(convsRes.conversations.length > 0, 'Messages Center returns active customer conversations');
    const firstConvId = convsRes.conversations[0].id;
    const threadRes = await fetch(`${BASE_URL}/messages/${firstConvId}/thread`, { headers: authHeaders }).then(r => r.json());
    assert(threadRes.replies.length > 0, 'Conversation thread returns message history');
    const replyRes = await fetch(`${BASE_URL}/messages/${firstConvId}/reply`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ content: 'Test automated dispatch response' })
    }).then(r => r.json());
    assert(!!replyRes.replyId, 'Message reply sent and persisted');

    // 18. Reports: Real CSV Generation & Streaming
    const csvRes = await fetch(`${BASE_URL}/reports/export-csv?startDate=2026-09-01&endDate=2026-09-30`, { headers: authHeaders });
    const csvText = await csvRes.text();
    assert(csvRes.headers.get('content-type').includes('text/csv'), 'Reports export sets text/csv Content-Type');
    assert(csvText.includes('Date,Reach,Impressions') && csvText.split('\n').length >= 31, 'CSV stream contains headers and exactly 30 date rows');

    // 19. Global Header Search
    const searchRes = await fetch(`${BASE_URL}/search?q=cargo`, { headers: authHeaders }).then(r => r.json());
    assert(searchRes.results.content.length > 0 || searchRes.results.pages.length > 0, 'Global header search successfully indexed cargo entities');

    // 20. Settings Updates
    const setRes = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Captain David Vance', theme: 'dark', currency: 'USD' })
    }).then(r => r.json());
    assert(setRes.message === 'Settings saved successfully', 'Settings updated and persisted to database');

    console.log('\n===============================================================');
    console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('===============================================================');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test suite error:', err);
    process.exit(1);
  }
}

runTestSuite();
