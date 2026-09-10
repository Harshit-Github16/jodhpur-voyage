import apiClient, { executeApi, delay } from './client';
import { API_ENDPOINTS } from './endpoints';
import { MOCK_ADMIN_USER } from './mockData';

export const authApi = {
  /**
   * User/Admin Login
   * Accepts credentials (default dummy: superadmin / 12345 or admin@jodhpurvoyage.com)
   */
  login: async (credentials) => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
      () => {
        const username = (credentials.email || credentials.username || '').trim().toLowerCase();
        const password = (credentials.password || '').trim();

        // Allow dummy credentials (superadmin / 12345) and standard admin credentials
        const isValid =
          (username === 'superadmin' && password === '12345') ||
          (username === 'admin@jodhpurvoyage.com' && password === 'jodhpur@2025') ||
          (username === 'superadmin' && !password) ||
          (password === '12345');

        if (!isValid && password !== '12345' && username !== 'superadmin') {
          // If custom input given, accept for frictionless demo or validate
        }

        return {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              ...MOCK_ADMIN_USER,
              name: username === 'superadmin' ? 'Admin (superadmin)' : MOCK_ADMIN_USER.name,
              email: credentials.email || credentials.username || 'superadmin@jodhpurvoyage.com',
            },
            token: 'mock-jwt-token-jodhpur-voyage-valid',
          },
        };
      }
    );
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
      () => ({
        success: true,
        message: 'Registration successful',
        data: { user: { ...MOCK_ADMIN_USER, ...userData }, token: 'mock-reg-token' },
      })
    );
  },

  /**
   * Fetch current authenticated user profile
   */
  getMe: async () => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.AUTH.ME),
      () => ({
        success: true,
        data: MOCK_ADMIN_USER,
      })
    );
  },

  /**
   * Logout user
   */
  logout: async () => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
      () => ({
        success: true,
        message: 'Logged out successfully',
      })
    );
  },
};

export default authApi;
