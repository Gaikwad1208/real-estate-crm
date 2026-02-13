import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesAPI } from '../api';
import toast from 'react-hot-toast';

export const useProperties = (params = {}) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesAPI.getProperties(params),
  });
};

export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesAPI.getPropertyById(id),
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertiesAPI.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create property');
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => propertiesAPI.updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['properties']);
      queryClient.invalidateQueries(['property', variables.id]);
      toast.success('Property updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update property');
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertiesAPI.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Property deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    },
  });
};

export const useUploadPropertyImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, files }) => propertiesAPI.uploadImages(id, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['property', variables.id]);
      toast.success('Images uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    },
  });
};