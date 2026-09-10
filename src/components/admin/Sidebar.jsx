'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useEnquiries } from '@/context/EnquiryContext';
import { useReviews } from '@/context/ReviewContext';
import { useTours } from '@/context/TourContext';
import { useCities } from '@/context/CityContext';
import Logo from '@/components/common/Logo';
import {
  LayoutDashboard,
  MapPin,
  Package,
  BookOpen,
  Users,
  ShoppingBag,
  MessageSquare,
  Star,
  UserCheck,
  ShieldCheck,
  Settings,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useAdmin();
  const { user } = useAuth();

  const { newCount: newEnquiriesCount } = useEnquiries();
  const { pendingCount: pendingReviewsCount } = useReviews();
  const { tours } = useTours();
  const { cities } = useCities();

  const NAV_SECTIONS = [
    {
      group: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      group: 'TRAVEL INVENTORY',
      items: [
        {
          name: 'Destinations',
          href: '/admin/create-city',
          icon: MapPin,
          badge: cities?.length ? `${cities.length} Cities` : null,
        },
        {
          name: 'Tour Packages',
          href: '/admin/packages',
          icon: Package,
          badge: tours?.length ? `${tours.length} Tours` : null,
        },
        {
          name: 'Travel Blogs',
          href: '/admin/blogs',
          icon: BookOpen,
          badge: null,
        },
      ],
    },
    {
      group: 'GUEST RELATIONS',
      items: [
        {
          name: 'Enquiries / Leads',
          href: '/admin/enquiries',
          icon: MessageSquare,
          badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} New` : null,
          badgeStyle: 'bg-amber-500 text-slate-950 font-black shadow-xs',
        },
        {
          name: 'Reviews & Ratings',
          href: '/admin/reviews',
          icon: Star,
          badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Pending` : null,
          badgeStyle: 'bg-rose-500 text-white font-black shadow-xs',
        },
        {
          name: 'Bookings & Orders',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: 'Live',
        },
        {
          name: 'Customers',
          href: '/admin/customers',
          icon: Users,
          badge: null,
        },
      ],
    },
    {
      group: 'SYSTEM & SETTINGS',
      items: [
        {
          name: 'Team Members',
          href: '/admin/team',
          icon: UserCheck,
          badge: null,
        },
        {
          name: 'Staff & Roles',
          href: '/admin/users',
          icon: ShieldCheck,
          badge: null,
        },
        {
          name: 'General Settings',
          href: '/admin/settings',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#090e1a] text-slate-200 border-r border-slate-800/80 transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80 bg-[#060a14]">
        {sidebarOpen ? (
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden flex-1 py-1 group">
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-amber-400 transition-all">
              <Logo height={32} />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[13px] font-black tracking-tight text-white leading-none">
                JODHPUR<span className="text-amber-400">VOYAGE</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-wider mt-1 uppercase">
                Travel Central
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="w-full flex items-center justify-center py-1 group">
            <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center group-hover:ring-2 group-hover:ring-amber-400 transition-all">
              <Logo height={26} />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto custom-scrollbar">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 pb-1">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {section.group}
                </p>
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!sidebarOpen ? item.name : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-slate-950 scale-105' : 'text-amber-400/80'
                    }`}
                  />
                  {sidebarOpen && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full leading-none font-bold ${
                            item.badgeStyle
                              ? item.badgeStyle
                              : isActive
                              ? 'bg-slate-950/20 text-slate-950'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
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
        ))}
      </div>

      {/* Footer Profile Box without duplicate chevron button */}
      <div className="p-3 border-t border-slate-800/80 bg-[#060a14]">
        {sidebarOpen ? (
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JV'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'admin@jodhpurvoyage.com'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-black flex items-center justify-center text-xs shadow-xs border border-slate-800">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JV'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
