import apiClient from './client';

export const tasksAPI = {
  // Get all tasks with filters
  getTasks: async (params = {}) => {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    const response = await apiClient.put(`/tasks/${id}/status`, { status });
    return response.data;
  },
};