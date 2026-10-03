import { query } from '../database/connection.js';

/**
 * Normalizes start and end dates with safe fallbacks
 */
export function resolveDateRange(startDate, endDate) {
  // Current app anchor date: 2026-10-03
  const DEFAULT_END = '2026-10-03';
  const DEFAULT_START = '2026-09-06'; // 28 days

  const end = endDate && !isNaN(Date.parse(endDate)) ? endDate : DEFAULT_END;
  const start = startDate && !isNaN(Date.parse(startDate)) ? startDate : DEFAULT_START;

  // Calculate previous period
  const endD = new Date(end + 'T00:00:00Z');
  const startD = new Date(start + 'T00:00:00Z');
  const diffTime = Math.abs(endD - startD);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const prevEndD = new Date(startD);
  prevEndD.setUTCDate(prevEndD.getUTCDate() - 1);

  const prevStartD = new Date(prevEndD);
  prevStartD.setUTCDate(prevStartD.getUTCDate() - (diffDays - 1));

  const prevStart = prevStartD.toISOString().split('T')[0];
  const prevEnd = prevEndD.toISOString().split('T')[0];

  return {
    current: { start, end, days: diffDays },
    previous: { start: prevStart, end: prevEnd, days: diffDays }
  };
}

/**
 * Calculates percentage delta safely
 */
export function calculateDelta(currentVal, previousVal) {
  const curr = Number(currentVal) || 0;
  const prev = Number(previousVal) || 0;

  if (prev === 0) {
    if (curr === 0) return { delta: 0, direction: 'none', formatted: '0.0%' };
    return { delta: 100, direction: 'up', formatted: '+100.0%' };
  }

  const delta = ((curr - prev) / prev) * 100;
  const rounded = Number(delta.toFixed(1));
  
  if (rounded > 0) return { delta: rounded, direction: 'up', formatted: `+${rounded}%` };
  if (rounded < 0) return { delta: Math.abs(rounded), direction: 'down', formatted: `${rounded}%` };
  return { delta: 0, direction: 'none', formatted: '0.0%' };
}

/**
 * Core Analytics Aggregator Engine
 */
export async function getAnalyticsSummary({ businessId = 1, pageId = null, startDate, endDate, comparison = true }) {
  const dates = resolveDateRange(startDate, endDate);

  // 1. Query Current Period Daily Analytics
  let currentSql = `
    SELECT 
      COALESCE(SUM(reach), 0) AS total_reach,
      COALESCE(SUM(impressions), 0) AS total_impressions,
      COALESCE(SUM(engagement), 0) AS total_engagement,
      COALESCE(SUM(likes), 0) AS total_likes,
      COALESCE(SUM(comments), 0) AS total_comments,
      COALESCE(SUM(shares), 0) AS total_shares,
      COALESCE(SUM(new_followers), 0) AS total_new_followers,
      COALESCE(SUM(unfollows), 0) AS total_unfollows,
      COALESCE(SUM(profile_visits), 0) AS total_profile_visits,
      COALESCE(SUM(content_views), 0) AS total_content_views,
      COALESCE(SUM(video_views), 0) AS total_video_views,
      COALESCE(SUM(link_clicks), 0) AS total_link_clicks,
      COALESCE(SUM(messages), 0) AS total_messages,
      COALESCE(MAX(followers), 0) AS latest_followers
    FROM daily_analytics
    WHERE business_id = ? AND date BETWEEN ? AND ?
  `;
  const currentParams = [businessId, dates.current.start, dates.current.end];
  if (pageId) {
    currentSql += ` AND page_id = ?`;
    currentParams.push(pageId);
  }
  const currentSummaryRows = await query(currentSql, currentParams);
  const currentSummary = currentSummaryRows[0] || {};

  // 2. Query Current Earnings
  const currentEarningsSql = `
    SELECT 
      COALESCE(SUM(amount), 0) AS total_earnings,
      COALESCE(SUM(estimated_amount), 0) AS estimated_earnings,
      COALESCE(AVG(amount), 0) AS daily_avg_earnings
    FROM earnings
    WHERE business_id = ? AND date BETWEEN ? AND ?
  `;
  const currentEarningsRows = await query(currentEarningsSql, [businessId, dates.current.start, dates.current.end]);
  const currentEarnings = currentEarningsRows[0] || {};

  // 3. Query Previous Period
  let prevSummary = {};
  let prevEarnings = {};

  if (comparison) {
    let prevSql = `
      SELECT 
        COALESCE(SUM(reach), 0) AS total_reach,
        COALESCE(SUM(impressions), 0) AS total_impressions,
        COALESCE(SUM(engagement), 0) AS total_engagement,
        COALESCE(SUM(likes), 0) AS total_likes,
        COALESCE(SUM(comments), 0) AS total_comments,
        COALESCE(SUM(shares), 0) AS total_shares,
        COALESCE(SUM(new_followers), 0) AS total_new_followers,
        COALESCE(SUM(unfollows), 0) AS total_unfollows,
        COALESCE(SUM(profile_visits), 0) AS total_profile_visits,
        COALESCE(SUM(content_views), 0) AS total_content_views,
        COALESCE(SUM(video_views), 0) AS total_video_views,
        COALESCE(SUM(link_clicks), 0) AS total_link_clicks,
        COALESCE(SUM(messages), 0) AS total_messages,
        COALESCE(MAX(followers), 0) AS latest_followers
      FROM daily_analytics
      WHERE business_id = ? AND date BETWEEN ? AND ?
    `;
    const prevParams = [businessId, dates.previous.start, dates.previous.end];
    if (pageId) {
      prevSql += ` AND page_id = ?`;
      prevParams.push(pageId);
    }
    const prevSummaryRows = await query(prevSql, prevParams);
    prevSummary = prevSummaryRows[0] || {};

    const prevEarningsRows = await query(currentEarningsSql, [businessId, dates.previous.start, dates.previous.end]);
    prevEarnings = prevEarningsRows[0] || {};
  }

  // 4. Query Timeseries for Charts
  let tsSql = `
    SELECT 
      da.date,
      da.reach,
      da.impressions,
      da.engagement,
      da.likes,
      da.comments,
      da.shares,
      da.followers,
      da.new_followers,
      da.unfollows,
      da.video_views,
      da.link_clicks,
      COALESCE(e.amount, 0) AS earnings
    FROM daily_analytics da
    LEFT JOIN earnings e ON da.business_id = e.business_id AND da.date = e.date
    WHERE da.business_id = ? AND da.date BETWEEN ? AND ?
  `;
  const tsParams = [businessId, dates.current.start, dates.current.end];
  if (pageId) {
    tsSql += ` AND da.page_id = ?`;
    tsParams.push(pageId);
  }
  tsSql += ` ORDER BY da.date ASC`;
  const timeseries = await query(tsSql, tsParams);

  // 5. Build Comparative KPI Indicators
  const kpis = {
    estimated_earnings: {
      value: Number(currentEarnings.estimated_earnings || 0),
      previousValue: Number(prevEarnings.estimated_earnings || 0),
      comparison: calculateDelta(currentEarnings.estimated_earnings, prevEarnings.estimated_earnings)
    },
    total_earnings: {
      value: Number(currentEarnings.total_earnings || 0),
      previousValue: Number(prevEarnings.total_earnings || 0),
      comparison: calculateDelta(currentEarnings.total_earnings, prevEarnings.total_earnings)
    },
    reach: {
      value: Number(currentSummary.total_reach || 0),
      previousValue: Number(prevSummary.total_reach || 0),
      comparison: calculateDelta(currentSummary.total_reach, prevSummary.total_reach)
    },
    impressions: {
      value: Number(currentSummary.total_impressions || 0),
      previousValue: Number(prevSummary.total_impressions || 0),
      comparison: calculateDelta(currentSummary.total_impressions, prevSummary.total_impressions)
    },
    engagement: {
      value: Number(currentSummary.total_engagement || 0),
      previousValue: Number(prevSummary.total_engagement || 0),
      comparison: calculateDelta(currentSummary.total_engagement, prevSummary.total_engagement)
    },
    followers: {
      value: Number(currentSummary.latest_followers || 0),
      previousValue: Number(prevSummary.latest_followers || 0),
      comparison: calculateDelta(currentSummary.latest_followers, prevSummary.latest_followers)
    },
    new_followers: {
      value: Number(currentSummary.total_new_followers || 0),
      previousValue: Number(prevSummary.total_new_followers || 0),
      comparison: calculateDelta(currentSummary.total_new_followers, prevSummary.total_new_followers)
    },
    content_views: {
      value: Number(currentSummary.total_content_views || 0),
      previousValue: Number(prevSummary.total_content_views || 0),
      comparison: calculateDelta(currentSummary.total_content_views, prevSummary.total_content_views)
    },
    video_views: {
      value: Number(currentSummary.total_video_views || 0),
      previousValue: Number(prevSummary.total_video_views || 0),
      comparison: calculateDelta(currentSummary.total_video_views, prevSummary.total_video_views)
    },
    link_clicks: {
      value: Number(currentSummary.total_link_clicks || 0),
      previousValue: Number(prevSummary.total_link_clicks || 0),
      comparison: calculateDelta(currentSummary.total_link_clicks, prevSummary.total_link_clicks)
    },
    messages: {
      value: Number(currentSummary.total_messages || 0),
      previousValue: Number(prevSummary.total_messages || 0),
      comparison: calculateDelta(currentSummary.total_messages, prevSummary.total_messages)
    },
    profile_visits: {
      value: Number(currentSummary.total_profile_visits || 0),
      previousValue: Number(prevSummary.total_profile_visits || 0),
      comparison: calculateDelta(currentSummary.total_profile_visits, prevSummary.total_profile_visits)
    }
  };

  return {
    dates,
    kpis,
    timeseries,
    summary: {
      ...currentSummary,
      ...currentEarnings
    }
  };
}
