import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Bell, BarChart2, MessageSquare, Layers, Sparkles,
  Calendar, Megaphone, LineChart, DollarSign, Grid, CreditCard,
  Users, Activity, Search, Settings, HelpCircle, ChevronDown, Check,
  ExternalLink, Ship, X, Compass
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import NotificationsDrawer from './NotificationsDrawer';
import AllToolsOverlay from './AllToolsOverlay';

export default function Sidebar({ mobileOpen, onMobileClose, onOpenSearch, compact = false, onHoverChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { businesses, selectedBusiness, selectedPage, setSelectedBusiness, setSelectedPage } = useBusiness();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifsDrawerOpen, setNotifsDrawerOpen] = useState(false);
  const [allToolsModalOpen, setAllToolsModalOpen] = useState(false);
  
  // Hover-to-expand state for compact sidebar mode
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (compact) {
      setIsHovered(true);
      if (onHoverChange) onHoverChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (compact) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        setDropdownOpen(false);
        if (onHoverChange) onHoverChange(false);
      }, 150); // 150ms grace period prevents flicker when moving cursor
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const mainNav = [
    { label: 'Home', to: '/home', icon: Home },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: true, isDrawer: true },
    { label: 'Ads Manager', to: '/ads-manager', icon: BarChart2, external: true },
    { label: 'Inbox', to: '/messages', icon: MessageSquare, badge: true },
    { label: 'Content', to: '/content', icon: Layers },
    { label: 'Creator Marketing', to: '/creator-marketing', icon: Sparkles },
    { label: 'Planner', to: '/planner', icon: Calendar },
    { label: 'Ads', to: '/ads', icon: Megaphone },
    { label: 'Insights', to: '/insights/overview', icon: LineChart },
    { label: 'Monetisation', to: '/insights/earnings', icon: DollarSign },
    { label: 'All tools', to: '/all-tools', icon: Grid, isOverlay: true }
  ];

  const frequentNav = [
    { label: 'Billing & payments', to: '/billing', icon: CreditCard },
    { label: 'Audiences', to: '/audience', icon: Users, external: true },
    { label: 'Events Manager', to: '/events-manager', icon: Activity, external: true }
  ];

  const isInsightsActive = location.pathname.startsWith('/insights');

  // Render Compact 68px Icon Rail Content
  const renderCompactContent = () => (
    <div className="flex flex-col h-full text-[#050505] dark:text-[#e4e6eb] w-[68px] select-none text-[13px] items-center py-3.5">
      {/* Top Brand Logo */}
      <div className="mb-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#0866ff] flex items-center justify-center text-white shadow-2xs">
          <Ship className="w-5.5 h-5.5" />
        </div>
      </div>

      {/* Profile Circle */}
      <div className="mb-3 relative group">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#050505] dark:text-white border border-[#e4e6eb] hover:ring-2 hover:ring-[#0866ff] transition-all"
        >
          {selectedBusiness?.name?.[0] || 'B'}
        </button>
      </div>

      {/* Main Nav Icons */}
      <div className="flex-1 overflow-y-auto w-full px-2 space-y-1.5 flex flex-col items-center">
        {mainNav.map((item) => {
          const isActive = item.to.startsWith('/insights') ? isInsightsActive : location.pathname === item.to;

          if (item.isDrawer) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  setNotifsDrawerOpen(true);
                  if (onMobileClose) onMobileClose();
                }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors relative"
                title={item.label}
              >
                <item.icon className="w-5.5 h-5.5 opacity-85" />
                {item.badge && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#18191a]" />
                )}
              </button>
            );
          }

          if (item.isOverlay) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  setAllToolsModalOpen(true);
                  if (onMobileClose) onMobileClose();
                }}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  location.pathname === '/all-tools'
                    ? 'bg-[#1c1e21] text-white shadow-2xs font-semibold'
                    : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
                }`}
                title={item.label}
              >
                <item.icon className="w-5.5 h-5.5 opacity-85" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onMobileClose}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors relative ${
                isActive
                  ? 'bg-[#1c1e21] text-white shadow-2xs font-semibold'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
              }`}
              title={item.label}
            >
              <item.icon className="w-5.5 h-5.5 opacity-85" />
              {item.badge && !isActive && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#18191a]" />
              )}
            </NavLink>
          );
        })}

        <div className="w-8 h-[1px] bg-[#e4e6eb] dark:bg-[#3e4042] my-2" />

        {frequentNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onMobileClose}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#1c1e21] text-white shadow-2xs font-semibold'
                  : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
              }`}
              title={item.label}
            >
              <item.icon className="w-4.5 h-4.5 opacity-75" />
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Utility Icons */}
      <div className="w-full px-2 pt-2.5 border-t border-[#e4e6eb] dark:border-[#3e4042] space-y-1.5 flex flex-col items-center">
        <button
          onClick={onOpenSearch}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5 opacity-80" />
        </button>

        <NavLink
          to="/settings"
          onClick={onMobileClose}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            location.pathname === '/settings'
              ? 'bg-[#1c1e21] text-white font-semibold'
              : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5 opacity-80" />
        </NavLink>

        <button
          onClick={() => alert('Business Shipping Suite - Production Maritime Analytics')}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5 opacity-80" />
        </button>
      </div>
    </div>
  );

  // Render Full 268px Expanded Sidebar Content
  const renderExpandedContent = () => (
    <div className="flex flex-col h-full text-[#050505] dark:text-[#e4e6eb] w-[268px] select-none text-[13.5px]">
      {/* Top Header: Branding & Fleet Selector */}
      <div className="p-3.5 border-b border-[#e4e6eb] dark:border-[#3e4042] relative" ref={dropdownRef}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5 font-bold tracking-tight text-[#050505] dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-[#0866ff] flex items-center justify-center text-white shadow-2xs shrink-0">
              <Ship className="w-4.5 h-4.5" />
            </div>
            <span className="uppercase font-black text-xs sm:text-[13px] tracking-normal leading-tight">
              Business Shipping Suite
            </span>
          </div>
          {onMobileClose && (
            <button onClick={onMobileClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Business/Page Selector Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] transition-colors text-left shadow-2xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#050505] dark:text-white shrink-0">
              {selectedBusiness?.name?.[0] || 'B'}
            </div>
            <span className="text-[13px] font-semibold text-[#050505] dark:text-white truncate">
              {selectedPage ? selectedPage.name : (selectedBusiness?.name || 'Main Fleet')}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#65676b] shrink-0 ml-1.5" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-3.5 right-3.5 top-22 z-50 rounded-lg bg-white dark:bg-[#242526] shadow-xl border border-[#e4e6eb] dark:border-[#3e4042] py-2 animate-in fade-in duration-100">
            <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#65676b]">
              Fleet Businesses
            </div>
            {businesses.map((b) => (
              <div key={b.id}>
                <button
                  onClick={() => { setSelectedBusiness(b); setSelectedPage(null); setDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-[13px] text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
                    selectedBusiness?.id === b.id && !selectedPage ? 'font-bold text-[#0866ff]' : ''
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {selectedBusiness?.id === b.id && !selectedPage && <Check className="w-4 h-4 text-[#0866ff]" />}
                </button>
                {b.pages && b.pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedBusiness(b); setSelectedPage(p); setDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between pl-7 pr-3.5 py-1.5 text-xs text-left text-[#65676b] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
                      selectedPage?.id === p.id ? 'font-bold text-[#0866ff]' : ''
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {selectedPage?.id === p.id && <Check className="w-3.5 h-3.5 text-[#0866ff]" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Nav Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-1">
        {mainNav.map((item) => {
          const isActive = item.to.startsWith('/insights') ? isInsightsActive : location.pathname === item.to;

          if (item.isDrawer) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  setNotifsDrawerOpen(true);
                  if (compact) setIsHovered(false);
                  if (onMobileClose) onMobileClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] text-left text-[13.5px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="w-4.5 h-4.5 shrink-0 opacity-85" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              </button>
            );
          }

          if (item.isOverlay) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  setAllToolsModalOpen(true);
                  if (compact) setIsHovered(false);
                  if (onMobileClose) onMobileClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors text-left text-[13.5px] ${
                  location.pathname === '/all-tools'
                    ? 'bg-[#1c1e21] text-white dark:bg-white dark:text-[#1c1e21]'
                    : 'hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="w-4.5 h-4.5 shrink-0 opacity-85" />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => {
                if (compact) setIsHovered(false);
                if (onMobileClose) onMobileClose();
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors text-[13.5px] ${
                isActive
                  ? 'bg-[#1c1e21] text-white dark:bg-white dark:text-[#1c1e21] shadow-2xs'
                  : 'hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <item.icon className="w-4.5 h-4.5 shrink-0 opacity-85" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && !isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                )}
                {item.external && (
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                )}
              </div>
            </NavLink>
          );
        })}

        {/* Section Divider: Frequently used */}
        <div className="pt-3 pb-1 px-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#65676b] dark:text-slate-400 uppercase tracking-wider">
            Frequently used
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#65676b] opacity-60" />
        </div>

        {frequentNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => {
                if (compact) setIsHovered(false);
                if (onMobileClose) onMobileClose();
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors text-[13.5px] ${
                isActive
                  ? 'bg-[#1c1e21] text-white dark:bg-white dark:text-[#1c1e21]'
                  : 'hover:bg-slate-100 dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <item.icon className="w-4.5 h-4.5 shrink-0 opacity-75" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.external && (
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Navigation: Search, Get started, Settings, Help */}
      <div className="p-2.5 border-t border-[#e4e6eb] dark:border-[#3e4042] space-y-1">
        <button
          onClick={() => {
            onOpenSearch();
            if (compact) setIsHovered(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors text-left text-[13.5px]"
        >
          <Search className="w-4.5 h-4.5 shrink-0 opacity-80" />
          <span>Search</span>
        </button>

        <NavLink
          to="/get-started"
          onClick={() => {
            if (compact) setIsHovered(false);
            if (onMobileClose) onMobileClose();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors text-[13.5px] ${
            location.pathname === '/get-started'
              ? 'bg-[#1c1e21] text-white dark:bg-white dark:text-[#1c1e21]'
              : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
          }`}
        >
          <Compass className="w-4.5 h-4.5 shrink-0 opacity-80 text-[#0866ff]" />
          <span>Get started</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={() => {
            if (compact) setIsHovered(false);
            if (onMobileClose) onMobileClose();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors text-[13.5px] ${
            location.pathname === '/settings'
              ? 'bg-[#1c1e21] text-white dark:bg-white dark:text-[#1c1e21]'
              : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
          }`}
        >
          <Settings className="w-4.5 h-4.5 shrink-0 opacity-80" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={() => alert('Business Shipping Suite - Production Maritime & Logistics Platform')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors text-left text-[13.5px]"
        >
          <HelpCircle className="w-4.5 h-4.5 shrink-0 opacity-80" />
          <span>Help</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Aside */}
      {compact ? (
        <aside
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`hidden lg:block fixed left-0 top-0 bottom-0 bg-white dark:bg-[#18191a] border-r border-[#e4e6eb] dark:border-[#3e4042] transition-[width,box-shadow] duration-200 ease-in-out overflow-x-hidden ${
            isHovered ? 'w-[268px] shadow-2xl z-40' : 'w-[68px] shadow-none z-30'
          }`}
        >
          {isHovered ? (
            <div className="w-[268px] h-full flex flex-col animate-in fade-in duration-150">
              {renderExpandedContent()}
            </div>
          ) : (
            <div className="w-[68px] h-full flex flex-col animate-in fade-in duration-150">
              {renderCompactContent()}
            </div>
          )}
        </aside>
      ) : (
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30 bg-white dark:bg-[#18191a] border-r border-[#e4e6eb] dark:border-[#3e4042] w-[268px]">
          {renderExpandedContent()}
        </aside>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onMobileClose} />
          <div className="fixed inset-y-0 left-0 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="w-[268px] h-full bg-white dark:bg-[#18191a]">
              {renderExpandedContent()}
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Drawers */}
      <NotificationsDrawer
        isOpen={notifsDrawerOpen}
        onClose={() => setNotifsDrawerOpen(false)}
      />
      <AllToolsOverlay
        isOpen={allToolsModalOpen}
        onClose={() => setAllToolsModalOpen(false)}
      />
    </>
  );
}
