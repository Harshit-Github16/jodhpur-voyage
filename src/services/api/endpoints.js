/**
 * Centralized API Endpoints for Jodhpur Voyage
 * Exactly mapped to backend REST API specifications (v1).
 */

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // 1. Authentication & User Profile (/auth)
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
  },

  // 2. Tours & Packages (/tours)
  TOURS: {
    LIST: '/tours',
    DETAIL: (idOrSlug) => `/tours/${idOrSlug}`,
    CREATE: '/tours',
    UPDATE: (id) => `/tours/${id}`,
    DELETE: (id) => `/tours/${id}`,
  },

  // 3. Cities & Destinations (/cities)
  CITIES: {
    LIST: '/cities',
    DETAIL: (idOrSlug) => `/cities/${idOrSlug}`,
    CREATE: '/cities',
    UPDATE: (id) => `/cities/${id}`,
    DELETE: (id) => `/cities/${id}`,
  },

  // 4. Destination Categories (/destination-categories)
  CATEGORIES: {
    LIST: '/destination-categories',
    DETAIL: (idOrSlug) => `/destination-categories/${idOrSlug}`,
    CREATE: '/destination-categories',
    UPDATE: (id) => `/destination-categories/${id}`,
    DELETE: (id) => `/destination-categories/${id}`,
  },

  // 5. Bookings (/bookings)
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    DETAIL: (id) => `/bookings/${id}`,
    LIST: '/bookings',
    UPDATE_STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },

  // 6. Enquiries & Contact Form (/enquiries)
  ENQUIRIES: {
    CREATE: '/enquiries',
    LIST: '/enquiries',
    UPDATE_STATUS: (id) => `/enquiries/${id}/status`,
    DELETE: (id) => `/enquiries/${id}`,
  },

  // 7. Reviews & Testimonials (/reviews)
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    UPDATE_STATUS: (id) => `/reviews/${id}/status`,
    DELETE: (id) => `/reviews/${id}`,
  },

  // 8. Blogs & Stories (/blogs)
  BLOGS: {
    LIST: '/blogs',
    DETAIL: (idOrSlug) => `/blogs/${idOrSlug}`,
    CREATE: '/blogs',
    UPDATE: (id) => `/blogs/${id}`,
    DELETE: (id) => `/blogs/${id}`,
  },

  // 9. Customers (/customers)
  CUSTOMERS: {
    LIST: '/customers',
  },

  // 10. Staff & Users (/users)
  USERS: {
    STAFF_LIST: '/users/staff',
    CREATE_STAFF: '/users/staff',
    UPDATE_STATUS: (id) => `/users/${id}/status`,
    DELETE: (id) => `/users/${id}`,
  },

  // 11. Team & Guides (/team)
  TEAM: {
    PUBLIC_LIST: '/team',
    ADMIN_LIST: '/team/admin',
    CREATE: '/team',
    UPDATE: (id) => `/team/${id}`,
    DELETE: (id) => `/team/${id}`,
  },

  // 12. Site Settings (/settings)
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
  },

  // 13. Analytics & Dashboard Metrics (/analytics)
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REVENUE: '/analytics/revenue',
    POPULARITY: '/analytics/popularity',
  },

  // 14. File & Media Upload (/upload)
  UPLOAD: {
    SINGLE: '/upload',
    MULTIPLE: '/upload',
  },
};

export default API_ENDPOINTS;
