'use client';

import React from 'react';
import { X, Calendar, User, Mail, Phone, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

export function BookingDetailModal({ isOpen, onClose, booking, onStatusChange }) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">{booking.id}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Tour Package
            </div>
            <p className="font-bold text-slate-900 text-xs">
              {booking.tourTitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Customer</span>
              <span className="font-bold text-slate-900">{booking.customerName}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Date</span>
              <span className="font-bold text-slate-900">{booking.tourDate}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Email</span>
              <span className="text-slate-700 truncate block">{booking.customerEmail}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Total Amount</span>
              <span className="font-bold text-slate-900">₹{Number(booking.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Status buttons */}
          <div className="pt-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Change Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onStatusChange(booking.id, 'Confirmed');
                  onClose();
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold border ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  onStatusChange(booking.id, 'Pending');
                  onClose();
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold border ${
                  booking.status === 'Pending'
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  onStatusChange(booking.id, 'Cancelled');
                  onClose();
                }}
                className={`py-1.5 px-2 rounded-lg font-semibold border ${
                  booking.status === 'Cancelled'
                    ? 'bg-rose-700 text-white border-rose-700'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
