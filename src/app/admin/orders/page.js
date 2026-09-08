'use client';

import React, { useState } from 'react';
import { useBookings } from '@/context/BookingContext';
import StatusBadge from '@/components/admin/StatusBadge';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import {
  ShoppingBag,
  Search,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MapPin,
} from 'lucide-react';

const ORDER_TABS = [
  { id: 'All', label: 'All Orders' },
  { id: 'Confirmed', label: 'Confirmed' },
  { id: 'Pending', label: 'Pending Payment' },
  { id: 'Cancelled', label: 'Cancelled' },
];

export default function OrdersManagementPage() {
  const { bookings, loading, statusFilter, setStatusFilter, searchQuery, setSearchQuery, updateStatus, metrics } = useBookings();
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Current Orders & Reservations</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time customer tour reservations, payments, and itinerary fulfillment statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs">
          <div>Total Orders: <strong className="text-slate-900">{metrics.totalCount}</strong></div>
          <span className="text-slate-300">|</span>
          <div className="text-emerald-700 font-semibold">Confirmed: {metrics.confirmedCount}</div>
          <span className="text-slate-300">|</span>
          <div className="text-amber-700 font-semibold">Pending: {metrics.pendingCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by customer name, order ID, tour package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Package Experience</th>
                <th className="py-3 px-3">Travel Date & Guests</th>
                <th className="py-3 px-3">Total Paid</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  {/* Order ID */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{ord.id}</span>
                    <span className="text-[10px] text-slate-400">
                      {ord.createdAt?.slice(0, 10) || '2026-09-08'}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-500">{ord.customerEmail}</div>
                  </td>

                  {/* Package */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="font-medium text-slate-800 line-clamp-1">{ord.tourTitle}</div>
                  </td>

                  {/* Date & Guests */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{ord.tourDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {ord.travelers} Guests
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-3">
                    <span className="font-black text-slate-900 text-sm">
                      ₹{Number(ord.totalAmount).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{ord.paymentMethod || 'UPI'}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <StatusBadge status={ord.status} />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                      {ord.status !== 'Confirmed' && (
                        <button
                          onClick={() => updateStatus(ord.id, 'Confirmed')}
                          className="p-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          title="Confirm Order"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <BookingDetailModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        booking={selectedOrder}
        onStatusChange={updateStatus}
      />
    </div>
  );
}
