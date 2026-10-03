import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Plus, Check, Calendar, ArrowDownToLine, X, CheckCircle2
} from 'lucide-react';
import { useDateRange } from '../../context/DateRangeContext';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function Reports() {
  const { startDate, endDate } = useDateRange();
  const { selectedBusiness } = useBusiness();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState(['reach', 'impressions', 'earnings']);
  const [generating, setGenerating] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    api.get(`/reports?businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setReports(res.data.reports || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [selectedBusiness]);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setGenerating(true);
    api.post('/reports/generate', {
      businessId: selectedBusiness?.id || 1,
      title: title.trim(),
      dateRange: `${startDate} to ${endDate}`,
      metrics: selectedMetrics,
      contentTypes: ['all']
    })
      .then(() => {
        setModalOpen(false);
        setTitle('');
        fetchReports();
      })
      .finally(() => setGenerating(false));
  };

  const handleExportCsv = (reportTitle = 'Current Period') => {
    const url = `/api/reports/export-csv?startDate=${startDate}&endDate=${endDate}&businessId=${selectedBusiness?.id || 1}`;
    window.open(url, '_blank');
  };

  const metricOptions = [
    { id: 'reach', label: 'Fleet Reach' },
    { id: 'impressions', label: 'Total Impressions' },
    { id: 'engagement', label: 'Engagement Rate & Likes' },
    { id: 'earnings', label: 'Financial Monetization Yield' },
    { id: 'followers', label: 'Follower Acquisition & Churn' },
    { id: 'video_views', label: 'Video Watch Time & Previews' }
  ];

  const toggleMetric = (id) => {
    if (selectedMetrics.includes(id)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== id));
    } else {
      setSelectedMetrics([...selectedMetrics, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Reports & Data Exports</h1>
          <p className="text-xs text-slate-400">Generate executive logistics performance spreadsheets & CSV telemetry downloads</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCsv()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Active CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Report Template
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Saved Report Configurations</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold pb-2">
                <th className="pb-2">Report Title</th>
                <th className="pb-2">Target Date Range</th>
                <th className="pb-2">Format</th>
                <th className="pb-2">Created</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-600" />
                    <span>{r.title}</span>
                  </td>
                  <td className="py-3 text-slate-500">{r.date_range}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {r.file_format}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{formatDate(r.created_at, true)}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleExportCsv(r.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Create Analytics Report Template
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select metrics and target dates for continuous export
            </p>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Logistics Operations & Yield Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Metrics to Include
                </label>
                <div className="space-y-2">
                  {metricOptions.map((m) => {
                    const isChecked = selectedMetrics.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMetric(m.id)}
                          className="w-3.5 h-3.5 rounded text-brand-600"
                        />
                        <span>{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-4 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-md shadow-xs"
                >
                  {generating ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
