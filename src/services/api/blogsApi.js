import apiClient, { executeApi } from './client';
import { INITIAL_BLOGS } from './mockData';

let blogsStore = [...INITIAL_BLOGS];

export const blogsApi = {
  /**
   * Get all blogs with optional category / search filtering
   */
  getBlogs: async (params = {}) => {
    return executeApi(
      apiClient.get('/blogs', { params }),
      () => {
        let filtered = [...blogsStore];
        if (params.category && params.category !== 'All') {
          filtered = filtered.filter((b) => b.category.toLowerCase() === params.category.toLowerCase());
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.excerpt.toLowerCase().includes(q) ||
              b.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }
        if (params.status && params.status !== 'All') {
          filtered = filtered.filter((b) => b.status.toLowerCase() === params.status.toLowerCase());
        }
        return { success: true, count: filtered.length, data: filtered };
      }
    );
  },

  /**
   * Get single blog by ID or Slug
   */
  getBlogById: async (id) => {
    return executeApi(
      apiClient.get(`/blogs/${id}`),
      () => {
        const blog = blogsStore.find((b) => b.id === id || b.slug === id);
        if (!blog) throw { success: false, status: 404, message: 'Blog article not found' };
        return { success: true, data: blog };
      }
    );
  },

  /**
   * Create new blog post
   */
  createBlog: async (blogData) => {
    return executeApi(
      apiClient.post('/blogs', blogData),
      () => {
        const newBlog = {
          id: `blog-${Date.now()}`,
          slug: blogData.slug || blogData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-blog-post',
          views: 0,
          status: blogData.status || 'Published',
          featured: Boolean(blogData.featured),
          tags: Array.isArray(blogData.tags) ? blogData.tags : [],
          publishedAt: new Date().toISOString(),
          authorAvatar: blogData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          readTime: blogData.readTime || '4 min read',
          ...blogData,
        };
        blogsStore = [newBlog, ...blogsStore];
        return {
          success: true,
          message: 'Blog published successfully',
          data: newBlog,
        };
      }
    );
  },

  /**
   * Update blog post
   */
  updateBlog: async (id, updatedFields) => {
    return executeApi(
      apiClient.put(`/blogs/${id}`, updatedFields),
      () => {
        const index = blogsStore.findIndex((b) => b.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'Blog post not found' };
        blogsStore[index] = { ...blogsStore[index], ...updatedFields };
        return {
          success: true,
          message: 'Blog updated successfully',
          data: blogsStore[index],
        };
      }
    );
  },

  /**
   * Delete blog post
   */
  deleteBlog: async (id) => {
    return executeApi(
      apiClient.delete(`/blogs/${id}`),
      () => {
        blogsStore = blogsStore.filter((b) => b.id !== id);
        return {
          success: true,
          message: 'Blog post deleted',
          deletedId: id,
        };
      }
    );
  },
};

export default blogsApi;
