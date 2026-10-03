import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Ship, HelpCircle, ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#edf3fa] via-[#f7f9fc] to-[#e8eff8] flex flex-col justify-between text-[#050505] selection:bg-[#0866ff] selection:text-white relative">
      {/* Subtle Ambient Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#0866ff]/8 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      {/* Top Enterprise Header */}
      <header className="relative z-10 w-full border-b border-[#e4e6eb] bg-white/70 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0866ff] text-white flex items-center justify-center shadow-md shadow-[#0866ff]/20">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[15px] tracking-tight text-[#050505]">
                  Business Shipping Suite
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0866ff]/10 text-[#0866ff]">
                  META ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-[#65676b] -mt-0.5">Maritime Operations & Global Dispatch Hub</p>
            </div>
          </div>

          {/* Right Status & Support Links */}
          <div className="flex items-center gap-4 text-xs text-[#65676b]">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <a
              href="https://business.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-[#0866ff] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Docs</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Meta Enterprise Footer */}
      <footer className="relative z-10 w-full border-t border-[#e4e6eb] bg-white/60 backdrop-blur-sm py-4 px-6 text-xs text-[#65676b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px]">
            <span>English (US)</span>
            <span>•</span>
            <span className="hover:text-[#0866ff] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#0866ff] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#0866ff] cursor-pointer">Security & Compliance</span>
            <span>•</span>
            <span className="hover:text-[#0866ff] cursor-pointer">Fleet API</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>© 2026 Business Shipping Suite • Meta Work & Logistics Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
