'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { Sun } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { sidebarOpen } = useAdmin();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-spin-slow">
          <Sun className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-x-hidden">
      {/* 3D Undulating Wireframe Terrain Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-60"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="#cbd5e1" strokeWidth="0.85" strokeOpacity="0.7">
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

            {Array.from({ length: 48 }).map((_, j) => {
              const xBase = -100 + j * 36;
              const skew = (j - 24) * 8;
              const d = `M ${xBase + skew} 0 
                Q ${xBase + skew * 1.5 + Math.sin(j) * 20} 350 ${xBase + skew * 2.2} 600 
                T ${xBase + skew * 3.2} 950`;
              return <path key={`v-${j}`} d={d} fill="none" strokeWidth="0.65" strokeOpacity="0.5" />;
            })}

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

          <path
            d="M 0 450 Q 360 410 720 460 T 1440 430"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Admin Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative z-10 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

