'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { blogsApi } from '@/services/api/blogsApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  const fetchBlogs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await blogsApi.getBlogs({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
      });
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.blogs || []);
        const normalized = rawList.map((b) => ({
          ...b,
          id: b.id || b._id,
        }));
        setBlogs(normalized);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err?.message || 'Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCategory, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated, fetchBlogs]);

  const addBlog = useCallback(
    async (blogData) => {
      try {
        const res = await blogsApi.createBlog(blogData);
        if (res?.data) {
          const created = res.data.data || res.data;
          const normalized = { ...created, id: created.id || created._id };
          setBlogs((prev) => [normalized, ...prev]);
          adminContext?.addToast(`Blog published successfully!`, 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Failed to publish blog' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to publish blog', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateBlog = useCallback(
    async (id, updateFields) => {
      try {
        const res = await blogsApi.updateBlog(id, updateFields);
        if (res?.data) {
          const updated = res.data.data || res.data;
          const normalized = { ...updated, id: updated.id || updated._id };
          setBlogs((prev) => prev.map((b) => ((b.id || b._id) === id ? normalized : b)));
          adminContext?.addToast('Blog updated successfully', 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Update failed' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update blog', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const deleteBlog = useCallback(
    async (id) => {
      try {
        const res = await blogsApi.deleteBlog(id);
        setBlogs((prev) => prev.filter((b) => (b.id || b._id) !== id));
        adminContext?.addToast('Blog post deleted', 'info');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete blog', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        fetchBlogs,
        addBlog,
        updateBlog,
        deleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogs() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
}

export default BlogContext;
