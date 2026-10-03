import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, MessageCircle, Send, CheckCircle2, Clock, User, ShieldCheck,
  Search, Filter, Tag, FileText, Settings, Sparkles, Megaphone,
  Check, Phone, Video, MoreHorizontal, UserCheck, Ship, Plus, X,
  Paperclip, Image, Smile, List, ChevronDown, ExternalLink, AlertCircle,
  Calendar, MapPin, Mail, SlidersHorizontal, Info, Eye, Download
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function Messages() {
  const { selectedBusiness } = useBusiness();
  const [inboxMode, setInboxMode] = useState('messages'); // 'messages' | 'leads'
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [filterChip, setFilterChip] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [thread, setThread] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCustomerPanel, setShowCustomerPanel] = useState(true);

  // Customer panel editable state
  const [customerNote, setCustomerNote] = useState('Reefer container logistics inquiry for Rotterdam arrival. Demurrage free period: 7 calendar days.');
  const [labels, setLabels] = useState(['High Priority', 'Ocean Freight', 'Rotterdam', 'Reefer 40ft']);
  const [newLabelInput, setNewLabelInput] = useState('');
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('Available');
  const [availabilityDropdownOpen, setAvailabilityDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const channels = [
    { id: 'all', label: 'All messages', count: 7, icon: MessageSquare },
    { id: 'messenger', label: 'Messenger', count: 3, icon: MessageCircle, color: 'text-blue-500' },
    { id: 'instagram', label: 'Instagram', count: 2, icon: MessageCircle, color: 'text-pink-500' },
    { id: 'whatsapp', label: 'WhatsApp', count: 2, icon: Phone, color: 'text-emerald-500' },
    { id: 'fb_comments', label: 'Facebook comments', count: 0, icon: MessageSquare },
    { id: 'ig_comments', label: 'Instagram comments', count: 0, icon: MessageCircle }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'unread', label: 'Unread' },
    { id: 'priority', label: 'Priority / Urgent' },
    { id: 'ad_replies', label: 'Ad Replies' },
    { id: 'follow_up', label: 'Follow up' }
  ];

  const fetchConversations = () => {
    setLoading(true);
    api.get(`/messages?businessId=${selectedBusiness?.id || 1}`)
      .then((res) => {
        const list = res.data.conversations || [];
        setConversations(list);
        if (list.length > 0 && !activeConv) {
          setActiveConv(list[0]);
        }
      })
      .catch((err) => console.error('Failed to load conversations:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, [selectedBusiness]);

  useEffect(() => {
    if (!activeConv) return;
    api.get(`/messages/${activeConv.id}/thread`)
      .then((res) => {
        setThread(res.data.replies || []);
        scrollToBottom();
      })
      .catch((err) => console.error('Failed to load thread:', err));
  }, [activeConv]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    const outgoingContent = replyText.trim();
    setSending(true);

    api.post(`/messages/${activeConv.id}/reply`, { content: outgoingContent })
      .then(() => {
        const newReply = {
          id: Date.now(),
          sender_type: 'user',
          content: outgoingContent,
          created_at: new Date().toISOString()
        };
        setThread((prev) => [...prev, newReply]);
        setReplyText('');

        // Update conversation list latest message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? { ...c, last_message: outgoingContent, updated_at: new Date().toISOString() }
              : c
          )
        );
        scrollToBottom();
      })
      .catch((err) => console.error('Failed to send reply:', err))
      .finally(() => setSending(false));
  };

  const handleAddLabel = () => {
    if (newLabelInput.trim() && !labels.includes(newLabelInput.trim())) {
      setLabels([...labels, newLabelInput.trim()]);
      setNewLabelInput('');
      setShowAddLabel(false);
    }
  };

  const handleRemoveLabel = (labelToRemove) => {
    setLabels(labels.filter((l) => l !== labelToRemove));
  };

  const filteredConversations = conversations.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.sender_name?.toLowerCase().includes(q);
      const matchMsg = c.last_message?.toLowerCase().includes(q);
      if (!matchName && !matchMsg) return false;
    }

    if (filterChip === 'unread' && c.status !== 'unread') return false;
    if (filterChip === 'priority') {
      const msg = (c.last_message || '').toLowerCase();
      if (!msg.includes('urgent') && !msg.includes('reefer') && !msg.includes('demurrage')) {
        return false;
      }
    }
    return true;
  });

  // Assign simulated channel icons & colors to conversations based on index
  const getChannelBadge = (id) => {
    if (id % 3 === 0) return { icon: MessageCircle, color: 'bg-blue-600', name: 'Messenger' };
    if (id % 3 === 1) return { icon: MessageCircle, color: 'bg-pink-600', name: 'Instagram' };
    return { icon: Phone, color: 'bg-emerald-600', name: 'WhatsApp' };
  };

  return (
    <div className="h-[calc(100vh-56px)] lg:h-screen flex flex-col bg-white dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb] font-sans overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Messages | Leads Center | Available | Automations | Create Ad) */}
      {/* ========================================================================= */}
      <header className="h-11 border-b border-[#e4e6eb] dark:border-[#3e4042] px-4 flex items-center justify-between shrink-0 bg-white dark:bg-[#242526] select-none z-10">
        {/* Left Side: Tabs */}
        <div className="flex items-center gap-6 h-full text-[13px]">
          <button
            onClick={() => setInboxMode('messages')}
            className={`h-full flex items-center font-bold relative transition-colors ${
              inboxMode === 'messages'
                ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
                : 'text-[#65676b] hover:text-[#050505] dark:hover:text-white'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setInboxMode('leads')}
            className={`h-full flex items-center font-bold relative transition-colors ${
              inboxMode === 'leads'
                ? 'text-[#0866ff] border-b-2 border-[#0866ff]'
                : 'text-[#65676b] hover:text-[#050505] dark:hover:text-white'
            }`}
          >
            Leads Center
          </button>
        </div>

        {/* Right Side: Meta-Style Compact Controls */}
        <div className="flex items-center gap-2">
          {/* Availability Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAvailabilityDropdownOpen(!availabilityDropdownOpen)}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#242526] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] text-[11.5px] font-semibold text-[#050505] dark:text-white transition-colors shadow-2xs"
            >
              <span className={`w-2 h-2 rounded-full ${availabilityStatus === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{availabilityStatus}</span>
              <ChevronDown className="w-3 h-3 text-[#65676b]" />
            </button>

            {availabilityDropdownOpen && (
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3e4042] rounded-lg shadow-xl py-1 z-50 text-[12px]">
                <button
                  onClick={() => { setAvailabilityStatus('Available'); setAvailabilityDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available</span>
                </button>
                <button
                  onClick={() => { setAvailabilityStatus('Away'); setAvailabilityDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Away</span>
                </button>
              </div>
            )}
          </div>

          {/* Automations Button */}
          <button
            onClick={() => alert('Automations: Instant Dispatch Reply & Container Status Keywords Active')}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-white dark:bg-[#242526] hover:bg-slate-50 dark:hover:bg-[#3a3b3c] text-[11.5px] font-semibold text-[#050505] dark:text-white transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Automations</span>
          </button>

          {/* Create Ad Button */}
          <a
            href="/ads"
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-[11.5px] font-semibold text-white transition-colors shadow-2xs"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Create Ad</span>
          </a>

          {/* Settings / Filters Icon */}
          <button
            onClick={() => alert('Inbox Settings: Notification sound, assignment routing, and auto-archive.')}
            className="p-1 rounded-md text-[#65676b] hover:text-[#050505] hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Inbox Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4-ZONE WORKSPACE BODY */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        
        {/* ========================================================================= */}
        {/* ZONE 1: CHANNEL & FILTER SIDEBAR (~180px) */}
        {/* ========================================================================= */}
        <aside className="w-[180px] shrink-0 border-r border-[#e4e6eb] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] flex flex-col justify-between p-2 select-none overflow-y-auto hidden md:flex">
          <div className="space-y-3">
            {/* Channels Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] px-2 block mb-1">
                CHANNELS
              </span>
              <div className="space-y-0.5">
                {channels.map((ch) => {
                  const isSelected = selectedChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#e7f3ff] text-[#0866ff] font-bold dark:bg-blue-900/30'
                          : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-slate-200/60 dark:hover:bg-[#2c2d2e]'
                      }`}
                    >
                      <span className="truncate">{ch.label}</span>
                      {ch.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-[#0866ff] text-white' : 'bg-slate-200 dark:bg-slate-700 text-[#65676b]'
                        }`}>
                          {ch.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[1px] bg-[#e4e6eb] dark:bg-[#3e4042] mx-1" />

            {/* Filter By Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] px-2 block mb-1">
                FILTER BY
              </span>
              <div className="space-y-0.5">
                {filterOptions.map((f) => {
                  const isSelected = filterChip === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilterChip(f.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#e7f3ff] text-[#0866ff] font-bold dark:bg-blue-900/30'
                          : 'text-[#65676b] hover:bg-slate-200/60 dark:hover:bg-[#2c2d2e]'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom App Promo / Channel Link */}
          <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 text-[10.5px] text-[#65676b] space-y-1">
            <span className="font-bold text-[#050505] dark:text-white block">Connected Fleets</span>
            <p className="line-clamp-2">Direct messaging synced with WhatsApp Business API.</p>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* ZONE 2: CONVERSATION LIST (~315px) */}
        {/* ========================================================================= */}
        <section className="w-[315px] shrink-0 border-r border-[#e4e6eb] dark:border-[#3e4042] bg-white dark:bg-[#242526] flex flex-col min-w-0">
          {/* Search Bar Container */}
          <div className="p-2.5 border-b border-[#e4e6eb] dark:border-[#3e4042]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#65676b]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-md bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-white placeholder:text-[#65676b] focus:outline-none focus:ring-1 focus:ring-[#0866ff] border border-transparent"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#3a3b3c]">
            {loading ? (
              <div className="p-4 space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-2.5 w-44 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#65676b]">
                No conversations found matching criteria.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = activeConv?.id === c.id;
                const badge = getChannelBadge(c.id);
                const BadgeIcon = badge.icon;
                const isUnread = c.status === 'unread';

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConv(c)}
                    className={`p-2.5 flex items-start gap-2.5 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-[#f0f7ff] dark:bg-blue-950/20 border-l-[3px] border-l-[#0866ff]'
                        : 'hover:bg-[#f7f8fa] dark:hover:bg-[#2c2d2e] border-l-[3px] border-l-transparent'
                    }`}
                  >
                    {/* Avatar with Channel Pill */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#050505] dark:text-white border border-[#e4e6eb]">
                        {c.sender_name?.[0] || 'C'}
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full ${badge.color} text-white absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-[#242526] flex items-center justify-center shadow-xs`}>
                        <BadgeIcon className="w-2 h-2" />
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[12.5px] truncate max-w-[155px] ${
                          isUnread ? 'font-bold text-[#050505] dark:text-white' : 'font-semibold text-[#050505] dark:text-[#e4e6eb]'
                        }`}>
                          {c.sender_name}
                        </span>
                        <span className="text-[10px] text-[#65676b] shrink-0 ml-1">
                          {formatDate(c.updated_at || c.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-[11.5px] truncate ${
                          isUnread ? 'font-bold text-[#050505] dark:text-white' : 'text-[#65676b] dark:text-slate-400'
                        }`}>
                          {c.last_message}
                        </p>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#0866ff] shrink-0 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ZONE 3: CONVERSATION VIEWER (Flexible Center) */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#18191a] relative">
          {activeConv ? (
            <>
              {/* Conversation Top Header */}
              <div className="h-12 border-b border-[#e4e6eb] dark:border-[#3e4042] px-4 flex items-center justify-between bg-white dark:bg-[#242526] shrink-0 z-10">
                {/* Left: Customer Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#0866ff] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {activeConv.sender_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-[13px] font-bold text-[#050505] dark:text-white truncate">
                        {activeConv.sender_name}
                      </h2>
                      <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#0866ff] font-semibold border border-blue-100">
                        Verified Shipper
                      </span>
                    </div>
                    <span className="text-[10.5px] text-[#65676b] block truncate">
                      Active on WhatsApp • Demurrage & Cargo Support
                    </span>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-1 text-[#65676b]">
                  <button
                    onClick={() => alert(`Call customer dispatch: +1 (713) 555-0198`)}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="Audio Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Start video survey for cargo inspection`)}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowCustomerPanel(!showCustomerPanel)}
                    className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      showCustomerPanel ? 'text-[#0866ff] bg-blue-50' : 'text-[#65676b]'
                    }`}
                    title="Toggle Customer Information Panel"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert('Options: Mark unread, assign agent, archive, block.')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="More actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7f8fa] dark:bg-[#18191a]">
                {/* Date separator */}
                <div className="flex justify-center my-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#65676b] bg-slate-200/70 dark:bg-slate-800 px-3 py-0.5 rounded-full">
                    Today, Oct 3, 2026
                  </span>
                </div>

                {/* Multi-turn Thread Bubbles */}
                {thread.map((t) => {
                  const isMe = t.sender_type === 'user';
                  return (
                    <div
                      key={t.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-lg ${isMe ? 'ml-auto' : ''}`}
                    >
                      <div
                        className={`p-3 text-[12.5px] leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-[#0866ff] text-white rounded-2xl rounded-tr-xs'
                            : 'bg-white dark:bg-[#242526] text-[#050505] dark:text-white border border-[#e4e6eb] dark:border-[#3e4042] rounded-2xl rounded-tl-xs'
                        }`}
                      >
                        {t.content}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#65676b] mt-1 px-1">
                        <span>{t.created_at ? formatDate(t.created_at) : 'Just now'}</span>
                        {isMe && (
                          <span className="text-[#0866ff] font-medium flex items-center gap-0.5">
                            • Delivered <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer (Meta Business Suite Style) */}
              <form
                onSubmit={handleSendReply}
                className="p-2.5 border-t border-[#e4e6eb] dark:border-[#3e4042] bg-white dark:bg-[#242526] flex items-center gap-2 shrink-0"
              >
                {/* Action Icons */}
                <div className="flex items-center gap-1 text-[#65676b]">
                  <button
                    type="button"
                    onClick={() => alert('Attach customs document, bill of lading, or temperature log PDF')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Upload container inspection photo or damage claim image')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="Attach Photo"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyText('Standard demurrage free time confirmed at 7 days. Tracking link has been activated.')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#050505] transition-colors"
                    title="Quick Saved Replies"
                  >
                    <List className="w-4 h-4 text-purple-600" />
                  </button>
                </div>

                {/* Input Text Box */}
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 h-8 px-3 rounded-full bg-[#f0f2f5] dark:bg-[#18191a] text-[12px] text-[#050505] dark:text-white placeholder:text-[#65676b] focus:outline-none focus:ring-1 focus:ring-[#0866ff] border border-transparent"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="h-8 px-3 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 shadow-2xs shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </>
          ) : (
            /* ========================================================================= */
            /* 8. EMPTY INBOX STATE (When no conversation is selected) */
            /* ========================================================================= */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#18191a]">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0866ff] flex items-center justify-center mb-4 shadow-inner">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-[#050505] dark:text-white mb-1.5">
                You don't have any messages right now.
              </h3>
              <p className="text-xs text-[#65676b] dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                Connect an Instagram or WhatsApp Business channel to centralize all customer inquiries, freight quotes, and port advisories in one unified Inbox.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Connect Channel: Launching Meta Business Manager integration modal')}
                  className="px-4 py-2 rounded-md bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Connect Channel
                </button>
                <a
                  href="/ads"
                  className="px-4 py-2 rounded-md border border-[#ced0d4] dark:border-[#3e4042] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#050505] dark:text-white transition-colors"
                >
                  Create Messaging Ad
                </a>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* ZONE 4: CUSTOMER INFORMATION PANEL (~270px) */}
        {/* ========================================================================= */}
        {activeConv && showCustomerPanel && (
          <aside className="w-[270px] shrink-0 border-l border-[#e4e6eb] dark:border-[#3e4042] bg-white dark:bg-[#242526] overflow-y-auto flex flex-col p-3.5 space-y-4 select-none hidden lg:flex">
            
            {/* 1. About Customer */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] block mb-2">
                ABOUT CUSTOMER
              </span>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-[#050505] dark:text-white border border-[#e4e6eb]">
                  {activeConv.sender_name?.[0] || 'C'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#050505] dark:text-white leading-tight">
                    {activeConv.sender_name}
                  </h4>
                  <span className="text-[10.5px] text-[#65676b]">Global Logistics & Freight Client</span>
                </div>
              </div>

              {/* Quick Details */}
              <div className="space-y-1.5 text-[11px] text-[#65676b] bg-[#f7f8fa] dark:bg-[#18191a] p-2.5 rounded-lg border border-[#e4e6eb] dark:border-[#3e4042]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">dispatch@{activeConv.sender_name?.toLowerCase().replace(/[^a-z]/g, '') || 'freight'}.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>+1 (713) 555-0198</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Port of Houston, TX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>09:42 AM (Local Time)</span>
                </div>
              </div>
            </div>

            {/* 2. Labels */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b]">
                  LABELS
                </span>
                <button
                  onClick={() => setShowAddLabel(!showAddLabel)}
                  className="text-[10.5px] text-[#0866ff] hover:underline font-semibold"
                >
                  + Add
                </button>
              </div>

              {showAddLabel && (
                <div className="flex items-center gap-1 mb-2">
                  <input
                    type="text"
                    placeholder="New label..."
                    value={newLabelInput}
                    onChange={(e) => setNewLabelInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                    className="flex-1 px-2 py-1 text-xs border rounded bg-[#f0f2f5] dark:bg-[#18191a]"
                  />
                  <button
                    onClick={handleAddLabel}
                    className="px-2 py-1 rounded bg-[#0866ff] text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-[#0866ff] border border-blue-200 dark:border-blue-800"
                  >
                    <span>{lbl}</span>
                    <button onClick={() => handleRemoveLabel(lbl)} className="hover:text-rose-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Notes */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] block mb-1.5">
                NOTES
              </span>
              <textarea
                rows={3}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Add private operational notes for dispatch team..."
                className="w-full p-2 text-[11.5px] rounded-md border border-[#ced0d4] dark:border-[#3e4042] bg-[#f7f8fa] dark:bg-[#18191a] text-[#050505] dark:text-white focus:bg-white focus:outline-none focus:border-[#0866ff] resize-none"
              />
              <span className="text-[9.5px] text-[#65676b] block text-right mt-0.5">Auto-saved</span>
            </div>

            {/* 4. Past Shipments (Business Shipping Suite Unique Value) */}
            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65676b] block mb-2">
                PAST SHIPMENTS
              </span>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-lg bg-[#f7f8fa] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#3e4042]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#050505] dark:text-white">BSS-78921</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Delivered
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#65676b]">Rotterdam Reefer • 40ft High Cube</p>
                  <span className="text-[9.5px] text-slate-400">Voyage EU-Atlantic #44</span>
                </div>

                <div className="p-2 rounded-lg bg-[#f7f8fa] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#3e4042]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[#050505] dark:text-white">BSS-44091</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">
                      In Transit
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#65676b]">Houston Barbours Cut • IMO Class 3</p>
                  <span className="text-[9.5px] text-slate-400">ETA: Oct 6, 2026</span>
                </div>
              </div>
            </div>

            {/* 5. Quick Actions */}
            <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#3e4042] space-y-1">
              <button
                onClick={() => alert(`Marked conversation with ${activeConv.sender_name} as unread.`)}
                className="w-full py-1.5 px-2 text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-[#65676b] font-medium transition-colors"
              >
                Mark as Unread
              </button>
              <button
                onClick={() => alert(`Exporting chat transcript for shipment ${activeConv.sender_name}`)}
                className="w-full py-1.5 px-2 text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-[#65676b] font-medium transition-colors"
              >
                Export Chat Transcript
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
