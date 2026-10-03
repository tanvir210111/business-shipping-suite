import React, { useState } from 'react';
import {
  Award, TrendingUp, Users, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Compass, HelpCircle, Plus, Eye, Layers
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function Benchmarking() {
  const [activeTab, setActiveTab] = useState('comparison'); // comparison, watchlist

  const comparisonMetrics = [
    {
      metric: 'Published content',
      fleetValue: '18 posts',
      industryMedian: '14 posts',
      status: 'Higher than others',
      isHigher: true,
      fleetScore: 78,
      p25: 8,
      p50: 14,
      p75: 22
    },
    {
      metric: 'Facebook / Fleet followers',
      fleetValue: '48,240',
      industryMedian: '35,000',
      status: 'Higher than others',
      isHigher: true,
      fleetScore: 82,
      p25: 15000,
      p50: 35000,
      p75: 55000
    },
    {
      metric: 'Follows velocity',
      fleetValue: '+1,840',
      industryMedian: '+1,120',
      status: 'Higher than others',
      isHigher: true,
      fleetScore: 74,
      p25: 600,
      p50: 1120,
      p75: 1950
    },
    {
      metric: 'Content interactions',
      fleetValue: '32,900',
      industryMedian: '21,500',
      status: 'Higher than others',
      isHigher: true,
      fleetScore: 85,
      p25: 12000,
      p50: 21500,
      p75: 36000
    }
  ];

  const watchlist = [
    { name: 'Maersk Commercial Updates', followers: '840K', posts: '14 / wk', engagement: '3.8%' },
    { name: 'CMA CGM Ocean Logistics', followers: '520K', posts: '10 / wk', engagement: '3.4%' },
    { name: 'Hapag-Lloyd Fleet News', followers: '390K', posts: '8 / wk', engagement: '4.1%' },
    { name: 'MSC Cargo Direct', followers: '960K', posts: '18 / wk', engagement: '3.2%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-amber-500" />
          <h1 className="text-base font-bold text-[#050505] dark:text-white">
            Benchmarking
          </h1>
        </div>
        <p className="text-xs text-[#65676b] dark:text-slate-400">
          Compare your publishing frequency, subscriber growth, and interactions against peer commercial freight operators.
        </p>
      </div>

      {/* Tabs: Business comparison, Businesses to watch */}
      <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#e4e6eb] dark:border-[#3e4042]">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'comparison'
              ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
              : 'text-[#65676b] hover:text-[#050505]'
          }`}
        >
          Business comparison
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'watchlist'
              ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
              : 'text-[#65676b] hover:text-[#050505]'
          }`}
        >
          Businesses to watch
        </button>
      </div>

      {activeTab === 'comparison' ? (
        <div className="space-y-4">
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonMetrics.map((item) => (
              <div key={item.metric} className="mbs-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                    {item.metric}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#050505] dark:text-white">
                    {item.fleetValue}
                  </span>
                  <span className="text-xs text-[#65676b]">
                    vs {item.industryMedian} median
                  </span>
                </div>

                {/* Percentile Bar Chart (Meta Business Suite Style) */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[#65676b]">
                    <span>25th percentile</span>
                    <span>50th (Median)</span>
                    <span>75th percentile</span>
                  </div>
                  <div className="w-full bg-[#f0f2f5] dark:bg-slate-700 rounded-full h-2 relative overflow-hidden">
                    <div
                      className="bg-[#0866ff] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.fleetScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#65676b] pt-0.5">
                    <span>{formatNumber(item.p25)}</span>
                    <span className="font-semibold text-[#050505] dark:text-white">{formatNumber(item.p50)}</span>
                    <span>{formatNumber(item.p75)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Recommendation Card */}
          <div className="mbs-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/40 dark:bg-blue-900/10">
            <div>
              <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                Keep up the momentum in content interactions
              </h3>
              <p className="text-[11px] text-[#65676b] mt-0.5">
                Your business is currently in the top 15% of maritime publishers. Posting another logistics reel this week can increase engagement by another +12%.
              </p>
            </div>
            <a
              href="/content"
              className="px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
            >
              Create post
            </a>
          </div>
        </div>
      ) : (
        /* Businesses to Watch Table */
        <div className="mbs-card overflow-hidden">
          <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#050505] dark:text-white">
              Watchlist of Similar Shipping Businesses
            </h2>
            <button
              onClick={() => alert('Add Business to Watchlist dialog')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0866ff] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add business</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Business / Page</th>
                  <th className="py-2.5 px-4 text-right">Subscribers</th>
                  <th className="py-2.5 px-4 text-right">Publishing Activity</th>
                  <th className="py-2.5 px-4 text-right">Engagement Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
                {watchlist.map((w) => (
                  <tr key={w.name} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#050505] dark:text-white">
                      {w.name}
                    </td>
                    <td className="py-3 px-4 text-right text-[#050505] dark:text-white">
                      {w.followers}
                    </td>
                    <td className="py-3 px-4 text-right text-[#65676b]">
                      {w.posts}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                      {w.engagement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
