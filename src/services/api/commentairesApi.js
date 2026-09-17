import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const commentairesApi = {
  /**
   * Get all commentaires with filtering, search, and pagination
   * GET /commentaires
   * Params: { rating, search, status, page, limit }
   */
  getCommentaires: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.COMMENTAIRES.LIST, { params });
  },

  /**
   * Get single commentaire by Slug or ID
   * GET /commentaires/:slug
   */
  getCommentaireBySlug: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.COMMENTAIRES.DETAIL(idOrSlug));
  },

  /**
   * Create new Commentaire
   * POST /commentaires
   * Body: { author, title, content, rating, tour, status }
   */
  createCommentaire: async (data) => {
    return apiClient.post(API_ENDPOINTS.COMMENTAIRES.CREATE, data);
  },

  /**
   * Update existing commentaire
   * PUT /commentaires/:id
   */
  updateCommentaire: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.COMMENTAIRES.UPDATE(id), updatedFields);
  },

  /**
   * Delete commentaire
   * DELETE /commentaires/:id
   */
  deleteCommentaire: async (id) => {
    return apiClient.delete(API_ENDPOINTS.COMMENTAIRES.DELETE(id));
  },

  /**
   * Sync WordPress commentaires
   * POST /commentaires/sync-wordpress
   */
  syncWordPress: async (syncData = {}) => {
    return apiClient.post(API_ENDPOINTS.COMMENTAIRES.SYNC_WP, syncData);
  },
};

export default commentairesApi;
