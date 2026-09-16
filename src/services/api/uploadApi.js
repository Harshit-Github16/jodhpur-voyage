import { getAccessToken } from './client';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jodhpur-voyage-backend.vercel.app/api/v1';

export const uploadApi = {
  /**
   * Upload single image file
   * Supports:
   * - POST /upload
   * - POST /upload/single
   * - POST /upload/image
   * Content-Type: multipart/form-data
   * Form Field: "image"
   */
  uploadSingle: async (file, endpoint = '/upload') => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = getAccessToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const uploadUrl = `${BASE_URL}${endpoint}`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.data) {
        const url =
          result.data.url ||
          result.data.imageUrl ||
          result.data.secure_url ||
          result.data.path ||
          (typeof result.data === 'string' ? result.data : null);

        if (url) {
          console.log('Uploaded Image URL:', url);
          return { success: true, url, data: result.data };
        }
      }

      throw new Error(result.message || 'Image upload failed');
    } catch (err) {
      console.error('Image upload error:', err);
      throw err;
    }
  },

  /**
   * Upload multiple images
   * POST /upload/multiple
   * Content-Type: multipart/form-data
   * Form Field: "images"
   */
  uploadMultiple: async (files) => {
    try {
      const formData = new FormData();
      if (Array.isArray(files) || files instanceof FileList) {
        Array.from(files).forEach((f) => {
          formData.append('images', f);
        });
      }

      const token = getAccessToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const uploadUrl = `${BASE_URL}/upload/multiple`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.data) {
        const urls = Array.isArray(result.data)
          ? result.data.map((item) => (typeof item === 'string' ? item : item.url || item.secure_url || item.imageUrl))
          : (result.data.urls || [result.data.url || result.data]);
        return { success: true, urls, data: result.data };
      }

      return result;
    } catch (err) {
      console.error('Multiple images upload error:', err);
      throw err;
    }
  },
};

export default uploadApi;
