import React from 'react';
import {
  Megaphone, Plus, Zap, BarChart2, TrendingUp, DollarSign,
  ArrowUpRight, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function Ads() {
  const adSummary = {
    spendLast28Days: 3444.75,
    reach: 264200,
    linkClicks: 15700,
    activeAdsCount: 3
  };

  const recentAds = [
    {
      id: 'AD-101',
      title: 'Trans-Atlantic Reefer Capacity Express Promotion',
      type: 'Single Image',
      status: 'Active',
      spent: 984.50,
      results: '2,940 link clicks',
      costPerResult: '$0.33 per click',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=200&fit=crop'
    },
    {
      id: 'AD-102',
      title: 'North Sea Wind Logistics Showcase Reel',
      type: 'Reel Video Ad',
      status: 'Active',
      spent: 1820.00,
      results: '4,120 link clicks',
      costPerResult: '$0.44 per click',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=300&h=200&fit=crop'
    },
    {
      id: 'AD-103',
      title: 'Automated Port Terminal API Integration',
      type: 'Carousel Ad',
      status: 'Active',
      spent: 640.25,
      results: '1,820 link clicks',
      costPerResult: '$0.35 per click',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Ads Center
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Overview of maritime advertising campaigns, automated delivery, and audience acquisition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/ads-manager"
            className="px-3.5 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            Go to Ads Manager
          </a>
          <button
            onClick={() => alert('Launching Create Ad wizard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ad</span>
          </button>
        </div>
      </div>

      {/* 28-day Summary Cards */}
      <div className="mbs-card p-5">
        <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-4">
          Last 28 days summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs text-[#65676b] block mb-1">Amount Spent</span>
            <div className="text-2xl font-bold text-[#050505] dark:text-white">
              {formatCurrency(adSummary.spendLast28Days)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">+12.5% vs previous 28 days</span>
          </div>
          <div>
            <span className="text-xs text-[#65676b] block mb-1">Total Reach</span>
            <div className="text-2xl font-bold text-[#050505] dark:text-white">
              {formatNumber(adSummary.reach)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">+18.4% vs previous 28 days</span>
          </div>
          <div>
            <span className="text-xs text-[#65676b] block mb-1">Link Clicks</span>
            <div className="text-2xl font-bold text-[#0866ff]">
              {formatNumber(adSummary.linkClicks)}
            </div>
            <span className="text-[11px] text-slate-500">Across 3 active campaigns</span>
          </div>
        </div>
      </div>

      {/* Recent Ads List */}
      <div className="mbs-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Recent Ads
          </h2>
          <a href="/ads-manager" className="text-xs font-semibold text-[#0866ff] hover:underline">
            View all ads in Ads Manager
          </a>
        </div>

        <div className="space-y-3">
          {recentAds.map((ad) => (
            <div
              key={ad.id}
              className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-16 h-12 rounded object-cover border border-[#e4e6eb] dark:border-[#3e4042]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      {ad.status}
                    </span>
                    <span className="text-[10px] text-[#65676b]">{ad.type}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white mt-0.5">
                    {ad.title}
                  </h3>
                  <span className="text-[11px] text-[#65676b]">
                    Spent: {formatCurrency(ad.spent)} • {ad.results}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-[#050505] dark:text-white block">
                    {ad.costPerResult}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Viewing analytics for ${ad.id}`)}
                  className="px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#3a3b3c]"
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
