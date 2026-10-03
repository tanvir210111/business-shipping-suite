import React from 'react';
import { Ship, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 mb-4">
        <Ship className="w-8 h-8" />
      </div>
      <span className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404</span>
      <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
        Logistics Route Not Found
      </h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The fleet destination or insights report you requested does not exist or may have been repositioned.
      </p>
      <a
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </a>
    </div>
  );
}
