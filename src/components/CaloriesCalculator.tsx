import React, { useState, useEffect } from 'react';
import { useCalories } from '../hooks/useCalories';
import { Card } from './Card';
import type { CaloriesBurnedItem, CaloriesBurnedSearchParams } from '../types/calories';

const EXERCISE_DICTIONARY = [
  // CARDIO Y CAMINATA
  { es: "correr", en: "running" },
  { es: "caminar", en: "walking" },
  { es: "trotar", en: "jogging" },
  { es: "ciclismo", en: "cycling" },
  { es: "bicicleta estatica", en: "stationary cycling" },
  { es: "nadar", en: "swimming" },
  { es: "natacion", en: "swimming" },
  { es: "eliptica", en: "elliptical trainer" },
  { es: "escaladora", en: "stair climbing" },
  { es: "saltar la cuerda", en: "jumping rope" },
  
  // GIMNASIO Y FUERZA
  { es: "pesas", en: "weight lifting" },
  { es: "calistenia", en: "calisthenics" },
  { es: "crossfit", en: "crossfit" },
  { es: "abdominales", en: "sit-ups" },
  { es: "lagartijas", en: "push-ups" },
  { es: "sentadillas", en: "squats" },
  
  // CLASES Y ESTILOS
  { es: "aerobicos", en: "aerobics" },
  { es: "yoga", en: "yoga" },
  { es: "pilates", en: "pilates" },
  { es: "zumba", en: "dance" },
  { es: "baile", en: "dancing" },
  { es: "estiramiento", en: "stretching" },
  { es: "artes marciales", en: "martial arts" },
  { es: "boxeo", en: "boxing" },
  
  // DEPORTES DE EQUIPO Y RAQUETA
  { es: "futbol", en: "soccer" },
  { es: "basquetbol", en: "basketball" },
  { es: "voleibol", en: "volleyball" },
  { es: "tenis", en: "tennis" },
  { es: "padel", en: "squash" },
  { es: "ping pong", en: "table tennis" },
  { es: "beisbol", en: "baseball" },
  { es: "futbol americano", en: "football" },
  
  // ACTIVIDADES COTIDIANAS Y RECREATIVAS
  { es: "limpiar la casa", en: "cleaning" },
  { es: "jardineria", en: "gardening" },
  { es: "subir escaleras", en: "climbing stairs" },
  { es: "senderismo", en: "hiking" },
  { es: "patinaje", en: "rollerblading" },
  { es: "bolos", en: "bowling" },
  { es: "golf", en: "golf" },
  { es: "surf", en: "surfing" }
];

const translateActivityToEnglish = (term: string): string => {
  const clean = term.toLowerCase().trim();
  const match = EXERCISE_DICTIONARY.find(ex => ex.es === clean);
  return match ? match.en : term;
};

const translateActivityName = (name: string): string => {
  const clean = name.toLowerCase().trim();
  const match = EXERCISE_DICTIONARY.find(ex => ex.en === clean);
  if (match) {
    return match.es;
  }
  
  let translated = name;
  const translationPairs: [RegExp, string][] = [
    [/^Running/i, 'Correr'],
    [/^Walking/i, 'Caminar'],
    [/^Swimming/i, 'Nadar'],
    [/^Cycling/i, 'Ciclismo'],
    [/^Bicycling/i, 'Ciclismo'],
    [/^Aerobics/i, 'Aeróbicos'],
    [/^Dancing/i, 'Bailar'],
    [/^Yoga/i, 'Yoga'],
    [/^Weight lifting/i, 'Pesas'],
    [/^Boxing/i, 'Boxeo'],
    [/^Hiking/i, 'Senderismo'],
    [/^Climbing/i, 'Escalada'],
    [/^Soccer/i, 'Fútbol'],
    [/^Basketball/i, 'Básquetbol'],
    [/^Tennis/i, 'Tenis'],
  ];

  for (const [regex, replacement] of translationPairs) {
    if (regex.test(translated)) {
      translated = translated.replace(regex, replacement);
    }
  }
  return translated;
};

interface CaloriesCalculatorProps {
  onAddActivity: (activity: CaloriesBurnedItem) => void;
}

// Helper to get initial weight in kg from localStorage or estimate it
const getInitialWeight = (): string => {
  const savedKg = localStorage.getItem('vitalmetrics_weight_kg');
  if (savedKg) return savedKg;

  const savedLbs = localStorage.getItem('vitalmetrics_weight_lbs');
  if (savedLbs) {
    const lbs = parseFloat(savedLbs);
    if (!isNaN(lbs) && lbs > 0) {
      return Math.round(lbs / 2.20462).toString();
    }
  }

  const savedBmr = localStorage.getItem('vitalmetrics_bmr');
  if (savedBmr) {
    const bmr = parseInt(savedBmr, 10);
    if (!isNaN(bmr) && bmr > 0) {
      return Math.round((bmr / 10) / 2.20462).toString();
    }
  }

  return '70';
};

export const CaloriesCalculator = React.memo(function CaloriesCalculator({ onAddActivity }: CaloriesCalculatorProps) {
  const [activityInput, setActivityInput] = useState('');
  const [weightInput, setWeightInput] = useState(getInitialWeight);
  const [durationInput, setDurationInput] = useState('30');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showWeightInfo, setShowWeightInfo] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Search parameters state that triggers hook
  const [searchParams, setSearchParams] = useState<CaloriesBurnedSearchParams>(() => ({
    activity: '',
    weight: Math.round(Number(getInitialWeight()) * 2.20462),
    duration: 30,
  }));

  // Validation errors
  const [errors, setErrors] = useState<{ activity?: string; weight?: string; duration?: string }>({});

  useEffect(() => {
    const handleWeightChange = () => {
      const currentVal = getInitialWeight();
      setWeightInput(currentVal);
      setSearchParams(prev => {
        if (prev.activity) {
          return {
            ...prev,
            weight: Math.round(Number(currentVal) * 2.20462),
          };
        }
        return prev;
      });
    };

    window.addEventListener('vitalmetrics_weight_changed', handleWeightChange);
    window.addEventListener('storage', handleWeightChange);
    return () => {
      window.removeEventListener('vitalmetrics_weight_changed', handleWeightChange);
      window.removeEventListener('storage', handleWeightChange);
    };
  }, []);

  // Query hook
  const { data: activityResults, isLoading, isError, error } = useCalories(searchParams);

  // Predictive local filter in Spanish
  const filteredSuggestions = activityInput.trim() === ''
    ? []
    : EXERCISE_DICTIONARY.filter((ex) =>
        ex.es.includes(activityInput.toLowerCase().trim())
      );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = highlightedIndex < filteredSuggestions.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(next);
      document.getElementById(`exercise-suggestion-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = highlightedIndex > 0 ? highlightedIndex - 1 : filteredSuggestions.length - 1;
      setHighlightedIndex(next);
      document.getElementById(`exercise-suggestion-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = filteredSuggestions[highlightedIndex];
      setActivityInput(selected.es);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const newErrors: typeof errors = {};

    const weightKg = Number(weightInput);
    const durationNum = Number(durationInput);

    if (!activityInput.trim()) {
      newErrors.activity = 'Debes ingresar un término de actividad.';
    }

    if (!weightInput || isNaN(weightKg) || weightKg <= 0 || weightKg > 500) {
      newErrors.weight = 'Ingresa un peso válido entre 1 y 500 kg.';
    }

    if (!durationInput || isNaN(durationNum) || durationNum <= 0 || durationNum > 1440) {
      newErrors.duration = 'Ingresa una duración válida entre 1 y 1440 minutos.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const queryTerm = translateActivityToEnglish(activityInput.trim());
    const weightLbs = Math.round(weightKg * 2.20462);
    setSearchParams({
      activity: queryTerm,
      weight: weightLbs,
      duration: durationNum,
    });
  };

  // Helper to get intensity scale details
  const getIntensityDetails = (calories: number) => {
    if (calories < 150) {
      return {
        label: 'Baja',
        color: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.1)',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    } else if (calories <= 350) {
      return {
        label: 'Moderada',
        color: '#f59e0b', // orange/amber
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
      };
    } else {
      return {
        label: 'Alta',
        color: '#ef4444', // red
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
      };
    }
  };

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs relative group">
          <h2 className="font-headline-md text-headline-md text-primary" style={{ margin: 0 }}>Calculadora de Gasto Calórico</h2>
          <span className="material-symbols-outlined text-[16px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
          <div className="absolute bottom-full mb-2 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
            Calculadora basada en equivalentes metabólicos (METs). Estima cuántas calorías quemas según tu peso y el tiempo de actividad.
          </div>
        </div>
        <span className="text-caption text-outline">Estimación Metabólica Precisa</span>
      </div>

      <div className="bg-surface-container-lowest rounded-none p-md shadow-sm border border-outline-variant/30 text-left flex flex-col h-full">
        <form onSubmit={handleSearch} className="space-y-md flex-grow">
          {/* Activity Input */}
          <div className="relative">
            <label className="font-sans text-sm font-medium text-on-surface-variant block mb-xs" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Actividad / Ejercicio
            </label>
            <input
              type="text"
              value={activityInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setActivityInput(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(-1);
              }}
              onBlur={() => setTimeout(() => { setShowSuggestions(false); setHighlightedIndex(-1); }, 200)}
              onKeyDown={handleKeyDown}
              placeholder="Ej. Correr, Caminar, Ciclismo..."
              className={`w-full rounded-md border-outline-variant focus:border-secondary focus:ring-secondary/20 p-sm text-body-md bg-transparent border ${errors.activity ? 'border-red-500' : ''}`}
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions && filteredSuggestions.length > 0}
              aria-activedescendant={highlightedIndex >= 0 ? `exercise-suggestion-${highlightedIndex}` : undefined}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-surface-container-lowest rounded-md shadow-xl border border-outline-variant/50 max-h-48 overflow-y-auto m-0 p-0 list-none custom-scrollbar" role="listbox">
                {filteredSuggestions.map((ex, idx) => (
                  <li
                    key={idx}
                    id={`exercise-suggestion-${idx}`}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                    className={`px-4 py-2 cursor-pointer text-body-md text-on-surface capitalize transition-colors ${
                      idx === highlightedIndex
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-surface-container-high'
                    }`}
                    onClick={() => {
                      setActivityInput(ex.es);
                      setShowSuggestions(false);
                      setHighlightedIndex(-1);
                    }}
                  >
                    {ex.es}
                  </li>
                ))}
              </ul>
            )}
            {errors.activity && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.activity}
              </span>
            )}
          </div>

          {/* Numeric Inputs Row */}
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-sans text-sm font-medium text-on-surface-variant block mb-xs" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Peso (kg)
              </label>
              <input
                type="number"
                value={weightInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setWeightInput(val);
                  const num = Number(val);
                  if (val && !isNaN(num) && num > 0 && num <= 500) {
                    localStorage.setItem('vitalmetrics_weight_kg', val);
                    const lbs = num * 2.20462;
                    localStorage.setItem('vitalmetrics_weight_lbs', Math.round(lbs).toString());
                    window.dispatchEvent(new Event('vitalmetrics_weight_changed'));
                  }
                }}
                placeholder="70"
                min="1"
                max="500"
                className={`w-full rounded-md border-outline-variant focus:border-secondary focus:ring-secondary/20 p-sm text-body-md bg-transparent border ${errors.weight ? 'border-red-500' : ''}`}
              />
              {errors.weight && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.weight}
                </span>
              )}
            </div>

            <div>
              <label className="font-sans text-sm font-medium text-on-surface-variant block mb-xs" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Duración (min)
              </label>
              <input
                type="number"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="30"
                min="1"
                max="1440"
                className={`w-full rounded-md border-outline-variant focus:border-secondary focus:ring-secondary/20 p-sm text-body-md bg-transparent border ${errors.duration ? 'border-red-500' : ''}`}
              />
              {errors.duration && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.duration}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary-container text-white py-md rounded-md font-sans text-base font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md border-none cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {isLoading ? 'Calculando...' : 'Calcular Calorías'}
          </button>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text)' }}>
            <span className="spinner" style={{ marginRight: '8px' }}>🔄</span>
            Buscando actividades y calculando...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div style={{ padding: '12px', borderRadius: '6px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', fontSize: '14px', marginBottom: '15px', marginTop: '15px' }}>
            Error al buscar: {error instanceof Error ? error.message : 'Error desconocido'}
          </div>
        )}

        {/* Results List */}
        {!isLoading && !isError && searchParams.activity && activityResults && (
          <div className="mt-xl pt-md border-t border-outline-variant">
            {activityResults.length === 0 ? (
              <p style={{ color: 'var(--text)', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                No se encontraron actividades para "{searchParams.activity}".
              </p>
            ) : (
              <div className="space-y-sm max-h-[300px] overflow-y-auto pr-xs custom-scrollbar">
                {activityResults.map((item, index) => {
                  const intensity = getIntensityDetails(item.total_calories);
                  const percentage = Math.min(100, Math.round((item.total_calories / 600) * 100));

                  return (
                    <Card key={`${item.name}-${index}`} className="flex-col gap-sm border-l-4 bg-surface-container rounded-none p-sm" style={{ borderLeftColor: intensity.color }}>
                      <Card.Header>
                        <div className="text-left">
                          <p className="font-label-md text-label-md text-on-surface capitalize" style={{ margin: 0 }}>{translateActivityName(item.name)}</p>
                          <p className="text-caption text-outline" style={{ margin: 0 }}>{item.duration_minutes} min | {item.calories_per_hour} kcal/hr</p>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          color: intensity.color,
                          backgroundColor: intensity.bg,
                          border: `1px solid ${intensity.border}`
                        }}>
                          {intensity.label}
                        </span>
                      </Card.Header>

                      <Card.Body>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text)' }}>Impacto calórico:</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-h)' }}>{item.total_calories} kcal</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: intensity.color, borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
                        </div>
                      </Card.Body>

                      <Card.Footer>
                        <button
                          type="button"
                          onClick={() => onAddActivity({
                            ...item,
                            name: translateActivityName(item.name)
                          })}
                          className="btn-secondary w-full"
                        >
                          + Seleccionar Ejercicio
                        </button>
                      </Card.Footer>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Educational collapsible: why weight matters */}
        <div className="mt-md border-t border-outline-variant/30 pt-sm">
          <button
            type="button"
            onClick={() => setShowWeightInfo(prev => !prev)}
            className="flex items-center gap-xs w-full bg-transparent border-none cursor-pointer p-0 text-left group"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">science</span>
            <span className="text-xs font-semibold text-primary group-hover:underline">¿Por qué influye tu peso?</span>
            <span className={`material-symbols-outlined text-[16px] text-outline transition-transform duration-300 ml-auto ${showWeightInfo ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showWeightInfo ? 'max-h-40 opacity-100 mt-sm' : 'max-h-0 opacity-0'}`}>
            <p className="text-xs text-outline leading-relaxed m-0 bg-surface-container-low p-sm rounded-md border border-outline-variant/20">
              La física determina que a mayor peso corporal, tu cuerpo requiere realizar un mayor esfuerzo y gastar más energía (calorías) para completar la misma actividad física (como el ciclismo o correr). Por ello, personalizar tu peso nos permite darte un cálculo exacto adaptado a ti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
