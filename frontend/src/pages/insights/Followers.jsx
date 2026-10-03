import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { Users, UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function Followers() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/followers?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) return <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />;

  const kpis = data?.kpis || {};
  const timeseries = data?.timeseries || [];
  const metrics = data?.followerMetrics || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">Follower Growth & Retention</h1>
        <p className="text-xs text-slate-400">Long-term subscriber acquisition and fleet retention dynamics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Followers"
          value={formatNumber(metrics.totalFollowers)}
          comparison={kpis.followers?.comparison}
          icon={Users}
        />
        <KpiCard
          title="New Followers"
          value={formatNumber(metrics.newFollowers)}
          comparison={kpis.new_followers?.comparison}
          icon={UserPlus}
        />
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Unfollows</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatNumber(metrics.unfollows)}
          </div>
          <span className="text-xs text-slate-400">Churn rate &lt; 0.8%</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">Net Subscriber Gain</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            +{formatNumber(metrics.netGrowth)}
          </div>
          <span className="text-xs text-emerald-600 font-semibold">Positive net trajectory</span>
        </div>
      </div>

      {/* Cumulative Followers Growth Curve */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Cumulative Followers Trajectory</h2>
        <p className="text-xs text-slate-400 mb-4">Total network size over time</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={['auto', 'auto']} tickFormatter={(v) => formatNumber(v, true)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload, label }) => (
                  active && payload && payload.length ? (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white mb-1">{formatDate(label, true)}</p>
                      <p className="text-brand-600 font-semibold">Total Followers: {formatNumber(payload[0]?.value)}</p>
                    </div>
                  ) : null
                )}
              />
              <Area type="monotone" dataKey="followers" stroke="#0ea5e9" strokeWidth={2.5} fill="#0ea5e9" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily New vs. Unfollows Stacked Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Daily Inflow vs. Churn</h2>
        <p className="text-xs text-slate-400 mb-4">Comparing new joins against cancellations</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="new_followers" name="New Followers" fill="#10b981" />
              <Bar dataKey="unfollows" name="Unfollows" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
