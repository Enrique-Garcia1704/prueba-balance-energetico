import type { NutritionItem } from '../types/nutrition';
import type { CaloriesBurnedItem, CaloriesBurnedSearchParams } from '../types/calories';
import type { ExerciseItem, ExerciseSearchParams } from '../types/exercises';

export const apiService = {
  /**
   * Search food nutrition information from API Ninjas
   */
  async searchNutrition(query: string, quantity?: string): Promise<NutritionItem[]> {
    if (!query.trim()) {
      return [];
    }

    const apiKey = import.meta.env.VITE_API_KEY || '';
    
    // Combine quantity and query for the API query parameter to get correct calculations,
    // and also append the quantity parameter as requested.
    const apiQuery = quantity ? `${quantity} ${query}` : query;
    let url = `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(apiQuery.trim())}`;
    if (quantity) {
      url += `&quantity=${encodeURIComponent(quantity)}`;
    }

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Nutrición: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as NutritionItem[];
  },

  /**
   * Calculate calories burned for activities from API Ninjas
   */
  async searchCaloriesBurned(params: CaloriesBurnedSearchParams): Promise<CaloriesBurnedItem[]> {
    const { activity, duration, weight } = params;
    if (!activity.trim()) {
      return [];
    }

    const apiKey = import.meta.env.VITE_API_KEY || '';
    const durationMinutes = duration ?? 30;
    const weightLbs = weight ?? 160;

    const url = `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(activity.trim())}&weight=${weightLbs}&duration=${durationMinutes}`;
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Calorías: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as CaloriesBurnedItem[];
  },

  /**
   * Search exercises with filtering and offset-based pagination from API Ninjas
   */
  async searchExercises(params: ExerciseSearchParams): Promise<ExerciseItem[]> {
    const { name, type, muscle, difficulty, offset = 0 } = params;
    const apiKey = import.meta.env.VITE_API_KEY || '';

    const queryParts: string[] = [];
    if (name?.trim()) queryParts.push(`name=${encodeURIComponent(name.trim())}`);
    if (type?.trim()) queryParts.push(`type=${encodeURIComponent(type.trim())}`);
    if (muscle?.trim()) queryParts.push(`muscle=${encodeURIComponent(muscle.trim())}`);
    if (difficulty?.trim()) queryParts.push(`difficulty=${encodeURIComponent(difficulty.trim())}`);
    queryParts.push(`offset=${offset}`);

    const url = `https://api.api-ninjas.com/v1/exercises?${queryParts.join('&')}`;
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Ejercicios: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as ExerciseItem[];
  },
};
