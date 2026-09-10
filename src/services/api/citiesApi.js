import apiClient, { executeApi } from './client';
import { INITIAL_CITIES, INITIAL_DESTINATION_CATEGORIES } from './mockData';

let citiesStore = [...INITIAL_CITIES];
let categoriesStore = [...(INITIAL_DESTINATION_CATEGORIES || [])];

export const citiesApi = {
  // ===================== CATEGORIES =====================
  /**
   * Get all destination categories / regions
   */
  getCategories: async () => {
    return executeApi(
      apiClient.get('/destination-categories'),
      () => {
        return {
          success: true,
          count: categoriesStore.length,
          data: [...categoriesStore],
        };
      }
    );
  },

  /**
   * Create destination category
   */
  createCategory: async (categoryData) => {
    return executeApi(
      apiClient.post('/destination-categories', categoryData),
      () => {
        const slug = categoryData.slug || categoryData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'region';
        const newCategory = {
          id: `cat-${slug}-${Date.now()}`,
          name: categoryData.name,
          slug,
          tagline: categoryData.tagline || '',
          description: categoryData.description || '',
          coverImage: categoryData.coverImage || 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
          order: categoriesStore.length + 1,
          status: categoryData.status || 'Active',
          createdAt: new Date().toISOString(),
          ...categoryData,
        };
        categoriesStore = [...categoriesStore, newCategory];
        return {
          success: true,
          message: `Category "${newCategory.name}" created successfully`,
          data: newCategory,
        };
      }
    );
  },

  /**
   * Update destination category
   */
  updateCategory: async (id, updatedFields) => {
    return executeApi(
      apiClient.put(`/destination-categories/${id}`, updatedFields),
      () => {
        const index = categoriesStore.findIndex((c) => c.id === id);
        if (index === -1) throw { success: false, status: 404, message: 'Category not found' };
        categoriesStore[index] = { ...categoriesStore[index], ...updatedFields };
        
        // If category name updated, update cities referencing it
        if (updatedFields.name) {
          citiesStore = citiesStore.map((city) =>
            city.categoryId === id ? { ...city, categoryName: updatedFields.name } : city
          );
        }

        return {
          success: true,
          message: 'Category updated successfully',
          data: categoriesStore[index],
        };
      }
    );
  },

  /**
   * Delete destination category
   */
  deleteCategory: async (id) => {
    return executeApi(
      apiClient.delete(`/destination-categories/${id}`),
      () => {
        const catToDelete = categoriesStore.find((c) => c.id === id);
        categoriesStore = categoriesStore.filter((c) => c.id !== id);
        return {
          success: true,
          message: `Category "${catToDelete?.name || id}" removed successfully`,
          deletedId: id,
        };
      }
    );
  },

  // ===================== CITIES =====================
  /**
   * Get all cities with optional search & category filter
   */
  getCities: async (params = {}) => {
    return executeApi(
      apiClient.get('/cities', { params }),
      () => {
        let filtered = [...citiesStore];
        if (params.categoryId && params.categoryId !== 'All') {
          filtered = filtered.filter(
            (c) => c.categoryId === params.categoryId || c.categoryName?.toLowerCase() === params.categoryId.toLowerCase()
          );
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.state?.toLowerCase().includes(q) ||
              c.categoryName?.toLowerCase().includes(q) ||
              c.tagline?.toLowerCase().includes(q)
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
   * Create new City with category, content, FAQs, and images
   */
  createCity: async (cityData) => {
    return executeApi(
      apiClient.post('/cities', cityData),
      () => {
        // Resolve category name if categoryId provided
        let categoryName = cityData.categoryName;
        if (cityData.categoryId) {
          const matchedCategory = categoriesStore.find((c) => c.id === cityData.categoryId);
          if (matchedCategory) {
            categoryName = matchedCategory.name;
          }
        }

        const newCity = {
          id: `city-${Date.now()}`,
          slug: cityData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'city-new',
          packagesCount: 0,
          status: cityData.status || 'Published',
          featured: Boolean(cityData.featured),
          gallery: cityData.gallery || [],
          faqs: cityData.faqs || [],
          highlights: cityData.highlights || [],
          categoryId: cityData.categoryId || (categoriesStore[0] ? categoriesStore[0].id : 'cat-north-india'),
          categoryName: categoryName || (categoriesStore[0] ? categoriesStore[0].name : 'North India'),
          createdAt: new Date().toISOString(),
          ...cityData,
          categoryName: categoryName || cityData.categoryName || 'General',
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
        
        let categoryName = updatedFields.categoryName || citiesStore[index].categoryName;
        if (updatedFields.categoryId && updatedFields.categoryId !== citiesStore[index].categoryId) {
          const matchedCategory = categoriesStore.find((c) => c.id === updatedFields.categoryId);
          if (matchedCategory) {
            categoryName = matchedCategory.name;
          }
        }

        citiesStore[index] = {
          ...citiesStore[index],
          ...updatedFields,
          categoryName,
        };
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
