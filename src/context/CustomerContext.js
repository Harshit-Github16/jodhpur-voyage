'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { customersApi } from '@/services/api/customersApi';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customersApi.getCustomers({ search: searchQuery });
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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
