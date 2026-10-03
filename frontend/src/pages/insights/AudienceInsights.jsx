import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { Users, Globe, UserCheck, Shield, Download, ChevronDown, Lock } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function AudienceInsights() {
  const { selectedBusiness } = useBusiness();
  const [activeTab, setActiveTab] = useState('demographics'); // demographics, trends, potential
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulatedPrivacyThreshold, setSimulatedPrivacyThreshold] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/audience?businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [selectedBusiness]);

  if (loading) return <div className="h-96 bg-white dark:bg-[#242526] rounded-xl animate-pulse" />;

  const countries = data?.countries || [];
  const ageGroups = data?.ageGroups || [];
  const summary = data?.summary || {};

  const topCities = [
    { city: 'Rotterdam, Netherlands', pct: '18.4%', count: 8870 },
    { city: 'Hamburg, Germany', pct: '14.2%', count: 6850 },
    { city: 'Singapore, Singapore', pct: '12.8%', count: 6180 },
    { city: 'Shanghai, China', pct: '11.5%', count: 5540 },
    { city: 'Houston, United States', pct: '9.8%', count: 4720 }
  ];

  const trendsData = [
    { date: 'May 2026', total: 32000, netNew: 1200 },
    { date: 'Jun 2026', total: 35400, netNew: 3400 },
    { date: 'Jul 2026', total: 39800, netNew: 4400 },
    { date: 'Aug 2026', total: 43200, netNew: 3400 },
    { date: 'Sep 2026', total: 46800, netNew: 3600 },
    { date: 'Oct 2026', total: 48240, netNew: 1440 }
  ];

  const handleExport = () => {
    const url = `/api/reports/export-csv?startDate=2026-09-06&endDate=2026-10-03&businessId=${selectedBusiness?.id || 1}&metric=audience`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-[#050505] dark:text-white">
            Audience
          </h1>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Followers, demographic profiles, geographic corridors, and growth trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy Threshold Toggle Demonstration */}
          <button
            onClick={() => setSimulatedPrivacyThreshold(!simulatedPrivacyThreshold)}
            className="px-2.5 py-1 text-[11px] font-medium rounded border border-[#ced0d4] text-[#65676b] hover:bg-slate-50 transition-colors"
            title="Toggle Meta Privacy Threshold State Demonstration"
          >
            {simulatedPrivacyThreshold ? 'Show Full Data' : 'Test Privacy Threshold'}
          </button>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs: Demographics, Trends, Potential audience */}
      <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#e4e6eb] dark:border-[#3e4042]">
        <button
          onClick={() => setActiveTab('demographics')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'demographics'
              ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
              : 'text-[#65676b] hover:text-[#050505]'
          }`}
        >
          Demographics
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'trends'
              ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
              : 'text-[#65676b] hover:text-[#050505]'
          }`}
        >
          Trends
        </button>
        <button
          onClick={() => setActiveTab('potential')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'potential'
              ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
              : 'text-[#65676b] hover:text-[#050505]'
          }`}
        >
          Potential audience
        </button>
      </div>

      {/* Privacy Threshold Empty State Condition */}
      {simulatedPrivacyThreshold ? (
        <div className="mbs-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#65676b]">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Demographic data is unavailable
          </h2>
          <p className="text-xs text-[#65676b] max-w-md mx-auto">
            To protect people’s privacy, insights on age, gender, and geographic locations are only available once your channel reaches a minimum threshold of qualifying followers.
          </p>
          <button
            onClick={() => setSimulatedPrivacyThreshold(false)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0866ff] rounded-md shadow-2xs"
          >
            Reset View
          </button>
        </div>
      ) : activeTab === 'demographics' ? (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="mbs-card p-5">
              <span className="text-xs font-semibold text-[#65676b] block mb-1">Followers (Lifetime)</span>
              <div className="text-2xl font-bold text-[#050505] dark:text-white mb-1">
                {formatNumber(summary.total_followers || 48240)}
              </div>
              <span className="text-xs text-emerald-600 font-semibold">+14.2% organic growth</span>
            </div>
            <div className="mbs-card p-5">
              <span className="text-xs font-semibold text-[#65676b] block mb-1">Gender Split</span>
              <div className="text-2xl font-bold text-[#050505] dark:text-white mb-1">
                {summary.men_percent || 72}% Men • {summary.women_percent || 28}% Women
              </div>
              <span className="text-xs text-[#65676b]">Verified freight and maritime operators</span>
            </div>
            <div className="mbs-card p-5">
              <span className="text-xs font-semibold text-[#65676b] block mb-1">Top National Corridor</span>
              <div className="text-2xl font-bold text-[#0866ff] mb-1">
                United States (38.5%)
              </div>
              <span className="text-xs text-[#65676b]">Followed by Germany and Netherlands</span>
            </div>
          </div>

          {/* Age & Gender Pyramid Chart */}
          <div className="mbs-card p-5">
            <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-1">Age & Gender Distribution (%)</h2>
            <p className="text-xs text-[#65676b] mb-4">Breakdown across demographic age brackets</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e6eb" opacity={0.6} />
                  <XAxis dataKey="age_bracket" tick={{ fontSize: 11 }} stroke="#65676b" />
                  <YAxis unit="%" tick={{ fontSize: 11 }} stroke="#65676b" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="male_pct" name="Men (%)" fill="#0866ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="female_pct" name="Women (%)" fill="#9333ea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Cities and Top Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Cities */}
            <div className="mbs-card p-5">
              <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-3">Top Port Cities</h2>
              <div className="space-y-2 text-xs">
                {topCities.map((city) => (
                  <div key={city.city} className="flex items-center justify-between py-1.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
                    <span className="font-semibold text-[#050505] dark:text-white">{city.city}</span>
                    <span className="text-[#65676b] font-medium">{city.pct} ({formatNumber(city.count)})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="mbs-card p-5">
              <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-3">Top Countries</h2>
              <div className="space-y-2 text-xs">
                {countries.slice(0, 5).map((c) => (
                  <div key={c.country_code} className="flex items-center justify-between py-1.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#65676b]">{c.country_code}</span>
                      <span className="font-semibold text-[#050505] dark:text-white">{c.country_name}</span>
                    </div>
                    <span className="text-[#0866ff] font-bold">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'trends' ? (
        /* Trends View */
        <div className="mbs-card p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#050505] dark:text-white">
              Lifetime Followers Trend (Monthly)
            </h2>
            <p className="text-xs text-[#65676b]">
              Growth trajectory over the active 2026 operating timeline
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData}>
                <defs>
                  <linearGradient id="audGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0866ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0866ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e6eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#65676b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#65676b" />
                <Tooltip formatter={(v) => [formatNumber(v), 'Subscribers']} />
                <Area type="monotone" dataKey="total" stroke="#0866ff" strokeWidth={2} fill="url(#audGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Potential Audience View */
        <div className="mbs-card p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#050505] dark:text-white">
              Estimated Potential Market Reach
            </h2>
            <p className="text-xs text-[#65676b]">
              Audience size across maritime transport, import/export cargo, and global freight forwarding
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <span className="text-xs font-semibold text-[#0866ff] block mb-1">Estimated Addressable Market</span>
            <div className="text-3xl font-bold text-[#0866ff]">
              1.8M – 2.4M people
            </div>
            <p className="text-xs text-[#65676b] mt-1">
              Active decision makers in global supply chain, port operations, and commercial freight management.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/ads"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0866ff] text-white text-xs font-semibold shadow-2xs hover:bg-[#075ce6]"
            >
              <span>Reach this audience with an ad</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
