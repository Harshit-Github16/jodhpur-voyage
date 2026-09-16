'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { sidebarOpen } = useAdmin();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#fafaf9] text-slate-800 antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Luxury Warm White & Royal Golden Amber Ambient Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-amber-100/35 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-orange-100/25 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-amber-50/20 via-transparent to-amber-50/10" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Admin Area with Permanently Fixed Top Navbar */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out relative z-10 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Fixed Header at Top */}
        <Navbar />

        {/* Full-width Scrollable Container (scrollbar positioned at the screen edge, not in the middle) */}
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <div className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-7 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
