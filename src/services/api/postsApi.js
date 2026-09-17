import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const postsApi = {
  /**
   * Get all posts with filtering, search, and pagination
   * GET /posts
   * Params: { category, search, status, page, limit }
   */
  getPosts: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.POSTS.LIST, { params });
  },

  /**
   * Get single post by Slug or ID
   * GET /posts/:slug
   */
  getPostBySlug: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.POSTS.DETAIL(idOrSlug));
  },

  /**
   * Create new Post
   * POST /posts
   * Body: { title, slug, excerpt, content, coverImage, category, tags, author, readTime, status }
   */
  createPost: async (postData) => {
    return apiClient.post(API_ENDPOINTS.POSTS.CREATE, postData);
  },

  /**
   * Update existing post
   * PUT /posts/:id
   */
  updatePost: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.POSTS.UPDATE(id), updatedFields);
  },

  /**
   * Delete post
   * DELETE /posts/:id
   */
  deletePost: async (id) => {
    return apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },

  /**
   * Sync WordPress posts
   * POST /posts/sync-wordpress
   */
  syncWordPress: async (syncData = {}) => {
    return apiClient.post(API_ENDPOINTS.POSTS.SYNC_WP, syncData);
  },
};

export default postsApi;
