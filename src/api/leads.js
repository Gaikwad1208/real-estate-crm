import apiClient from './client';

export const leadsAPI = {
  // Get all leads with filters
  getLeads: async (params = {}) => {
    const response = await apiClient.get('/leads', { params });
    return response.data;
  },

  // Get single lead by ID
  getLeadById: async (id) => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const response = await apiClient.post('/leads', leadData);
    return response.data;
  },

  // Update lead
  updateLead: async (id, leadData) => {
    const response = await apiClient.put(`/leads/${id}`, leadData);
    return response.data;
  },

  // Delete lead
  deleteLead: async (id) => {
    const response = await apiClient.delete(`/leads/${id}`);
    return response.data;
  },

  // Assign lead to user
  assignLead: async (id, assignedToId) => {
    const response = await apiClient.put(`/leads/${id}/assign`, { assignedToId });
    return response.data;
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    const response = await apiClient.put(`/leads/${id}/status`, { status });
    return response.data;
  },
};