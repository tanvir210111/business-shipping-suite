import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { TrendingUp, Radio, Flame, Sparkles } from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function Reach() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/reach?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) return <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />;

  const kpis = data?.kpis || {};
  const timeseries = data?.timeseries || [];
  const reachBreakdown = data?.reachBreakdown || {};
  const spikes = data?.spikes || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Reach & Impression Velocity</h1>
          <p className="text-xs text-slate-400">Total unique supply chain stakeholders exposed to fleet announcements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Reach"
          value={formatNumber(kpis.reach?.value)}
          comparison={kpis.reach?.comparison}
          icon={TrendingUp}
        />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Organic Fleet Reach</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatNumber(reachBreakdown.organic)}
          </div>
          <span className="text-xs text-emerald-600 font-semibold">{reachBreakdown.organicPct}% of total volume</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Promoted Logistics Reach</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatNumber(reachBreakdown.paid)}
          </div>
          <span className="text-xs text-brand-600 font-semibold">{reachBreakdown.paidPct}% of total volume</span>
        </div>
      </div>

      {/* Daily Reach Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Daily Reach Trendline</h2>
        <p className="text-xs text-slate-400 mb-4">Volume curve across active shipping period</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => formatNumber(v, true)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload, label }) => (
                  active && payload && payload.length ? (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white mb-1">{formatDate(label, true)}</p>
                      <p className="text-brand-600 font-semibold">Reach: {formatNumber(payload[0]?.value)}</p>
                    </div>
                  ) : null
                )}
              />
              <Area type="monotone" dataKey="reach" stroke="#0ea5e9" strokeWidth={2.5} fill="#0ea5e9" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Reach Spikes Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Reach Spikes & Catalyst Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium pb-2">
                <th className="pb-2">Date</th>
                <th className="pb-2">Trigger Event / Campaign</th>
                <th className="pb-2 text-right">Daily Reach</th>
                <th className="pb-2 text-right">Impressions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {spikes.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{formatDate(s.date, true)}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{s.event}</td>
                  <td className="py-2.5 text-right font-bold text-brand-600 dark:text-brand-400">{formatNumber(s.reach)}</td>
                  <td className="py-2.5 text-right text-slate-500">{formatNumber(s.impressions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
