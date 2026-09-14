import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const analyticsApi = {
  /**
   * Get Executive Dashboard Metrics
   * GET /analytics/dashboard
   */
  getDashboardMetrics: async () => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  },

  /**
   * Get Revenue Trend (Last 6-12 Months)
   * GET /analytics/revenue
   */
  getRevenueTrend: async () => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.REVENUE);
  },

  /**
   * Get Category Popularity Breakdown
   * GET /analytics/popularity
   */
  getCategoryPopularity: async () => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.POPULARITY);
  },
};

export default analyticsApi;
