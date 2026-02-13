import apiClient from './client';

export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  getActivities: async (limit = 20) => {
    const response = await apiClient.get('/dashboard/activities', {
      params: { limit },
    });
    return response.data;
  },
};