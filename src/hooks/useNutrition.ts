import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { NutritionItem } from '../types/nutrition';

/**
 * Custom hook to search food nutrition using TanStack Query
 * Only runs the query if search query is not empty
 */
export function useNutrition(query: string, quantity?: string) {
  return useQuery<NutritionItem[]>({
    queryKey: ['nutrition', query, quantity],
    queryFn: () => apiService.searchNutrition(query, quantity),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 10, // Cache results for 10 minutes
  });
}
