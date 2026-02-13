import apiClient from './client';

export const contactsAPI = {
  // Get all contacts with filters
  getContacts: async (params = {}) => {
    const response = await apiClient.get('/contacts', { params });
    return response.data;
  },

  // Get single contact by ID
  getContactById: async (id) => {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  // Create new contact
  createContact: async (contactData) => {
    const response = await apiClient.post('/contacts', contactData);
    return response.data;
  },

  // Update contact
  updateContact: async (id, contactData) => {
    const response = await apiClient.put(`/contacts/${id}`, contactData);
    return response.data;
  },

  // Delete contact
  deleteContact: async (id) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },
};