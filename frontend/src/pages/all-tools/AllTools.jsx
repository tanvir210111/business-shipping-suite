import React from 'react';
import {
  Grid, Home, MessageSquare, Layers, Calendar, Megaphone,
  BarChart2, LineChart, DollarSign, CreditCard, Users, Activity,
  Settings, FileText, Sparkles, Shield, Compass, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AllTools() {
  const toolSections = [
    {
      title: 'Manage',
      description: 'Run everyday operations, content planning, and fleet logistics advisories.',
      tools: [
        { title: 'Home', desc: 'Overview of channel activity and urgent to-dos', icon: Home, to: '/home' },
        { title: 'Inbox', desc: 'Customer inquiries, comments, and direct messages', icon: MessageSquare, to: '/messages' },
        { title: 'Content', desc: 'Manage published and scheduled shipping announcements', icon: Layers, to: '/content' },
        { title: 'Planner', desc: 'Calendar scheduling for posts, stories, and videos', icon: Calendar, to: '/planner' },
        { title: 'Settings', desc: 'Page permissions, channel preferences, and security', icon: Settings, to: '/settings' }
      ]
    },
    {
      title: 'Advertise',
      description: 'Promote logistics routes, run maritime ad campaigns, and drive inquiries.',
      tools: [
        { title: 'Ads Center', desc: 'Quick overview and creation of promoted posts', icon: Megaphone, to: '/ads' },
        { title: 'Ads Manager', desc: 'In-depth campaign optimization, ROAS, and budget management', icon: BarChart2, to: '/ads-manager' },
        { title: 'Audiences', desc: 'Demographics, subscriber lists, and buyer personas', icon: Users, to: '/audience' },
        { title: 'Events Manager', desc: 'Track booking conversions, webhooks, and pixel data', icon: Activity, to: '/events-manager' },
        { title: 'Creator Marketing', desc: 'Collaborate with verified maritime industry influencers', icon: Sparkles, to: '/creator-marketing' }
      ]
    },
    {
      title: 'Analyze & report',
      description: 'Gain visibility into commercial performance, engagement trends, and earnings.',
      tools: [
        { title: 'Insights Overview', desc: 'High-level performance results and weekly review', icon: LineChart, to: '/insights/overview' },
        { title: 'Earnings & Monetisation', desc: 'Approximate earnings, stars, and content monetisation', icon: DollarSign, to: '/insights/earnings' },
        { title: 'Benchmarking', desc: 'Compare metrics against industry logistics peers', icon: Compass, to: '/insights/benchmarking' },
        { title: 'Reports & CSV Export', desc: 'Generate and download executive PDF and CSV summaries', icon: FileText, to: '/reports' }
      ]
    },
    {
      title: 'Billing & legal',
      description: 'Manage payout methods, invoices, and compliance documentation.',
      tools: [
        { title: 'Billing & payments', desc: 'Credit cards, corporate invoicing, and payout history', icon: CreditCard, to: '/billing' },
        { title: 'Notifications', desc: 'Real-time alerts, milestones, and disbursements', icon: Activity, to: '/notifications' }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Grid className="w-5 h-5 text-[#0866ff]" />
          <h1 className="text-xl font-bold text-[#050505] dark:text-white">
            All Tools
          </h1>
        </div>
        <p className="text-xs text-[#65676b] dark:text-slate-400">
          Everything you need to manage, advertise, and analyze your maritime logistics presence.
        </p>
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        {toolSections.map((section) => (
          <div key={section.title} className="mbs-card p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#050505] dark:text-white">
                {section.title}
              </h2>
              <p className="text-xs text-[#65676b] dark:text-slate-400">
                {section.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.tools.map((t) => (
                <Link
                  key={t.title}
                  to={t.to}
                  className="p-3 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] hover:border-[#0866ff] hover:bg-white dark:hover:bg-[#242526] transition-all group flex items-start gap-3"
                >
                  <div className="p-2 rounded-md bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] text-[#0866ff] shrink-0 group-hover:bg-[#0866ff] group-hover:text-white transition-colors">
                    <t.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#050505] dark:text-white truncate">
                        {t.title}
                      </h3>
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
  );
}
