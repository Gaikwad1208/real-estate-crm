import apiClient from './client';

export const usersAPI = {
  // Get all users with filters
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // Get single user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    const response = await apiClient.put(`/users/${id}/toggle-status`);
    return response.data;
  },
};