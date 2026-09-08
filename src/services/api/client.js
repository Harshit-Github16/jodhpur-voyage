import axios from 'axios';

/**
 * Jodhpur Voyage Centralized API Client
 * Configured with baseURL, timeout, request/response interceptors, and graceful fallback handling.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.jodhpurvoyage.com/v1';
export const ENABLE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_ENABLE_MOCK_API !== 'false';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Bearer Token if present
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jv_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.headers['X-Client-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error & Unauthenticated handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorResponse = {
      success: false,
      message: error?.response?.data?.message || error.message || 'An unexpected API error occurred',
      status: error?.response?.status || 500,
      data: error?.response?.data || null,
    };

    if (error.response?.status === 401) {
      console.warn('[API Auth]: Session expired or unauthenticated.');
    }

    return Promise.reject(errorResponse);
  }
);

/**
 * Simulated delay helper for realistic local feel
 */
export const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to safely execute an API call with automatic mock fallback if backend is offline.
 */
export async function executeApi(realApiPromise, mockFallbackFn) {
  try {
    return await realApiPromise;
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK && mockFallbackFn) {
      await delay(120);
      return mockFallbackFn();
    }
    throw error;
  }
}

export default apiClient;
