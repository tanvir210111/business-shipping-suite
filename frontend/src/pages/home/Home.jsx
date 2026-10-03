import React, { useState, useEffect } from 'react';
import {
  Ship, Plus, Zap, Megaphone, Film, MoreHorizontal,
  Bell, CheckSquare, MessageCircle, Calendar, ArrowRight,
  TrendingUp, Users, Eye, CheckCircle2, ChevronRight, ChevronDown, Info, X,
  Smartphone, Rocket, Compass, Radio, ExternalLink, Share2, HelpCircle
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';

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
    followers: 48240,
    cover: '/cover.jpg',
    avatar: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150'
  };

  if (loading && !data) {
    return (
      <div className="p-4 sm:p-6 max-w-[1360px] w-full mx-auto space-y-4 animate-pulse">
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="mbs-card overflow-hidden">
          <div className="h-44 sm:h-52 w-full bg-slate-200 dark:bg-slate-700" />
          <div className="p-5 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-600 -mt-10 border-4 border-white" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-slate-300 dark:bg-slate-600 rounded" />
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="mbs-card p-5 h-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            <div className="mbs-card p-5 h-48 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="mbs-card p-5 h-56 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1360px] w-full mx-auto space-y-4">
      {/* Top Portfolio Breadcrumb (Matching media_1791008375778.jpg) */}
      <div className="flex items-center gap-2 text-xs text-[#65676b] px-1">
        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-[#050505] dark:text-white">
          B
        </div>
        <span className="font-semibold text-[#050505] dark:text-white">Business Shipping Suite</span>
        <span className="text-[10px] text-[#65676b]">Portfolio</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <div className="w-5 h-5 rounded-full bg-[#0866ff] flex items-center justify-center text-white text-[10px]">
          <Ship className="w-3 h-3" />
        </div>
        <span className="font-semibold text-[#050505] dark:text-white">{currentChannel.name}</span>
        <span className="text-[10px] text-[#65676b]">Profile</span>
      </div>

      {/* 1. Profile / Channel Header Banner (Meta Business Suite Style) */}
      <div className="mbs-card overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-100">
          <img
            src="/cover.jpg"
            alt="Business Shipping Suite Fleet Cover"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <div className="absolute bottom-3 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors">
            <span>Edit cover photo</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 relative z-10">
          <div className="flex items-end gap-3.5">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 border-white dark:border-[#242526] bg-[#0866ff] flex items-center justify-center text-white overflow-hidden shadow-md shrink-0">
              <Ship className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold text-[#050505] dark:text-white">
                  {currentChannel.name}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-[#0866ff]" />
              </div>
              <div className="flex items-center gap-2 text-[11.5px] text-[#65676b] dark:text-slate-400 mt-0.5">
                <a href="/settings" className="text-[#0866ff] hover:underline">Edit Fleet Page</a>
                <span>|</span>
                <a href="/messages" className="text-[#0866ff] hover:underline">Connect Social Channel</a>
                <span>|</span>
                <span className="text-[#65676b]">Verified Enterprise</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#050505] dark:text-white font-semibold">
            <span>{formatNumber(kpis.followers?.value || 48240)} followers</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#65676b]" />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center gap-2 flex-wrap border-t border-[#e4e6eb] dark:border-[#3e4042]">

          {/* Action Buttons: Create Post, Create ad, Create Reel, Create Story, More */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => alert('Create Post: Composing shipping advisory or logistics update')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create post</span>
            </button>
            <button
              onClick={() => alert('Create ad: Opening commercial campaign builder')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#0866ff]" />
              <span>Create ad</span>
            </button>
            <button
              onClick={() => alert('Create Reel: Upload short-form logistics video clip')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Film className="w-3.5 h-3.5 text-purple-600" />
              <span>Create reel</span>
            </button>
            <button
              onClick={() => alert('Create Story: Share temporary vessel departure or port status update')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Radio className="w-3.5 h-3.5 text-rose-500" />
              <span>Create story</span>
            </button>
            <button
              onClick={() => alert('More Options: Page settings, permissions, and fleet diagnostics')}
              className="p-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-[#050505] dark:text-white hover:bg-slate-50 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Get familiar / Onboarding Cards */}
      <div className="mbs-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#050505] dark:text-white">
              Get familiar with Business Shipping Suite
            </h2>
            <p className="text-xs text-[#65676b] dark:text-slate-400">
              Key steps to expand reach, streamline customer support, and track maritime cargo.
            </p>
          </div>
          <button
            onClick={() => setShowAnnouncement(true)}
            className="text-xs font-semibold text-[#0866ff] hover:underline"
          >
            What's new
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff] transition-all">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0866ff] flex items-center justify-center mb-2.5">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white">Connect Social & Logistics Channels</h3>
            <p className="text-[11px] text-[#65676b] dark:text-slate-400 mt-1 mb-2.5">
              Sync WhatsApp, Messenger, and Instagram to automate container inquiry responses.
            </p>
            <a href="/messages" className="text-xs font-bold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              Connect account <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff] transition-all">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center mb-2.5">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white">Bulk Upload Maritime Reels</h3>
            <p className="text-[11px] text-[#65676b] dark:text-slate-400 mt-1 mb-2.5">
              Showcase fleet arrivals, port turnarounds, and automated container discharge clips.
            </p>
            <a href="/content" className="text-xs font-bold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              Explore Content Hub <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40 hover:border-[#0866ff] transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-2.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#050505] dark:text-white">Review Competitive Benchmarking</h3>
            <p className="text-[11px] text-[#65676b] dark:text-slate-400 mt-1 mb-2.5">
              Compare your fleet engagement against top 50th and 75th percentile maritime logistics firms.
            </p>
            <a href="/insights/benchmarking" className="text-xs font-bold text-[#0866ff] hover:underline inline-flex items-center gap-1">
              View Benchmarks <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Alerts Card (Matching media_1791008375778.jpg) */}
      <div className="mbs-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#050505] dark:text-white">
                  Verify business documents to receive payouts
                </span>
              </div>
              <p className="text-[11.5px] text-[#65676b] dark:text-slate-400 mt-0.5">
                For your security, we occasionally ask you to verify maritime registration information. To continue receiving commercial payouts, please verify your fleet documents.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Take action: Uploading commercial maritime certificate')}
            className="px-3.5 py-1.5 rounded-md bg-white dark:bg-[#3a3b3c] border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
          >
            Take action
          </button>
        </div>
      </div>

      {/* 3. Grid Sections: To-dos & Recent Ads + Messages & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 Cols): To-dos & Alerts + Recent Ads + Weekly Plan */}
        <div className="lg:col-span-2 space-y-4">
          {/* To-do list (Matching media_1791008375778.jpg) */}
          <div className="mbs-card p-4 space-y-3">
            <div>
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                To-do list
              </h2>
              <p className="text-[11.5px] text-[#65676b] dark:text-slate-400 mt-0.5">
                Check unread messages, comments and other things that may require your attention.
              </p>
            </div>

            {/* Accordion 1: Comments */}
            <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-[#f7f8fa] dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#050505] dark:text-white">Comments</span>
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  5
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#65676b]" />
            </div>

            {/* Accordion 2: Weekly plan */}
            <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between bg-[#f7f8fa] dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#050505] dark:text-white">Weekly plan</span>
                <Info className="w-3.5 h-3.5 text-[#65676b]" />
                <span className="text-[11px] text-[#65676b]">• 1 day left</span>
              </div>
              <a href="/insights/plan" className="text-xs font-bold text-[#0866ff] hover:underline">
                See full plan
              </a>
            </div>
          </div>

          {/* Recent Ads Card */}
          <div className="mbs-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0866ff]" />
                <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                  Recent ads & promoted campaigns
                </h2>
              </div>
              <a href="/ads" className="text-xs font-semibold text-[#0866ff] hover:underline">
                View all in Ads
              </a>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                    <h4 className="text-xs font-bold text-[#050505] dark:text-white">
                      Trans-Pacific Express Capacity Q4
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#65676b] mt-1">
                    Spent $240.00 • 18,400 Reach • 412 Link Clicks
                  </p>
                </div>
                <a href="/ads" className="text-xs font-semibold text-[#0866ff] hover:underline">
                  View results
                </a>
              </div>

              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      Completed
                    </span>
                    <h4 className="text-xs font-bold text-[#050505] dark:text-white">
                      Reefer Container Availability - Busan to Rotterdam
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#65676b] mt-1">
                    Spent $350.00 • 26,100 Reach • 680 Inquiries
                  </p>
                </div>
                <a href="/ads" className="text-xs font-semibold text-[#0866ff] hover:underline">
                  View results
                </a>
              </div>
            </div>
          </div>

          {/* Weekly Plan (Planner / Scheduled Operations) */}
          <div className="mbs-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                  Weekly plan & scheduled logistics posts
                </h2>
              </div>
              <a href="/planner" className="text-xs font-semibold text-[#0866ff] hover:underline">
                Open Planner
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[10px] font-bold text-[#65676b] uppercase block mb-1">Monday, Oct 5</span>
                <p className="text-xs font-semibold text-[#050505] dark:text-white">Trans-Atlantic Weather Advisory</p>
                <span className="text-[10px] text-slate-500">Scheduled: 09:00 EST</span>
              </div>
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[10px] font-bold text-[#65676b] uppercase block mb-1">Wednesday, Oct 7</span>
                <p className="text-xs font-semibold text-[#050505] dark:text-white">Autonomous Cargo Vessel Showcase</p>
                <span className="text-[10px] text-slate-500">Scheduled: 14:00 EST</span>
              </div>
              <div className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-slate-800/40">
                <span className="text-[10px] font-bold text-[#65676b] uppercase block mb-1">Friday, Oct 9</span>
                <p className="text-xs font-semibold text-[#050505] dark:text-white">Fuel Bunkering Index Update</p>
                <span className="text-[10px] text-slate-500">Scheduled: 11:30 EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Messages + Explore Growth + Mobile App Promotion */}
        <div className="space-y-6">
          {/* Customer Inquiries Snapshot */}
          <div className="mbs-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                  Customer comments & inquiries
                </h2>
              </div>
              <a href="/messages" className="text-xs font-semibold text-[#0866ff] hover:underline">
                View all
              </a>
            </div>

            <div className="space-y-3">
              {conversations.slice(0, 3).map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#050505] dark:text-white truncate">{c.sender_name}</span>
                    <span className="text-[10px] text-[#65676b]">{formatDate(c.updated_at)}</span>
                  </div>
                  <p className="text-xs text-[#65676b] dark:text-slate-400 line-clamp-2">{c.last_message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Explore More Ways to Grow */}
          <div className="mbs-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                Explore more ways to grow
              </h2>
            </div>
            <p className="text-xs text-[#65676b]">
              Reach targeted freight forwarders and shippers looking for ocean capacity.
            </p>
            <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                A/B Test Audience Creatives
              </h4>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5 mb-2">
                Test shipping container route graphics vs vessel video clips to increase response rates.
              </p>
              <a href="/content" className="text-xs font-bold text-[#0866ff] hover:underline">
                Launch A/B Test
              </a>
            </div>
          </div>

          {/* Mobile App Promotion */}
          <div className="mbs-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#0866ff]" />
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                Manage on the go
              </h2>
            </div>
            <p className="text-xs text-[#65676b]">
              Download Business Shipping Suite for iOS and Android to track port alerts in real time.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('App Store link: Business Shipping Suite Mobile')}
                className="flex-1 py-1.5 px-3 rounded-md bg-[#f0f2f5] hover:bg-[#e4e6eb] text-xs font-semibold text-center transition-colors"
              >
                App Store
              </button>
              <button
                onClick={() => alert('Google Play link: Business Shipping Suite Mobile')}
                className="flex-1 py-1.5 px-3 rounded-md bg-[#f0f2f5] hover:bg-[#e4e6eb] text-xs font-semibold text-center transition-colors"
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Onboarding Announcement Modal (Replicating "You can now bulk upload reels!" popup from video) */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-[#e4e6eb] dark:border-[#3e4042] max-w-md w-full overflow-hidden p-6 text-center space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAnnouncement(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Illustration Icon */}
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0866ff] flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#050505] dark:text-white">
                You can now bulk upload reels & advisories!
              </h3>
              <p className="text-xs text-[#65676b] dark:text-slate-400 mt-2">
                Save hours by dragging and dropping multiple maritime container clips, port departure updates, and ocean weather notices into the Content Hub at once.
              </p>
            </div>

            <div className="text-left text-xs space-y-2 bg-[#f7f8fa] dark:bg-slate-800/40 p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042]">
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
              className="w-full py-2 px-4 rounded-lg bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-bold shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
