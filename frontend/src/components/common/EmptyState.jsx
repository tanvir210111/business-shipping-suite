import React from 'react';
import { CalendarX2, RefreshCw } from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';

export default function EmptyState({ onReset }) {
  const { selectPreset } = useDateRange();

  const handleReset = () => {
    selectPreset('last_28_days');
    if (onReset) onReset();
  };

  return (
    <div className="mbs-card p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
        <CalendarX2 className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-[#050505] dark:text-white mb-1">
        No activity during this date range
      </h3>
      <p className="text-xs text-[#65676b] dark:text-slate-400 max-w-sm mb-5 leading-normal">
        Please select a different date range to see these insights.
      </p>
      <button
        onClick={handleReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reset to Last 28 Days
      </button>
    </div>
  );
}
