import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { MessageSquare, Clock, CheckCircle2, Zap } from 'lucide-react';
import KpiCard from '../../components/common/KpiCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber } from '../../utils/formatters';

export default function MessagesInsights() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/insights/messages?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedBusiness]);

  if (loading) return <div className="h-96 bg-white dark:bg-[#242526] rounded-xl animate-pulse" />;

  const kpis = data?.kpis || {};
  const sla = data?.slaMetrics || {};
  const hourly = data?.hourlyHeatmap || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-[#050505] dark:text-white">Customer Support & Messaging SLA</h1>
        <p className="text-xs text-[#65676b] dark:text-slate-400">Response turnaround, query volume distribution, and SLA resolution times</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Inbound Messages"
          value={formatNumber(kpis.messages?.value)}
          comparison={kpis.messages?.comparison}
          icon={MessageSquare}
        />
        <div className="mbs-card p-5">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Average First Response</span>
          <div className="text-2xl font-bold text-emerald-600 mb-1">
            {sla.avgResponseTimeMinutes} mins
          </div>
          <span className="text-xs text-emerald-600 font-semibold">Exceeding 15-min SLA threshold</span>
        </div>
        <div className="mbs-card p-5">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">Response Rate</span>
          <div className="text-2xl font-bold text-[#050505] dark:text-white mb-1">
            {sla.responseRatePct}%
          </div>
          <span className="text-xs text-[#65676b]">Resolved inquiries</span>
        </div>
        <div className="mbs-card p-5">
          <span className="text-xs font-semibold text-[#65676b] block mb-1">On-Time Resolutions</span>
          <div className="text-2xl font-bold text-[#0866ff] mb-1">
            {sla.resolvedOnTimePct}%
          </div>
          <span className="text-xs text-emerald-600 font-semibold">Under 24-hr resolution</span>
        </div>
      </div>

      <div className="mbs-card p-5">
        <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-1">24-Hour Message Inflow Heatmap</h2>
        <p className="text-xs text-[#65676b] mb-4">Hourly message distribution volume</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e6eb" opacity={0.6} />
              <XAxis dataKey="hour_label" tick={{ fontSize: 11 }} stroke="#65676b" />
              <YAxis tick={{ fontSize: 11 }} stroke="#65676b" />
              <Tooltip />
              <Bar dataKey="message_count" name="Messages" fill="#0866ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
