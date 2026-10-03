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
        className="flex items-center gap-2 p-1 pl-1 pr-2 sm:pr-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 border border-transparent hover:border-[#e4e6eb] dark:hover:border-[#3e4042] transition-colors cursor-pointer select-none focus:outline-none"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        {/* Avatar with User's Initial */}
        <div className="w-7 h-7 rounded-full bg-[#0866ff] text-white flex items-center justify-center font-bold text-xs shadow-2xs overflow-hidden shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {/* User Name (hidden on ultra-compact mobile view, shown on sm+) */}
        {!compact && (
          <span className="text-[12px] font-semibold text-[#050505] dark:text-white hidden sm:inline-block max-w-[130px] md:max-w-[170px] truncate leading-none">
            {userName}
          </span>
        )}

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#65676b] dark:text-[#b0b3b8] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-68 bg-white dark:bg-[#242526] rounded-xl border border-[#e4e6eb] dark:border-[#3e4042] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in duration-100"
          role="menu"
        >
          {/* User Info Header */}
          <div className="px-2.5 py-2 rounded-lg bg-[#f7f8fa] dark:bg-slate-800/40 mb-1 border border-[#e4e6eb]/60 dark:border-[#3e4042]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0866ff] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[#050505] dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] truncate">
                  {userEmail}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[#e4e6eb]/50 dark:border-[#3e4042]/50 text-[10px]">
              <span className="px-1.5 py-0.5 rounded font-bold bg-[#0866ff]/10 text-[#0866ff] uppercase tracking-wide">
                {userRole}
              </span>
              <span className="text-[#65676b] dark:text-[#b0b3b8] truncate max-w-[130px]">
                {selectedBusiness?.name || 'Main Fleet'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-semibold text-[#050505] dark:text-white hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 text-[#65676b] dark:text-[#b0b3b8]" />
              <span>Profile</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-semibold text-[#050505] dark:text-white hover:bg-slate-100 dark:hover:bg-[#3a3b3c] transition-colors"
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
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
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
