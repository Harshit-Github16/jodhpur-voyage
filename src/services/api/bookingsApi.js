import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const bookingsApi = {
  /**
   * Create a new booking (Public & Logged-in Customers)
   * POST /bookings
   * Body: { tourId, customerName, customerEmail, customerPhone, travelDate, guests: { adults, children }, totalAmount, paymentMethod, specialRequests }
   */
  createBooking: async (bookingData) => {
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
  },

  /**
   * Get my bookings (Customer Portal)
   * GET /bookings/my-bookings
   */
  getMyBookings: async () => {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS);
  },

  /**
   * Get single booking by ID
   * GET /bookings/:id
   */
  getBookingById: async (id) => {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.DETAIL(id));
  },

  /**
   * Get all bookings (Admin Panel) with search, status, paymentStatus, pagination
   * GET /bookings
   * Params: { status, paymentStatus, search, page, limit }
   */
  getBookings: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params });
  },

  /**
   * Update booking status & payment status
   * PATCH /bookings/:id/status
   * Body: { status, paymentStatus }
   */
  updateBookingStatus: async (id, statusPayload) => {
    const payload =
      typeof statusPayload === 'string'
        ? { status: statusPayload }
        : statusPayload;

    return apiClient.patch(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id), payload);
  },

  /**
   * Cancel booking
   * POST /bookings/:id/cancel
   * Body: { reason }
   */
  cancelBooking: async (id, reason = '') => {
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason });
  },
};

export default bookingsApi;
