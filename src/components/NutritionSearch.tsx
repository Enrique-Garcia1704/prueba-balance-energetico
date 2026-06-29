import React, { useState } from 'react';
import { useNutrition } from '../hooks/useNutrition';
import { Card } from './Card';
import type { NutritionItem } from '../types/nutrition';

const FOOD_DICTIONARY = [
  // PROTEÍNAS Y CARNES
  { es: "pollo", en: "chicken breast" },
  { es: "pechuga de pollo", en: "chicken breast" },
  { es: "carne de res", en: "beef" },
  { es: "carne asada", en: "steak" },
  { es: "cerdo", en: "pork" },
  { es: "huevo", en: "egg" },
  { es: "huevos", en: "eggs" },
  { es: "salmon", en: "salmon" },
  { es: "salmón", en: "salmon" },
  { es: "atun", en: "tuna" },
  { es: "atún", en: "tuna" },
  { es: "camarones", en: "shrimp" },

  // CARBOHIDRATOS Y CEREALES
  { es: "arroz blanco", en: "white rice" },
  { es: "arroz integral", en: "brown rice" },
  { es: "avena", en: "oats" },
  { es: "pan integral", en: "whole wheat bread" },
  { es: "pan blanco", en: "white bread" },
  { es: "tortilla de maiz", en: "corn tortilla" },
  { es: "tortilla de maíz", en: "corn tortilla" },
  { es: "papas", en: "potato" },
  { es: "papa", en: "potato" },
  { es: "camote", en: "sweet potato" },
  { es: "pasta", en: "pasta" },
  { es: "quinoa", en: "quinoa" },

  // FRUTAS
  { es: "manzana", en: "apple" },
  { es: "platano", en: "banana" },
  { es: "plátano", en: "banana" },
  { es: "fresa", en: "strawberry" },
  { es: "fresas", en: "strawberries" },
  { es: "naranja", en: "orange" },
  { es: "aguacate", en: "avocado" },

  // VERDURAS Y ENSALADAS
  { es: "ensalada", en: "salad" },
  { es: "ensalada de lechuga", en: "lettuce salad" },
  { es: "espinaca", en: "spinach" },
  { es: "espinacas", en: "spinach" },
  { es: "brocoli", en: "broccoli" },
  { es: "brócoli", en: "broccoli" },
  { es: "jitomate", en: "tomato" },
  { es: "tomate", en: "tomato" },
  { es: "zanahoria", en: "carrot" },

  // LÁCTEOS Y GRASAS SALUDABLES
  { es: "leche", en: "milk" },
  { es: "queso", en: "cheese" },
  { es: "yogur griego", en: "greek yogurt" },
  { es: "yogurt griego", en: "greek yogurt" },
  { es: "almendras", en: "almonds" },
  { es: "cacahuates", en: "peanuts" }
];

const FALLBACK_NUTRITION: Record<string, Partial<NutritionItem>> = {
  'chicken breast': { calories: 165, protein_g: 31, fat_total_g: 3.6, carbohydrates_total_g: 0 },
  'beef': { calories: 250, protein_g: 26, fat_total_g: 15, carbohydrates_total_g: 0 },
  'steak': { calories: 271, protein_g: 25, fat_total_g: 19, carbohydrates_total_g: 0 },
  'pork': { calories: 242, protein_g: 27, fat_total_g: 14, carbohydrates_total_g: 0 },
  'egg': { calories: 143, protein_g: 12.6, fat_total_g: 9.5, carbohydrates_total_g: 0.7 },
  'eggs': { calories: 143, protein_g: 12.6, fat_total_g: 9.5, carbohydrates_total_g: 0.7 },
  'salmon': { calories: 208, protein_g: 20, fat_total_g: 13, carbohydrates_total_g: 0 },
  'tuna': { calories: 132, protein_g: 28, fat_total_g: 1, carbohydrates_total_g: 0 },
  'shrimp': { calories: 99, protein_g: 24, fat_total_g: 0.3, carbohydrates_total_g: 0.2 },
  
  'white rice': { calories: 130, protein_g: 2.7, fat_total_g: 0.3, carbohydrates_total_g: 28 },
  'brown rice': { calories: 111, protein_g: 2.6, fat_total_g: 0.9, carbohydrates_total_g: 23 },
  'oats': { calories: 389, protein_g: 16.9, fat_total_g: 6.9, carbohydrates_total_g: 66.3 },
  'whole wheat bread': { calories: 247, protein_g: 13, fat_total_g: 3.4, carbohydrates_total_g: 41 },
  'white bread': { calories: 265, protein_g: 9, fat_total_g: 3.2, carbohydrates_total_g: 49 },
  'corn tortilla': { calories: 218, protein_g: 6, fat_total_g: 3, carbohydrates_total_g: 45 },
  'potato': { calories: 77, protein_g: 2, fat_total_g: 0.1, carbohydrates_total_g: 17 },
  'sweet potato': { calories: 86, protein_g: 1.6, fat_total_g: 0.1, carbohydrates_total_g: 20 },
  'pasta': { calories: 131, protein_g: 5, fat_total_g: 1, carbohydrates_total_g: 25 },
  'quinoa': { calories: 120, protein_g: 4.4, fat_total_g: 1.9, carbohydrates_total_g: 21 },
  
  'apple': { calories: 52, protein_g: 0.3, fat_total_g: 0.2, carbohydrates_total_g: 14 },
  'banana': { calories: 89, protein_g: 1.1, fat_total_g: 0.3, carbohydrates_total_g: 22.8 },
  'strawberry': { calories: 32, protein_g: 0.7, fat_total_g: 0.3, carbohydrates_total_g: 7.7 },
  'strawberries': { calories: 32, protein_g: 0.7, fat_total_g: 0.3, carbohydrates_total_g: 7.7 },
  'orange': { calories: 47, protein_g: 0.9, fat_total_g: 0.1, carbohydrates_total_g: 12 },
  'avocado': { calories: 160, protein_g: 2, fat_total_g: 15, carbohydrates_total_g: 8.5 },
  
  'salad': { calories: 15, protein_g: 1.4, fat_total_g: 0.2, carbohydrates_total_g: 2.9 },
  'lettuce salad': { calories: 15, protein_g: 1.4, fat_total_g: 0.2, carbohydrates_total_g: 2.9 },
  'spinach': { calories: 23, protein_g: 2.9, fat_total_g: 0.4, carbohydrates_total_g: 3.6 },
  'broccoli': { calories: 34, protein_g: 2.8, fat_total_g: 0.4, carbohydrates_total_g: 6.6 },
  'tomato': { calories: 18, protein_g: 0.9, fat_total_g: 0.2, carbohydrates_total_g: 3.9 },
  'carrot': { calories: 41, protein_g: 0.9, fat_total_g: 0.2, carbohydrates_total_g: 10 },
  
  'milk': { calories: 42, protein_g: 3.4, fat_total_g: 1, carbohydrates_total_g: 5 },
  'cheese': { calories: 402, protein_g: 25, fat_total_g: 33, carbohydrates_total_g: 1.3 },
  'greek yogurt': { calories: 59, protein_g: 10, fat_total_g: 0.4, carbohydrates_total_g: 3.6 },
  'almonds': { calories: 579, protein_g: 21, fat_total_g: 50, carbohydrates_total_g: 22 },
  'peanuts': { calories: 567, protein_g: 26, fat_total_g: 49, carbohydrates_total_g: 16 },
};

const translateFoodToEnglish = (term: string): string => {
  const clean = term.toLowerCase().trim();
  const match = FOOD_DICTIONARY.find(f => f.es === clean);
  return match ? match.en : term;
};

const translateFoodToSpanish = (name: string): string => {
  const clean = name.toLowerCase().trim();
  const match = FOOD_DICTIONARY.find(f => f.en === clean);
  const esWord = match ? match.es : name;
  return esWord.charAt(0).toUpperCase() + esWord.slice(1);
};

interface NutritionSearchProps {
  onAddFood: (food: NutritionItem) => void;
}

export const NutritionSearch = React.memo(function NutritionSearch({ onAddFood }: NutritionSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [grams, setGrams] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
 
  // Consume TanStack Query hook - querying 100g base for scaling
  const { data: foodResults, isLoading, isError, error } = useNutrition(searchTerm, "100g");
 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchTerm(translateFoodToEnglish(trimmed));
    }
  };
 
  // Predictive local filter in Spanish
  const filteredSuggestions = inputValue.trim() === ''
    ? []
    : FOOD_DICTIONARY.filter((food) =>
        food.es.includes(inputValue.toLowerCase().trim())
      );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = highlightedIndex < filteredSuggestions.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(next);
      document.getElementById(`suggestion-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = highlightedIndex > 0 ? highlightedIndex - 1 : filteredSuggestions.length - 1;
      setHighlightedIndex(next);
      document.getElementById(`suggestion-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = filteredSuggestions[highlightedIndex];
      setInputValue(selected.es);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };
 
  const showNoResultsMessage =
    !isLoading &&
    !isError &&
    searchTerm.trim() !== '' &&
    foodResults &&
    foodResults.length === 0;

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs relative group">
          <h2 className="font-headline-md text-headline-md text-primary" style={{ margin: 0 }}>Analizador de Nutrientes</h2>
          <span className="material-symbols-outlined text-[16px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
          <div className="absolute bottom-full mb-2 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
            Buscador inteligente conectado a bases de datos clínicas. Desglosa al instante los macronutrientes de tus porciones.
          </div>
        </div>
        <span className="text-caption text-outline">Impulsado por la API ClinicalData</span>
      </div>
 
      <div className="bg-surface-container-lowest rounded-none p-md shadow-sm border border-outline-variant/30 text-left">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 w-full mb-md relative">
          {/* Fila 1: Alimento */}
          <div className="relative w-full">
            <input
              type="text"
              value={inputValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setHighlightedIndex(-1); }, 200)}
              onKeyDown={handleKeyDown}
              placeholder="Ej. Ensalada, Manzana..."
              className="w-full rounded-none border-outline-variant focus:border-secondary focus:ring-secondary/20 p-sm text-title-md bg-transparent border h-14"
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions && filteredSuggestions.length > 0}
              aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute top-full mt-1 z-10 w-full bg-surface-container-lowest rounded-none shadow-xl border border-outline-variant/50 max-h-48 overflow-y-auto m-0 p-0 list-none custom-scrollbar" role="listbox">
                {filteredSuggestions.map((food, idx) => (
                  <li
                    key={idx}
                    id={`suggestion-${idx}`}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                    className={`px-4 py-3 cursor-pointer text-title-sm text-on-surface capitalize transition-colors ${
                      idx === highlightedIndex 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'hover:bg-surface-container-high'
                    }`}
                    onClick={() => {
                      setInputValue(food.es);
                      setShowSuggestions(false);
                      setHighlightedIndex(-1);
                    }}
                  >
                    {food.es}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fila 2: Configuración y Acción */}
          <div className="flex flex-row items-center justify-between w-full mt-3 gap-3">
            {/* Cantidad (g) */}
            <div className="flex items-center gap-2">
              <span className="text-body-md text-outline font-medium">Gramos:</span>
              <input
                type="number"
                value={grams}
                min="1"
                max="10000"
                onChange={(e) => setGrams(Number(e.target.value))}
                placeholder="Cantidad (g)"
                className="w-32 flex-shrink-0 rounded-none border-outline-variant focus:border-secondary focus:ring-secondary/20 p-sm text-title-md bg-transparent border text-center h-14"
                title="Cantidad en gramos"
              />
            </div>

            {/* Botón Buscar */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-secondary text-white rounded-none font-sans font-medium flex items-center justify-center gap-xs hover:opacity-90 transition-all active:scale-95 border-none disabled:opacity-50 disabled:cursor-not-allowed h-14 cursor-pointer"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span className="font-sans font-medium text-base">Buscar</span>
                </>
              )}
            </button>
          </div>
        </form>
 
        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text)' }}>
            <span className="spinner" style={{ marginRight: '8px' }}>🔄</span>
            Buscando información nutricional...
          </div>
        )}
 
        {/* Error State */}
        {isError && (
          <div style={{ padding: '12px', borderRadius: '6px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', fontSize: '14px', marginBottom: '15px' }}>
            Ocurrió un error al buscar: {error instanceof Error ? error.message : 'Error desconocido'}
          </div>
        )}
 
        {/* Results List */}
        {!isLoading && !isError && searchTerm.trim() !== '' && foodResults && (
          <div className="mt-md">
            {showNoResultsMessage ? (
              <p className="text-caption text-outline text-center py-sm" style={{ margin: '20px 0' }}>
                No se encontraron alimentos para "{searchTerm}".
              </p>
            ) : (
              foodResults.length > 0 && (
                <div className="space-y-sm max-h-[400px] overflow-y-auto pr-xs custom-scrollbar">
                  {foodResults.map((item, index) => {
                    // Normalize base items to 100g to ensure correct multiplier math
                    const baseServing = item.serving_size_g || 100;
                    const multiplier = grams / baseServing;

                    let rawProtein = typeof item.protein_g === 'number' ? item.protein_g : parseFloat(item.protein_g as any) || 0;
                    let rawFat = typeof item.fat_total_g === 'number' ? item.fat_total_g : parseFloat(item.fat_total_g as any) || 0;
                    let rawCarbs = typeof item.carbohydrates_total_g === 'number' ? item.carbohydrates_total_g : parseFloat(item.carbohydrates_total_g as any) || 0;
                    let rawCalories = typeof item.calories === 'number' ? item.calories : parseFloat(item.calories as any) || 0;

                    // Fallback to realistic values if API returns 0 (e.g. premium limits)
                    if (rawCalories === 0 || isNaN(rawCalories)) {
                      const fallback = FALLBACK_NUTRITION[item.name.toLowerCase().trim()];
                      if (fallback) {
                        rawCalories = Number(fallback.calories || 0);
                        rawProtein = Number(fallback.protein_g || 0);
                        rawFat = Number(fallback.fat_total_g || 0);
                        rawCarbs = Number(fallback.carbohydrates_total_g || 0);
                      }
                    }

                    // Math application: api_value * (grams / base_serving)
                    const scaledItem: NutritionItem = {
                      ...item,
                      serving_size_g: grams,
                      calories: Math.round(rawCalories * multiplier),
                      protein_g: Number((rawProtein * multiplier).toFixed(1)),
                      fat_total_g: Number((rawFat * multiplier).toFixed(1)),
                      carbohydrates_total_g: Number((rawCarbs * multiplier).toFixed(1)),
                    };
 
                    return (
                      <Card key={`${scaledItem.name}-${index}`} className="flex flex-col border-l-4 border-tertiary bg-surface-container rounded-none p-md relative gap-sm text-left">
                        <div className="flex justify-between items-start">
                          <Card.Header className="flex-col items-start gap-0">
                            <p className="font-title-lg text-title-lg text-on-surface capitalize font-bold" style={{ margin: 0, fontSize: '1.25rem' }}>{translateFoodToSpanish(item.name)}</p>
                            <p className="text-caption text-outline" style={{ margin: 0 }}>Porción: {scaledItem.serving_size_g}g</p>
                          </Card.Header>
 
                          <div className="text-right flex flex-col">
                            <span className="text-[10px] text-outline uppercase font-bold tracking-wider">Calorías</span>
                            <span className="font-headline-sm text-headline-sm text-primary leading-none mt-xs">
                              {scaledItem.calories} <span className="text-caption">kcal</span>
                            </span>
                          </div>
                        </div>
 
                        <Card.Body className="border-t border-b border-outline-variant/30 py-sm">
                          <div className="grid grid-cols-3 text-center gap-2">
                            <div className="bg-surface-container-low rounded-none p-xs flex flex-col justify-center items-center h-14">
                              <span className="text-[10px] text-outline uppercase font-bold tracking-wider leading-none mb-1">Proteínas</span>
                              <span className="text-base font-bold text-tertiary leading-none">
                                {scaledItem.protein_g}g
                              </span>
                            </div>
                            <div className="bg-surface-container-low rounded-none p-xs flex flex-col justify-center items-center h-14">
                              <span className="text-[10px] text-outline uppercase font-bold tracking-wider leading-none mb-1">Carbs</span>
                              <span className="text-base font-bold text-secondary leading-none">
                                {scaledItem.carbohydrates_total_g}g
                              </span>
                            </div>
                            <div className="bg-surface-container-low rounded-none p-xs flex flex-col justify-center items-center h-14">
                              <span className="text-[10px] text-outline uppercase font-bold tracking-wider leading-none mb-1">Grasas</span>
                              <span className="text-base font-bold text-tertiary leading-none">
                                {scaledItem.fat_total_g}g
                              </span>
                            </div>
                          </div>
                        </Card.Body>
 
                        <Card.Footer className="flex justify-end pt-xs pb-1">
                          <button
                            type="button"
                            onClick={() => onAddFood({
                              ...scaledItem,
                              name: translateFoodToSpanish(item.name)
                            })}
                            className="bg-secondary text-white p-2 rounded-none flex items-center justify-center hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer"
                            title="Agregar al Balance Diario"
                            style={{ marginBottom: '4px' }}
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </Card.Footer>
                      </Card>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
});
