import React, { useState, useEffect } from 'react';
import {
  Bell, X, Check, CheckCheck, Trash2, Megaphone, User,
  DollarSign, Award, AlertCircle, Info, ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all'); // all, ads, account, featured
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/notifications')
        .then((res) => setNotifications(res.data.notifications || []))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    api.post('/notifications/mark-all-read')
      .then(() => {
        setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      });
  };

  const handleMarkRead = (id) => {
    api.put(`/notifications/${id}/read`)
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      });
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ads') return n.type === 'alert' || n.title?.toLowerCase().includes('ad') || n.title?.toLowerCase().includes('campaign');
    if (activeTab === 'account') return n.type === 'milestone' || n.title?.toLowerCase().includes('clearance') || n.title?.toLowerCase().includes('payout');
    if (activeTab === 'featured') return n.type === 'earnings' || n.is_read === 0;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'earnings': return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'milestone': return <Award className="w-4 h-4 text-amber-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-[#0866ff]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Darkened backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Panel from left */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#242526] shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0866ff]" />
            <h2 className="text-base font-bold text-[#050505] dark:text-white">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="text-xs font-semibold text-[#0866ff] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#65676b] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs: All, Ads, Account, Featured */}
        <div className="flex items-center gap-2 px-4 pt-2 border-b border-[#e4e6eb] dark:border-[#3e4042] text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'ads', label: 'Ads' },
            { id: 'account', label: 'Account' },
            { id: 'featured', label: 'Featured' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
                  : 'text-[#65676b] hover:text-[#050505] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#65676b] animate-pulse">
              Loading notifications...
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#65676b]">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors cursor-pointer ${
                  !n.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="p-2 rounded-full bg-white dark:bg-[#3a3b3c] border border-[#e4e6eb] dark:border-[#3e4042] shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-xs ${!n.is_read ? 'font-bold text-[#050505] dark:text-white' : 'font-medium text-[#050505] dark:text-white'}`}>
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#0866ff] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#65676b] dark:text-slate-400 line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-[#65676b] block mt-1">
                    {formatDate(n.created_at, true)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] text-center">
          <a
            href="/notifications"
            onClick={onClose}
            className="text-xs font-semibold text-[#0866ff] hover:underline"
          >
            Open full notifications page
          </a>
        </div>
      </div>
    </div>
  );
}
