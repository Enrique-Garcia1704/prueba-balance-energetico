export interface NutritionItem {
  name: string;
  calories: number | string; // Real API returns number, mock might return string notice
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number | string; // Real API returns number, mock might return string notice
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export interface NutritionSearchParams {
  query: string;
}
