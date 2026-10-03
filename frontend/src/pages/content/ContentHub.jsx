import React, { useState, useEffect } from 'react';
import {
  Layers, Film, Video, FileText, Search, Plus, Download,
  Filter, ChevronRight, CheckCircle2, AlertCircle, Share2,
  Grid, Compass, Sparkles, Clock, Copy, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';

export default function ContentHub() {
  const { selectedBusiness } = useBusiness();
  const [activeNav, setActiveNav] = useState('posts_reels'); // posts_reels, stories, ab_tests, feed_grid, mentions, clips, playlists, crosspost
  const [activeTab, setActiveTab] = useState('published'); // published, scheduled, drafts, expiring, expired, ad_posts
  const [postTypeFilter, setPostTypeFilter] = useState('all'); // all, post, reel, story, video
  const [searchQuery, setSearchQuery] = useState('');

  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  // Sub-navigation on left
  const leftNavItems = [
    { id: 'posts_reels', label: 'Posts & reels', icon: Layers },
    { id: 'stories', label: 'Stories', icon: Clock },
    { id: 'ab_tests', label: 'A/B tests', icon: Compass },
    { id: 'feed_grid', label: 'Feed & grid', icon: Grid },
    { id: 'mentions', label: 'Mentions & tags', icon: Share2 },
    { id: 'clips', label: 'Clips', icon: Film },
    { id: 'playlists', label: 'Playlists', icon: Video },
    { id: 'crosspost', label: 'Videos you can crosspost', icon: Copy }
  ];

  const fetchContent = () => {
    setLoading(true);
    const params = new URLSearchParams({
      businessId: selectedBusiness?.id || 1,
      type: postTypeFilter,
      search: searchQuery,
      sortBy: 'date',
      order: 'DESC',
      page: 1,
      limit: 15
    });

    api.get(`/content?${params.toString()}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, [selectedBusiness, postTypeFilter, searchQuery, activeTab]);

  const items = data?.items || [];

  const handleExportData = () => {
    const url = `/api/reports/export-csv?startDate=2026-09-06&endDate=2026-10-03&businessId=${selectedBusiness?.id || 1}&metric=content`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#18191a]">
      {/* Top Header */}
      <div className="p-6 border-b border-[#e4e6eb] dark:border-[#3e4042] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#242526]">
        <div>
          <h1 className="text-xl font-bold text-[#050505] dark:text-white">
            Content
          </h1>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Schedule, publish and manage posts, reels and stories, and more.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export data</span>
          </button>
          <button
            onClick={() => alert('Opening Create Reel modal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Film className="w-3.5 h-3.5 text-purple-600" />
            <span>Create reel</span>
          </button>
          <button
            onClick={() => alert('Opening Create Post modal')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create post</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace: Left Nav + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-Navigation (200px) */}
        <div className="w-52 border-r border-[#e4e6eb] dark:border-[#3e4042] p-3 space-y-1 shrink-0 hidden md:block bg-white dark:bg-[#242526]">
          {leftNavItems.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveNav(nav.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                activeNav === nav.id
                  ? 'bg-blue-50 text-[#0866ff] font-bold dark:bg-blue-900/30'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
              }`}
            >
              <nav.icon className="w-4 h-4 shrink-0 opacity-80" />
              <span className="truncate">{nav.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeNav === 'posts_reels' ? (
            <>
              {/* Tabs: Published, Scheduled, Drafts, Expiring, Expired, Ad Posts */}
              <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#e4e6eb] dark:border-[#3e4042]">
                {[
                  { id: 'published', label: 'Published' },
                  { id: 'scheduled', label: 'Scheduled' },
                  { id: 'drafts', label: 'Drafts' },
                  { id: 'expiring', label: 'Expiring' },
                  { id: 'expired', label: 'Expired' },
                  { id: 'ad_posts', label: 'Ad Posts' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`pb-2.5 transition-colors relative ${
                      activeTab === t.id
                        ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
                        : 'text-[#65676b] hover:text-[#050505]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Filters Bar: Post type, Search, Columns */}
              <div className="mbs-card p-3 flex flex-wrap items-center justify-between gap-3 bg-[#f7f8fa] dark:bg-[#242526]">
                <div className="flex items-center gap-2">
                  <select
                    value={postTypeFilter}
                    onChange={(e) => setPostTypeFilter(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white"
                  >
                    <option value="all">All Post Types</option>
                    <option value="post">Posts</option>
                    <option value="reel">Reels</option>
                    <option value="story">Stories</option>
                    <option value="video">Videos</option>
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#65676b]" />
                    <input
                      type="text"
                      placeholder="Search by caption or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert('Column customization dialog')}
                  className="px-2.5 py-1 text-xs rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#18191a] text-[#050505] dark:text-white hover:bg-slate-50"
                >
                  Columns
                </button>
              </div>

              {/* Main Content Table (Meta Business Suite Reference) */}
              <div className="mbs-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7f8fa] dark:bg-[#18191a] border-b border-[#e4e6eb] dark:border-[#3e4042] text-[#65676b] font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Title / Caption</th>
                        <th className="py-2.5 px-4">Date Published</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Reach</th>
                        <th className="py-2.5 px-4 text-right">Views</th>
                        <th className="py-2.5 px-4 text-right">Interactions</th>
                        <th className="py-2.5 px-4 text-right">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors">
                          <td className="py-3 px-4 max-w-sm">
                            <span className="font-semibold text-[#050505] dark:text-white block truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-[#0866ff]">
                              {item.content_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#65676b]">
                            {formatDate(item.published_at || item.created_at, true)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Published
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-[#050505] dark:text-white">
                            {formatNumber(item.reach)}
                          </td>
                          <td className="py-3 px-4 text-right text-[#65676b]">
                            {formatNumber(item.views)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-[#0866ff]">
                            {formatNumber(item.engagement)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-600">
                            {formatCurrency(item.earnings)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : activeNav === 'feed_grid' ? (
            /* Feed & Grid Split View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Feed Posts (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="mbs-card p-4">
                  <h2 className="text-sm font-bold text-[#050505] dark:text-white mb-2">Fleet Channel Feed</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.slice(0, 6).map((item) => (
                      <div key={item.id} className="rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] overflow-hidden bg-[#f7f8fa] dark:bg-[#18191a]">
                        <div className="h-32 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[#65676b]">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-semibold text-[#050505] dark:text-white truncate">{item.title}</p>
                          <span className="text-[10px] text-[#65676b]">{item.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Connect Social Channel (Meta Business Suite Style) */}
              <div className="mbs-card p-5 space-y-3 h-fit">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#050505] dark:text-white">
                  Connect Social Channel
                </h3>
                <p className="text-xs text-[#65676b]">
                  Connect an Instagram profile or maritime partner network to crosspost shipping advisories and reels simultaneously.
                </p>
                <button
                  onClick={() => alert('Connect Social Channel modal launched')}
                  className="w-full py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs"
                >
                  Connect account
                </button>
              </div>
            </div>
          ) : activeNav === 'stories' ? (
            /* Stories View */
            <div className="space-y-4">
              <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#e4e6eb] dark:border-[#3e4042]">
                <button className="pb-2.5 text-[#0866ff] border-b-2 border-[#0866ff]">Active</button>
                <button className="pb-2.5 text-[#65676b] hover:text-[#050505]">Scheduled</button>
                <button className="pb-2.5 text-[#65676b] hover:text-[#050505]">Archived</button>
              </div>

              <div className="mbs-card p-12 text-center space-y-2">
                <Clock className="w-8 h-8 text-[#65676b] mx-auto opacity-50" />
                <h3 className="text-sm font-bold text-[#050505] dark:text-white">
                  No activity during this date range
                </h3>
                <p className="text-xs text-[#65676b]">
                  Please select a different date range or create a new story.
                </p>
                <button
                  onClick={() => alert('Opening Create Story modal')}
                  className="px-4 py-1.5 rounded-md bg-[#0866ff] text-white text-xs font-semibold shadow-2xs"
                >
                  Create Story
                </button>
              </div>
            </div>
          ) : (
            /* Other Sub-views */
            <div className="mbs-card p-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#0866ff] mx-auto" />
              <h3 className="text-sm font-bold text-[#050505] dark:text-white capitalize">
                {activeNav.replace('_', ' ')}
              </h3>
              <p className="text-xs text-[#65676b]">
                Manage collections, playlists, and maritime videos you can crosspost.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
