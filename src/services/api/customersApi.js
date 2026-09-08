import apiClient, { executeApi } from './client';
import { INITIAL_CUSTOMERS } from './mockData';

let customersStore = [...INITIAL_CUSTOMERS];

export const customersApi = {
  getCustomers: async (params = {}) => {
    return executeApi(
      apiClient.get('/customers', { params }),
      () => {
        let filtered = [...customersStore];
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.email.toLowerCase().includes(q) ||
              c.phone.toLowerCase().includes(q) ||
              c.city.toLowerCase().includes(q)
          );
        }
        return { success: true, count: filtered.length, data: filtered };
      }
    );
  },
};

export default customersApi;
