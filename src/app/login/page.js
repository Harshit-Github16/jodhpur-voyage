'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import Logo from '@/components/common/Logo';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useAdmin();

  // Pre-filled credentials
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('12345');
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
      const res = await login({ email: username, username, password });
      if (res.success) {
        addToast('Welcome to Jodhpur Voyage Portal', 'success', 2500);
        router.push('/admin');
      } else {
        setErrorMessage(res.message || 'Invalid username or password');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden select-none">
      {/* 3D Undulating Wireframe Terrain Mesh Background (matching reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-75"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Topographical Wave Contours */}
          <g stroke="#cbd5e1" strokeWidth="0.85" strokeOpacity="0.8">
            {/* Horizontal terrain elevation curves */}
            {Array.from({ length: 32 }).map((_, i) => {
              const yBase = 80 + i * 26;
              const amp1 = Math.sin(i * 0.35) * 45;
              const amp2 = Math.cos(i * 0.28) * 35;
              const d = `M -100 ${yBase} 
                Q 200 ${yBase - amp1} 450 ${yBase + amp2} 
                T 950 ${yBase - amp2 * 0.8} 
                T 1550 ${yBase + amp1 * 0.6}`;
              return <path key={`h-${i}`} d={d} fill="none" />;
            })}

            {/* Vertical perspective cross-grid lines for 3D terrain mesh */}
            {Array.from({ length: 48 }).map((_, j) => {
              const xBase = -100 + j * 36;
              const skew = (j - 24) * 8;
              const d = `M ${xBase + skew} 0 
                Q ${xBase + skew * 1.5 + Math.sin(j) * 20} 350 ${xBase + skew * 2.2} 600 
                T ${xBase + skew * 3.2} 950`;
              return <path key={`v-${j}`} d={d} fill="none" strokeWidth="0.65" strokeOpacity="0.6" />;
            })}

            {/* Diagonal isometric wireframe facets */}
            {Array.from({ length: 24 }).map((_, k) => {
              const startX = -200 + k * 80;
              return (
                <line
                  key={`diag-${k}`}
                  x1={startX}
                  y1="0"
                  x2={startX + 600}
                  y2="900"
                  stroke="#e2e8f0"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              );
            })}
          </g>

          {/* Golden Yellow Accent Horizon Line */}
          <path
            d="M 0 450 Q 360 410 720 460 T 1440 430"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeOpacity="0.35"
            fill="none"
          />
        </svg>

        {/* Soft Vignette Overlay for focus on central card */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#f8fafc]/30 to-[#f8fafc]/80 pointer-events-none" />
      </div>

      {/* Center White Card matching reference demo screenshot */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(15,23,42,0.08)] border border-slate-200/90 relative z-10 space-y-6">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Logo height={58} className="mb-1" />
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">
            ADMINISTRATOR PORTAL
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center animate-in fade-in duration-150">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Email Address / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="superadmin"
              className="w-full bg-[#f8fafc] hover:bg-slate-100/60 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium rounded-xl border border-slate-300/80 px-3.5 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setUsername('superadmin');
                  setPassword('12345');
                }}
                className="text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors"
              >
                Reset Default
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-[#f8fafc] hover:bg-slate-100/60 focus:bg-white text-slate-900 text-xs sm:text-sm font-medium rounded-xl border border-slate-300/80 px-3.5 py-3 pr-10 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
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

          {/* Solid Black Sign In Button matching reference screenshot */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black hover:bg-slate-900 active:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl py-3.5 px-4 transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Signing In...' : 'SIGN IN'}</span>
            </button>
          </div>
        </form>

        {/* Demo Credentials Footer */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Demo Access: <strong className="text-slate-700">superadmin</strong> / <strong className="text-slate-700">12345</strong>
          </p>
        </div>
      </div>
    </div>
  );
}


