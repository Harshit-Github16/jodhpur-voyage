'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import Logo from '@/components/common/Logo';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Plane,
  Compass,
  MapPin,
  Sparkles,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sun,
  Camera,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useAdmin();

  // Input credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await login({ email: username, password });
      if (res.success) {
        addToast('Welcome back to Jodhpur Voyage Portal', 'success', 2500);
        router.push('/admin');
      } else {
        setErrorMessage(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* User Uploaded Desert Sunset Landscape Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/login-desert-bg.jpg"
          alt="Jodhpur Desert Sunset"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft Golden Sunset & Dark Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-black/30 backdrop-blur-[0.5px]" />
      </div>

      {/* Center White Luxury Card */}
      <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200/90 relative z-10 space-y-6">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 rounded-2xl bg-amber-50/70 border border-amber-200/50 shadow-2xs inline-block">
            <Logo height={52} className="mb-0" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>ADMINISTRATOR PORTAL</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage tour packages, destinations, blogs & enquiries
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center animate-in fade-in duration-150">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Email Address / Username
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin"
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => handleQuickFill('superadmin', '12345')}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 transition-colors"
              >
                Reset Default
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Solid Obsidian & Gold Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0f172a] hover:bg-slate-800 active:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3 px-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* 1-Click Quick Demo Login Chips */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick Demo Login (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('superadmin', '12345')}
              className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-left transition-colors cursor-pointer"
            >
              <p className="text-[11px] font-bold text-amber-900">👑 Superadmin</p>
              <p className="text-[9px] text-amber-700 font-mono">superadmin / 12345</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@jodhpurvoyage.com', 'jodhpur@2025')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer"
            >
              <p className="text-[11px] font-bold text-slate-800">🧭 Tour Manager</p>
              <p className="text-[9px] text-slate-500 font-mono">admin@jodhpur...</p>
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Encrypted Admin Session • Jodhpur Voyage</span>
        </div>
      </div>
    </div>
  );
}


