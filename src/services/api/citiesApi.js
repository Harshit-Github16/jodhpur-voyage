import apiClient, { executeApi } from './client';
import { INITIAL_CITIES } from './mockData';

let citiesStore = [...INITIAL_CITIES];

export const citiesApi = {
  /**
   * Get all cities with optional search
   */
  getCities: async (params = {}) => {
    return executeApi(
      apiClient.get('/cities', { params }),
      () => {
        let filtered = [...citiesStore];
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.state.toLowerCase().includes(q) ||
              c.tagline.toLowerCase().includes(q)
          );
        }
        if (params.status && params.status !== 'All') {
          filtered = filtered.filter((c) => c.status.toLowerCase() === params.status.toLowerCase());
        }
        return { success: true, count: filtered.length, data: filtered };
      }
    );
  },

  /**
   * Get city by ID or Slug
   */
  getCityById: async (id) => {
    return executeApi(
      apiClient.get(`/cities/${id}`),
      () => {
        const city = citiesStore.find((c) => c.id === id || c.slug === id);
        if (!city) throw { success: false, status: 404, message: 'City not found' };
        return { success: true, data: city };
      }
    );
  },

  /**
   * Create new City with content, FAQs, and images
   */
  createCity: async (cityData) => {
    return executeApi(
      apiClient.post('/cities', cityData),
      () => {
        const newCity = {
          id: `city-${Date.now()}`,
          slug: cityData.name?.toLowerCase().replace(/\s+/g, '-') || 'city-new',
          packagesCount: 0,
          status: cityData.status || 'Published',
          featured: Boolean(cityData.featured),
          gallery: cityData.gallery || [],
          faqs: cityData.faqs || [],
          highlights: cityData.highlights || [],
          createdAt: new Date().toISOString(),
          ...cityData,
        };
        citiesStore = [newCity, ...citiesStore];
        return {
          success: true,
          message: 'City published successfully',
          data: newCity,
        };
      }
    );
  },

  /**
   * Update existing city
   */
  updateCity: async (id, updatedFields) => {
    return executeApi(
      apiClient.put(`/cities/${id}`, updatedFields),
      () => {
        const index = citiesStore.findIndex((c) => c.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'City not found' };
        citiesStore[index] = { ...citiesStore[index], ...updatedFields };
        return {
          success: true,
          message: 'City content updated successfully',
          data: citiesStore[index],
        };
      }
    );
  },

  /**
   * Delete city
   */
  deleteCity: async (id) => {
    return executeApi(
      apiClient.delete(`/cities/${id}`),
      () => {
        citiesStore = citiesStore.filter((c) => c.id !== id);
        return {
          success: true,
          message: 'City removed successfully',
          deletedId: id,
        };
      }
    );
  },
};

export default citiesApi;
