import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const enquiriesApi = {
  /**
   * Submit enquiry / contact form
   * POST /enquiries
   * Body: { name, email, phone, tourId, travelDate, guestsCount, message, type }
   */
  createEnquiry: async (enquiryData) => {
    return apiClient.post(API_ENDPOINTS.ENQUIRIES.CREATE, enquiryData);
  },

  /**
   * Get all enquiries (Admin / Staff)
   * GET /enquiries
   * Params: { status, type, search, page, limit }
   */
  getEnquiries: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.ENQUIRIES.LIST, { params });
  },

  /**
   * Update enquiry status & note
   * PATCH /enquiries/:id/status
   * Body: { status, note }
   */
  updateEnquiryStatus: async (id, statusPayload) => {
    const payload =
      typeof statusPayload === 'string'
        ? { status: statusPayload }
        : statusPayload;

    return apiClient.patch(API_ENDPOINTS.ENQUIRIES.UPDATE_STATUS(id), payload);
  },

  /**
   * Delete enquiry
   * DELETE /enquiries/:id
   */
  deleteEnquiry: async (id) => {
    return apiClient.delete(API_ENDPOINTS.ENQUIRIES.DELETE(id));
  },
};

export default enquiriesApi;
