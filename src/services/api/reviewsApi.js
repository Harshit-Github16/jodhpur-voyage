import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const reviewsApi = {
  /**
   * Get reviews with filters
   * GET /reviews
   * Params: { tourId, featured, status, page, limit }
   */
  getReviews: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.REVIEWS.LIST, { params });
  },

  /**
   * Submit review (Logged-in or Guest)
   * POST /reviews
   * Body: { tourId, authorName, authorAvatar, authorLocation, rating, title, comment, photos }
   */
  createReview: async (reviewData) => {
    return apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
  },

  /**
   * Update review status & moderation
   * PATCH /reviews/:id/status
   * Body: { status, featured }
   */
  updateReviewStatus: async (id, statusPayload) => {
    const payload =
      typeof statusPayload === 'string'
        ? { status: statusPayload }
        : statusPayload;

    return apiClient.patch(API_ENDPOINTS.REVIEWS.UPDATE_STATUS(id), payload);
  },

  /**
   * Delete review
   * DELETE /reviews/:id
   */
  deleteReview: async (id) => {
    return apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
  },
};

export default reviewsApi;
