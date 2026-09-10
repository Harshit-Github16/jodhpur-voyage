'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useEnquiries } from '@/context/EnquiryContext';
import Logo from '@/components/common/Logo';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ExternalLink,
  Plus,
  MessageSquare,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const {
    toggleSidebar,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    globalSearch,
    setGlobalSearch,
  } = useAdmin();
  const { user, logout } = useAuth();
  const { newCount: newEnquiriesCount } = useEnquiries();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="w-full shrink-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] z-30 transition-all">
      {/* Left Area: Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-slate-200"
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Mobile Logo */}
        <div className="flex items-center md:hidden shrink-0">
          <Logo height={30} />
        </div>

        {/* Universal Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tours, cities, guests, bookings..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-slate-400 shadow-2xs"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Area: Actions, Quick Enquiries, Notifications & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick New Leads Pill */}
        {newEnquiriesCount > 0 && (
          <Link
            href="/admin/enquiries"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-bold transition-all shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>{newEnquiriesCount} New Leads</span>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200/90 p-4 z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h4 className="font-black text-slate-900 text-xs">Notifications</h4>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-amber-600 hover:text-amber-800 font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-2.5 rounded-lg cursor-pointer text-xs transition-colors ${
                        notif.read
                          ? 'bg-slate-50 hover:bg-slate-100'
                          : 'bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                        {notif.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@jodhpurvoyage.com'}</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>General Settings</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
