import apiClient, { executeApi } from './client';
import { API_ENDPOINTS } from './endpoints';
import { INITIAL_BOOKINGS } from './mockData';

let bookingsStore = [...INITIAL_BOOKINGS];

export const bookingsApi = {
  /**
   * Get list of bookings with filtering
   */
  getBookings: async (params = {}) => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params }),
      () => {
        let filtered = [...bookingsStore];
        if (params.status && params.status !== 'All') {
          filtered = filtered.filter((b) => b.status.toLowerCase() === params.status.toLowerCase());
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.customerName.toLowerCase().includes(q) ||
              b.customerEmail.toLowerCase().includes(q) ||
              b.id.toLowerCase().includes(q) ||
              b.tourTitle.toLowerCase().includes(q)
          );
        }
        return {
          success: true,
          count: filtered.length,
          data: filtered,
        };
      }
    );
  },

  /**
   * Get single booking by ID
   */
  getBookingById: async (id) => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.BOOKINGS.DETAIL(id)),
      () => {
        const booking = bookingsStore.find((b) => b.id === id);
        if (!booking) throw { success: false, status: 404, message: 'Booking not found' };
        return { success: true, data: booking };
      }
    );
  },

  /**
   * Create a new booking
   */
  createBooking: async (bookingData) => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData),
      () => {
        const newBooking = {
          id: `BK-2025-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Confirmed',
          paymentStatus: 'Paid',
          createdAt: new Date().toISOString(),
          ...bookingData,
        };
        bookingsStore = [newBooking, ...bookingsStore];
        return {
          success: true,
          message: 'Booking created successfully',
          data: newBooking,
        };
      }
    );
  },

  /**
   * Update booking status (e.g. Confirmed, Pending, Cancelled)
   */
  updateBookingStatus: async (id, status) => {
    return executeApi(
      apiClient.patch(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), { status }),
      () => {
        const index = bookingsStore.findIndex((b) => b.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'Booking not found' };
        bookingsStore[index] = { ...bookingsStore[index], status };
        return {
          success: true,
          message: `Booking marked as ${status}`,
          data: bookingsStore[index],
        };
      }
    );
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id, reason = '') => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason }),
      () => {
        const index = bookingsStore.findIndex((b) => b.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'Booking not found' };
        bookingsStore[index] = { ...bookingsStore[index], status: 'Cancelled', paymentStatus: 'Refunded' };
        return {
          success: true,
          message: 'Booking cancelled successfully',
          data: bookingsStore[index],
        };
      }
    );
  },
};

export default bookingsApi;
