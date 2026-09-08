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

  // Safe admin toast helper
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
        category: selectedCategory,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setTours(res.data);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err?.message || 'Failed to load tours');
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
      if (res.success && res.data) {
        setTours((prev) => [res.data, ...prev]);
        adminContext?.addToast('New tour package created successfully!', 'success');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to create tour', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const updateTour = useCallback(async (id, updateFields) => {
    try {
      const res = await toursApi.updateTour(id, updateFields);
      if (res.success && res.data) {
        setTours((prev) => prev.map((t) => (t.id === id ? res.data : t)));
        adminContext?.addToast('Tour updated successfully', 'success');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to update tour', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const deleteTour = useCallback(async (id) => {
    try {
      const res = await toursApi.deleteTour(id);
      if (res.success) {
        setTours((prev) => prev.filter((t) => t.id !== id));
        adminContext?.addToast('Tour deleted', 'info');
        return { success: true };
      }
      return { success: false, message: res.message };
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
