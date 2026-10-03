import React, { useState } from 'react';
import {
  Activity, CheckCircle2, AlertCircle, RefreshCw, Plus,
  Shield, Server, Globe, ArrowUpRight
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function EventsManager() {
  const [events, setEvents] = useState([
    {
      name: 'CargoQuoteRequest',
      connection: 'Conversions API + Web Pixel',
      status: 'Active',
      lastReceived: '3 mins ago',
      total28Days: 14280,
      matchQuality: '9.4/10 Excellent'
    },
    {
      name: 'BillOfLadingGenerated',
      connection: 'Server-to-Server API',
      status: 'Active',
      lastReceived: '12 mins ago',
      total28Days: 3410,
      matchQuality: '9.8/10 Excellent'
    },
    {
      name: 'ContainerTracked',
      connection: 'Web Pixel',
      status: 'Active',
      lastReceived: '1 min ago',
      total28Days: 48920,
      matchQuality: '8.9/10 Good'
    },
    {
      name: 'PortArrivalAlertSubscribe',
      connection: 'Conversions API',
      status: 'Active',
      lastReceived: '28 mins ago',
      total28Days: 8410,
      matchQuality: '9.1/10 Excellent'
    }
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Events Manager
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Monitor real-time maritime booking events, Conversions API telemetry, and Pixel diagnostics.
          </p>
        </div>

        <button
          onClick={() => alert('Connect new data source wizard')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Connect Data Sources</span>
        </button>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="mbs-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#65676b]">Pixel & CAPI Status</span>
          </div>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            Operational
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">0 critical errors in 28 days</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Total Processed Events</span>
          <div className="text-xl font-bold text-[#050505] dark:text-white">
            {formatNumber(75020)}
          </div>
          <span className="text-[11px] text-[#65676b]">Last 28-day maritime logistics events</span>
        </div>

        <div className="mbs-card p-4">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Event Match Quality</span>
          <div className="text-xl font-bold text-[#0866ff]">
            9.3 / 10
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">High commercial attribution</span>
        </div>
      </div>

      {/* Events Table */}
      <div className="mbs-card overflow-hidden">
        <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042]">
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Configured Business Events
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Event Name</th>
                <th className="py-2.5 px-4">Connection Method</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Last Activity</th>
                <th className="py-2.5 px-4 text-right">28-Day Volume</th>
                <th className="py-2.5 px-4 text-right">Event Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {events.map((ev) => (
                <tr key={ev.name} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#050505] dark:text-white">
                    {ev.name}
                  </td>
                  <td className="py-3 px-4 text-[#65676b] dark:text-slate-400">
                    {ev.connection}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {ev.lastReceived}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {formatNumber(ev.total28Days)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">
                    {ev.matchQuality}
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
