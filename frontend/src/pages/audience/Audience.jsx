import React, { useState } from 'react';
import {
  Users, Plus, Search, Filter, Share2, Trash2, Edit3,
  CheckCircle2, ArrowRight, ShieldCheck, Download
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function Audience() {
  const [activeTab, setActiveTab] = useState('all'); // all, active_ads, action_needed, unlabeled
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const [audiences, setAudiences] = useState([
    {
      id: 'AUD-901',
      name: 'Trans-Atlantic Reefer Freight Importers',
      type: 'Custom Audience (Customer List)',
      group: 'Customers',
      size: '24,500',
      matchScore: '9.4 / 10',
      status: 'Ready',
      created: 'Aug 14, 2026',
      sharing: 'Not shared'
    },
    {
      id: 'AUD-902',
      name: 'North Sea Wind Project Decision Makers',
      type: 'Engaged Audience (Video Viewers 50%+)',
      group: 'Engaged audiences',
      size: '48,200',
      matchScore: '9.1 / 10',
      status: 'Ready',
      created: 'Sep 02, 2026',
      sharing: 'Shared with 1 partner'
    },
    {
      id: 'AUD-903',
      name: 'Global Container Shippers Lookalike (1%)',
      type: 'Lookalike (1% - US & EU)',
      group: 'Lookalikes',
      size: '280,000',
      matchScore: '8.8 / 10',
      status: 'Ready',
      created: 'Sep 18, 2026',
      sharing: 'Not shared'
    },
    {
      id: 'AUD-904',
      name: 'Asia-Pacific Port Drayage Contacts',
      type: 'Saved Audience (Demographic & Interest)',
      group: 'Saved audiences',
      size: '112,000',
      matchScore: '9.0 / 10',
      status: 'Ready',
      created: 'Sep 25, 2026',
      sharing: 'Not shared'
    }
  ]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredAudiences = audiences.filter(a => {
    if (activeTab === 'action_needed') return a.status !== 'Ready';
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Audiences
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Create, save, and manage customer segments, video engagement lists, and lookalike maritime audiences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Opening Create Audience dialog')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create audience</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar: All audiences, Active ads, Action needed, Unlabeled */}
      <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#e4e6eb] dark:border-[#3e4042]">
        {[
          { id: 'all', label: 'All audiences' },
          { id: 'active_ads', label: 'Active in ads' },
          { id: 'action_needed', label: 'Action needed' },
          { id: 'unlabeled', label: 'Unlabeled audiences' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2.5 transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
                : 'text-[#65676b] hover:text-[#050505]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action and Filter Toolbar */}
      <div className="mbs-card p-3 flex flex-wrap items-center justify-between gap-3 bg-[#f7f8fa] dark:bg-[#242526]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#65676b]" />
            <input
              type="text"
              placeholder="Search for name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white focus:outline-none focus:border-[#0866ff]"
            />
          </div>

          <button
            disabled={selectedIds.length === 0}
            onClick={() => alert(`Editing audience ${selectedIds.join(', ')}`)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white disabled:opacity-40"
          >
            Edit
          </button>
          <button
            disabled={selectedIds.length === 0}
            onClick={() => alert(`Sharing audience ${selectedIds.join(', ')}`)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white disabled:opacity-40"
          >
            Share
          </button>
          <button
            disabled={selectedIds.length === 0}
            onClick={() => setAudiences(audiences.filter(a => !selectedIds.includes(a.id)))}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-rose-600 disabled:opacity-40"
          >
            Delete
          </button>
        </div>

        <button
          onClick={() => alert('Customizing audience columns')}
          className="px-2.5 py-1.5 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white hover:bg-slate-50"
        >
          Columns
        </button>
      </div>

      {/* Audiences Table */}
      <div className="mbs-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === audiences.length && audiences.length > 0}
                    onChange={(e) => setSelectedIds(e.target.checked ? audiences.map(a => a.id) : [])}
                  />
                </th>
                <th className="py-2.5 px-4">Audiences</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Estimated Size</th>
                <th className="py-2.5 px-4 text-right">Match Score</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4">Date Created</th>
                <th className="py-2.5 px-4">Sharing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
              {filteredAudiences.map((aud) => (
                <tr key={aud.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(aud.id)}
                      onChange={() => toggleSelect(aud.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#050505] dark:text-white block">
                      {aud.name}
                    </span>
                    <span className="text-[10px] text-[#65676b]">ID: {aud.id}</span>
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {aud.type}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                    {aud.size}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0866ff]">
                    {aud.matchScore}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {aud.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {aud.created}
                  </td>
                  <td className="py-3 px-4 text-[#65676b]">
                    {aud.sharing}
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
