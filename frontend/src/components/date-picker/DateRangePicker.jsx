import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';
import { formatDate } from '../../utils/formatters';

export default function DateRangePicker() {
  const {
    activePreset,
    startDate,
    endDate,
    comparisonEnabled,
    setComparisonEnabled,
    selectPreset,
    setCustomRange,
    presets
  } = useDateRange();

  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyCustom = () => {
    if (tempStart && tempEnd) {
      setCustomRange(tempStart, tempEnd);
      setIsOpen(false);
    }
  };

  const currentLabel = presets.find(p => p.id === activePreset)?.label || 'Custom range';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-2xs transition-colors"
        aria-expanded={isOpen}
      >
        <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="font-semibold text-slate-900 dark:text-white">{currentLabel}</span>
        <span className="text-slate-400 dark:text-slate-500">|</span>
        <span className="tabular-nums">{formatDate(startDate, true)} – {formatDate(endDate, true)}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[440px] max-w-[90vw] origin-top-right rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95 duration-100">
          <div className="grid grid-cols-2 gap-4">
            {/* Presets List */}
            <div className="border-r border-slate-100 dark:border-slate-800 pr-3 max-h-[300px] overflow-y-auto">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-2">
                Date Presets
              </span>
              <div className="space-y-1">
                {presets.map((p) => {
                  const isSelected = activePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectPreset(p.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{p.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Range & Comparison */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-2">
                  Custom Range
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempStart}
                      min="2026-01-01"
                      max="2026-10-03"
                      onChange={(e) => setTempStart(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempEnd}
                      min="2026-01-01"
                      max="2026-10-03"
                      onChange={(e) => setTempEnd(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Comparison Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={comparisonEnabled}
                      onChange={(e) => setComparisonEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <span className="font-medium">Compare with previous period</span>
                  </label>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-5">
                    Calculates percentage deltas against preceding {formatDate(startDate)} span.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-3 py-1.5 text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md shadow-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
