import React from 'react';
import type { NutritionItem } from '../types/nutrition';
import type { CaloriesBurnedItem } from '../types/calories';
import IconConsumed from '../assets/caloriasconsumidas.png';
import IconBurned from '../assets/caloriasquemadas.png';
import IconBalance from '../assets/balance.png';
import { CaloriesChart } from './CaloriesChart';


interface DailyBalanceProps {
  selectedFoods: NutritionItem[];
  selectedActivities: CaloriesBurnedItem[];
  onRemoveFood: (index: number) => void;
  onRemoveActivity: (index: number) => void;
  overrideTotalConsumed?: number;
  overrideTotalBurned?: number;
}

export const DailyBalance = React.memo(function DailyBalance({
  selectedFoods,
  selectedActivities,
  onRemoveFood,
  onRemoveActivity,
  overrideTotalConsumed,
  overrideTotalBurned,
}: DailyBalanceProps) {
  
  // Safe helper to extract numerical calories from NutritionItem
  // If calories is premium string, estimate mathematically based on macronutrients (Carbs * 4 + Fats * 9)
  const getNutritionCalories = (item: NutritionItem): number => {
    if (typeof item.calories === 'number') {
      return item.calories;
    }
    // Estimate: Carbohidratos * 4 + Grasas * 9
    const carbs = item.carbohydrates_total_g || 0;
    const fats = item.fat_total_g || 0;
    return Math.round(carbs * 4 + fats * 9);
  };

  const calcConsumed = selectedFoods.reduce((acc, item) => acc + getNutritionCalories(item), 0);
  const calcBurned = selectedActivities.reduce((acc, item) => acc + item.total_calories, 0);
  
  const totalConsumed = overrideTotalConsumed !== undefined ? overrideTotalConsumed : calcConsumed;
  const totalBurned = overrideTotalBurned !== undefined ? overrideTotalBurned : calcBurned;
  const netBalance = totalConsumed - totalBurned;

  const handleScrollToTools = () => {
    const element = document.getElementById('nutrition-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col gap-md" style={{ gridColumn: '1 / -1' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-left">
        {/* Card 1: Consumed */}
        <div className="bento-card bg-surface-container-lowest p-lg rounded-none shadow-[0_4px_20px_-4px_rgba(122,29,109,0.1)] border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-md">
            <span className="font-label-md text-label-md text-primary-container px-sm py-1 bg-primary/10 rounded-none flex items-center gap-xs relative group">
              <span>Calorías Consumidas</span>
              <span className="material-symbols-outlined text-[14px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
              <div className="absolute top-full mt-1 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
                Suma de la energía aportada por todos los alimentos registrados hoy. Te ayuda a controlar tu ingesta diaria.
              </div>
            </span>
            <img src={IconConsumed} alt="Calorías Consumidas" className="w-9 h-9 object-contain" />
          </div>
          <div className="flex flex-col mt-xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{totalConsumed}</span>
            <span className="text-caption text-outline mt-sm block leading-relaxed">
              Energía registrada a través de tus alimentos.
            </span>
          </div>
        </div>

        {/* Card 2: Burned */}
        <div className="bento-card bg-surface-container-lowest p-lg rounded-none shadow-[0_4px_20px_-4px_rgba(122,29,109,0.1)] border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-md">
            <span className="font-label-md text-label-md text-primary-container px-sm py-1 bg-primary/10 rounded-none flex items-center gap-xs relative group">
              <span>Calorías Quemadas</span>
              <span className="material-symbols-outlined text-[14px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
              <div className="absolute top-full mt-1 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
                Tu gasto energético total. Incluye tu metabolismo basal estimado más el esfuerzo extra de tus ejercicios.
              </div>
            </span>
            <img src={IconBurned} alt="Calorías Quemadas" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col mt-xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{totalBurned}</span>
            <span className="text-caption text-outline mt-sm block leading-relaxed">
              Gasto calórico estimado por tu actividad física.
            </span>
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className="bento-card bg-surface-container-lowest p-lg rounded-none shadow-[0_4px_20px_-4px_rgba(122,29,109,0.1)] border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-md">
            <span className="font-label-md text-label-md text-primary-container px-sm py-1 bg-primary/10 rounded-none flex items-center gap-xs relative group">
              <span>Balance Neto</span>
              <span className="material-symbols-outlined text-[14px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
              <div className="absolute top-full mt-1 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
                El resultado de restar lo que quemas a lo que consumes. Un número negativo indica déficit calórico.
              </div>
            </span>
            <img src={IconBalance} alt="Balance Neto" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col mt-xs">
            <span className="font-display-lg text-display-lg text-on-surface leading-none">{netBalance}</span>
            <span className="text-caption text-outline mt-sm block leading-relaxed">
              Tu estado metabólico actual (Consumidas - Quemadas).
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Calories Comparison and Selected Items / Empty State in a Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md w-full items-stretch">
        {/* Chart Column (7/12 width on desktop) */}
        <div className="lg:col-span-7 h-full">
          <CaloriesChart totalConsumed={totalConsumed} totalExerciseBurned={totalBurned} />
        </div>

        {/* Selected Items lists or Empty State Column (5/12 width on desktop) */}
        <div className="lg:col-span-5 h-full">
          {selectedFoods.length === 0 && selectedActivities.length === 0 ? (
            <div 
              onClick={handleScrollToTools}
              className="border-2 border-dashed border-outline-variant rounded-none p-lg flex flex-col items-center justify-center text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer group h-full min-h-[300px]"
            >
              <div className="w-12 h-12 bg-surface-container rounded-none flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[28px]">add_circle</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">No hay registros hoy</h3>
              <p className="text-caption text-outline mt-xs max-w-sm" style={{ margin: '8px 0 0 0' }}>
                Comienza a registrar tu día: busca alimentos a la izquierda y calcula tus ejercicios a la derecha.
              </p>
            </div>
          ) : (
            <div className="bento-card bg-surface-container-lowest p-md sm:p-lg rounded-none border border-outline-variant/30 text-left h-full flex flex-col gap-md">
              <div className="space-y-md">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm" style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
                    Alimentos Seleccionados ({selectedFoods.length})
                  </h3>
                  {selectedFoods.length === 0 ? (
                    <p className="text-caption text-outline" style={{ margin: 0 }}>Ningún alimento seleccionado.</p>
                  ) : (
                    <ul className="selected-items-list">
                      {selectedFoods.map((item, index) => (
                        <li key={`${item.name}-${index}`} className="selected-item">
                          <span>{item.name} ({getNutritionCalories(item)} kcal)</span>
                          <button 
                            type="button" 
                            onClick={() => onRemoveFood(index)}
                            className="btn-remove"
                            title="Eliminar alimento"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm" style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
                    Actividades Seleccionadas ({selectedActivities.length})
                  </h3>
                  {selectedActivities.length === 0 ? (
                    <p className="text-caption text-outline" style={{ margin: 0 }}>Ninguna actividad seleccionada.</p>
                  ) : (
                    <ul className="selected-items-list">
                      {selectedActivities.map((item, index) => (
                        <li key={`${item.name}-${index}`} className="selected-item">
                          <span>{item.name} ({item.total_calories} kcal - {item.duration_minutes} min)</span>
                          <button 
                            type="button" 
                            onClick={() => onRemoveActivity(index)}
                            className="btn-remove"
                            title="Eliminar actividad"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
