import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const destinationCategoriesApi = {
  /**
   * Get all destination categories / regions
   * GET /destination-categories
   */
  getCategories: async () => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  /**
   * Get single category by ID or Slug
   * GET /destination-categories/:idOrSlug
   */
  getCategoryById: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(idOrSlug));
  },

  /**
   * Create destination category
   * POST /destination-categories
   * Body: { name, slug, tagline, description, coverImage, order, status }
   */
  createCategory: async (categoryData) => {
    return apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
  },

  /**
   * Update destination category
   * PUT /destination-categories/:id
   */
  updateCategory: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), updatedFields);
  },

  /**
   * Delete destination category
   * DELETE /destination-categories/:id
   */
  deleteCategory: async (id) => {
    return apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  },
};

export default destinationCategoriesApi;
