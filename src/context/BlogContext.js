'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { blogsApi } from '@/services/api/blogsApi';
import { useAdmin } from './AdminContext';

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    setError(null);
    try {
      const res = await blogsApi.getBlogs({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
      });
      if (res?.data) {
        setBlogs(Array.isArray(res.data) ? res.data : res.data.data || []);
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
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const addBlog = useCallback(
    async (blogData) => {
      try {
        const res = await blogsApi.createBlog(blogData);
        if (res?.data) {
          const created = res.data.data || res.data;
          setBlogs((prev) => [created, ...prev]);
          adminContext?.addToast(`Blog published successfully!`, 'success');
          return { success: true, data: created };
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
          setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
          adminContext?.addToast('Blog updated successfully', 'success');
          return { success: true, data: updated };
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
        setBlogs((prev) => prev.filter((b) => b.id !== id));
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
