'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useEnquiries } from '@/context/EnquiryContext';
import { useTours } from '@/context/TourContext';
import { useCities } from '@/context/CityContext';
import Logo from '@/components/common/Logo';
import {
  LayoutDashboard,
  MapPin,
  Package,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Settings,
  ChevronLeft,
  X,
  Newspaper,
  MessageSquareText,
  UsersRound,
  GalleryHorizontalEnd,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAdmin();
  const { user } = useAuth();

  const { newCount: newEnquiriesCount } = useEnquiries();
  const { tours } = useTours();
  const { cities } = useCities();

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

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
        {
          name: 'Posts',
          href: '/admin/posts',
          icon: Newspaper,
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
          name: 'Commentaries',
          href: '/admin/commentaries',
          icon: MessageSquareText,
          badge: null,
        },
        {
          name: 'Bookings & Orders',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: 'Live',
        },
      ],
    },
    {
      group: 'COMPANY',
      items: [
        {
          name: 'Who We Are',
          href: '/admin/who-we-are',
          icon: UsersRound,
          badge: null,
        },
        {
          name: 'Hero Slider',
          href: '/admin/hero-slider',
          icon: GalleryHorizontalEnd,
          badge: null,
        },
      ],
    },
    {
      group: 'SYSTEM & SETTINGS',
      items: [
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
    <>
      {/* Mobile Backdrop Overlay - Click outside to close sidebar on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200 cursor-pointer"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 md:z-30 h-screen bg-[#090e1a] text-slate-200 border-r border-slate-800/80 transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${
          sidebarOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        {/* Brand Header with prominent Collapse / Close button */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-[#060a14] shrink-0 gap-2">
          {sidebarOpen ? (
            <>
              <Link
                href="/admin"
                onClick={handleNavClick}
                className="flex items-center gap-2.5 min-w-0 flex-1 py-1 group overflow-hidden"
              >
                <div className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-amber-400 transition-all">
                  <Logo height={28} />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-black tracking-tight text-white leading-none truncate">
                    JODHPUR<span className="text-amber-400">VOYAGE</span>
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 tracking-wider mt-1 uppercase truncate">
                    Travel Central
                  </span>
                </div>
              </Link>

              {/* Prominent Collapse / Close Button */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-amber-400 hover:text-slate-950 bg-slate-800/90 hover:bg-amber-400 border border-slate-700 hover:border-amber-400 transition-all cursor-pointer shrink-0 shadow-sm flex items-center justify-center"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4 hidden md:block" />
                <X className="w-4 h-4 md:hidden" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center py-1">
              <button
                type="button"
                onClick={toggleSidebar}
                className="bg-white rounded-xl p-1.5 shadow-sm flex items-center justify-center hover:ring-2 hover:ring-amber-400 transition-all cursor-pointer"
                title="Expand Sidebar"
              >
                <Logo height={26} />
              </button>
            </div>
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
                    onClick={handleNavClick}
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

        {/* Footer Profile Box */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060a14] shrink-0">
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
    </>
  );
}

export default Sidebar;

