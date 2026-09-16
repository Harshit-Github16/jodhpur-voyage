'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citiesApi } from '@/services/api/citiesApi';
import { destinationCategoriesApi } from '@/services/api/destinationCategoriesApi';
import { useAdmin } from './AdminContext';
import { useAuth } from './AuthContext';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  let adminContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminContext = useAdmin();
  } catch (e) {
    adminContext = null;
  }

  // Fetch Categories from API
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await destinationCategoriesApi.getCategories();
      if (res?.data) {
        setCategories(Array.isArray(res.data) ? res.data : res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching destination categories:', err);
    }
  }, [isAuthenticated]);

  // Fetch Cities with search & category filter from API
  const fetchCities = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await citiesApi.getCities({
        search: searchQuery || undefined,
        categoryId: selectedCategoryId !== 'All' ? selectedCategoryId : undefined,
      });
      if (res?.data) {
        setCities(Array.isArray(res.data) ? res.data : res.data.data || []);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError(err?.message || 'Failed to load cities');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, selectedCategoryId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCities();
    }
  }, [isAuthenticated, fetchCities]);

  // Category CRUD Handlers
  const addCategory = useCallback(
    async (categoryData) => {
      try {
        const res = await destinationCategoriesApi.createCategory(categoryData);
        if (res?.data) {
          const created = res.data.data || res.data;
          setCategories((prev) => [...prev, created]);
          adminContext?.addToast(`Region "${created.name}" added successfully!`, 'success');
          return { success: true, data: created };
        }
        return { success: false, message: res?.message || 'Failed to add region' };
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
        const res = await destinationCategoriesApi.updateCategory(id, updateFields);
        if (res?.data) {
          const updated = res.data.data || res.data;
          setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
          fetchCities();
          adminContext?.addToast(`Category "${updated.name}" updated`, 'success');
          return { success: true, data: updated };
        }
        return { success: false, message: res?.message || 'Update failed' };
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
        const res = await destinationCategoriesApi.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
        fetchCities();
        adminContext?.addToast('Category deleted successfully', 'info');
        return { success: true, data: res };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to delete category', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext, fetchCities]
  );

  // City CRUD Handlers
  const addCity = useCallback(
    async (cityData) => {
      try {
        const res = await citiesApi.createCity(cityData);
        if (res?.data) {
          const created = res.data.data || res.data;
          setCities((prev) => [created, ...prev]);
          adminContext?.addToast(`City "${created.name}" created successfully!`, 'success');
          return { success: true, data: created };
        }
        return { success: false, message: res?.message || 'Failed to create city' };
      } catch (err) {
        adminContext?.addToast(err?.message || 'Failed to create city', 'error');
        return { success: false, message: err?.message };
      }
    },
    [adminContext]
  );

  const updateCity = useCallback(
    async (id, updateFields) => {
      try {
        const res = await citiesApi.updateCity(id, updateFields);
        if (res?.data) {
          const updated = res.data.data || res.data;
          setCities((prev) => prev.map((c) => (c.id === id ? updated : c)));
          adminContext?.addToast(`City updated successfully`, 'success');
          return { success: true, data: updated };
        }
        return { success: false, message: res?.message || 'Update failed' };
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
        setCities((prev) => prev.filter((c) => c.id !== id));
        adminContext?.addToast('City deleted successfully', 'info');
        return { success: true, data: res };
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
        loading,
        error,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        fetchCities,
        fetchCategories,
        addCity,
        updateCity,
        deleteCity,
        addCategory,
        updateCategory,
        deleteCategory,
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
