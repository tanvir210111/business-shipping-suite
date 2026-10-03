import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';

export default function UserAccountControl({ compact = false }) {
  const { user, logout } = useAuth();
  const { selectedBusiness } = useBusiness();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const userName = user?.name || 'Captain David Vance';
  const userEmail = user?.email || 'admin@businessshipping.com';
  const userRole = user?.role || 'admin';
  const initial = userName.charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 pl-1.5 pr-2.5 sm:pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-[#e4e6eb] dark:hover:border-[#3e4042] transition-colors cursor-pointer select-none focus:outline-none"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        {/* Avatar with User's Initial */}
        <div className="w-8 h-8 rounded-full bg-[#0866ff] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs overflow-hidden shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {/* User Name (hidden on ultra-compact mobile view, shown on sm+) */}
        {!compact && (
          <span className="text-xs sm:text-sm font-semibold text-[#050505] dark:text-white hidden sm:inline-block max-w-[140px] md:max-w-[190px] truncate leading-none">
            {userName}
          </span>
        )}

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-[#65676b] dark:text-[#b0b3b8] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-[#242526] rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] shadow-[0_8px_28px_rgba(0,0,0,0.14)] p-2.5 z-50 animate-in fade-in duration-100"
          role="menu"
        >
          {/* User Info Header */}
          <div className="px-3 py-2.5 rounded-lg bg-[#f7f8fa] dark:bg-slate-800/40 mb-1.5 border border-[#e4e6eb]/70 dark:border-[#3e4042]/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0866ff] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#050505] dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate mt-0.5">
                  {userEmail}
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#e4e6eb]/60 dark:border-[#3e4042]/60 text-[11px]">
              <span className="px-2 py-0.5 rounded font-bold bg-[#0866ff]/10 text-[#0866ff] uppercase tracking-wide">
                {userRole}
              </span>
              <span className="text-[#65676b] dark:text-[#b0b3b8] truncate max-w-[140px]">
                {selectedBusiness?.name || 'Main Fleet'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-[13px] font-semibold text-[#050505] dark:text-white hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8]" />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-[13px] font-semibold text-[#050505] dark:text-white hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8]" />
              <span>Account Settings</span>
            </Link>

            {/* Separator */}
            <div className="border-t border-[#e4e6eb] dark:border-[#3e4042] my-1" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-[13px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
