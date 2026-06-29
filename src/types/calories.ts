export interface CaloriesBurnedItem {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

export interface CaloriesBurnedSearchParams {
  activity: string;
  weight?: number; // optional, API Ninjas supports optional weight
  duration?: number; // optional, API Ninjas supports optional duration (default is usually 60 mins in API, but mock is 30 mins)
}
