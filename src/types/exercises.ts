export interface ExerciseItem {
  name: string;
  type: string;
  muscle: string;
  difficulty: string;
  instructions: string;
  equipment?: string; // Standard API Ninjas field
  equipments?: string[]; // Custom list from mock data
  safety_info?: string; // Safety instructions from mock data
}

export interface ExerciseSearchParams {
  name?: string;
  type?: string;
  muscle?: string;
  difficulty?: string;
  offset?: number; // pagination parameter
}
