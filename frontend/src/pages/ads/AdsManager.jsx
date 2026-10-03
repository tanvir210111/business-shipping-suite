import React, { useState } from 'react';
import {
  Megaphone, Plus, Search, Filter, Play, Pause, ChevronRight,
  TrendingUp, DollarSign, Eye, MousePointer, ExternalLink, BarChart2
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function AdsManager() {
  const { selectedBusiness } = useBusiness();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [campaigns, setCampaigns] = useState([
    {
      id: 'CAM-8801',
      name: 'Trans-Atlantic Reefer Capacity Showcase',
      status: 'active',
      budget: 1500,
      spent: 984.50,
      impressions: 48200,
      clicks: 2940,
      cpc: 0.33,
      conversions: 184,
      roas: 4.8
    },
    {
      id: 'CAM-8802',
      name: 'North Sea Wind Turbine Heavy-Lift Logistics',
      status: 'active',
      budget: 2400,
      spent: 1820.00,
      impressions: 74600,
      clicks: 4120,
      cpc: 0.44,
      conversions: 248,
      roas: 5.2
    },
    {
      id: 'CAM-8803',
      name: 'Asia-US West Coast Direct Liner Promotion',
      status: 'paused',
      budget: 3000,
      spent: 2980.00,
      impressions: 112000,
      clicks: 6800,
      cpc: 0.44,
      conversions: 412,
      roas: 4.1
    },
    {
      id: 'CAM-8804',
      name: 'Automated Port Terminal API Integration Campaign',
      status: 'active',
      budget: 1200,
      spent: 640.25,
      impressions: 29400,
      clicks: 1820,
      cpc: 0.35,
      conversions: 96,
      roas: 3.9
    }
  ]);

  const toggleStatus = (id) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
      }
      return c;
    }));
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Ads Manager
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Create, manage, and track commercial maritime shipping campaigns across Meta channels.
          </p>
        </div>

        <button
          onClick={() => alert('Opening Meta Ads Campaign Builder')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] dark:text-slate-400 block mb-1">Total Ad Spend</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            {formatCurrency(totalSpent)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Avg ROAS: 4.5x across active fleets</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] dark:text-slate-400 block mb-1">Total Impressions</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            {formatNumber(totalImpressions)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">+18.4% vs previous period</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] dark:text-slate-400 block mb-1">Link Clicks & Inquiries</span>
          <div className="text-xl font-bold text-[#0866ff]">
            {formatNumber(totalClicks)}
          </div>
          <span className="text-[11px] text-[#65676b]">Avg CPC: $0.39</span>
        </div>
      </div>

      {/* Campaigns Table Card */}
      <div className="mbs-card overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-3 border-b border-[#e4e6eb] dark:border-[#3e4042] flex flex-wrap items-center justify-between gap-3 bg-[#f7f8fa] dark:bg-[#242526]">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-[#3a3b3c] text-[#050505] dark:text-white shadow-2xs'
                  : 'text-[#65676b] hover:text-[#050505]'
              }`}
            >
              All Campaigns ({campaigns.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white dark:bg-[#3a3b3c] text-[#050505] dark:text-white shadow-2xs'
                  : 'text-[#65676b] hover:text-[#050505]'
              }`}
            >
              Active ({campaigns.filter(c => c.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('paused')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'paused'
                  ? 'bg-white dark:bg-[#3a3b3c] text-[#050505] dark:text-white shadow-2xs'
                  : 'text-[#65676b] hover:text-[#050505]'
              }`}
            >
              Paused ({campaigns.filter(c => c.status === 'paused').length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#65676b]" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white focus:outline-none focus:border-[#0866ff]"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Delivery</th>
                <th className="py-2.5 px-4">Campaign Name</th>
                <th className="py-2.5 px-4 text-right">Budget</th>
                <th className="py-2.5 px-4 text-right">Amount Spent</th>
                <th className="py-2.5 px-4 text-right">Impressions</th>
                <th className="py-2.5 px-4 text-right">Link Clicks</th>
                <th className="py-2.5 px-4 text-right">CPC</th>
                <th className="py-2.5 px-4 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        c.status === 'active' ? 'bg-[#0866ff]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          c.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#050505] dark:text-white block">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-[#65676b]">ID: {c.id}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {formatCurrency(c.budget)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {formatCurrency(c.spent)}
                  </td>
                  <td className="py-3 px-4 text-right text-[#050505] dark:text-white">
                    {formatNumber(c.impressions)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">
                    {formatNumber(c.clicks)}
                  </td>
                  <td className="py-3 px-4 text-right text-[#65676b]">
                    ${c.cpc}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    {c.roas}x
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
