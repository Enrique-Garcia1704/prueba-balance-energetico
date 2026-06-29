import type { NutritionItem } from './nutrition';
import type { CaloriesBurnedItem } from './calories';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  title: string;
  foods: NutritionItem[];
  activities: CaloriesBurnedItem[];
  totalConsumed: number;
  totalBurned: number;
  netBalance: number;
}
