'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '@/services/api/bookingsApi';
import { useAdmin } from './AdminContext';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsApi.getBookings({
        status: statusFilter,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = useCallback(async (id, newStatus) => {
    try {
      const res = await bookingsApi.updateBookingStatus(id, newStatus);
      if (res.success && res.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? res.data : b)));
        adminContext?.addToast(`Booking ${id} set to ${newStatus}`, 'success');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to update booking status', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const cancelBooking = useCallback(async (id, reason) => {
    try {
      const res = await bookingsApi.cancelBooking(id, reason);
      if (res.success && res.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? res.data : b)));
        adminContext?.addToast(`Booking ${id} has been cancelled`, 'info');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to cancel booking', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  // Derived metrics
  const totalRevenue = bookings.reduce((sum, b) => (b.status === 'Confirmed' ? sum + Number(b.totalAmount || 0) : sum), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        error,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        fetchBookings,
        updateStatus,
        cancelBooking,
        metrics: {
          totalRevenue,
          confirmedCount,
          pendingCount,
          cancelledCount,
          totalCount: bookings.length,
        },
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}

export default BookingContext;
