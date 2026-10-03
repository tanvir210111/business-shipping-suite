import React, { useState } from 'react';
import {
  Calendar, CheckCircle2, Circle, Plus, ArrowRight, Award,
  Megaphone, Layers, Film, Users, Zap, ExternalLink, HelpCircle,
  Clock, Sparkles, TrendingUp
} from 'lucide-react';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function Plan() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Publish one ad',
      desc: 'Promote a shipping corridor or reefer capacity',
      progressText: '0 of 1 ad',
      actionText: 'Create ad',
      to: '/ads',
      completed: false
    },
    {
      id: 2,
      title: 'Publish one post on Fleet Channel',
      desc: 'Share operational updates or cargo schedule',
      progressText: '0 of 1 post',
      actionText: 'Create post',
      to: '/content',
      completed: false
    },
    {
      id: 3,
      title: 'Publish one story on Fleet Story',
      desc: 'Show real-time port docking or vessel operations',
      progressText: '0 of 1 story',
      actionText: 'Create story',
      to: '/content',
      completed: false
    },
    {
      id: 4,
      title: 'Connect to Instagram Logistics channel',
      desc: 'Cross-post maritime reels and photo showcases',
      progressText: '0 of 1 connected',
      actionText: 'Connect account',
      to: '/content',
      completed: false
    },
    {
      id: 5,
      title: 'Maintain response rate above 90%',
      desc: 'Answer client freight questions promptly',
      progressText: '98.6% Response Rate',
      actionText: 'Completed',
      to: '/messages',
      completed: true
    },
    {
      id: 6,
      title: 'Visit Insights to review 28-day trends',
      desc: 'Analyze reach, interaction velocity, and revenue',
      progressText: 'Review completed',
      actionText: 'Completed',
      to: '/insights/overview',
      completed: true
    }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: '10 Shipping Fleet Posts', current: 8, target: 10, reward: 'Bronze Maritime Badge' },
    { id: 2, title: 'First Commercial Logistics Ad', current: 1, target: 1, reward: 'Growth Catalyst Tier' },
    { id: 3, title: '50,000 Verified Subscribers', current: 48240, target: 50000, reward: 'Enterprise Fleet Status' }
  ]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-[#0866ff]" />
          <h1 className="text-base font-bold text-[#050505] dark:text-white">
            Plan
          </h1>
        </div>
        <p className="text-xs text-[#65676b] dark:text-slate-400">
          Create, track, and complete your weekly publishing goals and operational achievements.
        </p>
      </div>

      {/* Weekly Plan Card (Meta Business Suite Reference) */}
      <div className="mbs-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#050505] dark:text-white">
              Weekly plan
            </h2>
            <p className="text-xs text-[#65676b]">
              Complete your key weekly logistics publishing and engagement targets
            </p>
          </div>
          <span className="text-xs font-bold text-[#0866ff] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            {completedCount} of {tasks.length} tasks completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#f0f2f5] dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#0866ff] h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((completedCount / tasks.length) * 100)}%` }}
          />
        </div>

        {/* Tasks Grid */}
        <div className="space-y-2 pt-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-[#65676b] dark:text-slate-400">
                    {task.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-medium text-[#65676b]">
                  {task.progressText}
                </span>
                {task.completed ? (
                  <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-semibold">
                    Completed
                  </span>
                ) : (
                  <a
                    href={task.to}
                    className="px-3 py-1 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    {task.actionText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Highlights Bar */}
      <div className="mbs-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-[#050505] dark:text-white">
            Performance Highlights
          </h3>
          <p className="text-[11px] text-[#65676b]">
            Your weekly reach is up +14.2% across verified maritime subscriber channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Plan History: Reviewing past 8 weeks completion logs')}
            className="px-3 py-1.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] text-xs font-semibold text-[#050505] dark:text-white hover:bg-slate-50 transition-colors"
          >
            See plan history
          </button>
          <a
            href="/insights/content"
            className="px-3 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            See all post insights
          </a>
        </div>
      </div>

      {/* Achievements to Earn */}
      <div className="mbs-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-[#050505] dark:text-white">
            Achievements to earn
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const pct = Math.min(Math.round((ach.current / ach.target) * 100), 100);
            return (
              <div
                key={ach.id}
                className="p-4 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#050505] dark:text-white">
                    {ach.title}
                  </h3>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-[#e4e6eb] dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#65676b]">
                  <span>{ach.current} of {ach.target}</span>
                  <span className="font-medium text-[#0866ff]">{ach.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
