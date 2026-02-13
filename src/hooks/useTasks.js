import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';

export const useTasks = (params = {}) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksAPI.getTasks(params),
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksAPI.getTaskById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksAPI.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tasksAPI.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['task', variables.id]);
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksAPI.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => tasksAPI.updateTaskStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['task', variables.id]);
      toast.success('Task status updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};