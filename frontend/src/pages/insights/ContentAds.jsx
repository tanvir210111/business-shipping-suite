import React from 'react';
import {
  Megaphone, Plus, TrendingUp, DollarSign, Eye, MousePointer,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function ContentAds() {
  const boostedPosts = [
    {
      id: 'BOOST-101',
      title: 'Trans-Atlantic Reefer Lane Capacity Expansion Update',
      published: 'Sep 24, 2026',
      spend: 420.00,
      reach: 34100,
      clicks: 1840,
      costPerClick: '$0.23',
      status: 'Completed'
    },
    {
      id: 'BOOST-102',
      title: 'North Sea Offshore Wind Heavy-Lift Capability Demo',
      published: 'Sep 28, 2026',
      spend: 650.00,
      reach: 52400,
      clicks: 2910,
      costPerClick: '$0.22',
      status: 'Active'
    },
    {
      id: 'BOOST-103',
      title: 'Autonomous Port Crane Automation Case Study',
      published: 'Oct 1, 2026',
      spend: 300.00,
      reach: 21800,
      clicks: 1220,
      costPerClick: '$0.25',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-[#050505] dark:text-white">
            Content Ads & Boosted Posts
          </h1>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Performance of organic shipping advisories boosted to broader enterprise audiences.
          </p>
        </div>

        <a
          href="/ads"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <span>Go to Ads Center</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Boosted Content Spend</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            {formatCurrency(1370.00)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Avg CPC: $0.23</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Total Paid Reach</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            {formatNumber(108300)}
          </div>
          <span className="text-[11px] text-[#65676b]">+38% extra audience delivery</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Paid Inquiries & Clicks</span>
          <div className="text-xl font-bold text-[#0866ff]">
            {formatNumber(5970)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">High commercial intent</span>
        </div>
      </div>

      {/* Boosted Posts Table */}
      <div className="mbs-card overflow-hidden">
        <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042]">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Boosted Content Performance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Content Title</th>
                <th className="py-2.5 px-4">Date Boosted</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Spend</th>
                <th className="py-2.5 px-4 text-right">Paid Reach</th>
                <th className="py-2.5 px-4 text-right">Link Clicks</th>
                <th className="py-2.5 px-4 text-right">Cost Per Click</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {boostedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#050505] dark:text-white">
                    {post.title}
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {post.published}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      post.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {formatCurrency(post.spend)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#050505] dark:text-white">
                    {formatNumber(post.reach)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">
                    {formatNumber(post.clicks)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#050505] dark:text-white">
                    {post.costPerClick}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
