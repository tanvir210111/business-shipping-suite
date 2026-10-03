import React from 'react';
import {
  Sparkles, Users, Award, Handshake, ArrowRight, CheckCircle2,
  DollarSign, TrendingUp, ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function CreatorMarketing() {
  const partnerships = [
    {
      id: 1,
      creator: 'Captain Maritime Reviews',
      handle: '@capt_maritime',
      followers: 124000,
      niche: 'Vessel Reviews & Port Engineering',
      status: 'Active Collaboration',
      reach: 48900,
      payout: 1200
    },
    {
      id: 2,
      creator: 'Logistics Insider Hub',
      handle: '@logistics_insider',
      followers: 86500,
      niche: 'Supply Chain Optimization & Tech',
      status: 'Pending Proposal',
      reach: 32400,
      payout: 850
    },
    {
      id: 3,
      creator: 'Ocean Freight Weekly',
      handle: '@ocean_freight_wkly',
      followers: 215000,
      niche: 'Global Liner Trade & Tariffs',
      status: 'Active Collaboration',
      reach: 92400,
      payout: 2500
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Creator Marketing & Partnerships
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Collaborate with maritime influencers, industry analysts, and specialized logistics content creators.
          </p>
        </div>

        <button
          onClick={() => alert('Opening Creator Discovery marketplace')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Find Creators</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Active Partnerships</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            2 Active
          </div>
          <span className="text-[11px] text-purple-600 font-medium">1 proposal awaiting review</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Partner Reach</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            141,300
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">+24.8% organic brand lift</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Total Creator Spend</span>
          <div className="text-xl font-bold text-[#0866ff]">
            {formatCurrency(3700)}
          </div>
          <span className="text-[11px] text-[#65676b]">ROAS on partner content: 4.9x</span>
        </div>
      </div>

      {/* Creator Collaboration Table */}
      <div className="mbs-card overflow-hidden">
        <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042]">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Active Campaigns & Creators
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Creator</th>
                <th className="py-2.5 px-4">Focus Area</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Audience</th>
                <th className="py-2.5 px-4 text-right">Campaign Reach</th>
                <th className="py-2.5 px-4 text-right">Disbursement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {partnerships.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#050505] dark:text-white block">
                      {p.creator}
                    </span>
                    <span className="text-[11px] text-[#65676b]">{p.handle}</span>
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {p.niche}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.status.includes('Active')
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {formatNumber(p.followers)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">
                    {formatNumber(p.reach)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#050505] dark:text-white">
                    {formatCurrency(p.payout)}
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
