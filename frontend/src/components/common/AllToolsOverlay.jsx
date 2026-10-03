import React, { useState } from 'react';
import {
  Grid, Search, X, Home, MessageSquare, Layers, Calendar, Megaphone,
  BarChart2, LineChart, DollarSign, CreditCard, Users, Activity,
  Settings, FileText, Sparkles, Shield, Compass, ArrowRight, Video, Radio, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllToolsOverlay({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const toolCategories = [
    {
      title: 'Frequently used',
      tools: [
        { title: 'Billing & payments', desc: 'Invoices, payment methods, credit balance', icon: CreditCard, to: '/billing' },
        { title: 'Inbox', desc: 'Manage inquiries, comments, customer replies', icon: MessageSquare, to: '/messages' },
        { title: 'Content', desc: 'Posts, reels, stories, video crossposting', icon: Layers, to: '/content' },
        { title: 'Creator Marketing', desc: 'Influencers, brand partners, collabs', icon: Sparkles, to: '/creator-marketing' },
        { title: 'Ads Manager', desc: 'Commercial ad campaigns, budgets, ROAS', icon: BarChart2, to: '/ads-manager' },
        { title: 'Audiences', desc: 'Saved, custom, lookalike shipping audiences', icon: Users, to: '/audience' }
      ]
    },
    {
      title: 'Engage audience',
      tools: [
        { title: 'Content', desc: 'Schedule and publish announcements', icon: Layers, to: '/content' },
        { title: 'Inbox', desc: 'Customer chats across channels', icon: MessageSquare, to: '/messages' },
        { title: 'Inspiration hub', desc: 'Top maritime content ideas and trends', icon: Compass, to: '/content' },
        { title: 'Leads Center', desc: 'Manage commercial freight inquiries', icon: Users, to: '/messages' },
        { title: 'Live Dashboard', desc: 'Port broadcasts and vessel inaugurations', icon: Radio, to: '/content' },
        { title: 'Page posts', desc: 'Direct feed post management', icon: FileText, to: '/content' },
        { title: 'Planner', desc: 'Calendar scheduling grid for upcoming posts', icon: Calendar, to: '/planner' },
        { title: 'Sound Collection', desc: 'Royalty-free audio for maritime reels', icon: Video, to: '/content' }
      ]
    },
    {
      title: 'Advertise',
      tools: [
        { title: 'Ad limits per Page', desc: 'Monitor active promotional thresholds', icon: Shield, to: '/ads-manager' },
        { title: 'Ads', desc: 'Quick campaign summary and boost triggers', icon: Megaphone, to: '/ads' },
        { title: 'Ads Manager', desc: 'Full campaign builder, ad sets, and ROAS', icon: BarChart2, to: '/ads-manager' },
        { title: 'Creative Hub', desc: 'Mockup and test logistics video creatives', icon: Sparkles, to: '/content' },
        { title: 'Creator Marketing Hub', desc: 'Partner sponsorships and payouts', icon: Sparkles, to: '/creator-marketing' },
        { title: 'Events Manager', desc: 'Pixel, webhooks, and Conversions API', icon: Activity, to: '/events-manager' },
        { title: 'Instant Forms', desc: 'Fast lead generation for container bookings', icon: FileText, to: '/messages' }
      ]
    },
    {
      title: 'Analyze and report',
      tools: [
        { title: 'Branded Content', desc: 'Tag partners and track sponsor metrics', icon: Sparkles, to: '/creator-marketing' },
        { title: 'Call Insights', desc: 'Track inbound voice and support calls', icon: Phone, to: '/insights/messages' },
        { title: 'Creative Reporting', desc: 'Compare video formats and creative yield', icon: LineChart, to: '/insights/content' },
        { title: 'Experiments', desc: 'A/B testing for shipping announcements', icon: Compass, to: '/content' },
        { title: 'Insights', desc: 'Overview, Results, Audience, and Earnings', icon: LineChart, to: '/insights/overview' },
        { title: 'Traffic analysis report', desc: 'Corridor origin and demographic breakdown', icon: FileText, to: '/reports' }
      ]
    },
    {
      title: 'Manage',
      tools: [
        { title: 'Billing & payments', desc: 'Manage payment accounts and tax docs', icon: CreditCard, to: '/billing' },
        { title: 'Brand Rights Protection', desc: 'Protect logos, trademarks, and vessel IP', icon: Shield, to: '/settings' },
        { title: 'Brand safety and suitability', desc: 'Content suitability filters and blacklists', icon: Shield, to: '/settings' },
        { title: 'Business Apps', desc: 'Integrate TMS and port telemetry software', icon: Grid, to: '/settings' },
        { title: 'Settings', desc: 'Fleet permissions, admins, channel settings', icon: Settings, to: '/settings' }
      ]
    }
  ];

  const filteredCategories = toolCategories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(t =>
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl max-w-5xl w-full shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-between gap-4 bg-white dark:bg-[#242526] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0866ff]">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#050505] dark:text-white">
                All Tools
              </h2>
              <p className="text-xs text-[#65676b] dark:text-slate-400">
                Browse and search all features and tools in Business Shipping Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#65676b]" />
              <input
                type="text"
                autoFocus
                placeholder="Search all tools for keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#ced0d4] dark:border-[#3e4042] bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-white focus:outline-none focus:border-[#0866ff]"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#65676b] hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {category.tools.map((t) => (
                  <Link
                    key={t.title}
                    to={t.to}
                    onClick={onClose}
                    className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] hover:border-[#0866ff] hover:bg-white dark:hover:bg-[#242526] transition-all group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-md bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] text-[#0866ff] shrink-0 group-hover:bg-[#0866ff] group-hover:text-white transition-colors">
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#050505] dark:text-white truncate">
                          {t.title}
                        </h4>
                        <ArrowRight className="w-3 h-3 text-[#65676b] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] text-[#65676b] dark:text-slate-400 line-clamp-2 mt-0.5">
                        {t.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
