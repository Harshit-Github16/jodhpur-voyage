import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const customersApi = {
  /**
   * Get customer list with metrics (Admin)
   * GET /customers
   * Params: { search, status, page, limit }
   */
  getCustomers: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST, { params });
  },
};

export default customersApi;
