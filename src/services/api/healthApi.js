import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const healthApi = {
  /**
   * Check Backend Server Health
   * GET /health
   */
  checkHealth: async () => {
    return apiClient.get(API_ENDPOINTS.HEALTH);
  },
};

export default healthApi;
