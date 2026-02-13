import apiClient from './client';

export const propertiesAPI = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    const response = await apiClient.get('/properties', { params });
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (propertyData) => {
    const response = await apiClient.post('/properties', propertyData);
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await apiClient.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },

  // Upload property images
  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};