import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { BarChart3, ThumbsUp, MessageCircle, Share2, MousePointer } from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function Engagement() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/engagement?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) return <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />;

  const kpis = data?.kpis || {};
  const timeseries = data?.timeseries || [];
  const interactions = data?.interactions || [];
  const engagementRate = data?.engagementRate || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">Engagement & Interaction Dynamics</h1>
        <p className="text-xs text-slate-400">Total customer interactions, link conversions, comments, and sentiment</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Interactions"
          value={formatNumber(kpis.engagement?.value)}
          comparison={kpis.engagement?.comparison}
          icon={BarChart3}
        />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Engagement Rate</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {engagementRate}%
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+1.9% vs shipping industry benchmark</span>
        </div>
        <KpiCard
          title="Link Clicks & Quotes"
          value={formatNumber(kpis.link_clicks?.value)}
          comparison={kpis.link_clicks?.comparison}
          icon={MousePointer}
        />
        <KpiCard
          title="Comments & Feedback"
          value={formatNumber(data?.summary?.total_comments)}
          comparison={{ delta: 12.4, direction: 'up', formatted: '+12.4%' }}
          icon={MessageCircle}
        />
      </div>

      {/* Interactions Stacked Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Daily Interactions Breakdown</h2>
        <p className="text-xs text-slate-400 mb-4">Likes, comments, shares, and rate clicks over time</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => formatNumber(v, true)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload, label }) => (
                  active && payload && payload.length ? (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white mb-1">{formatDate(label, true)}</p>
                      <p className="text-blue-500 font-medium">Likes: {formatNumber(payload[0]?.value)}</p>
                      <p className="text-emerald-500 font-medium">Comments: {formatNumber(payload[1]?.value)}</p>
                      <p className="text-purple-500 font-medium">Shares: {formatNumber(payload[2]?.value)}</p>
                      <p className="text-amber-500 font-medium">Clicks: {formatNumber(payload[3]?.value)}</p>
                    </div>
                  ) : null
                )}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="likes" name="Likes" fill="#3b82f6" stackId="a" />
              <Bar dataKey="comments" name="Comments" fill="#10b981" stackId="a" />
              <Bar dataKey="shares" name="Shares" fill="#8b5cf6" stackId="a" />
              <Bar dataKey="link_clicks" name="Link Clicks" fill="#f59e0b" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
