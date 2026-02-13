import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsAPI } from '../api';
import toast from 'react-hot-toast';

export const useLeads = (params = {}) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsAPI.getLeads(params),
  });
};

export const useLead = (id) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsAPI.getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsAPI.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast.success('Lead created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => leadsAPI.updateLead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['lead', variables.id]);
      toast.success('Lead updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsAPI.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      toast.success('Lead deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    },
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedToId }) => leadsAPI.assignLead(id, assignedToId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['lead', variables.id]);
      toast.success('Lead assigned successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign lead');
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => leadsAPI.updateLeadStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['lead', variables.id]);
      toast.success('Lead status updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};