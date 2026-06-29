import { useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { ExerciseItem, ExerciseSearchParams } from '../types/exercises';

/**
 * Custom hook to search exercises with infinite query pagination
 * Filters search by name, type, muscle, and difficulty.
 * Handles offsets in increments of 5 items.
 */
export function useExercises(filters: Omit<ExerciseSearchParams, 'offset'>) {
  const isIdle = !filters.name && !filters.muscle && !filters.difficulty;

  return useInfiniteQuery<ExerciseItem[], Error>({
    queryKey: ['exercises', filters],
    queryFn: ({ pageParam }) => {
      const offset = pageParam as number;
      return apiService.searchExercises({
        ...filters,
        offset,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Page size is 5 in the mock service.
      // If the last page fetched has fewer than 5 items, we reached the end of the collection.
      if (lastPage.length < 5) {
        return undefined;
      }
      // Return the next offset
      return allPages.length * 5;
    },
    enabled: !isIdle, // Prevents queries when filters are empty (idle)
  });
}
