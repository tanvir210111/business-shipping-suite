import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Target, Users, MessageSquare, Award,
  Layers, FileText, Megaphone, DollarSign, ChevronLeft
} from 'lucide-react';

export default function InsightsSecondaryNav() {
  const topNav = [
    { label: 'Overview', to: '/insights/overview', icon: LayoutDashboard },
    { label: 'Plan', to: '/insights/plan', icon: Calendar },
    { label: 'Results', to: '/insights/results', icon: Target },
    { label: 'Audience', to: '/insights/audience', icon: Users },
    { label: 'Messaging', to: '/insights/messages', icon: MessageSquare },
    { label: 'Benchmarking', to: '/insights/benchmarking', icon: Award }
  ];

  const contentNav = [
    { label: 'Overview', to: '/insights/content-overview', icon: LayoutDashboard },
    { label: 'Content', to: '/insights/content', icon: Layers },
    { label: 'Ads', to: '/insights/content-ads', icon: Megaphone }
  ];

  const earningsNav = [
    { label: 'Earnings', to: '/insights/earnings', icon: DollarSign }
  ];

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
      isActive
        ? 'bg-[#1c1e21] text-white font-semibold shadow-2xs dark:bg-white dark:text-[#1c1e21]'
        : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-100 dark:hover:bg-[#3a3b3c]'
    }`;

  return (
    <div className="w-[210px] shrink-0 bg-white dark:bg-[#242526] border-r border-[#e4e6eb] dark:border-[#3e4042] min-h-[calc(100vh-56px)] p-2.5 flex flex-col justify-between hidden md:flex select-none">
      <div className="space-y-3">
        {/* Top Section */}
        <div className="space-y-0.5">
          {topNav.map((item) => (
            <NavLink key={item.label} to={item.to} className={navItemClass}>
              <item.icon className="w-4 h-4 shrink-0 opacity-85" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Content Submenu Section */}
        <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042]">
          <span className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400 block mb-1">
            Content
          </span>
          <div className="space-y-0.5">
            {contentNav.map((item) => (
              <NavLink key={item.label} to={item.to} className={navItemClass}>
                <item.icon className="w-4 h-4 shrink-0 opacity-85" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Earnings Submenu Section */}
        <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042]">
          <span className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-[#65676b] dark:text-slate-400 block mb-1">
            Earnings
          </span>
          <div className="space-y-0.5">
            {earningsNav.map((item) => (
              <NavLink key={item.label} to={item.to} className={navItemClass}>
                <item.icon className="w-4 h-4 shrink-0 opacity-85" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sub-Nav Collapse Footer */}
      <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] flex items-center justify-end px-2">
        <button
          className="p-1 rounded-md text-[#65676b] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Collapse navigation"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
