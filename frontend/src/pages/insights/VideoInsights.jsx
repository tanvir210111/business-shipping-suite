import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Video, Clock, Eye, CheckCircle2 } from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber } from '../../utils/formatters';

export default function VideoInsights() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/video?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) return <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />;

  const kpis = data?.kpis || {};
  const stats = data?.videoStats || {};
  const retentionCurve = data?.retentionCurve || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">Video Engagement & Audience Retention</h1>
        <p className="text-xs text-slate-400">Total watch minutes, 3-second previews, and audience drop-off points</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Video Views"
          value={formatNumber(kpis.video_views?.value)}
          comparison={kpis.video_views?.comparison}
          icon={Video}
        />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Total Minutes Viewed</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatNumber(stats.minutesViewed)} mins
          </div>
          <span className="text-xs text-emerald-600 font-semibold">+18.2% vs previous period</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Average Watch Time</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.avgWatchTimeSeconds} seconds
          </div>
          <span className="text-xs text-slate-400">Completion rate: {stats.completionRate}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">1-Minute Views</span>
          <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-1">
            {formatNumber(stats.oneMinViews)}
          </div>
          <span className="text-xs text-brand-600 font-semibold">High-intent viewers</span>
        </div>
      </div>

      {/* Retention Curve Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Audience Retention Curve</h2>
        <p className="text-xs text-slate-400 mb-4">Percentage of viewers watching through each benchmark timestamp</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionCurve}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis unit="%" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload, label }) => (
                  active && payload && payload.length ? (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-md border text-xs">
                      <p className="font-bold">{label}</p>
                      <p className="text-brand-600 font-semibold">{payload[0]?.value}% retained</p>
                    </div>
                  ) : null
                )}
              />
              <Area type="monotone" dataKey="retention" stroke="#0ea5e9" strokeWidth={2.5} fill="#0ea5e9" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
