import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Settings,
  Ship,
  ChevronRight,
  Lock,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { formatDate } from '../../utils/formatters';

export default function Profile() {
  const { user } = useAuth();
  const { selectedBusiness, selectedPage } = useBusiness();

  const userName = user?.name || 'Captain David Vance';
  const userEmail = user?.email || 'admin@businessshipping.com';
  const userRole = user?.role || 'admin';
  const initial = userName.charAt(0).toUpperCase() || 'U';
  const companyName = selectedBusiness?.name || 'Business Shipping Suite - Main Fleet';

  return (
    <div className="max-w-[1140px] w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#65676b] dark:text-[#b0b3b8] px-0.5">
        <Link to="/home" className="hover:text-[#0866ff] flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-[#0866ff] flex items-center justify-center text-white text-[9px] shrink-0">
            <Ship className="w-2.5 h-2.5" />
          </div>
          <span className="font-semibold text-[#050505] dark:text-white">Business Shipping Suite</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-[#8a8d91]" />
        <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8]">Account</span>
        <ChevronRight className="w-3 h-3 text-[#8a8d91]" />
        <span className="font-semibold text-[#050505] dark:text-white">User Profile</span>
      </div>

      {/* Main Profile Header Banner Card */}
      <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Decorative Top Gradient Header */}
        <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-[#0866ff]/90 via-[#0284c7] to-[#0369a1] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
        </div>

        {/* Profile Info Row with Overlapping Avatar */}
        <div className="px-5 pb-5 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 relative z-10">
          <div className="flex items-end gap-3.5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-[#242526] bg-[#0866ff] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-md overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#050505] dark:text-white">
                  {userName}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-[#0866ff] fill-[#0866ff] text-white shrink-0" />
              </div>
              <p className="text-[12px] text-[#65676b] dark:text-[#b0b3b8]">{userEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0866ff]/10 text-[#0866ff] uppercase tracking-wide">
                  {userRole}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Verified Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <div className="pb-1">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Details Grid (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Column 1: Identity & Role */}
        <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e4e6eb] dark:border-[#3e4042]">
            <User className="w-4 h-4 text-[#0866ff]" />
            <h2 className="text-[13px] font-bold text-[#050505] dark:text-white">
              Account & Credentials
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Full Name</span>
              <span className="font-semibold text-[#050505] dark:text-white">{userName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Email Address</span>
              <span className="font-semibold text-[#050505] dark:text-white">{userEmail}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Assigned Role</span>
              <span className="font-semibold text-[#0866ff] capitalize">{userRole} (Fleet Master)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Account ID</span>
              <span className="font-mono text-[11px] text-[#050505] dark:text-white">BSS-USR-{user?.id || 1}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Organization & Fleet Scope */}
        <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e4e6eb] dark:border-[#3e4042]">
            <Building className="w-4 h-4 text-purple-600" />
            <h2 className="text-[13px] font-bold text-[#050505] dark:text-white">
              Company & Fleet Assignment
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Company / Business</span>
              <span className="font-semibold text-[#050505] dark:text-white truncate max-w-[200px]">
                {companyName}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Active Channel</span>
              <span className="font-semibold text-[#050505] dark:text-white">
                {selectedPage?.name || 'Main Fleet Channel'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Default Timezone</span>
              <span className="font-semibold text-[#050505] dark:text-white">America/New_York (EST)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Operational Currency</span>
              <span className="font-semibold text-[#050505] dark:text-white">USD ($)</span>
            </div>
          </div>
        </div>

        {/* Column 3: Security & Session */}
        <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e4e6eb] dark:border-[#3e4042]">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[13px] font-bold text-[#050505] dark:text-white">
              Security & Verification
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Authentication</span>
              <span className="font-semibold text-[#050505] dark:text-white">JWT + 256-bit AES</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Account Status</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Meta Work Compliance</span>
              <span className="font-semibold text-[#050505] dark:text-white">Verified Enterprise</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Password Protection</span>
              <Link to="/settings" className="text-[#0866ff] hover:underline font-semibold">
                Change in Settings →
              </Link>
            </div>
          </div>
        </div>

        {/* Column 4: History & Timestamps */}
        <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e4e6eb] dark:border-[#3e4042]">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-[13px] font-bold text-[#050505] dark:text-white">
              Session & Activity
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Member Since</span>
              <span className="font-semibold text-[#050505] dark:text-white">
                {user?.created_at ? formatDate(user.created_at) : 'December 2025'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Last Login</span>
              <span className="font-semibold text-[#050505] dark:text-white">
                {user?.last_login ? formatDate(user.last_login) : 'Today'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Session Mode</span>
              <span className="font-semibold text-[#050505] dark:text-white">Enterprise Persistent</span>
            </div>
            <div className="flex items-center justify-between py-1 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
              <span className="text-[#65676b] dark:text-[#b0b3b8]">Access Gateway</span>
              <span className="font-semibold text-[#050505] dark:text-white">Web Suite v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
