import apiClient, { executeApi } from './client';
import { API_ENDPOINTS } from './endpoints';
import { INITIAL_STATS } from './mockData';

export const analyticsApi = {
  /**
   * Get main Admin dashboard summary statistics
   */
  getDashboardStats: async () => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD_STATS),
      () => ({
        success: true,
        data: INITIAL_STATS,
      })
    );
  },

  /**
   * Get revenue over time
   */
  getRevenueAnalytics: async (timeframe = '6months') => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.ANALYTICS.REVENUE, { params: { timeframe } }),
      () => ({
        success: true,
        data: INITIAL_STATS.monthlyTrends,
      })
    );
  },

  /**
   * Get category popularity breakdown
   */
  getCategoryBreakdown: async () => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.ANALYTICS.POPULARITY),
      () => ({
        success: true,
        data: INITIAL_STATS.popularCategories,
      })
    );
  },
};

export default analyticsApi;
