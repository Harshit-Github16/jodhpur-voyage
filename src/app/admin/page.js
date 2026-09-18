'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/context/BookingContext';
import { useTours } from '@/context/TourContext';
import { useCities } from '@/context/CityContext';
import { useEnquiries } from '@/context/EnquiryContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import {
  IndianRupee,
  Compass,
  Plus,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Package,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Download,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { bookings, metrics, updateStatus } = useBookings();
  const { tours } = useTours();
  const { cities } = useCities();
  const { enquiries, newCount, updateStatus: updateEnquiryStatus, exportToCSV } = useEnquiries();

  const [selectedBooking, setSelectedBooking] = useState(null);

  const recentOrders = bookings.slice(0, 5);
  const recentEnquiries = enquiries.slice(0, 4);

  const handleWhatsAppClick = (lead) => {
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Namaste ${lead.name}! Greetings from Jodhpur Voyage. We received your inquiry regarding "${lead.packageInterest || lead.destination || 'Rajasthan Tour'}". How may we assist you with your personalized itinerary?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Executive Welcome Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Executive Travel Control Center
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{user?.name || 'Administrator'}</strong>. Real-time overview of Rajasthan tours, guest inquiries, and confirmed bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Package</span>
          </Link>
          <Link
            href="/admin/create-city"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Add City</span>
          </Link>
          <button
            onClick={() => exportToCSV()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200/80 cursor-pointer"
            title="Download Leads CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Leads</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries / Leads"
          value={enquiries.length}
          growth={newCount > 0 ? `${newCount} New Pending` : 'Up to date'}
          subtitle="Guest contact & quote requests"
          icon={MessageSquare}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(metrics.totalRevenue + 0).toLocaleString()}`}
          growth="+18.4% this month"
          subtitle="From confirmed tour orders"
          icon={IndianRupee}
        />
        <StatCard
          title="Active Tour Packages"
          value={tours.length}
          subtitle="Desert, Heritage & Luxury"
          icon={Compass}
        />
        <StatCard
          title="Destination Cities"
          value={cities.length}
          subtitle="Jodhpur, Jaipur, Udaipur..."
          icon={MapPin}
        />
      </div>

      {/* Action Center / Pending Tasks Banner */}
      {newCount > 0 && (
        <div className="bg-linear-to-r from-amber-50 via-orange-50/70 to-amber-50 border border-amber-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Action Required: Pending Inquiries
                </h3>
                <p className="text-xs text-slate-700 mt-0.5">
                  You have <strong className="text-amber-900">{newCount} new guest inquiries</strong> awaiting response.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/enquiries"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors shadow-2xs"
              >
                Respond ({newCount})
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid Section: Recent Leads & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Enquiries / Leads Panel */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900">Recent Customer Leads</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                  {enquiries.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct WhatsApp & Email reply</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEnquiries.map((lead) => (
              <div key={lead.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{lead.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${lead.status === 'New'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : lead.status === 'Converted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                    {lead.packageInterest || lead.destination} • {lead.travelers} Guests • {lead.preferredDate || 'Flexible'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {lead.phone} • {lead.email}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleWhatsAppClick(lead)}
                    title="Send WhatsApp Message"
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors border border-emerald-200 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                  <a
                    href={`mailto:${lead.email}?subject=Regarding Your Rajasthan Tour Inquiry - Jodhpur Voyage&body=Dear ${lead.name},%0D%0A%0D%0AThank you for reaching out to Jodhpur Voyage.`}
                    title="Send Email"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200/80"
                  >
                    <span>Email</span>
                  </a>
                  <select
                    value={lead.status}
                    onChange={(e) => updateEnquiryStatus(lead.id, e.target.value)}
                    className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders / Bookings Panel */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">Recent Tour Bookings</h2>
              <p className="text-xs text-slate-400">Confirmed reservations & payments</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Guest / Order</th>
                  <th className="pb-2.5">Tour Package</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.id}</div>
                    </td>
                    <td className="py-2.5 max-w-[150px]">
                      <div className="font-medium text-slate-800 truncate">{ord.tourTitle}</div>
                      <div className="text-[10px] text-slate-400">{ord.travelers} Guests • {ord.tourDate}</div>
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">₹{Number(ord.totalAmount).toLocaleString()}</td>
                    <td className="py-2.5">
                      <StatusBadge status={ord.status} />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedBooking(ord)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer"
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
      </div>

      {/* Destinations & Quick Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Destinations List */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">Destination Hubs</h2>
              <p className="text-xs text-slate-400">Rajasthan royal cities and regional hubs</p>
            </div>
            <Link href="/admin/create-city" className="text-xs font-bold text-amber-700 hover:text-amber-800">
              Manage Cities ({cities.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cities.map((city) => (
              <div
                key={city.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-amber-400 transition-all group shadow-2xs"
              >
                <img
                  src={city.bannerImage}
                  alt={city.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{city.name}</h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {city.packagesCount || 0} pkgs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{city.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h2 className="text-sm font-black text-slate-900">Quick Shortcuts</h2>
          <div className="space-y-2">
            <Link
              href="/admin/packages"
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-100 transition-all text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Tour Packages & Itineraries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/blogs"
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-100 transition-all text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Publish New Blog Post</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-100 transition-all text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                <span>Website Brand & Contact Settings</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
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
