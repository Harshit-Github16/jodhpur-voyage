'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citiesApi } from '@/services/api/citiesApi';
import { useAdmin } from './AdminContext';

const CityContext = createContext(null);

export function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
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

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await citiesApi.getCities({ search: searchQuery });
      if (res.success && res.data) {
        setCities(res.data);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError(err?.message || 'Failed to load cities');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const addCity = useCallback(async (cityData) => {
    try {
      const res = await citiesApi.createCity(cityData);
      if (res.success && res.data) {
        setCities((prev) => [res.data, ...prev]);
        adminContext?.addToast(`City "${res.data.name}" added successfully!`, 'success');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to add city', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const updateCity = useCallback(async (id, updateFields) => {
    try {
      const res = await citiesApi.updateCity(id, updateFields);
      if (res.success && res.data) {
        setCities((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        adminContext?.addToast(`City content updated`, 'success');
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      adminContext?.addToast(err?.message || 'Failed to update city', 'error');
      return { success: false, message: err?.message };
    }
  }, [adminContext]);

  const deleteCity = useCallback(async (id) => {
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
  }, [adminContext]);

  return (
    <CityContext.Provider
      value={{
        cities,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        fetchCities,
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
