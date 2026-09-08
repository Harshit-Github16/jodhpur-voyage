'use client';

import React, { useState } from 'react';
import { useCustomers } from '@/context/CustomerContext';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

export default function CustomersPage() {
  const { customers, loading, searchQuery, setSearchQuery } = useCustomers();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filtered = customers.filter((c) => {
    if (selectedFilter === 'VIP') return c.badge?.includes('VIP') || c.badge?.includes('Patron');
    if (selectedFilter === 'Active') return c.status === 'Active';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Customer Directory</h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {customers.length} Guests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered travelers, booking history, lifetime spend, and contact preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedFilter === 'All' ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Guests
          </button>
          <button
            onClick={() => setSelectedFilter('VIP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedFilter === 'VIP' ? 'bg-[#0f172a] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            VIP Patrons
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0f172a]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Origin City</th>
                <th className="py-3 px-3">Bookings</th>
                <th className="py-3 px-3">Lifetime Spend</th>
                <th className="py-3 px-3">Membership</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name with initials */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0f172a] text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{cust.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{cust.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>

                  {/* Origin */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{cust.city}</span>
                    </div>
                  </td>

                  {/* Bookings */}
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {cust.totalBookings} Tours
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>

                  {/* Badge */}
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Award className="w-3 h-3 text-amber-600" />
                      {cust.badge}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
