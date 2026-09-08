/**
 * Centralized API Endpoints for Jodhpur Voyage
 * All backend routes are mapped here for consistent access across the application.
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Tour Packages
  TOURS: {
    LIST: '/tours',
    DETAIL: (id) => `/tours/${id}`,
    CREATE: '/tours',
    UPDATE: (id) => `/tours/${id}`,
    DELETE: (id) => `/tours/${id}`,
    FEATURED: '/tours/featured',
    CATEGORIES: '/tours/categories',
  },

  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    DETAIL: (id) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
    STATS: '/bookings/stats',
  },

  // Destinations & Attractions
  DESTINATIONS: {
    LIST: '/destinations',
    DETAIL: (id) => `/destinations/${id}`,
    POPULAR: '/destinations/popular',
  },

  // Analytics & Dashboard
  ANALYTICS: {
    DASHBOARD_STATS: '/analytics/dashboard',
    REVENUE: '/analytics/revenue',
    POPULARITY: '/analytics/popularity',
    RECENT_ACTIVITY: '/analytics/recent-activity',
  },

  // Users & Staff
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
  },
};

export default API_ENDPOINTS;
