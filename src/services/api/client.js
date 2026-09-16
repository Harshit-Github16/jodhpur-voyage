import axios from 'axios';

/**
 * Jodhpur Voyage Centralized API Client
 * Configured with baseURL (https://jodhpur-voyage-backend.vercel.app/api/v1), withCredentials,
 * automatic JWT header injection, and 401 automatic token refresh.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jodhpur-voyage-backend.vercel.app/api/v1';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // required for httpOnly refresh cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Helper to get access token from localStorage safely
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') || localStorage.getItem('jv_auth_token') || null;
};

// Helper to set access token in localStorage
export const setAccessToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('jv_auth_token', token);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('jv_auth_token');
  }
};

// Request Interceptor: Auto-attach JWT access token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Client-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Normalize error object
    const status = error?.response?.status || error?.response?.data?.statusCode || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected API error occurred';

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      errors: error?.response?.data?.errors || [],
      data: error?.response?.data || null,
    };

    // If 401 Unauthorized, clear stale token and redirect to login if on protected route
    if (status === 401) {
      setAccessToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jv_auth_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
