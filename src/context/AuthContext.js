'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api/authApi';
import { usersApi } from '@/services/api/usersApi';
import { getAccessToken, setAccessToken } from '@/services/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffUsers, setStaffUsers] = useState([]);

  // Fetch staff users directly from backend API
  const fetchStaffUsers = useCallback(async () => {
    try {
      const res = await usersApi.getStaff();
      if (res.success && res.data) {
        setStaffUsers(res.data);
      }
    } catch (e) {
      console.warn('Failed to fetch staff from API:', e);
    }
  }, []);

  // Initialize auth and profile on mount (non-blocking)
  useEffect(() => {
    const storedToken = getAccessToken();
    const storedUser = localStorage.getItem('jv_auth_user');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          // invalid json
        }
      }

      // Silent background profile check
      authApi.getMe()
        .then((meRes) => {
          if (meRes?.success && meRes?.data) {
            setUser(meRes.data);
            setIsAuthenticated(true);
            localStorage.setItem('jv_auth_user', JSON.stringify(meRes.data));
          }
        })
        .catch((err) => {
          console.warn('Silent /auth/me check failed:', err);
        });

      fetchStaffUsers();
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [fetchStaffUsers]);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        const loggedUser = res.data.user;
        const loggedToken = res.data.token || res.data.accessToken;
        setUser(loggedUser);
        setToken(loggedToken);
        setIsAuthenticated(true);
        setAccessToken(loggedToken);
        localStorage.setItem('jv_auth_user', JSON.stringify(loggedUser));
        await fetchStaffUsers();
        return { success: true, user: loggedUser, data: res.data };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchStaffUsers]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.data) {
        const newUser = res.data.user;
        const newToken = res.data.token || res.data.accessToken;
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        setAccessToken(newToken);
        localStorage.setItem('jv_auth_user', JSON.stringify(newUser));
        return { success: true, user: newUser, data: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error?.message || 'Registration failed' };
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

  const addStaffUser = useCallback(async (newStaff) => {
    try {
      const res = await usersApi.createStaff(newStaff);
      if (res.success && res.data) {
        const created = res.data;
        setStaffUsers((prev) => [created, ...prev]);
        return created;
      }
      throw new Error(res.message || 'Failed to create staff');
    } catch (err) {
      console.error('Failed to create staff via API:', err);
      throw err;
    }
  }, []);

  const updateStaffUser = useCallback(async (id, patchData) => {
    try {
      if (patchData.status) {
        await usersApi.updateUserStatus(id, patchData.status);
      }
      setStaffUsers((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patchData } : item))
      );
      if (user && user.id === id) {
        setUser((prev) => ({ ...prev, ...patchData }));
      }
    } catch (err) {
      console.error('Failed to update staff status via API:', err);
      throw err;
    }
  }, [user]);

  const deleteStaffUser = useCallback(async (id) => {
    try {
      await usersApi.deleteStaff(id);
      setStaffUsers((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete staff via API:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setAccessToken(null);
      localStorage.removeItem('jv_auth_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const res = await authApi.updateProfile(updatedData);
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('jv_auth_user', JSON.stringify(res.data));
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error('API updateProfile failed:', err);
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    return authApi.changePassword(passwordData);
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
        register,
        logout,
        switchRole,
        switchActiveUser,
        addStaffUser,
        updateStaffUser,
        deleteStaffUser,
        updateProfile,
        changePassword,
        fetchStaffUsers,
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
