import apiClient, { executeApi } from './client';
import { API_ENDPOINTS } from './endpoints';
import { INITIAL_TOURS } from './mockData';

// Local in-memory store for fallback modifications
let toursStore = [...INITIAL_TOURS];

export const toursApi = {
  /**
   * Get list of tours with optional filters
   */
  getTours: async (params = {}) => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.TOURS.LIST, { params }),
      () => {
        let filtered = [...toursStore];
        if (params.category && params.category !== 'All') {
          filtered = filtered.filter((t) => t.category.toLowerCase().includes(params.category.toLowerCase()));
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
        }
        if (params.status) {
          filtered = filtered.filter((t) => t.status.toLowerCase() === params.status.toLowerCase());
        }
        return {
          success: true,
          count: filtered.length,
          data: filtered,
        };
      }
    );
  },

  /**
   * Get single tour by ID
   */
  getTourById: async (id) => {
    return executeApi(
      apiClient.get(API_ENDPOINTS.TOURS.DETAIL(id)),
      () => {
        const tour = toursStore.find((t) => t.id === id);
        if (!tour) throw { success: false, status: 404, message: 'Tour package not found' };
        return { success: true, data: tour };
      }
    );
  },

  /**
   * Create a new tour package
   */
  createTour: async (tourData) => {
    return executeApi(
      apiClient.post(API_ENDPOINTS.TOURS.CREATE, tourData),
      () => {
        const newTour = {
          id: `tour-${Date.now()}`,
          rating: 5.0,
          reviewsCount: 0,
          status: 'Active',
          createdAt: new Date().toISOString(),
          image: tourData.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
          ...tourData,
        };
        toursStore = [newTour, ...toursStore];
        return {
          success: true,
          message: 'Tour package created successfully',
          data: newTour,
        };
      }
    );
  },

  /**
   * Update an existing tour package
   */
  updateTour: async (id, updatedFields) => {
    return executeApi(
      apiClient.put(API_ENDPOINTS.TOURS.UPDATE(id), updatedFields),
      () => {
        const index = toursStore.findIndex((t) => t.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'Tour not found' };
        toursStore[index] = { ...toursStore[index], ...updatedFields };
        return {
          success: true,
          message: 'Tour updated successfully',
          data: toursStore[index],
        };
      }
    );
  },

  /**
   * Delete a tour package
   */
  deleteTour: async (id) => {
    return executeApi(
      apiClient.delete(API_ENDPOINTS.TOURS.DELETE(id)),
      () => {
        toursStore = toursStore.filter((t) => t.id !== id);
        return {
          success: true,
          message: 'Tour deleted successfully',
          deletedId: id,
        };
      }
    );
  },
};

export default toursApi;
