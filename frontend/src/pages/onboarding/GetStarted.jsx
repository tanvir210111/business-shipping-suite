import React, { useState } from 'react';
import {
  Compass, CheckCircle2, Circle, ArrowRight, Ship, Megaphone,
  Layers, MessageSquare, LineChart, Sparkles, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GetStarted() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Verify Maritime Fleet Profile', desc: 'Confirm business legal entity, registration, and verified enterprise badge.', completed: true, to: '/settings' },
    { id: 2, title: 'Schedule First Shipping Advisory', desc: 'Use the Planner to queue an ocean lane status or weather update.', completed: true, to: '/planner' },
    { id: 3, title: 'Review 28-Day Fleet Insights', desc: 'Inspect vessel reach, container impressions, and customer interactions.', completed: false, to: '/insights/overview' },
    { id: 4, title: 'Launch a Commercial Cargo Ad', desc: 'Promote reefer capacity or direct container routes via Ads Manager.', completed: false, to: '/ads-manager' },
    { id: 5, title: 'Configure Freight Inquiries & Instant Replies', desc: 'Set up automated answers for container booking questions in Inbox.', completed: false, to: '/messages' }
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="mbs-card p-6 bg-gradient-to-r from-blue-50/80 via-white to-sky-50/60 dark:from-slate-800 dark:via-[#242526] dark:to-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0866ff]" />
              <h1 className="text-xl font-bold text-[#050505] dark:text-white">
                Get Started with Business Shipping Suite
              </h1>
            </div>
            <p className="text-xs text-[#65676b] dark:text-slate-400 max-w-xl">
              Complete these setup steps to optimize your commercial freight presence, maximize customer engagement, and streamline maritime announcements.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-[#0866ff]">
              {progressPct}%
            </span>
            <span className="text-xs text-[#65676b] block">
              {completedCount} of {tasks.length} tasks completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#e4e6eb] dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-[#0866ff] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="mbs-card divide-y divide-[#e4e6eb] dark:divide-[#3e4042]">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#2c2d2e] transition-colors"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-[#0866ff] hover:opacity-80 transition-opacity"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 fill-[#0866ff] text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
              </button>
              <div>
                <h3 className={`text-xs font-bold ${task.completed ? 'line-through text-[#65676b]' : 'text-[#050505] dark:text-white'}`}>
                  {task.title}
                </h3>
                <p className="text-[11px] text-[#65676b] dark:text-slate-400 mt-0.5">
                  {task.desc}
                </p>
              </div>
            </div>

            <Link
              to={task.to}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0866ff] hover:underline shrink-0"
            >
              <span>Launch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
