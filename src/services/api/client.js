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
  timeout: 15000,
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

// Response Interceptor: Auto-refresh token on 401 Unauthorized
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Normalize error object
    const errorResponse = {
      success: false,
      statusCode: error?.response?.status || error?.response?.data?.statusCode || 500,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected API error occurred',
      errors: error?.response?.data?.errors || [],
      data: error?.response?.data || null,
    };

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/login') &&
      !originalRequest?.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedToken = getAccessToken();
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken: storedToken },
          { withCredentials: true }
        );

        const newToken = data?.data?.token || data?.token || data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
