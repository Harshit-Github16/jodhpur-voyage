import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const blogsApi = {
  /**
   * Get all blogs with filtering, search, and pagination
   * GET /blogs
   * Params: { category, search, featured, status, page, limit }
   */
  getBlogs: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.BLOGS.LIST, { params });
  },

  /**
   * Get single blog by ID or Slug
   * GET /blogs/:idOrSlug
   */
  getBlogById: async (idOrSlug) => {
    return apiClient.get(API_ENDPOINTS.BLOGS.DETAIL(idOrSlug));
  },

  /**
   * Create new Blog post
   * POST /blogs
   * Body: { title, slug, excerpt, content, coverImage, category, tags, author, readTime, featured, status }
   */
  createBlog: async (blogData) => {
    return apiClient.post(API_ENDPOINTS.BLOGS.CREATE, blogData);
  },

  /**
   * Update existing blog
   * PUT /blogs/:id
   */
  updateBlog: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.BLOGS.UPDATE(id), updatedFields);
  },

  /**
   * Delete blog
   * DELETE /blogs/:id
   */
  deleteBlog: async (id) => {
    return apiClient.delete(API_ENDPOINTS.BLOGS.DELETE(id));
  },

  /**
   * Sync WordPress blogs
   * POST /blogs/sync-wordpress
   */
  syncWordPress: async (syncData = {}) => {
    return apiClient.post(API_ENDPOINTS.BLOGS.SYNC_WP, syncData);
  },
};

export default blogsApi;
