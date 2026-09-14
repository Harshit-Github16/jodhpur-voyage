import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const teamApi = {
  /**
   * Get active team members (Public)
   * GET /team
   */
  getTeam: async () => {
    return apiClient.get(API_ENDPOINTS.TEAM.PUBLIC_LIST);
  },

  /**
   * Get all team members (Admin)
   * GET /team/admin
   */
  getTeamAdmin: async () => {
    return apiClient.get(API_ENDPOINTS.TEAM.ADMIN_LIST);
  },

  /**
   * Add team member
   * POST /team
   * Body: { name, role, bio, image, experienceYears, socials, order, status }
   */
  createTeamMember: async (memberData) => {
    return apiClient.post(API_ENDPOINTS.TEAM.CREATE, memberData);
  },

  /**
   * Update team member
   * PUT /team/:id
   */
  updateTeamMember: async (id, updatedFields) => {
    return apiClient.put(API_ENDPOINTS.TEAM.UPDATE(id), updatedFields);
  },

  /**
   * Delete team member
   * DELETE /team/:id
   */
  deleteTeamMember: async (id) => {
    return apiClient.delete(API_ENDPOINTS.TEAM.DELETE(id));
  },
};

export default teamApi;
