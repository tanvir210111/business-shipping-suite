import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  TrendingUp, Eye, Users, MousePointer, Radio, Download,
  ChevronDown, ArrowUpRight, ArrowDownRight, Target
} from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';

export default function Results() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const busId = selectedBusiness?.id || 1;
    Promise.all([
      api.get(`/dashboard?startDate=${startDate}&endDate=${endDate}&businessId=${busId}`),
      api.get(`/insights/overview?startDate=${startDate}&endDate=${endDate}&businessId=${busId}`)
    ])
      .then(([dashRes, ovRes]) => {
        setData({
          kpis: dashRes.data.kpis || {},
          timeseries: dashRes.data.timeseries || []
        });
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) {
    return <div className="h-96 bg-white dark:bg-[#242526] rounded-xl animate-pulse" />;
  }

  const kpis = data?.kpis || {};
  const timeseries = data?.timeseries || [];

  const cards = [
    {
      title: 'Views',
      value: formatNumber(kpis.impressions?.value || 342000),
      percentage: '+14.8%',
      isPositive: true,
      dataKey: 'impressions',
      stroke: '#0866ff',
      fill: '#0866ff'
    },
    {
      title: 'Viewers',
      value: formatNumber(kpis.reach?.value || 215400),
      percentage: '+11.2%',
      isPositive: true,
      dataKey: 'reach',
      stroke: '#00a400',
      fill: '#00a400'
    },
    {
      title: 'Content interactions',
      value: formatNumber(kpis.engagement?.value || 32900),
      percentage: '+22.4%',
      isPositive: true,
      dataKey: 'engagement',
      stroke: '#9333ea',
      fill: '#9333ea'
    },
    {
      title: 'Link clicks',
      value: formatNumber(kpis.link_clicks?.value || 14820),
      percentage: '+8.6%',
      isPositive: true,
      dataKey: 'link_clicks',
      stroke: '#f59e0b',
      fill: '#f59e0b'
    },
    {
      title: 'Visits',
      value: formatNumber(kpis.profile_visits?.value || 24500),
      percentage: '+16.5%',
      isPositive: true,
      dataKey: 'profile_visits',
      stroke: '#06b6d4',
      fill: '#06b6d4'
    },
    {
      title: 'Follows',
      value: formatNumber(kpis.new_followers?.value || 1840),
      percentage: '+5.4%',
      isPositive: true,
      dataKey: 'new_followers',
      stroke: '#e11d48',
      fill: '#e11d48'
    }
  ];

  const handleExportMetric = (metric) => {
    const url = `/api/reports/export-csv?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}&metric=${metric}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-base font-bold text-[#050505] dark:text-white">
              Results
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Performance trends, views, interactions, and audience delivery across selected dates.
          </p>
        </div>

        <button
          onClick={() => handleExportMetric('all')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#65676b]" />
          <span>Export All Results</span>
        </button>
      </div>

      {/* Grid of 6 Analytics Cards (Meta Business Suite Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="mbs-card p-4 flex flex-col justify-between space-y-3">
            {/* Card Header with Export Dropdown */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#050505] dark:text-white">
                {c.title}
              </span>
              <button
                onClick={() => handleExportMetric(c.dataKey)}
                title="Export this metric"
                className="p-1 rounded text-[#65676b] hover:text-[#050505] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metric Value & Delta */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#050505] dark:text-white">
                {c.value}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {c.percentage}
              </span>
            </div>

            {/* Mini Time-series Sparkline / Chart */}
            <div className="h-28 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id={`grad-${c.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.fill} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={c.fill} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    formatter={(val) => [formatNumber(val), c.title]}
                    labelFormatter={(label) => formatDate(label)}
                    contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                  />
                  <XAxis
                    dataKey="date"
                    hide={false}
                    tickLine={false}
                    axisLine={{ stroke: '#e4e6eb' }}
                    tick={{ fontSize: 9, fill: '#8c939d' }}
                    tickFormatter={(d) => formatDate(d).split(',')[0]}
                    interval={Math.floor(timeseries.length / 4)}
                  />
                  <Area
                    type="monotone"
                    dataKey={c.dataKey}
                    stroke={c.stroke}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#grad-${c.dataKey})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
