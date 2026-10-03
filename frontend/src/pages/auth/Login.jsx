import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Ship, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('admin@businessshipping.com');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-brand-600 to-sky-700 text-white shadow-lg mb-3">
          <Ship className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Business Shipping Suite
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sign in to access your logistics insights and fleet analytics
        </p>
      </div>

      {/* Demo Credentials Quick Pill */}
      <div className="mb-6 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-brand-900 dark:text-brand-300">Demo Account Credentials:</span>
          <button
            type="button"
            onClick={autofillDemo}
            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Auto-fill
          </button>
        </div>
        <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] space-y-0.5">
          <div>Email: <strong className="text-slate-800 dark:text-slate-200">admin@businessshipping.com</strong></div>
          <div>Password: <strong className="text-slate-800 dark:text-slate-200">Admin@123</strong></div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Forgot Notice */}
      {forgotSent && (
        <div className="mb-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Password reset dispatched to your email address.</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@businessshipping.com"
              required
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full text-xs pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 border-slate-300 dark:border-slate-700"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setForgotSent(true)}
            className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 mt-2 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>
    </div>
  );
}
