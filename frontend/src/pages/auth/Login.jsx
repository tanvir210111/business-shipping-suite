import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Ship,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Anchor,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  const demoAccounts = [
    {
      role: 'admin',
      label: 'Admin (Captain)',
      email: 'admin@businessshipping.com',
      password: 'Admin@123',
      desc: 'Full fleet control & settings'
    },
    {
      role: 'manager',
      label: 'Fleet Manager',
      email: 'manager@businessshipping.com',
      password: 'Manager@123',
      desc: 'Operations & dispatch'
    },
    {
      role: 'viewer',
      label: 'Observer',
      email: 'viewer@businessshipping.com',
      password: 'Viewer@123',
      desc: 'Read-only analytics'
    }
  ];

  const handleSelectDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setActiveRole(account.role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Check email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* LEFT HERO & VALUE SHOWCASE (Desktop) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Meta Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0866ff]/10 border border-[#0866ff]/20 text-[#0866ff] text-xs font-bold tracking-wide">
          <Anchor className="w-3.5 h-3.5" />
          <span>MARITIME FLEET INTELLIGENCE</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#050505] tracking-tight leading-[1.15]">
          Manage global shipping, messaging & fleet analytics in one place.
        </h1>

        <p className="text-sm sm:text-base text-[#65676b] leading-relaxed max-w-xl">
          Unified command architecture built on the Meta Business Suite design standard. 
          Connect with shippers across WhatsApp and Messenger, monitor 24 container carriers via AIS telemetry, 
          and automate dispatch workflows effortlessly.
        </p>

        {/* 3 Interactive Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3.5 rounded-xl bg-white/80 border border-[#e4e6eb] shadow-xs backdrop-blur-sm hover:border-[#0866ff]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866ff] flex items-center justify-center mb-2.5">
              <Radio className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#050505]">4-Zone Dispatch</h2>
            <p className="text-[11px] text-[#65676b] mt-0.5">Unified Messenger & WhatsApp communications</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 border border-[#e4e6eb] shadow-xs backdrop-blur-sm hover:border-[#0866ff]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Globe2 className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#050505]">Live Telemetry</h2>
            <p className="text-[11px] text-[#65676b] mt-0.5">24 active vessels with real-time AIS route tracking</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 border border-[#e4e6eb] shadow-xs backdrop-blur-sm hover:border-[#0866ff]/40 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#050505]">98.4% On-Time</h2>
            <p className="text-[11px] text-[#65676b] mt-0.5">Automated bills of lading & port manifests</p>
          </div>
        </div>

        {/* Client trust footnote */}
        <div className="flex items-center gap-3 pt-2 text-xs text-[#65676b]">
          <div className="flex -space-x-1.5 overflow-hidden">
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" alt="Captain David Vance" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60" alt="Sarah Jenkins" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" alt="Marcus Thorne" />
          </div>
          <span>Trusted by 140+ maritime operators & shipping logistics hubs.</span>
        </div>
      </div>

      {/* RIGHT AUTH CARD */}
      <div className="lg:col-span-5 w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-[#e4e6eb] shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-[#0866ff] text-white shadow-lg shadow-[#0866ff]/25 mb-3">
              <Ship className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#050505]">
              Log in to Business Suite
            </h2>
            <p className="text-xs text-[#65676b] mt-1">
              Enter your enterprise credentials to access your fleet operations
            </p>
          </div>

          {/* Quick Demo Switcher Pills */}
          <div className="mb-6 p-3 rounded-xl bg-[#f0f2f5] border border-[#e4e6eb]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#050505] uppercase tracking-wider">
                1-Click Demo Login:
              </span>
              <span className="text-[10px] text-[#65676b]">Select Role</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((account) => {
                const isSelected = activeRole === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleSelectDemo(account)}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#0866ff] text-white shadow-xs'
                        : 'bg-white text-[#050505] hover:bg-slate-100 border border-[#e4e6eb]'
                    }`}
                  >
                    <div className="truncate">{account.role === 'admin' ? 'Captain' : account.role === 'manager' ? 'Manager' : 'Observer'}</div>
                  </button>
                );
              })}
            </div>
            {activeRole && (
              <div className="mt-2 text-[10px] text-emerald-700 font-medium flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Loaded {demoAccounts.find(a => a.role === activeRole)?.label} credentials</span>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Notice */}
          {forgotSent && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password reset instructions sent to your email.</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#050505] mb-1.5">
                Work Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#65676b] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setActiveRole(null);
                  }}
                  placeholder="admin@businessshipping.com"
                  required
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-[#ced0d4] bg-[#f0f2f5] text-[#050505] focus:bg-white focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 outline-none transition-all placeholder:text-[#65676b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#050505] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#65676b] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActiveRole(null);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-[#ced0d4] bg-[#f0f2f5] text-[#050505] focus:bg-white focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/20 outline-none transition-all placeholder:text-[#65676b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#65676b] hover:text-[#050505] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#65676b] select-none hover:text-[#050505]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0866ff] border-[#ced0d4] focus:ring-[#0866ff]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[#0866ff] hover:underline font-semibold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-xl bg-[#0866ff] hover:bg-[#075ce6] active:bg-[#0650c8] text-white text-sm font-bold shadow-md shadow-[#0866ff]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log In to Fleet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div className="mt-6 pt-4 border-t border-[#e4e6eb] text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#65676b]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by Meta Identity & Access Management (256-bit TLS)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
