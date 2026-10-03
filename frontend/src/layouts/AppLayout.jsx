import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Search, X, Ship, Compass, ArrowRight, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import UserAccountControl from '../components/common/UserAccountControl';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [helpWidgetOpen, setHelpWidgetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const { selectedBusiness } = useBusiness();
  const location = useLocation();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q || q.length < 2) {
      setSearchResults(null);
      return;
    }
    api.get(`/search?q=${encodeURIComponent(q)}&businessId=${selectedBusiness?.id || 1}`)
      .then((res) => setSearchResults(res.data.results))
      .catch(() => {});
  };

  const [sidebarHovered, setSidebarHovered] = useState(false);
  const isCompactPage = location.pathname !== '/home' && location.pathname !== '/';
  const isCompactActive = isCompactPage && !sidebarHovered;

  return (
    <div className="min-h-screen bg-transparent flex">
      {/* Main Left Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onOpenSearch={() => setSearchModalOpen(true)}
        compact={isCompactPage}
        onHoverChange={setSidebarHovered}
      />

      {/* Main Content Area: Smoothly shifts right when sidebar expands on hover */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          isCompactActive ? 'lg:pl-[60px]' : 'lg:pl-[230px]'
        }`}
      >
        {/* Mobile Top Header */}
        <div className="lg:hidden h-14 bg-white dark:bg-[#242526] border-b border-[#e4e6eb] dark:border-[#3e4042] px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-[#050505] dark:text-white"
          >
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current mb-1" />
            <div className="w-5 h-0.5 bg-current" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xs">
            <Ship className="w-4 h-4 text-[#0866ff]" />
            <span>BUSINESS SHIPPING SUITE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <UserAccountControl compact />
          </div>
        </div>

        {/* View Outlet */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center gap-3">
              <Search className="w-4 h-4 text-[#65676b]" />
              <input
                type="text"
                autoFocus
                placeholder="Search shipping announcements, reports, channels..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-[#050505] dark:text-white placeholder:text-[#65676b]"
              />
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-3">
              {searchResults ? (
                <>
                  {searchResults.navigation?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] block mb-1">
                        Navigation
                      </span>
                      {searchResults.navigation.map((n, i) => (
                        <a
                          key={i}
                          href={n.route}
                          onClick={() => setSearchModalOpen(false)}
                          className="flex items-center justify-between p-2 rounded-md text-xs hover:bg-slate-100 dark:hover:bg-[#3a3b3c]"
                        >
                          <span>{n.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  )}

                  {searchResults.content?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] block mb-1">
                        Content Items
                      </span>
                      {searchResults.content.map((c, i) => (
                        <a
                          key={i}
                          href={c.route}
                          onClick={() => setSearchModalOpen(false)}
                          className="flex items-center justify-between p-2 rounded-md text-xs hover:bg-slate-100 dark:hover:bg-[#3a3b3c]"
                        >
                          <span className="truncate">{c.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">{c.type}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-center py-6 text-[#65676b]">Type at least 2 characters to search</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Help / Assistant Button (Meta Business Suite Style) */}
      <div className="fixed bottom-5 right-5 z-40">
        {helpWidgetOpen ? (
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl shadow-2xl p-4 w-72 mb-2 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e4e6eb] dark:border-[#3e4042] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#050505] dark:text-white">Business Suite Assistant</span>
              </div>
              <button onClick={() => setHelpWidgetOpen(false)} className="text-[#65676b] hover:text-[#050505]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="text-[#65676b] text-[11px]">Quick navigation & support guides:</p>
              <a href="/insights/overview" onClick={() => setHelpWidgetOpen(false)} className="block p-2 rounded-md hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] font-medium text-[#0866ff]">
                • Review 28-day performance
              </a>
              <a href="/planner" onClick={() => setHelpWidgetOpen(false)} className="block p-2 rounded-md hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] font-medium text-[#0866ff]">
                • Schedule a shipping advisory
              </a>
              <a href="/reports" onClick={() => setHelpWidgetOpen(false)} className="block p-2 rounded-md hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] font-medium text-[#0866ff]">
                • Export analytics CSV / PDF
              </a>
            </div>
            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between text-[11px] text-[#65676b]">
              <span>System: 100% Operational</span>
              <a href="/settings" className="font-semibold text-[#0866ff] hover:underline">Help Center</a>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => setHelpWidgetOpen(!helpWidgetOpen)}
          className="w-11 h-11 rounded-full bg-[#0866ff] hover:bg-[#075ce6] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Help & Assistant"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
