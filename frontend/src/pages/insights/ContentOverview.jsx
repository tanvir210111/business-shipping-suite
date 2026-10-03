import React, { useState, useEffect } from 'react';
import {
  Layers, Film, Video, FileText, ArrowRight, Eye, ThumbsUp,
  MessageSquare, Sparkles, ChevronRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useDateRange } from '../../context/DateRangeContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';

export default function ContentOverview() {
  const { selectedBusiness } = useBusiness();
  const { startDate, endDate } = useDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const busId = selectedBusiness?.id || 1;
    Promise.all([
      api.get(`/insights/content?startDate=${startDate}&endDate=${endDate}&businessId=${busId}`),
      api.get(`/content?businessId=${busId}&limit=6&sortBy=reach`)
    ])
      .then(([insRes, cntRes]) => {
        setData({
          formatBreakdown: insRes.data.formatBreakdown || [],
          topItems: cntRes.data.items || []
        });
      })
      .finally(() => setLoading(false));
  }, [selectedBusiness, startDate, endDate]);

  if (loading) {
    return <div className="h-96 bg-white dark:bg-[#242526] rounded-xl animate-pulse" />;
  }

  const formats = data?.formatBreakdown || [];
  const topItems = data?.topItems || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-[#050505] dark:text-white">
            Content Overview
          </h1>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Insights across your maritime videos, fleet reels, and scheduled logistics updates.
          </p>
        </div>

        <a
          href="/content"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors"
        >
          <span>See all content</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Format Efficiency Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.map((f, i) => (
          <div key={i} className="mbs-card p-4 space-y-2">
            <span className="text-[11px] font-bold text-[#65676b] uppercase tracking-wider block">
              {f.format}
            </span>
            <div className="text-xl font-bold text-[#050505] dark:text-white">
              {f.count} Published
            </div>
            <div className="text-xs text-[#65676b] space-y-1 border-t border-[#e4e6eb] dark:border-[#3e4042] pt-2">
              <div className="flex justify-between">
                <span>Avg Reach:</span>
                <strong className="text-[#050505] dark:text-white">{formatNumber(f.avgReach)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Avg Engagement:</span>
                <strong className="text-[#0866ff]">{formatNumber(f.avgEngagement)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing Content Section */}
      <div className="mbs-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Top Performing Content
          </h2>
          <a href="/insights/content" className="text-xs font-semibold text-[#0866ff] hover:underline">
            View full content analytics
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] overflow-hidden flex flex-col justify-between"
            >
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0866ff] bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                    {item.content_type}
                  </span>
                  <span className="text-[11px] text-[#65676b]">{formatDate(item.created_at)}</span>
                </div>
                <h3 className="text-xs font-bold text-[#050505] dark:text-white line-clamp-2">
                  {item.title}
                </h3>
              </div>

              <div className="p-3 bg-white dark:bg-[#242526] border-t border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#65676b]">
                  <Eye className="w-3.5 h-3.5 text-[#0866ff]" />
                  <span>{formatNumber(item.reach)}</span>
                </div>
                <div className="flex items-center gap-1 text-[#65676b]">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formatNumber(item.engagement)}</span>
                </div>
                <div className="font-semibold text-emerald-600">
                  {formatCurrency(item.earnings)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
