import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const uploadApi = {
  /**
   * Upload single image file
   * POST /upload/single
   * Content-Type: multipart/form-data
   * Form Field: "image"
   */
  uploadSingle: async (fileOrFormData) => {
    let formData = fileOrFormData;
    if (!(fileOrFormData instanceof FormData)) {
      formData = new FormData();
      formData.append('image', fileOrFormData);
    }

    return apiClient.post(API_ENDPOINTS.UPLOAD.SINGLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Upload multiple images (Up to 10)
   * POST /upload/multiple
   * Content-Type: multipart/form-data
   * Form Field: "images"
   */
  uploadMultiple: async (filesOrFormData) => {
    let formData = filesOrFormData;
    if (!(filesOrFormData instanceof FormData)) {
      formData = new FormData();
      if (Array.isArray(filesOrFormData) || filesOrFormData instanceof FileList) {
        Array.from(filesOrFormData).forEach((f) => {
          formData.append('images', f);
        });
      }
    }

    return apiClient.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default uploadApi;
