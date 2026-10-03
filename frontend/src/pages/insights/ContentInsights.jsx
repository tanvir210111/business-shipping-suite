import React, { useState, useEffect } from 'react';
import { Layers, Film, Video, FileText, Search } from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';

export default function ContentInsights() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/content?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}&contentType=${filterType}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness, filterType]);

  if (loading) return <div className="h-96 bg-white dark:bg-[#242526] rounded-xl animate-pulse" />;

  const contentList = data?.contentList || [];
  const formatBreakdown = data?.formatBreakdown || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-[#050505] dark:text-white">Content Performance & Formats</h1>
        <p className="text-xs text-[#65676b] dark:text-slate-400">Comparing maritime video showcases, announcements, and logistics reels</p>
      </div>

      {/* Format Efficiency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formatBreakdown.map((f, i) => (
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

      {/* Filter Chips + Table */}
      <div className="mbs-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">Published Content Analytics</h2>

          <div className="flex items-center gap-1.5">
            {['all', 'video', 'reel', 'post', 'photo'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${
                  filterType === t
                    ? 'bg-[#0866ff] text-white font-semibold shadow-2xs'
                    : 'bg-[#f0f2f5] dark:bg-[#18191a] text-[#65676b] hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Published</th>
                <th className="py-2.5 px-4 text-right">Reach</th>
                <th className="py-2.5 px-4 text-right">Views</th>
                <th className="py-2.5 px-4 text-right">Engagement</th>
                <th className="py-2.5 px-4 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {contentList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#050505] dark:text-white max-w-sm truncate">
                    {item.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-[#0866ff]">
                      {item.content_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#65676b] whitespace-nowrap">{formatDate(item.published_at, true)}</td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">{formatNumber(item.reach)}</td>
                  <td className="py-3 px-4 text-right text-[#65676b]">{formatNumber(item.views)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">{formatNumber(item.engagement)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">{formatCurrency(item.earnings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
