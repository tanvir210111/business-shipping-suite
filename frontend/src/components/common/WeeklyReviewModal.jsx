import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Sparkles, TrendingUp, Users, MessageSquare, ArrowUpRight,
  Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function WeeklyReviewModal({ isOpen, onClose, data }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const kpis = data?.kpis || {};
  const reachVal = kpis.reach?.value ? Math.round(kpis.reach.value / 4) : 118450;
  const reachDelta = kpis.reach?.comparison?.formatted || '+14.2%';
  const messagesVal = kpis.messages?.value ? Math.round(kpis.messages.value / 4) : 84;
  const interactionsVal = kpis.engagement?.value ? Math.round(kpis.engagement.value / 4) : 5320;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-linear-to-r from-blue-50/60 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0866ff]/10 text-[#0866ff] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                Your last week in review
              </h2>
              <p className="text-[11px] text-[#65676b] dark:text-slate-400">
                Weekly logistics summary for Sep 26 – Oct 3, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Your Activity */}
          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400 block mb-2">
              Your activity
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
                <span className="text-base font-bold text-[#050505] dark:text-white block">4</span>
                <span className="text-[11px] text-[#65676b] dark:text-slate-400">Posts & Advisories</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
                <span className="text-base font-bold text-[#050505] dark:text-white block">2</span>
                <span className="text-[11px] text-[#65676b] dark:text-slate-400">Videos & Reels</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
                <span className="text-base font-bold text-[#050505] dark:text-white block">3</span>
                <span className="text-[11px] text-[#65676b] dark:text-slate-400">Stories</span>
              </div>
            </div>
          </div>

          {/* Section 2: Your Results */}
          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400 block mb-2">
              Your results
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0866ff]" />
                  <span className="text-xs font-medium text-[#050505] dark:text-white">Fleet Reach</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#050505] dark:text-white">{formatNumber(reachVal)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">{reachDelta}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-[#050505] dark:text-white">Content Interactions</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#050505] dark:text-white">{formatNumber(interactionsVal)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">+8.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Your Messaging Activity */}
          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400 block mb-2">
              Your messaging activity
            </span>
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-md border border-[#e4e6eb] dark:border-slate-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-medium text-[#050505] dark:text-white block">Customer Inquiries</span>
                  <span className="text-[10px] text-[#65676b] dark:text-slate-400">Response time avg: 11.4 mins</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#050505] dark:text-white">{messagesVal} messages</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); navigate('/insights/overview'); }}
            className="px-4 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            View all insights
          </button>
        </div>
      </div>
    </div>
  );
}
