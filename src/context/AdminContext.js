'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Booking Received',
      description: 'Elena Rostova booked Osian Desert Camel Safari (₹13,996)',
      time: '15 mins ago',
      read: false,
      type: 'booking',
    },
    {
      id: 'notif-2',
      title: 'Pending Confirmation',
      description: 'Aarav Sharma requested date change for Mehrangarh tour',
      time: '1 hour ago',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-3',
      title: 'New Review (5.0 ★)',
      description: 'Sophie Becker rated Blue City Stepwell walk 5 stars!',
      time: '3 hours ago',
      read: true,
      type: 'review',
    },
  ]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        globalSearch,
        setGlobalSearch,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export default AdminContext;
