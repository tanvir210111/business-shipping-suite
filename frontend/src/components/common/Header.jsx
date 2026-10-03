import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Moon, Sun, Monitor, Menu, ChevronDown, Check,
  User, Settings, Shield, LogOut, HelpCircle, Ship, Compass, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

export default function Header({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const { businesses, selectedBusiness, selectedPage, setSelectedBusiness, setSelectedPage } = useBusiness();
  const { theme, setTheme } = useTheme();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Dropdown states
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const businessRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(() => {
      api.get(`/search?q=${encodeURIComponent(searchQuery)}&businessId=${selectedBusiness?.id || 1}`)
        .then((res) => {
          setSearchResults(res.data.results);
          setSearchOpen(true);
        })
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedBusiness]);

  // Load notifications preview
  useEffect(() => {
    api.get('/notifications')
      .then((res) => {
        setNotifications(res.data.notifications?.slice(0, 5) || []);
        setUnreadCount(res.data.unreadCount || 0);
      })
      .catch(() => {});
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (businessRef.current && !businessRef.current.contains(e.target)) setBusinessDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Logo + Business Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Business Shipping Suite Crest Logo */}
        <a href="/dashboard" className="flex items-center gap-2.5 font-bold text-sm tracking-tight text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-600 to-sky-700 flex items-center justify-center text-white shadow-xs">
            <Ship className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-900 dark:text-white font-extrabold text-sm block leading-none">
              BUSINESS SHIPPING
            </span>
            <span className="text-brand-600 dark:text-brand-400 font-semibold text-[10px] tracking-widest uppercase">
              SUITE
            </span>
          </div>
        </a>

        {/* Divider */}
        <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Fleet & Page Selector Dropdown */}
        <div className="relative" ref={businessRef}>
          <button
            onClick={() => setBusinessDropdownOpen(!businessDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300">
              {selectedBusiness?.name?.[0] || 'B'}
            </div>
            <span className="max-w-[150px] truncate text-left">
              {selectedPage ? selectedPage.name : (selectedBusiness?.name || 'Main Fleet')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {businessDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Fleet Accounts
              </div>
              {businesses.map((b) => (
                <div key={b.id} className="mb-1">
                  <button
                    onClick={() => {
                      setSelectedBusiness(b);
                      setSelectedPage(null);
                      setBusinessDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                      selectedBusiness?.id === b.id && !selectedPage
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {selectedBusiness?.id === b.id && !selectedPage && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>

                  {/* Sub-channels / pages */}
                  {b.pages && b.pages.length > 0 && (
                    <div className="pl-4 space-y-0.5 mt-0.5">
                      {b.pages.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedBusiness(b);
                            setSelectedPage(p);
                            setBusinessDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1 text-[11px] text-left rounded-md ${
                            selectedPage?.id === p.id
                              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-medium'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          {selectedPage?.id === p.id && <Check className="w-3 h-3 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shipments, reports, channels, insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-500 dark:focus:border-brand-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {searchOpen && searchResults && (
          <div className="absolute top-11 left-0 w-full rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 max-h-80 overflow-y-auto">
            {searchResults.navigation?.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">Navigation</span>
                {searchResults.navigation.map((n, i) => (
                  <a
                    key={i}
                    href={n.route}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>{n.title}</span>
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
            {searchResults.content?.length > 0 && (
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">Content Items</span>
                {searchResults.content.map((c, i) => (
                  <a
                    key={i}
                    href={c.route}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">{c.type}</span>
                  </a>
                ))}
              </div>
            )}
            {searchResults.reports?.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">Saved Reports</span>
                {searchResults.reports.map((r, i) => (
                  <a
                    key={i}
                    href={r.route}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="truncate">{r.title}</span>
                    <span className="text-[10px] text-slate-400">CSV</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Theme + Notifications + User Menu */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <a href="/notifications" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View all
                </a>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name || 'User'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 uppercase">
                  {user?.role || 'Admin'}
                </span>
              </div>

              <div className="py-1">
                <a href="/settings" className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <User className="w-4 h-4 text-slate-400" />
                  Profile
                </a>
                <a href="/settings" className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </a>
                <a href="/settings" className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Shield className="w-4 h-4 text-slate-400" />
                  Security
                </a>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
