import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  comparison,
  comparisonPeriod = 'vs previous period',
  prefix = '',
  suffix = '',
  icon: Icon,
  tooltip
}) {
  const delta = comparison?.delta || 0;
  const direction = comparison?.direction || 'none';
  const formattedDelta = comparison?.formatted || '0.0%';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate" title={tooltip || title}>
          {title}
        </span>
        {Icon && (
          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>

      <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        {prefix}{value}{suffix}
      </div>

      <div className="flex items-center gap-1.5 text-xs flex-wrap">
        {direction === 'up' && (
          <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            {formattedDelta}
          </span>
        )}
        {direction === 'down' && (
          <span className="inline-flex items-center font-semibold text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            {formattedDelta}
          </span>
        )}
        {direction === 'none' && (
          <span className="inline-flex items-center font-medium text-slate-500 dark:text-slate-400">
            <Minus className="w-3.5 h-3.5 mr-0.5" />
            0.0%
          </span>
        )}
        <span className="text-slate-500 dark:text-slate-400 truncate">
          {comparisonPeriod}
        </span>
      </div>
    </div>
  );
}
