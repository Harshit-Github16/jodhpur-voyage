'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citiesApi } from '@/services/api/citiesApi';
import { useAdmin } from './AdminContext';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await citiesApi.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error fetching destination categories:', err);
    }
  }, []);

  // Fetch Cities with search & category filter
  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await citiesApi.getCities({
        search: searchQuery,
        categoryId: selectedCategoryId,
      });
      if (res.success && res.data) {
        setCities(res.data);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError(err?.message || 'Failed to load cities');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Category CRUD Handlers
  const addCategory = useCallback(
    async (categoryData) => {
      try {
        const res = await citiesApi.createCategory(categoryData);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data]);
          adminContext?.addToast(`Region "${res.data.name}" added successfully!`, 'success');
          return { success: true, data: res.data };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to create category', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateCategory = useCallback(
    async (id, updateFields) => {
      try {
        const res = await citiesApi.updateCategory(id, updateFields);
        if (res.success && res.data) {
          setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)));
          // Refresh cities in case category name changed
          fetchCities();
          adminContext?.addToast(`Category "${res.data.name}" updated`, 'success');
          return { success: true, data: res.data };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update category', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext, fetchCities]
  );

  const deleteCategory = useCallback(
    async (id) => {
      try {
        const res = await citiesApi.deleteCategory(id);
        if (res.success) {
          setCategories((prev) => prev.filter((c) => c.id !== id));
          if (selectedCategoryId === id) {
            setSelectedCategoryId('All');
          }
          adminContext?.addToast('Category removed', 'info');
          return { success: true };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete category', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext, selectedCategoryId]
  );

  // City CRUD Handlers
  const addCity = useCallback(
    async (cityData) => {
      try {
        const res = await citiesApi.createCity(cityData);
        if (res.success && res.data) {
          setCities((prev) => [res.data, ...prev]);
          adminContext?.addToast(`Destination "${res.data.name}" added to ${res.data.categoryName || 'Region'}!`, 'success');
          return { success: true, data: res.data };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to add city', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateCity = useCallback(
    async (id, updateFields) => {
      try {
        const res = await citiesApi.updateCity(id, updateFields);
        if (res.success && res.data) {
          setCities((prev) => prev.map((c) => (c.id === id ? res.data : c)));
          adminContext?.addToast(`City "${res.data.name}" updated`, 'success');
          return { success: true, data: res.data };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to update city', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const deleteCity = useCallback(
    async (id) => {
      try {
        const res = await citiesApi.deleteCity(id);
        if (res.success) {
          setCities((prev) => prev.filter((c) => c.id !== id));
          adminContext?.addToast('City removed from portal', 'info');
          return { success: true };
        }
        return { success: false, message: res.message };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete city', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  return (
    <CityContext.Provider
      value={{
        cities,
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        fetchCities,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addCity,
        updateCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCities must be used within a CityProvider');
  }
  return context;
}

export default CityContext;
