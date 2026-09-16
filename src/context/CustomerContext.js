'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { customersApi } from '@/services/api/customersApi';
import { useAuth } from './AuthContext';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const { isAuthenticated } = useAuth() || {};
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await customersApi.getCustomers({ search: searchQuery || undefined });
      if (res?.data) {
        setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
      } else {
        setCustomers([]);
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
    }
  }, [isAuthenticated, fetchCustomers]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        searchQuery,
        setSearchQuery,
        fetchCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

export default CustomerContext;
