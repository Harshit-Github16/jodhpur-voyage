import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const settingsApi = {
  /**
   * Get site settings (Public)
   * GET /settings
   */
  getSettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.GET);
  },

  /**
   * Update site settings (Super Admin)
   * PUT /settings
   * Body: Full or partial settings object
   */
  updateSettings: async (settingsData) => {
    return apiClient.put(API_ENDPOINTS.SETTINGS.UPDATE, settingsData);
  },
};

export default settingsApi;
