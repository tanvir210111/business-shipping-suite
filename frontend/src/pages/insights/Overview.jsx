import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Video, MessageSquare, ArrowRight, Sparkles,
  ChevronRight, Info, Eye, ThumbsUp, Radio, Film, ExternalLink,
  Plus, CheckCircle2, Megaphone, Ship
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';
import WeeklyReviewModal from '../../components/common/WeeklyReviewModal';
import EmptyState from '../../components/common/EmptyState';

export default function Overview() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness, selectedPage } = useBusiness();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [recentContent, setRecentContent] = useState([]);
  const [recentAds, setRecentAds] = useState([]);

  const fetchOverview = () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({
      startDate,
      endDate,
      businessId: selectedBusiness?.id || 1
    });
    if (selectedPage?.id) params.append('pageId', selectedPage.id);

    Promise.all([
      api.get(`/insights/overview?${params.toString()}`),
      api.get(`/content?businessId=${selectedBusiness?.id || 1}&limit=4&sortBy=date`),
      api.get(`/insights/content-ads?${params.toString()}`).catch(() => ({ data: { ads: [] } }))
    ])
      .then(([ovRes, cntRes, adsRes]) => {
        setData(ovRes.data);
        setRecentContent(cntRes.data.items || []);
        setRecentAds(adsRes.data.ads || []);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load overview insights'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, [startDate, endDate, selectedBusiness, selectedPage]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-white rounded-lg border border-[#e4e6eb]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-lg border border-[#e4e6eb]" />
          ))}
        </div>
      </div>
    );
  }

  const timeseries = data?.timeseries || [];
  if (!timeseries || timeseries.length === 0) {
    return <EmptyState onReset={fetchOverview} />;
  }

  const kpis = data?.kpis || {};
  const reachVal = kpis.reach?.value || 248912;
  const followersVal = kpis.followers?.value || 25938;
  const visitsVal = kpis.profile_visits?.value || Math.round(reachVal * 0.18);
  const interactionsVal = kpis.engagement?.value || 18490;
  const videoVal = kpis.video_views?.value || Math.round(reachVal * 0.36);
  const msgVal = kpis.messages?.value || 412;

  // Mini Chart Sparkline Component
  const Sparkline = ({ dataKey = 'reach', stroke = '#0866ff' }) => (
    <div className="h-10 w-full my-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={timeseries.slice(-14)} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.2} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={1.5}
            fill={`url(#grad-${dataKey})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* 1. "Your last week in review" Callout Banner (Matching Meta Business Suite reference) */}
      <div className="mbs-card p-4 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 dark:from-slate-800 dark:via-[#242526] dark:to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0866ff]/10 text-[#0866ff] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#050505] dark:text-white">
              Your last week in review
            </h2>
            <p className="text-[11.5px] text-[#65676b] dark:text-slate-400">
              See what worked well and what to improve across your shipping and logistics announcements.
            </p>
          </div>
        </div>
        <button
          onClick={() => setReviewOpen(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>See review</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Performance Section Header */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Performance
          </h2>
          <a
            href="/insights/results"
            className="text-xs font-semibold text-[#0866ff] hover:underline flex items-center gap-0.5"
          >
            <span>See all results</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-COLUMN COMPACT CARDS GRID (Exact Structure from Reference Section 2 & 10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* ========================================================================= */}
          {/* ROW 1 - CARD 1: Views */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              {/* Card Header with Chevron */}
              <a
                href="/insights/reach"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Views</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Metric Label + Value + Percentage */}
              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  Views <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(reachVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 14.8%
                </span>
              </div>

              {/* Mini Sparkline Graph */}
              <Sparkline dataKey="reach" stroke="#0866ff" />
            </div>

            {/* Secondary Metrics */}
            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>From followers</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(reachVal * 0.38))}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>From non-followers</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(reachVal * 0.62))}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Viewers</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(reachVal * 0.82))}</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 1 - CARD 2: Follows */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <a
                href="/insights/followers"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Follows</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  Follows <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(followersVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 8.2%
                </span>
              </div>

              <Sparkline dataKey="followers" stroke="#0866ff" />
            </div>

            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Follows</span>
                <strong className="text-emerald-600 font-bold">+1,420</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Unfollows</span>
                <strong className="text-rose-500 font-bold">-128</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Net follows</span>
                <strong className="text-[#050505] dark:text-white font-bold">+1,292</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2 - CARD 1: Visits */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <a
                href="/insights/results"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Visits</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  Fleet visits <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(visitsVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 12.4%
                </span>
              </div>

              <Sparkline dataKey="profile_visits" stroke="#0866ff" />
            </div>

            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>New visitors</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(visitsVal * 0.72))}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Returning visitors</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(visitsVal * 0.28))}</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2 - CARD 2: Interactions */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <a
                href="/insights/engagement"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Interactions</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  Content interactions <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(interactionsVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 6.9%
                </span>
              </div>

              <Sparkline dataKey="engagement" stroke="#0866ff" />
            </div>

            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>From followers</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(interactionsVal * 0.35))}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>From non-followers</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(interactionsVal * 0.65))}</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3 - CARD 1: Videos and reels */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <a
                href="/insights/video"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Videos and reels</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  3-second views <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(videoVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 18.2%
                </span>
              </div>

              <Sparkline dataKey="video_views" stroke="#0866ff" />
            </div>

            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Watch time</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(videoVal * 1.6))} mins</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>1-minute video views</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(videoVal * 0.27))}</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3 - CARD 2: Conversations */}
          {/* ========================================================================= */}
          <div className="mbs-card p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <a
                href="/insights/messages"
                className="flex items-center justify-between text-xs font-bold text-[#050505] dark:text-white group mb-1.5"
              >
                <span>Conversations</span>
                <ChevronRight className="w-4 h-4 text-[#65676b] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-400 mb-0.5">
                <span className="flex items-center gap-1">
                  Conversations started <Info className="w-3 h-3 opacity-60" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#050505] dark:text-white">
                  {formatNumber(msgVal)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                  ▲ 5.4%
                </span>
              </div>

              <Sparkline dataKey="reach" stroke="#0866ff" />
            </div>

            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>New contacts</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(Math.round(msgVal * 0.68))}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Response rate</span>
                <strong className="text-emerald-600 font-bold">98.4%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Ads Section (Matching media_1791008375741.png) */}
      <div className="mbs-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#050505] dark:text-white">
            Recent ads
          </h2>
          <a
            href="/insights/content-ads"
            className="px-2.5 py-1 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            See all ads
          </a>
        </div>

        {recentAds.length > 0 ? (
          <div className="space-y-2">
            {recentAds.slice(0, 2).map((ad) => (
              <div
                key={ad.id}
                className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-[#f7f8fa] dark:bg-slate-800/40"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#050505] dark:text-white">{ad.campaign_name || ad.title}</h4>
                  <p className="text-[11px] text-[#65676b]">Spent {formatCurrency(ad.spend)} • {formatNumber(ad.reach)} Reach • Status: {ad.status}</p>
                </div>
                <a href="/insights/content-ads" className="text-xs font-semibold text-[#0866ff] hover:underline">
                  View results
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            {/* Telescope Graphic Matching Reference Empty State */}
            <div className="w-16 h-16 mx-auto opacity-75">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#f0f4f9" />
                <path d="M30 65 L45 35 L70 45 L55 75 Z" fill="#0866ff" opacity="0.8" />
                <path d="M45 35 L40 28 L50 25 L55 32 Z" fill="#2563eb" />
                <line x1="50" y1="55" x2="35" y2="85" stroke="#0866ff" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="55" x2="65" y2="85" stroke="#0866ff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white">
              No activity during this date range
            </h3>
            <p className="text-[11px] text-[#65676b] dark:text-slate-400">
              Please select a different date range or create a cargo campaign to see these insights.
            </p>
          </div>
        )}
      </div>

      {/* 4. Recent Content Section (Matching media_1791008375690.png) */}
      <div className="mbs-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#0866ff] flex items-center justify-center text-white">
              <Ship className="w-2.5 h-2.5" />
            </div>
            <h2 className="text-xs font-bold text-[#050505] dark:text-white">
              Recent content
            </h2>
          </div>
          <a
            href="/insights/content"
            className="px-2.5 py-1 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            See all content
          </a>
        </div>

        {recentContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentContent.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] p-3 flex flex-col justify-between bg-white dark:bg-[#242526] hover:shadow-2xs transition-shadow"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0866ff] mb-1 block">
                    {c.content_type}
                  </span>
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white line-clamp-2 mb-2 leading-snug">
                    {c.title}
                  </h3>
                </div>
                <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] text-[11px] text-[#65676b] dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Reach</span>
                    <strong className="text-[#050505] dark:text-white">{formatNumber(c.reach)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Interactions</span>
                    <strong className="text-[#0866ff]">{formatNumber(c.engagement)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <div className="w-16 h-16 mx-auto opacity-75">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="#f0f4f9" />
                <path d="M30 65 L45 35 L70 45 L55 75 Z" fill="#0866ff" opacity="0.8" />
                <path d="M45 35 L40 28 L50 25 L55 32 Z" fill="#2563eb" />
                <line x1="50" y1="55" x2="35" y2="85" stroke="#0866ff" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="55" x2="65" y2="85" stroke="#0866ff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white">
              No activity during this date range
            </h3>
            <p className="text-[11px] text-[#65676b] dark:text-slate-400">
              Please select a different date range to see these insights.
            </p>
          </div>
        )}
      </div>

      {/* 5. Recommendations Section (Matching media_1791008375690.png) */}
      <div className="mbs-card p-4">
        <h2 className="text-xs font-bold text-[#050505] dark:text-white mb-3">
          Recommendations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Recommendation Card 1: Grow your reach with reels */}
          <div className="rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] overflow-hidden flex flex-col justify-between bg-white dark:bg-[#242526]">
            {/* Pastel Graphic Header */}
            <div className="h-28 bg-gradient-to-br from-cyan-100 via-sky-200 to-indigo-100 flex items-center justify-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-yellow-300 shadow-md flex items-center justify-center transform -rotate-6">
                <Film className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-400/80 shadow-xs absolute right-8 bottom-3 flex items-center justify-center transform rotate-12">
                <Radio className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                  Grow your reach with reels
                </h3>
                <p className="text-[11.5px] text-[#65676b] dark:text-slate-400 mt-1 leading-relaxed">
                  You typically post 0 reels a week. Sharing 1–3 times a week may keep your audience engaged and help grow your reach.
                </p>
              </div>
              <button
                onClick={() => alert('Create reel: Launching maritime video publisher')}
                className="w-full py-1.5 px-3 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs mt-2"
              >
                Create reel
              </button>
            </div>
          </div>

          {/* Recommendation Card 2: Keep quality in mind */}
          <div className="rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] overflow-hidden flex flex-col justify-between bg-white dark:bg-[#242526]">
            {/* Pastel Graphic Header */}
            <div className="h-28 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-full border-4 border-dashed border-rose-300 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-rose-500" />
              </div>
              <div className="absolute left-6 bottom-2 w-8 h-8 rounded-lg bg-pink-300/60 transform rotate-45" />
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                  Keep quality in mind
                </h3>
                <div className="text-[11.5px] text-[#65676b] dark:text-slate-400 mt-1 space-y-1 leading-relaxed">
                  <p>Make sure your video advisories are not muted.</p>
                  <p>Keep your reels between 15 and 90 seconds.</p>
                  <p>Ensure your footage is at least 720p resolution.</p>
                </div>
              </div>
              <button
                onClick={() => alert('Try it now: Inspecting media upload guidelines')}
                className="w-full py-1.5 px-3 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs mt-2"
              >
                Try it now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. "Your last week in review" Modal (Replicating media_1791008375761.png) */}
      <WeeklyReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        data={data}
      />
    </div>
  );
}
