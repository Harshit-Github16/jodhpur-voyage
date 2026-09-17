'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { postsApi } from '@/services/api/postsApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const PostContext = createContext(null);

export function PostProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  const fetchPosts = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postsApi.getPosts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: searchQuery || undefined,
        limit: 'all',
      });
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.posts || []);
        const normalized = rawList.map((p) => ({
          ...p,
          id: p.id || p._id,
        }));
        setPosts(normalized);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err?.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, fetchPosts]);

  const addPost = useCallback(
    async (postData) => {
      try {
        const res = await postsApi.createPost(postData);
        if (res?.data) {
          const created = res.data.data || res.data;
          const normalized = { ...created, id: created.id || created._id };
          setPosts((prev) => [normalized, ...prev]);
          adminContext?.addToast('Post created successfully!', 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Failed to create post' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to create post', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updatePost = useCallback(
    async (id, updateFields) => {
      try {
        const res = await postsApi.updatePost(id, updateFields);
        if (res?.data) {
          const updated = res.data.data || res.data;
          const normalized = { ...updated, id: updated.id || updated._id };
          setPosts((prev) => prev.map((p) => ((p.id || p._id) === id ? normalized : p)));
          adminContext?.addToast('Post updated successfully', 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Update failed' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update post', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const deletePost = useCallback(
    async (id) => {
      try {
        const res = await postsApi.deletePost(id);
        setPosts((prev) => prev.filter((p) => (p.id || p._id) !== id));
        adminContext?.addToast('Post deleted', 'info');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete post', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const syncWordPress = useCallback(
    async (payload = {}) => {
      setLoading(true);
      try {
        const res = await postsApi.syncWordPress(payload);
        await fetchPosts();
        adminContext?.addToast(res?.message || 'WordPress posts synchronized successfully!', 'success');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to sync WordPress posts', 'error');
        return { success: false, message: err?.message };
      } finally {
        setLoading(false);
      }
    },
    [adminContext, fetchPosts]
  );

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        fetchPosts,
        addPost,
        updatePost,
        deletePost,
        syncWordPress,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}

export default PostContext;
