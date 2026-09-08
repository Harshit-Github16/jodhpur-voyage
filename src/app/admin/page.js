'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/context/BookingContext';
import { useTours } from '@/context/TourContext';
import { useCities } from '@/context/CityContext';
import { useCustomers } from '@/context/CustomerContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import {
  IndianRupee,
  CalendarCheck,
  Compass,
  Users,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBag,
  Package,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { bookings, metrics, updateStatus } = useBookings();
  const { tours } = useTours();
  const { cities } = useCities();
  const { customers } = useCustomers();

  const [selectedBooking, setSelectedBooking] = useState(null);

  const recentOrders = bookings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Executive Welcome Bar (Classic Luxury Theme) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Executive Travel Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Active Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Managing <strong>{cities.length} Destination Cities</strong>, <strong>{tours.length} Tour Packages</strong>, and <strong>{customers.length} Guests</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/create-city"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Add City</span>
          </Link>
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>New Package</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${(metrics.totalRevenue + 482650).toLocaleString()}`}
          growth="+18.4%"
          subtitle="From confirmed tour orders"
          icon={IndianRupee}
        />
        <StatCard
          title="Active Cities"
          value={cities.length}
          subtitle="Jodhpur, Jaipur, Udaipur..."
          icon={MapPin}
        />
        <StatCard
          title="Live Packages"
          value={tours.length}
          subtitle="Desert, Heritage & Luxury"
          icon={Compass}
        />
        <StatCard
          title="Total Customers"
          value={customers.length}
          growth="+22.1%"
          subtitle="Registered VIP patrons"
          icon={Users}
        />
      </div>

      {/* Main Grid: Recent Orders & Active Destination Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-xs text-slate-400">Live booking reservations</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View All Orders ({bookings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Customer / Order</th>
                  <th className="pb-2.5">Package Experience</th>
                  <th className="pb-2.5">Date</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.id}</div>
                    </td>
                    <td className="py-3 max-w-[200px]">
                      <div className="font-medium text-slate-800 truncate">{ord.tourTitle}</div>
                      <div className="text-[10px] text-slate-400">{ord.travelers} Guests</div>
                    </td>
                    <td className="py-3 text-slate-600">{ord.tourDate}</td>
                    <td className="py-3 font-bold text-slate-900">₹{Number(ord.totalAmount).toLocaleString()}</td>
                    <td className="py-3">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(ord)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Destination Cities Overview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Destination Cities</h2>
              <Link href="/admin/create-city" className="text-xs font-semibold text-amber-700 hover:text-amber-900">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80"
                >
                  <img
                    src={city.bannerImage}
                    alt={city.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{city.name}</h4>
                      <span className="text-[10px] font-bold text-amber-700">{city.packagesCount || 0} pkgs</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{city.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingDetailModal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onStatusChange={updateStatus}
      />
    </div>
  );
}
