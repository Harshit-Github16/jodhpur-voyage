import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const usersApi = {
  /**
   * Get staff list (Super Admin)
   * GET /users/staff
   */
  getStaff: async () => {
    return apiClient.get(API_ENDPOINTS.USERS.STAFF_LIST);
  },

  /**
   * Create staff member (Super Admin)
   * POST /users/staff
   * Body: { name, email, password, role, permissions }
   */
  createStaff: async (staffData) => {
    return apiClient.post(API_ENDPOINTS.USERS.CREATE_STAFF, staffData);
  },

  /**
   * Toggle user status (Block / Unblock / Active)
   * PATCH /users/:id/status
   * Body: { status }
   */
  updateUserStatus: async (id, status) => {
    const statusPayload = typeof status === 'string' ? { status } : status;
    return apiClient.patch(API_ENDPOINTS.USERS.UPDATE_STATUS(id), statusPayload);
  },

  /**
   * Delete staff member
   * DELETE /users/:id
   */
  deleteStaff: async (id) => {
    return apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};

export default usersApi;
