import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { CaloriesBurnedItem, CaloriesBurnedSearchParams } from '../types/calories';

/**
 * Custom hook to calculate calories burned using TanStack Query
 * Only runs the query if an activity search query is provided
 */
export function useCalories(params: CaloriesBurnedSearchParams) {
  const { activity } = params;
  
  return useQuery<CaloriesBurnedItem[]>({
    queryKey: ['caloriesBurned', params],
    queryFn: () => apiService.searchCaloriesBurned(params),
    enabled: activity.trim().length > 0,
    staleTime: 1000 * 60 * 10, // Cache results for 10 minutes
  });
}
