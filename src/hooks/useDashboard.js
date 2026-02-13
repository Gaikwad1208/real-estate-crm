import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardAPI.getStats,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useRecentActivities = (limit = 20) => {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: () => dashboardAPI.getActivities(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};