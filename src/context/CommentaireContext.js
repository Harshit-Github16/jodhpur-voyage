'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { commentairesApi } from '@/services/api/commentairesApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const CommentaireContext = createContext(null);

export function CommentaireProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [commentaires, setCommentaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState('All');
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

  const fetchCommentaires = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await commentairesApi.getCommentaires({
        rating: selectedRating !== 'All' ? selectedRating : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: searchQuery || undefined,
        limit: 'all',
      });
      if (res?.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || res.data.commentaires || []);
        const normalized = rawList.map((c) => ({
          ...c,
          id: c.id || c._id,
        }));
        setCommentaires(normalized);
      } else {
        setCommentaires([]);
      }
    } catch (err) {
      console.error('Error fetching commentaires:', err);
      setError(err?.message || 'Failed to load commentaires');
      setCommentaires([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedRating, selectedStatus, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommentaires();
    }
  }, [isAuthenticated, fetchCommentaires]);

  const addCommentaire = useCallback(
    async (data) => {
      try {
        const res = await commentairesApi.createCommentaire(data);
        if (res?.data) {
          const created = res.data.data || res.data;
          const normalized = { ...created, id: created.id || created._id };
          setCommentaires((prev) => [normalized, ...prev]);
          adminContext?.addToast('Commentaire added successfully!', 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Failed to add commentaire' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to add commentaire', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateCommentaire = useCallback(
    async (id, updateFields) => {
      try {
        const res = await commentairesApi.updateCommentaire(id, updateFields);
        if (res?.data) {
          const updated = res.data.data || res.data;
          const normalized = { ...updated, id: updated.id || updated._id };
          setCommentaires((prev) => prev.map((c) => ((c.id || c._id) === id ? normalized : c)));
          adminContext?.addToast('Commentaire updated successfully', 'success');
          return { success: true, data: normalized };
        }
        return { success: false, message: res?.message || 'Update failed' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update commentaire', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const deleteCommentaire = useCallback(
    async (id) => {
      try {
        const res = await commentairesApi.deleteCommentaire(id);
        setCommentaires((prev) => prev.filter((c) => (c.id || c._id) !== id));
        adminContext?.addToast('Commentaire deleted', 'info');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete commentaire', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const syncWordPress = useCallback(
    async (payload = {}) => {
      setLoading(true);
      try {
        const res = await commentairesApi.syncWordPress(payload);
        await fetchCommentaires();
        adminContext?.addToast(res?.message || 'WordPress commentaires synchronized successfully!', 'success');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to sync WordPress commentaires', 'error');
        return { success: false, message: err?.message };
      } finally {
        setLoading(false);
      }
    },
    [adminContext, fetchCommentaires]
  );

  return (
    <CommentaireContext.Provider
      value={{
        commentaires,
        loading,
        error,
        selectedRating,
        setSelectedRating,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        fetchCommentaires,
        addCommentaire,
        updateCommentaire,
        deleteCommentaire,
        syncWordPress,
      }}
    >
      {children}
    </CommentaireContext.Provider>
  );
}

export function useCommentaires() {
  const context = useContext(CommentaireContext);
  if (!context) {
    throw new Error('useCommentaires must be used within a CommentaireProvider');
  }
  return context;
}

export default CommentaireContext;
