import { getAnalyticsSummary } from '../services/analyticsEngine.js';
import { query } from '../database/connection.js';

export async function getOverview(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const pageId = req.query.pageId ? parseInt(req.query.pageId, 10) : null;
    const { startDate, endDate } = req.query;

    const data = await getAnalyticsSummary({ businessId, pageId, startDate, endDate, comparison: true });

    // Growth drivers & industry benchmark metrics
    const benchmarks = {
      reachPercentile: 'Top 5%',
      engagementRateBenchmark: '4.8% (Industry Avg: 2.9%)',
      shippingFulfillmentReliability: '99.4%',
      audienceGrowthRate: '+14.2% MoM'
    };

    return res.json({
      ...data,
      benchmarks
    });
  } catch (err) {
    console.error('[Insights Overview ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve overview insights' });
  }
}

export async function getResults(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    // Target vs actual goals for Business Shipping Suite
    const goals = [
      { id: 1, title: 'Quarterly Fleet Reach Target', current: data.kpis.reach.value, target: 800000, unit: 'reach', progress: Math.min(100, Math.round((data.kpis.reach.value / 800000) * 100)) },
      { id: 2, title: 'Subscriber & Fleet Follower Milestone', current: data.kpis.followers.value, target: 50000, unit: 'followers', progress: Math.min(100, Math.round((data.kpis.followers.value / 50000) * 100)) },
      { id: 3, title: 'Revenue Monetization Objective', current: data.kpis.total_earnings.value, target: 6000, unit: 'USD', progress: Math.min(100, Math.round((data.kpis.total_earnings.value / 6000) * 100)) },
      { id: 4, title: 'Supply Chain Inquiries Handled', current: data.kpis.messages.value, target: 1200, unit: 'inquiries', progress: Math.min(100, Math.round((data.kpis.messages.value / 1200) * 100)) }
    ];

    const milestones = [
      { title: 'Passed 45,000 Verified Shipping Partners', date: '2026-09-18', status: 'completed' },
      { title: 'Reached 1,000,000 Monthly Impressions', date: '2026-08-30', status: 'completed' },
      { title: 'ACH Payout Milestone: $25,000 Cumulative 2026', date: '2026-09-15', status: 'completed' },
      { title: 'Sub-15 Minute Inquiry Response SLA Maintained', date: '2026-10-01', status: 'active' }
    ];

    return res.json({
      ...data,
      goals,
      milestones
    });
  } catch (err) {
    console.error('[Insights Results ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve results insights' });
  }
}

export async function getReach(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    // Organic vs Paid Logistics Reach breakdown
    const totalReach = data.kpis.reach.value || 1;
    const organicReach = Math.round(totalReach * 0.76);
    const paidReach = totalReach - organicReach;

    // Detect top reach spikes
    const sortedDays = [...data.timeseries].sort((a, b) => b.reach - a.reach).slice(0, 5);
    const spikes = sortedDays.map((d, idx) => ({
      date: d.date,
      reach: d.reach,
      impressions: d.impressions,
      event: idx === 0 ? 'Trans-Pacific Autonomous Alpha Voyage Milestone' : 
             idx === 1 ? 'High-Density Reefer Logistics Campaign' : 
             idx === 2 ? 'Global IMO Carbon Compliance Live Webinar' : 'Weekly Port Advisory Digest'
    }));

    return res.json({
      ...data,
      reachBreakdown: {
        total: totalReach,
        organic: organicReach,
        organicPct: 76.0,
        paid: paidReach,
        paidPct: 24.0
      },
      spikes
    });
  } catch (err) {
    console.error('[Insights Reach ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve reach insights' });
  }
}

export async function getEngagement(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    const totalImpressions = data.kpis.impressions.value || 1;
    const totalEngagement = data.kpis.engagement.value || 0;
    const engagementRate = Number(((totalEngagement / totalImpressions) * 100).toFixed(2));

    const interactions = [
      { name: 'Likes & Reactions', count: data.summary.total_likes || 0, color: '#3b82f6' },
      { name: 'Comments & Inquiries', count: data.summary.total_comments || 0, color: '#10b981' },
      { name: 'Shares & Reposts', count: data.summary.total_shares || 0, color: '#8b5cf6' },
      { name: 'Link & Rate Card Clicks', count: data.summary.total_link_clicks || 0, color: '#f59e0b' }
    ];

    return res.json({
      ...data,
      engagementRate,
      interactions
    });
  } catch (err) {
    console.error('[Insights Engagement ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve engagement insights' });
  }
}

export async function getFollowers(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    return res.json({
      ...data,
      followerMetrics: {
        totalFollowers: data.kpis.followers.value,
        newFollowers: data.kpis.new_followers.value,
        unfollows: data.summary.total_unfollows,
        netGrowth: data.kpis.new_followers.value - (data.summary.total_unfollows || 0)
      }
    });
  } catch (err) {
    console.error('[Insights Followers ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve follower insights' });
  }
}

export async function getContentInsights(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate, contentType } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    let contentSql = `
      SELECT 
        c.id, c.title, c.content_type, c.thumbnail, c.published_at,
        cm.reach, cm.impressions, cm.views, cm.likes, cm.comments, cm.shares, cm.clicks, cm.engagement, cm.earnings
      FROM content c
      JOIN content_metrics cm ON c.id = cm.content_id
      WHERE c.business_id = ?
    `;
    const params = [businessId];
    if (contentType && contentType !== 'all') {
      contentSql += ` AND c.content_type = ?`;
      params.push(contentType);
    }
    contentSql += ` ORDER BY cm.reach DESC LIMIT 20`;

    const contentList = await query(contentSql, params);

    // Format breakdown
    const formatBreakdown = [
      { format: 'Videos', count: 12, avgReach: 38500, avgEngagement: 2450 },
      { format: 'Reels', count: 8, avgReach: 41200, avgEngagement: 3100 },
      { format: 'Posts & Advisories', count: 10, avgReach: 26400, avgEngagement: 1420 },
      { format: 'Stories', count: 6, avgReach: 18200, avgEngagement: 850 }
    ];

    return res.json({
      ...data,
      contentList,
      formatBreakdown
    });
  } catch (err) {
    console.error('[Insights Content ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve content insights' });
  }
}

export async function getVideoInsights(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    const totalVideoViews = data.kpis.video_views.value || 0;
    const minutesViewed = Math.round((totalVideoViews * 115) / 60);
    const threeSecViews = Math.round(totalVideoViews * 1.25);
    const oneMinViews = Math.round(totalVideoViews * 0.42);
    const avgWatchTimeSeconds = 64;

    const retentionCurve = [
      { time: '0s', retention: 100 },
      { time: '3s', retention: 86 },
      { time: '15s', retention: 68 },
      { time: '30s', retention: 54 },
      { time: '1m', retention: 42 },
      { time: '2m', retention: 31 },
      { time: '3m', retention: 22 }
    ];

    return res.json({
      ...data,
      videoStats: {
        minutesViewed,
        threeSecViews,
        oneMinViews,
        avgWatchTimeSeconds,
        completionRate: '38.4%'
      },
      retentionCurve
    });
  } catch (err) {
    console.error('[Insights Video ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve video insights' });
  }
}

export async function getMessagesInsights(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    const slaMetrics = {
      avgResponseTimeMinutes: 11.4,
      responseRatePct: 98.6,
      resolvedWithinSlaPct: 96.2,
      totalInquiries: data.kpis.messages.value
    };

    // 24-hour inquiry distribution heatmap
    const hourlyHeatmap = [
      { hour: '00:00', volume: 14 }, { hour: '02:00', volume: 9 },
      { hour: '04:00', volume: 18 }, { hour: '06:00', volume: 42 },
      { hour: '08:00', volume: 88 }, { hour: '10:00', volume: 112 },
      { hour: '12:00', volume: 95 }, { hour: '14:00', volume: 104 },
      { hour: '16:00', volume: 82 }, { hour: '18:00', volume: 56 },
      { hour: '20:00', volume: 38 }, { hour: '22:00', volume: 24 }
    ];

    return res.json({
      ...data,
      slaMetrics,
      hourlyHeatmap
    });
  } catch (err) {
    console.error('[Insights Messages ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve messages insights' });
  }
}

export async function getEarnings(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);
    const { startDate, endDate } = req.query;
    const data = await getAnalyticsSummary({ businessId, startDate, endDate, comparison: true });

    // Platform breakdown
    const platformBreakdown = [
      { name: 'Shipping Suite Web', value: Math.round(data.kpis.total_earnings.value * 0.58), color: '#3b82f6' },
      { name: 'Mobile Fleet App', value: Math.round(data.kpis.total_earnings.value * 0.32), color: '#10b981' },
      { name: 'Partner API Stream', value: Math.round(data.kpis.total_earnings.value * 0.10), color: '#f59e0b' }
    ];

    // Payouts history
    const payouts = await query(`
      SELECT id, payout_date, amount, status, method, reference_id
      FROM payouts
      WHERE business_id = ?
      ORDER BY payout_date DESC
    `, [businessId]);

    return res.json({
      ...data,
      platformBreakdown,
      payouts
    });
  } catch (err) {
    console.error('[Insights Earnings ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve earnings insights' });
  }
}

export async function getAudience(req, res) {
  try {
    const businessId = parseInt(req.query.businessId || '1', 10);

    const countries = await query(`
      SELECT country_code, country_name, percentage, follower_count
      FROM audience_countries
      WHERE business_id = ?
      ORDER BY percentage DESC
    `, [businessId]);

    const ageGroups = await query(`
      SELECT age_bracket, male_pct, female_pct, total_pct
      FROM audience_age_groups
      WHERE business_id = ?
      ORDER BY id ASC
    `, [businessId]);

    const gender = await query(`
      SELECT gender, percentage
      FROM audience_gender
      WHERE business_id = ?
    `, [businessId]);

    const metricsRows = await query(`
      SELECT total_followers, net_growth, men_percent, women_percent
      FROM audience_metrics
      WHERE business_id = ?
      ORDER BY date DESC
      LIMIT 1
    `, [businessId]);

    return res.json({
      countries,
      ageGroups,
      gender,
      summary: metricsRows[0] || { total_followers: 48200, net_growth: 48, men_percent: 58.4, women_percent: 39.8 }
    });
  } catch (err) {
    console.error('[Insights Audience ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve audience demographics' });
  }
}
