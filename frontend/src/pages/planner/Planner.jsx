import React, { useState } from 'react';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Clock, CheckCircle2, AlertCircle, Ship, Film, FileText, Filter
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export default function Planner() {
  const { selectedBusiness } = useBusiness();
  const [currentView, setCurrentView] = useState('week'); // week or month
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledItems, setScheduledItems] = useState([
    {
      id: 1,
      day: 'Mon, Oct 5',
      time: '09:00 AM',
      type: 'post',
      title: 'Trans-Atlantic Express Weather Advisory #44',
      status: 'scheduled',
      channel: 'Main Fleet Facebook'
    },
    {
      id: 2,
      day: 'Mon, Oct 5',
      time: '02:30 PM',
      type: 'reel',
      title: 'Autonomous Cargo Drone Docking Demo',
      status: 'scheduled',
      channel: 'Fleet Instagram Reels'
    },
    {
      id: 3,
      day: 'Tue, Oct 6',
      time: '11:00 AM',
      type: 'story',
      title: 'Rotterdam Port Live Operations Story',
      status: 'scheduled',
      channel: 'Main Fleet Story'
    },
    {
      id: 4,
      day: 'Wed, Oct 7',
      time: '10:15 AM',
      type: 'post',
      title: 'Q4 Fuel Surcharge & IMO 2026 Compliance Update',
      status: 'scheduled',
      channel: 'Main Fleet Facebook'
    },
    {
      id: 5,
      day: 'Fri, Oct 9',
      time: '03:00 PM',
      type: 'video',
      title: 'Panama Canal Expansion Logistics Documentary',
      status: 'scheduled',
      channel: 'Fleet YouTube & Watch'
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDay, setNewPostDay] = useState('Thu, Oct 8');
  const [newPostTime, setNewPostTime] = useState('10:00 AM');
  const [newPostType, setNewPostType] = useState('post');

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;
    const item = {
      id: Date.now(),
      day: newPostDay,
      time: newPostTime,
      type: newPostType,
      title: newPostTitle.trim(),
      status: 'scheduled',
      channel: `${selectedBusiness?.name || 'Main Fleet'} Channel`
    };
    setScheduledItems([...scheduledItems, item]);
    setNewPostTitle('');
    setScheduleModalOpen(false);
  };

  const filteredItems = scheduledItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const weekDays = [
    { name: 'Monday', date: 'Oct 5', key: 'Mon, Oct 5' },
    { name: 'Tuesday', date: 'Oct 6', key: 'Tue, Oct 6' },
    { name: 'Wednesday', date: 'Oct 7', key: 'Wed, Oct 7' },
    { name: 'Thursday', date: 'Oct 8', key: 'Thu, Oct 8' },
    { name: 'Friday', date: 'Oct 9', key: 'Fri, Oct 9' },
    { name: 'Saturday', date: 'Oct 10', key: 'Sat, Oct 10' },
    { name: 'Sunday', date: 'Oct 11', key: 'Sun, Oct 11' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-5 h-5 text-[#0866ff]" />
            <h1 className="text-xl font-bold text-[#050505] dark:text-white">
              Planner
            </h1>
          </div>
          <p className="text-xs text-[#65676b] dark:text-slate-400">
            Plan, schedule, and organize shipping advisories, stories, and maritime fleet updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] p-0.5 bg-white dark:bg-[#242526]">
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'week' ? 'bg-[#0866ff] text-white' : 'text-[#65676b] hover:text-[#050505]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'month' ? 'bg-[#0866ff] text-white' : 'text-[#65676b] hover:text-[#050505]'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="mbs-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md border border-[#e4e6eb] dark:border-[#3e4042] hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4 text-[#65676b]" />
          </button>
          <span className="text-xs font-bold text-[#050505] dark:text-white px-2">
            October 5 – October 11, 2026
          </span>
          <button className="p-1 rounded-md border border-[#e4e6eb] dark:border-[#3e4042] hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronRight className="w-4 h-4 text-[#65676b]" />
          </button>
          <button className="text-xs font-semibold text-[#0866ff] hover:underline ml-2">
            Today
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#65676b] mr-1" />
          {['all', 'post', 'reel', 'story', 'video'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                selectedFilter === type
                  ? 'bg-slate-200 dark:bg-slate-700 text-[#050505] dark:text-white font-semibold'
                  : 'text-[#65676b] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Week Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const itemsForDay = filteredItems.filter(i => i.day === day.key);
          return (
            <div key={day.key} className="mbs-card flex flex-col min-h-[360px] p-3">
              {/* Day Header */}
              <div className="border-b border-[#e4e6eb] dark:border-[#3e4042] pb-2 mb-2 text-center">
                <span className="text-[11px] font-semibold text-[#65676b] dark:text-slate-400 block">
                  {day.name}
                </span>
                <span className="text-sm font-bold text-[#050505] dark:text-white">
                  {day.date}
                </span>
              </div>

              {/* Items List */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {itemsForDay.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-6 text-center text-[#65676b]">
                    <span className="text-[11px] italic">No posts</span>
                  </div>
                ) : (
                  itemsForDay.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] hover:border-[#0866ff] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0866ff] bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-[#65676b]">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-[#050505] dark:text-white line-clamp-2">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#65676b] block mt-1 truncate">
                        {item.channel}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => {
                  setNewPostDay(day.key);
                  setScheduleModalOpen(true);
                }}
                className="mt-2 w-full py-1 text-[11px] font-semibold text-[#0866ff] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-dashed border-[#0866ff]/40 flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Schedule Post Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-[#050505] dark:text-white">
              Schedule New Post
            </h2>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#65676b] block mb-1">Content Title / Advisory</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asia-Europe Lane Congestion Status"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#ced0d4] dark:border-[#3e4042] rounded-md focus:outline-none focus:border-[#0866ff] dark:bg-[#18191a] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#65676b] block mb-1">Target Day</label>
                  <select
                    value={newPostDay}
                    onChange={(e) => setNewPostDay(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#ced0d4] dark:border-[#3e4042] rounded-md dark:bg-[#18191a] dark:text-white"
                  >
                    {weekDays.map(d => (
                      <option key={d.key} value={d.key}>{d.name} ({d.date})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#65676b] block mb-1">Format</label>
                  <select
                    value={newPostType}
                    onChange={(e) => setNewPostType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#ced0d4] dark:border-[#3e4042] rounded-md capitalize dark:bg-[#18191a] dark:text-white"
                  >
                    <option value="post">Post</option>
                    <option value="reel">Reel</option>
                    <option value="story">Story</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042]">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-[#65676b] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0866ff] hover:bg-[#075ce6] rounded-md shadow-2xs"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
