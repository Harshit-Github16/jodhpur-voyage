import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const toursApi = {
  /**
   * Get all tours with query filters, search, and pagination
   * GET /tours
   * Params: { search, category, cityId, minPrice, maxPrice, duration, featured, status, sort, page, limit }
   */
  getTours: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.TOURS.LIST, { params });
  },

  /**
   * Get single tour package by ID or Slug
   * GET /tours/:idOrSlug
   */
  getTourById: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.TOURS.DETAIL(idOrSlug));
  },

  /**
   * Create a new tour package
   * POST /tours
   */
  createTour: async (tourData) => {
    return apiClient.post(API_ENDPOINTS.TOURS.CREATE, tourData);
  },

  /**
   * Update an existing tour package
   * PUT /tours/:id
   */
  updateTour: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.TOURS.UPDATE(id), updatedFields);
  },

  /**
   * Delete a tour package
   * DELETE /tours/:id
   */
  deleteTour: async (id) => {
    return apiClient.delete(API_ENDPOINTS.TOURS.DELETE(id));
  },
};

export default toursApi;
