import apiClient, { setAccessToken } from './client';
import { API_ENDPOINTS } from './endpoints';

export const authApi = {
  /**
   * Register a new customer
   * POST /auth/register
   * Body: { name, email, password, phone }
   */
  register: async (userData) => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    const token = res?.data?.token || res?.data?.accessToken || res?.token;
    if (token) {
      setAccessToken(token);
    }
    return res;
  },

  /**
   * User / Staff / Admin Login
   * POST /auth/login
   * Body: { email, password }
   */
  login: async (credentials) => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const token = res?.data?.token || res?.data?.accessToken || res?.token;
    if (token) {
      setAccessToken(token);
    }
    return res;
  },

  /**
   * Refresh Access Token
   * POST /auth/refresh
   */
  refresh: async (refreshToken) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  /**
   * Get Current User Profile
   * GET /auth/me
   */
  getMe: async () => {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Update Profile
   * PUT /auth/profile
   * Body: { name, phone, avatar }
   */
  updateProfile: async (profileData) => {
    return apiClient.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
  },

  /**
   * Change Password
   * PUT /auth/change-password
   * Body: { currentPassword, newPassword }
   */
  changePassword: async (passwordData) => {
    return apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  },

  /**
   * Logout
   * POST /auth/logout
   */
  logout: async () => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      setAccessToken(null);
      return res;
    } catch (err) {
      setAccessToken(null);
      throw err;
    }
  },
};

export default authApi;
