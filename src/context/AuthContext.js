'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api/authApi';
import { MOCK_ADMIN_USER, INITIAL_STAFF } from '@/data/mockData';

const AuthContext = createContext(null);
const STAFF_STORAGE_KEY = 'jv_staff_users_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffUsers, setStaffUsers] = useState(INITIAL_STAFF);

  // Initialize auth and staff users from storage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('jv_auth_token');
      const storedUser = localStorage.getItem('jv_auth_user');
      const storedStaff = localStorage.getItem(STAFF_STORAGE_KEY);

      if (storedStaff) {
        setStaffUsers(JSON.parse(storedStaff));
      } else {
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.warn('Auth initialization error:', e);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStaffToStorage = (updatedList) => {
    setStaffUsers(updatedList);
    try {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save staff users:', e);
    }
  };

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        setIsAuthenticated(true);
        localStorage.setItem('jv_auth_token', res.data.token);
        localStorage.setItem('jv_auth_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchRole = useCallback((newRole) => {
    setUser((prev) => {
      const updated = { ...prev, role: newRole };
      localStorage.setItem('jv_auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const switchActiveUser = useCallback((staffMember) => {
    setUser(staffMember);
    localStorage.setItem('jv_auth_user', JSON.stringify(staffMember));
  }, []);

  const addStaffUser = useCallback((newStaff) => {
    const userWithId = {
      ...newStaff,
      id: `usr-admin-${Date.now().toString().slice(-4)}`,
      status: newStaff.status || 'Active',
      lastLogin: 'Just now',
      avatar: newStaff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    const updated = [userWithId, ...staffUsers];
    saveStaffToStorage(updated);
    return userWithId;
  }, [staffUsers]);

  const updateStaffUser = useCallback((id, patchData) => {
    const updated = staffUsers.map((item) =>
      item.id === id ? { ...item, ...patchData } : item
    );
    saveStaffToStorage(updated);
    if (user && user.id === id) {
      setUser((prev) => ({ ...prev, ...patchData }));
    }
  }, [staffUsers, user]);

  const deleteStaffUser = useCallback((id) => {
    const updated = staffUsers.filter((item) => item.id !== id);
    saveStaffToStorage(updated);
  }, [staffUsers]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('jv_auth_token');
      localStorage.removeItem('jv_auth_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, []);

  const updateProfile = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('jv_auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        staffUsers,
        login,
        logout,
        switchRole,
        switchActiveUser,
        addStaffUser,
        updateStaffUser,
        deleteStaffUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
