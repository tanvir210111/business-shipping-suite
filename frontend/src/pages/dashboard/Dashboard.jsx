import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, Users, Eye, Video, MousePointer,
  MessageSquare, Radio, ShieldCheck, Ship, ArrowUpRight,
  ExternalLink, BarChart3, RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export default function Dashboard() {
  const { startDate, endDate, comparisonEnabled } = useDateRange();
  const { selectedBusiness, selectedPage } = useBusiness();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams({
      startDate,
      endDate,
      businessId: selectedBusiness?.id || 1
    });
    if (selectedPage?.id) params.append('pageId', selectedPage.id);

    api.get(`/dashboard?${params.toString()}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load dashboard analytics');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate, selectedBusiness, selectedPage]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">{error}</p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const timeseries = data?.timeseries || [];
  const topContent = data?.topContent || [];
  const health = data?.systemHealth || {};

  return (
    <div className="space-y-6">
      {/* Top Banner: Fleet Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-brand-900 via-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-md border border-brand-800/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
              Fleet Operations Live
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            {selectedPage ? selectedPage.name : selectedBusiness?.name} Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time logistics analytics, audience engagement & commercial shipping performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-300 block text-[10px]">On-Time Rate</span>
            <span className="font-bold text-emerald-400">{health.onTimeRate || '99.1%'}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-300 block text-[10px]">Fleet Score</span>
            <span className="font-bold text-white">{health.fleetScore || 98.4}/100</span>
          </div>
        </div>
      </div>

      {/* 12 KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Estimated Earnings"
          value={formatCurrency(kpis.estimated_earnings?.value)}
          comparison={kpis.estimated_earnings?.comparison}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Earnings"
          value={formatCurrency(kpis.total_earnings?.value)}
          comparison={kpis.total_earnings?.comparison}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Reach"
          value={formatNumber(kpis.reach?.value)}
          comparison={kpis.reach?.comparison}
          icon={TrendingUp}
        />
        <KpiCard
          title="Impressions"
          value={formatNumber(kpis.impressions?.value)}
          comparison={kpis.impressions?.comparison}
          icon={Eye}
        />
        <KpiCard
          title="Engagement"
          value={formatNumber(kpis.engagement?.value)}
          comparison={kpis.engagement?.comparison}
          icon={BarChart3}
        />
        <KpiCard
          title="Total Followers"
          value={formatNumber(kpis.followers?.value)}
          comparison={kpis.followers?.comparison}
          icon={Users}
        />
        <KpiCard
          title="New Followers"
          value={formatNumber(kpis.new_followers?.value)}
          comparison={kpis.new_followers?.comparison}
          icon={Users}
        />
        <KpiCard
          title="Content Views"
          value={formatNumber(kpis.content_views?.value)}
          comparison={kpis.content_views?.comparison}
          icon={Eye}
        />
        <KpiCard
          title="Video Views"
          value={formatNumber(kpis.video_views?.value)}
          comparison={kpis.video_views?.comparison}
          icon={Video}
        />
        <KpiCard
          title="Link Clicks"
          value={formatNumber(kpis.link_clicks?.value)}
          comparison={kpis.link_clicks?.comparison}
          icon={MousePointer}
        />
        <KpiCard
          title="Customer Inquiries"
          value={formatNumber(kpis.messages?.value)}
          comparison={kpis.messages?.comparison}
          icon={MessageSquare}
        />
        <KpiCard
          title="Profile Visits"
          value={formatNumber(kpis.profile_visits?.value)}
          comparison={kpis.profile_visits?.comparison}
          icon={Radio}
        />
      </div>

      {/* Primary Analytics Chart: Reach & Impressions Area Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daily Reach & Impressions Trend</h2>
            <p className="text-xs text-slate-400">Time-series delivery volume across the selected timeframe</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-brand-500" />
              Reach
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-sky-300 dark:bg-sky-700" />
              Impressions
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => formatNumber(v, true)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                        <p className="font-bold text-slate-900 dark:text-white mb-1.5">{formatDate(label, true)}</p>
                        <div className="space-y-1">
                          <p className="text-brand-600 dark:text-brand-400 font-semibold">
                            Reach: {formatNumber(payload[0]?.value)}
                          </p>
                          <p className="text-sky-500 font-semibold">
                            Impressions: {formatNumber(payload[1]?.value)}
                          </p>
                          <p className="text-emerald-600 font-semibold">
                            Earnings: {formatCurrency(payload[0]?.payload?.earnings)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="reach" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#reachGrad)" />
              <Area type="monotone" dataKey="impressions" stroke="#38bdf8" strokeWidth={1.5} fillOpacity={1} fill="url(#impGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Top Performing Content & Channel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Content Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Top Performing Content</h2>
              <p className="text-xs text-slate-400">High-reach shipping updates and maritime showcases</p>
            </div>
            <a href="/content" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View all
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium pb-2">
                  <th className="pb-2">Content Title</th>
                  <th className="pb-2">Format</th>
                  <th className="pb-2 text-right">Reach</th>
                  <th className="pb-2 text-right">Views</th>
                  <th className="pb-2 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {topContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 pr-2 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.content_type}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-800 dark:text-slate-200">
                      {formatNumber(item.reach)}
                    </td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(item.views)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(item.earnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Channels Status Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Fleet Shipping Channels</h2>
            <p className="text-xs text-slate-400 mb-4">Active maritime and express air delivery profiles</p>

            <div className="space-y-3">
              {(data?.channels || []).map((ch) => (
                <div key={ch.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-300 font-bold text-xs">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{ch.name}</p>
                      <p className="text-[11px] text-slate-400">{ch.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {formatNumber(ch.followers)}
                    </span>
                    <span className="text-[10px] text-slate-400">Followers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">API Telemetry Synchronized</span>
            <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
