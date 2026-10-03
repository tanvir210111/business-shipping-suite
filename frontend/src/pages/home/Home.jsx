import React, { useState, useEffect } from 'react';
import {
  Ship, Plus, Zap, Megaphone, Film, MoreHorizontal,
  Bell, CheckSquare, MessageCircle, Calendar, ArrowRight,
  TrendingUp, Users, Eye, CheckCircle2, ChevronRight, ChevronDown, Info, X,
  Smartphone, Rocket, Compass, Radio, ExternalLink, Share2, HelpCircle,
  MessageSquare, AlertTriangle
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';
import UserAccountControl from '../../components/common/UserAccountControl';

export default function Home() {
  const { user } = useAuth();
  const { selectedBusiness, selectedPage } = useBusiness();
  const [data, setData] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    setLoading(true);
    const busId = selectedBusiness?.id || 1;
    Promise.all([
      api.get(`/dashboard?startDate=2026-09-06&endDate=2026-10-03&businessId=${busId}`),
      api.get(`/messages?businessId=${busId}`)
    ])
      .then(([dashRes, msgRes]) => {
        setData(dashRes.data);
        setTopContent(dashRes.data.topContent || []);
        setConversations(msgRes.data.conversations || []);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
      })
      .finally(() => setLoading(false));
  }, [selectedBusiness, selectedPage]);

  const kpis = data?.kpis || {};
  const currentChannel = selectedPage || {
    name: selectedBusiness?.name || 'Business Shipping Suite - Main Fleet',
    handle: '@businessshipping',
    followers: 25938,
    cover: '/cover.jpg',
    avatar: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150'
  };

  if (loading && !data) {
    return (
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-5 space-y-4 animate-pulse">
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl overflow-hidden">
          <div className="h-44 sm:h-56 md:h-64 w-full bg-slate-200 dark:bg-slate-700" />
          <div className="p-5 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-600 -mt-10 border-4 border-white dark:border-[#242526]" />
            <div className="space-y-2">
              <div className="h-5 w-52 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-5 h-44" />
            <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-5 h-52" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-5 h-60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-5 space-y-4">
      {/* 1. TOP BREADCRUMB / PROFILE HEADER WITH USER ACCOUNT CONTROL */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] flex items-center justify-center font-bold text-[10px] text-[#050505] dark:text-white shrink-0">
            B
          </div>
          <span className="font-semibold text-[#050505] dark:text-white truncate">Business Shipping Suite</span>
          <span className="text-xs text-[#65676b] dark:text-[#b0b3b8] hidden sm:inline">Portfolio</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8a8d91] shrink-0" />
          <div className="w-5 h-5 rounded-full bg-[#0866ff] flex items-center justify-center text-white text-[10px] shrink-0">
            <Ship className="w-3 h-3" />
          </div>
          <span className="font-semibold text-[#050505] dark:text-white truncate">{currentChannel.name}</span>
          <span className="text-xs text-[#65676b] dark:text-[#b0b3b8] hidden sm:inline">Profile</span>
        </div>

        {/* User Account Control (Top-Right) */}
        <div className="shrink-0">
          <UserAccountControl />
        </div>
      </div>

      {/* 2. COVER PHOTO & PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 md:h-64 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src="/cover.jpg"
            alt="Business Shipping Suite Fleet Cover"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          <button
            onClick={() => alert('Edit Cover Photo: Choose from fleet asset library or upload new vessel banner')}
            className="absolute bottom-3 right-4 bg-black/60 hover:bg-black/75 backdrop-blur-xs px-3 py-1.5 rounded-md text-white text-xs sm:text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <span>Edit cover photo</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-5 sm:px-6 pt-0 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 relative z-10">
          <div className="flex items-end gap-3.5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-[#242526] bg-[#0866ff] flex items-center justify-center text-white overflow-hidden shadow-sm shrink-0">
              <Ship className="w-11 h-11 sm:w-13 sm:h-13" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-[#050505] dark:text-white leading-tight">
                  {currentChannel.name}
                </h1>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0866ff] fill-[#0866ff] text-white shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1">
                <a href="/settings" className="text-[#0866ff] font-medium hover:underline">Edit Fleet Page</a>
                <span>•</span>
                <a href="/messages" className="text-[#0866ff] font-medium hover:underline">Connect Social Channel</a>
                <span>•</span>
                <span>Verified Enterprise</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#050505] dark:text-white font-bold pb-1 sm:pb-1.5">
            <span>{formatNumber(kpis.followers?.value || 25938)} followers</span>
            <ChevronRight className="w-4 h-4 text-[#8a8d91]" />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="px-5 sm:px-6 py-3 flex items-center gap-2.5 flex-wrap border-t border-[#e4e6eb] dark:border-[#3e4042] bg-[#fafbfc] dark:bg-[#242526]">
          <button
            onClick={() => alert('Create Post: Composing shipping advisory or logistics update')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create post</span>
          </button>
          <button
            onClick={() => alert('Create ad: Opening commercial campaign builder')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs sm:text-sm font-semibold text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors shadow-2xs cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-[#0866ff]" />
            <span>Create ad</span>
          </button>
          <button
            onClick={() => alert('Create Reel: Upload short-form logistics video clip')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs sm:text-sm font-semibold text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors shadow-2xs cursor-pointer"
          >
            <Film className="w-4 h-4 text-purple-600" />
            <span>Create reel</span>
          </button>
          <button
            onClick={() => alert('Create Story: Share temporary vessel departure or port status update')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs sm:text-sm font-semibold text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors shadow-2xs cursor-pointer"
          >
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Create story</span>
          </button>
          <button
            onClick={() => alert('More Options: Page settings, permissions, and fleet diagnostics')}
            className="p-2 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-[#050505] dark:text-white hover:bg-slate-50 dark:hover:bg-[#4e4f50] transition-colors cursor-pointer"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. GET FAMILIAR SECTION (Compact 4-Card Grid on Desktop) */}
      <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
              Get familiar with Business Shipping Suite
            </h2>
            <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5">
              Key steps to expand reach, streamline customer support, and track maritime cargo.
            </p>
          </div>
          <button
            onClick={() => setShowAnnouncement(true)}
            className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline cursor-pointer"
          >
            What's new
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1 */}
          <div className="p-4 rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#0866ff] flex items-center justify-center mb-3">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#050505] dark:text-white leading-snug">
                Connect Social & Logistics Channels
              </h3>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1.5 mb-3 leading-relaxed">
                Sync WhatsApp and Messenger to automate container inquiries.
              </p>
            </div>
            <a href="/messages" className="text-xs sm:text-[13px] font-semibold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              Connect channel <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-3">
                <Film className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#050505] dark:text-white leading-snug">
                Create / Publish Maritime Content
              </h3>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1.5 mb-3 leading-relaxed">
                Share vessel arrival schedules, lane advisories, and reefer updates.
              </p>
            </div>
            <a href="/content" className="text-xs sm:text-[13px] font-semibold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              Create post <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#050505] dark:text-white leading-snug">
                Reply to Customer Messages
              </h3>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1.5 mb-3 leading-relaxed">
                Manage freight forwarder chats in a unified 4-zone workspace.
              </p>
            </div>
            <a href="/messages" className="text-xs sm:text-[13px] font-semibold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              Go to Inbox <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff]/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#050505] dark:text-white leading-snug">
                Review Competitive Benchmarking
              </h3>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1.5 mb-3 leading-relaxed">
                Track your ocean freight transit times against industry benchmarks.
              </p>
            </div>
            <a href="/insights/benchmarking" className="text-xs sm:text-[13px] font-semibold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              View benchmarks <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. VERIFY BUSINESS DOCUMENTS ALERT (Compact Meta Alert Strip) */}
      <div className="bg-[#fffbeb] dark:bg-[#342e1d] border border-[#fef3c7] dark:border-[#52441f] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-[#050505] dark:text-white block">
                Verify business documents to receive payouts
              </span>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 leading-normal">
                For your security, we occasionally ask you to verify maritime registration information. To continue receiving commercial payouts, please verify your fleet documents.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Take action: Uploading commercial maritime certificate')}
            className="px-3.5 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#4e4f50] text-xs sm:text-[13px] font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shrink-0 self-start sm:self-center shadow-2xs cursor-pointer"
          >
            Take action
          </button>
        </div>
      </div>

      {/* 5. MAIN TWO-COLUMN CONTENT GRID (8 Cols Left / 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN (8 cols): To-dos, Recent Ads, Weekly Plan */}
        <div className="lg:col-span-8 space-y-4">
          {/* A. To-do list */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                To-do list
              </h2>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
                Check unread messages, comments and other things that may require your attention.
              </p>
            </div>

            {/* Row 1: Comments */}
            <div className="px-4 py-2.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-[#f7f8fa] dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white">Comments</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">
                  5
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#65676b] cursor-pointer" />
            </div>

            {/* Row 2: Weekly plan */}
            <div className="px-4 py-2.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-[#f7f8fa] dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
                <span className="font-bold text-[#050505] dark:text-white text-xs sm:text-sm">Weekly plan</span>
                <Info className="w-3.5 h-3.5 text-[#8a8d91]" />
                <span>• 1 day left</span>
              </div>
              <a href="/insights/plan" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline">
                See full plan
              </a>
            </div>
          </div>

          {/* B. Recent Ads & Promoted Campaigns */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0866ff]" />
                <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                  Recent ads & promoted campaigns
                </h2>
              </div>
              <a href="/ads" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline">
                View all in Ads
              </a>
            </div>

            <div className="space-y-2.5">
              {/* Campaign 1 */}
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Active
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white">
                      Trans-Pacific Express Capacity Q4
                    </h4>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1">
                    Spent $240.00 • 18,400 Reach • 412 Link Clicks
                  </p>
                </div>
                <a href="/ads" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline shrink-0 ml-3">
                  View results
                </a>
              </div>

              {/* Campaign 2 */}
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      Completed
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white">
                      Reefer Container Availability — Busan to Rotterdam
                    </h4>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-1">
                    Spent $350.00 • 26,100 Reach • 680 Inquiries
                  </p>
                </div>
                <a href="/ads" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline shrink-0 ml-3">
                  View results
                </a>
              </div>
            </div>
          </div>

          {/* C. Weekly Plan / Scheduled Logistics Posts */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                  Weekly plan & scheduled logistics posts
                </h2>
              </div>
              <a href="/planner" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline">
                Open Planner
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wide block mb-1">
                  Monday, Oct 5
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white line-clamp-2 leading-snug">
                  Trans-Atlantic Weather Advisory
                </p>
                <span className="text-xs text-slate-500 mt-1.5 block">Scheduled: 09:00 EST</span>
              </div>

              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wide block mb-1">
                  Wednesday, Oct 7
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white line-clamp-2 leading-snug">
                  Autonomous Cargo Vessel Showcase
                </p>
                <span className="text-xs text-slate-500 mt-1.5 block">Scheduled: 14:00 EST</span>
              </div>

              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wide block mb-1">
                  Friday, Oct 9
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white line-clamp-2 leading-snug">
                  Fuel Bunker Index Update
                </p>
                <span className="text-xs text-slate-500 mt-1.5 block">Scheduled: 11:30 EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Customer Inquiries, Growth, Mobile App */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Customer Comments & Inquiries */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                  Customer comments & inquiries
                </h2>
              </div>
              <a href="/messages" className="text-xs sm:text-sm font-semibold text-[#0866ff] hover:underline">
                View all
              </a>
            </div>

            <div className="space-y-2">
              {conversations.slice(0, 3).map((c) => (
                <a
                  key={c.id}
                  href="/messages"
                  className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-[#e4e6eb]"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white truncate max-w-[150px]">
                      {c.sender_name}
                    </span>
                    <span className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                      {formatDate(c.updated_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">
                    {c.last_message}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Explore More Ways to Grow */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2.5">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                Explore more ways to grow
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] leading-normal">
              Reach targeted freight forwarders and shippers looking for ocean capacity.
            </p>
            <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
              <h4 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200">
                A/B Test Audience Creatives
              </h4>
              <p className="text-xs sm:text-[12.5px] text-indigo-700 dark:text-indigo-300 mt-1 mb-2 leading-normal">
                Test container route graphics vs vessel clips to increase response rates.
              </p>
              <a href="/content" className="text-xs sm:text-sm font-bold text-[#0866ff] hover:underline">
                Launch A/B Test →
              </a>
            </div>
          </div>

          {/* 3. Manage on the Go */}
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-2.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#0866ff]" />
              <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                Manage on the go
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] leading-normal">
              Download Business Shipping Suite for iOS and Android to track port alerts in real time.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => alert('App Store link: Business Shipping Suite Mobile')}
                className="flex-1 py-2 px-3 rounded-md bg-[#f0f2f5] hover:bg-[#e4e6eb] text-xs sm:text-sm font-semibold text-[#050505] text-center transition-colors cursor-pointer"
              >
                App Store
              </button>
              <button
                onClick={() => alert('Google Play link: Business Shipping Suite Mobile')}
                className="flex-1 py-2 px-3 rounded-md bg-[#f0f2f5] hover:bg-[#e4e6eb] text-xs sm:text-sm font-semibold text-[#050505] text-center transition-colors cursor-pointer"
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. ONBOARDING ANNOUNCEMENT MODAL */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-[#e4e6eb] dark:border-[#3e4042] max-w-sm w-full overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-end -mr-1 -mt-1">
              <button
                onClick={() => setShowAnnouncement(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0866ff] flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#050505] dark:text-white">
                You can now bulk upload reels & advisories!
              </h3>
              <p className="text-xs sm:text-[13px] text-[#65676b] dark:text-[#b0b3b8] mt-2 leading-relaxed">
                Save hours by dragging and dropping multiple maritime container clips, port departure updates, and ocean weather notices into the Content Hub at once.
              </p>
            </div>

            <div className="text-left text-xs sm:text-[13px] space-y-2 bg-[#f7f8fa] dark:bg-slate-800/40 p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Upload up to 50 logistics video clips simultaneously</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Preset ocean lane hashtags and commercial tags</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Directly schedule across all connected fleet pages</span>
              </div>
            </div>

            <button
              onClick={() => setShowAnnouncement(false)}
              className="w-full py-2.5 px-4 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

