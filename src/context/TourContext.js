'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toursApi } from '@/services/api/toursApi';
import { useAdmin } from './AdminContext';

const TourContext = createContext(null);

export function TourProvider({ children }) {
  const [tours, setTours] = useState([]);
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

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await toursApi.getTours({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
      });
      if (res?.data) {
        setTours(Array.isArray(res.data) ? res.data : res.data.data || []);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err?.message || 'Failed to load tours');
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const addTour = useCallback(async (tourData) => {
    try {
      const res = await toursApi.createTour(tourData);
      if (res?.data) {
        const created = res.data.data || res.data;
        setTours((prev) => [created, ...prev]);
        adminContext?.addToast('New tour package created successfully!', 'success');
        return { success: true, data: created };
      }
      return { success: false, message: res?.message || 'Creation failed' };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to create tour', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const updateTour = useCallback(async (id, updateFields) => {
    try {
      const res = await toursApi.updateTour(id, updateFields);
      if (res?.data) {
        const updated = res.data.data || res.data;
        setTours((prev) => prev.map((t) => (t.id === id ? updated : t)));
        adminContext?.addToast('Tour updated successfully', 'success');
        return { success: true, data: updated };
      }
      return { success: false, message: res?.message || 'Update failed' };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to update tour', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const deleteTour = useCallback(async (id) => {
    try {
      const res = await toursApi.deleteTour(id);
      setTours((prev) => prev.filter((t) => t.id !== id));
      adminContext?.addToast('Tour deleted successfully', 'info');
      return { success: true, data: res };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to delete tour', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  return (
    <TourContext.Provider
      value={{
        tours,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        fetchTours,
        addTour,
        updateTour,
        deleteTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTours() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTours must be used within a TourProvider');
  }
  return context;
}

export default TourContext;
