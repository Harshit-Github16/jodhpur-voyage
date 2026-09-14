import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { destinationCategoriesApi } from './destinationCategoriesApi';

export const citiesApi = {
  getCategories: destinationCategoriesApi.getCategories,
  createCategory: destinationCategoriesApi.createCategory,
  updateCategory: destinationCategoriesApi.updateCategory,
  deleteCategory: destinationCategoriesApi.deleteCategory,

  /**
   * Get all cities with search, categoryId, featured, status, pagination
   * GET /cities
   * Params: { search, categoryId, featured, status, page, limit }
   */
  getCities: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.CITIES.LIST, { params });
  },

  /**
   * Get city by ID or Slug
   * GET /cities/:idOrSlug
   */
  getCityById: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.CITIES.DETAIL(idOrSlug));
  },

  /**
   * Create new City
   * POST /cities
   * Body: { name, slug, categoryId, state, tagline, heroTitle, bannerImage, gallery, highlights, faqs, featured, status }
   */
  createCity: async (cityData) => {
    return apiClient.post(API_ENDPOINTS.CITIES.CREATE, cityData);
  },

  /**
   * Update existing city
   * PUT /cities/:id
   */
  updateCity: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.CITIES.UPDATE(id), updatedFields);
  },

  /**
   * Delete city
   * DELETE /cities/:id
   */
  deleteCity: async (id) => {
    return apiClient.delete(API_ENDPOINTS.CITIES.DELETE(id));
  },
};

export default citiesApi;
