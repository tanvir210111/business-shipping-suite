import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck, AlertCircle, DollarSign, Award, Info } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => setNotifications(res.data.notifications || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = (id) => {
    api.put(`/notifications/${id}/read`)
      .then(() => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      });
  };

  const handleMarkAllRead = () => {
    api.post('/notifications/mark-all-read')
      .then(() => {
        setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
      });
  };

  const handleDelete = (id) => {
    api.delete(`/notifications/${id}`)
      .then(() => {
        setNotifications(notifications.filter(n => n.id !== id));
      });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'earnings': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'milestone': return <Award className="w-4 h-4 text-amber-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Info className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Notification & Alert Center</h1>
          <p className="text-xs text-slate-400">Operational alerts, milestone events, and monetization disbursements</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No active notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.is_read ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{formatDate(n.created_at, true)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
