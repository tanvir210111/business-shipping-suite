import React, { useState, useEffect } from 'react';
import {
  User, Settings as SettingsIcon, Shield, Bell, Moon, Sun, Check, AlertCircle, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        const s = res.data.settings;
        if (s) {
          setEmailAlerts(!!s.email_alerts);
          setWeeklyDigest(!!s.weekly_digest);
          if (s.currency) setCurrency(s.currency);
          if (s.timezone) setTimezone(s.timezone);
        }
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', msg: '' });

    api.put('/settings', {
      theme,
      name,
      email_alerts: emailAlerts,
      weekly_digest: weeklyDigest,
      currency,
      timezone,
      ...(currentPassword && newPassword ? { currentPassword, newPassword } : {})
    })
      .then((res) => {
        setFeedback({ type: 'success', msg: 'Settings saved successfully!' });
        setCurrentPassword('');
        setNewPassword('');
      })
      .catch((err) => {
        setFeedback({ type: 'error', msg: err.response?.data?.error || 'Failed to update settings.' });
      })
      .finally(() => setSaving(false));
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'business', label: 'Fleet & Regional', icon: SettingsIcon },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">Settings & Preferences</h1>
        <p className="text-xs text-slate-400">Configure account profiles, fleet preferences, notifications, and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-2xs border border-slate-200 dark:border-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          {feedback.msg && (
            <div className={`mb-5 p-3 rounded-lg text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
            }`}>
              {feedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.msg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Profile Information
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Managed via authentication provider</p>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Fleet & Regional Preferences
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Settlement Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Eurozone</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="SGD">SGD (S$) - Singapore Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fleet Operational Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="America/New_York">America/New_York (EST / EDT)</option>
                    <option value="Europe/London">Europe/London (GMT / BST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Alert Subscriptions
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600"
                    />
                    <div>
                      <span className="font-semibold block">Critical Operational Alerts</span>
                      <span className="text-slate-400 text-[11px]">Receive immediate notifications for route disruptions and delays</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600"
                    />
                    <div>
                      <span className="font-semibold block">Weekly Monetization & Analytics Digest</span>
                      <span className="text-slate-400 text-[11px]">Automated executive summary sent every Monday morning</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Password & Authentication
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full max-w-md text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
