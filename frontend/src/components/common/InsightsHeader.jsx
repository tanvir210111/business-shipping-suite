import React, { useState } from 'react';
import { Download, CheckSquare, ChevronDown, Info, Ship, X, ChevronRight } from 'lucide-react';
import DateRangePicker from '../date-picker/DateRangePicker';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useDateRange } from '../../context/DateRangeContext';

export default function InsightsHeader({ title = 'Insights', subtitle = 'Review performance results and more.' }) {
  const { user } = useAuth();
  const { selectedBusiness, selectedPage } = useBusiness();
  const { startDate, endDate } = useDateRange();
  const [todosOpen, setTodosOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleExport = () => {
    const url = `/api/reports/export-csv?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-[#242526] border-b border-[#e4e6eb] dark:border-[#3e4042]">
      {/* Top Global Terms Banner (Replicating exact Meta Business Suite reference banner) */}
      {!bannerDismissed && (
        <div className="bg-[#f0f2f5] dark:bg-slate-800/80 border-b border-[#e4e6eb] dark:border-[#3e4042] px-6 py-2 flex items-center justify-between text-[11px] text-[#65676b] dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#65676b] shrink-0" />
            <span>
              <strong>We're updating our terms, effective October 30, 2026.</strong> We're updating our Commercial Terms, Product Catalog Terms, and Generative AI Terms.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Terms preview: Reviewing updated 2026 commercial freight agreements')}
              className="text-[#0866ff] font-semibold hover:underline"
            >
              Preview terms
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Title & Subtitle */}
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#050505] dark:text-white leading-tight">
            {title}
          </h1>
          <p className="text-[11.5px] text-[#65676b] dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Right Controls: Channel selector, Export Data, Date selector, To-dos, Avatar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Channel Selector Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-[12px] font-medium text-[#050505] dark:text-white shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-[#0866ff] flex items-center justify-center text-white text-[9px] font-bold">
              <Ship className="w-2.5 h-2.5" />
            </div>
            <span className="max-w-[130px] truncate">
              {selectedPage ? selectedPage.name : (selectedBusiness?.name || 'Main Fleet')}
            </span>
            <ChevronDown className="w-3 h-3 text-[#65676b]" />
          </div>

          {/* Export Data Button */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-[12px] font-medium text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#65676b]" />
            <span>Export Data</span>
            <ChevronDown className="w-3 h-3 text-[#65676b]" />
          </button>

          {/* Compact Date Range Selector */}
          <DateRangePicker />

          {/* To-dos Button */}
          <div className="relative">
            <button
              onClick={() => setTodosOpen(!todosOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-[12px] font-medium text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors shadow-2xs"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#0866ff]" />
              <span>To-dos</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {todosOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-[#e4e6eb] dark:border-[#3e4042] p-3 z-50 animate-in fade-in duration-100">
                <span className="text-xs font-bold text-[#050505] dark:text-white block mb-2">
                  Action Items
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <span className="text-[#050505] dark:text-white">Review 2 pending container clearance inquiries</span>
                  </div>
                  <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <span className="text-[#050505] dark:text-white">Verify Q3 ACH disbursement status</span>
                  </div>
                  <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <span className="text-[#050505] dark:text-white">Review weekly performance digest</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#e4e6eb] dark:ring-slate-700 ml-1 shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
