'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import Logo from '@/components/common/Logo';
import {
  LayoutDashboard,
  MapPin,
  Package,
  BookOpen,
  Users,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'City Builder',
    href: '/admin/create-city',
    icon: MapPin,
    badge: '4 Cities',
  },
  {
    name: 'Packages',
    href: '/admin/packages',
    icon: Package,
    badge: '5 Tours',
  },
  {
    name: 'Travel Blogs',
    href: '/admin/blogs',
    icon: BookOpen,
    badge: '3 Posts',
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    badge: null,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    badge: 'Live',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAdmin();

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#0f172a] text-slate-200 border-r border-slate-800 transition-all duration-200 ease-in-out flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header with Official Logo & Toggle */}
      <div className="h-22 flex items-center justify-between px-3 border-b border-slate-800/90 bg-[#0b1120]">
        {sidebarOpen ? (
          <>
            <Link href="/admin" className="flex items-center gap-2 overflow-hidden flex-1 justify-center py-2">
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center justify-center">
                <Logo height={46} />
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              aria-label="Collapse Sidebar"
              title="Collapse Sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            aria-label="Expand Sidebar"
            title="Click to expand sidebar"
            className="w-full flex items-center justify-center py-2 group cursor-pointer"
          >
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center group-hover:ring-2 group-hover:ring-amber-400 transition-all">
              <Logo height={28} />
            </div>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {sidebarOpen && (
          <div className="px-3 pb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Navigation Menu
            </p>
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!sidebarOpen ? item.name : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-amber-500 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-400'}`} />
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-slate-800 text-amber-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Profile & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800 bg-[#0b1120]">
        {sidebarOpen ? (
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                JV
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Jodhpur Admin</p>
                <p className="text-[10px] text-amber-400 font-mono truncate">user1</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white transition-all cursor-pointer border border-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}


export default Sidebar;
