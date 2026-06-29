import { useState, useEffect, useCallback } from 'react';
import { useExercises } from '../hooks/useExercises';
import type { ExerciseItem } from '../types/exercises';

// Dynamic muscle image imports
import abdominalesImg from '../assets/abdominales.jpg';
import bicepsImg from '../assets/bicep.jpg';
import calvesImg from '../assets/pantorrilla.jpg';
import chestImg from '../assets/pushup.jpg';
import glutesImg from '../assets/hittrush.jpg';
import hamstringsImg from '../assets/hamstrings.jpg';
import latsImg from '../assets/lats.png';
import quadricepsImg from '../assets/quadriceps.png';
import shouldersImg from '../assets/shoulders.jpg';
import tricepsImg from '../assets/triceps.png';
import musculoImg from '../assets/musculo.png';

export function ExerciseExplorer() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showMuscleDropdown, setShowMuscleDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [muscleHighlight, setMuscleHighlight] = useState(-1);
  const [difficultyHighlight, setDifficultyHighlight] = useState(-1);
  
  // State for popup instructions modal
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  // Debounce search input (450ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    if (selectedExercise) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedExercise]);

  // Determine if we are in the "idle" state
  const isIdle = !debouncedSearch.trim() && !selectedMuscle && !selectedDifficulty;

  // Set up search parameters
  const searchFilters = {
    name: debouncedSearch.trim() || undefined,
    muscle: selectedMuscle || undefined,
    difficulty: selectedDifficulty || undefined,
  };

  // Consume our infinite query hook (enabled only when not idle)
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExercises(searchFilters);

  // Predefined options matching standard API Ninjas values, displaying in Spanish
  const muscles = [
    { value: '', label: 'Grupo Muscular' },
    { value: 'abdominals', label: 'Abdominales' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'calves', label: 'Pantorrillas' },
    { value: 'chest', label: 'Pecho' },
    { value: 'glutes', label: 'Glúteos' },
    { value: 'hamstrings', label: 'Isquiotibiales' },
    { value: 'lats', label: 'Espalda (Lats)' },
    { value: 'quadriceps', label: 'Cuádriceps' },
    { value: 'shoulders', label: 'Hombros' },
    { value: 'triceps', label: 'Tríceps' },
  ];

  const difficulties = [
    { value: '', label: 'Dificultad' },
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'expert', label: 'Avanzado' },
  ];

  // Map difficulty levels to prototype Tailwind colors
  const getDifficultyClass = useCallback((diff: string) => {
    const d = diff.toLowerCase();
    if (d === 'beginner') {
      return 'bg-surface-container-highest text-on-surface-variant';
    }
    if (d === 'intermediate') {
      return 'bg-tertiary-container text-on-tertiary-container';
    }
    return 'bg-tertiary text-white';
  }, []);

  // Translation helpers
  const translateDifficulty = useCallback((diff: string) => {
    const d = diff.toLowerCase();
    if (d === 'beginner') return 'Principiante';
    if (d === 'intermediate') return 'Intermedio';
    if (d === 'expert') return 'Avanzado';
    return diff;
  }, []);

  const translateMuscle = useCallback((m: string) => {
    const muscleMap: Record<string, string> = {
      abdominals: 'Abdominales',
      biceps: 'Bíceps',
      calves: 'Pantorrillas',
      chest: 'Pecho',
      glutes: 'Glúteos',
      hamstrings: 'Isquiotibiales',
      lats: 'Espalda (Lats)',
      quadriceps: 'Cuádriceps',
      shoulders: 'Hombros',
      triceps: 'Tríceps'
    };
    return muscleMap[m.toLowerCase()] || m;
  }, []);

  const translateType = useCallback((t: string) => {
    const typeMap: Record<string, string> = {
      strength: 'Fuerza',
      cardiorespiratory: 'Cardiovascular',
      stretching: 'Estiramiento',
      plyometrics: 'Pliometría',
      powerlifting: 'Levantamiento de potencia'
    };
    return typeMap[t.toLowerCase()] || t;
  }, []);

  // Map muscle to dynamic image source path
  const getMuscleImage = useCallback((muscle: string) => {
    const muscleImages: Record<string, string> = {
      abdominals: abdominalesImg,
      biceps: bicepsImg,
      calves: calvesImg,
      chest: chestImg,
      glutes: glutesImg,
      hamstrings: hamstringsImg,
      lats: latsImg,
      quadriceps: quadricepsImg,
      shoulders: shouldersImg,
      triceps: tricepsImg,
    };
    const m = muscle.toLowerCase();
    return muscleImages[m] || latsImg; // fallback to latsImg if not matched
  }, []);

  return (
    <div className="space-y-md text-left" style={{ gridColumn: '1 / -1' }}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <div className="flex items-center gap-xs relative group">
            <h2 className="font-headline-md text-headline-md text-primary" style={{ margin: 0 }}>Explorador de Ejercicios</h2>
            <span className="material-symbols-outlined text-[16px] text-outline hover:text-primary transition-colors cursor-help select-none">info</span>
            <div className="absolute bottom-full mb-2 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-2 rounded-none shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal">
              Buscador y guía de acondicionamiento físico. Permite filtrar movimientos por grupo muscular o dificultad y proporciona instrucciones detalladas paso a paso.
            </div>
          </div>
          <p className="font-body-md text-body-md text-outline" style={{ margin: 0 }}>Movimientos guiados para una integridad física óptima.</p>
        </div>
        
        <div className="flex flex-wrap gap-sm">
          <div className="flex items-center bg-surface-container rounded-md px-sm border border-outline-variant">
            <span className="material-symbols-outlined text-outline text-sm">search</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar ejercicios..."
              className="bg-transparent border-none focus:ring-0 py-2 text-label-md w-32 md:w-48"
              style={{ border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>

          {/* Custom Muscle Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowMuscleDropdown(prev => !prev); setShowDifficultyDropdown(false); setMuscleHighlight(-1); }}
              onKeyDown={(e) => {
                if (!showMuscleDropdown) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = muscleHighlight < muscles.length - 1 ? muscleHighlight + 1 : 0;
                  setMuscleHighlight(next);
                  document.getElementById(`muscle-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const next = muscleHighlight > 0 ? muscleHighlight - 1 : muscles.length - 1;
                  setMuscleHighlight(next);
                  document.getElementById(`muscle-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'Enter' && muscleHighlight >= 0) {
                  e.preventDefault();
                  setSelectedMuscle(muscles[muscleHighlight].value);
                  setShowMuscleDropdown(false);
                  setMuscleHighlight(-1);
                } else if (e.key === 'Escape') {
                  setShowMuscleDropdown(false);
                  setMuscleHighlight(-1);
                }
              }}
              className="rounded-md border border-outline-variant bg-surface-container py-2 px-3 text-label-md cursor-pointer flex items-center gap-2 hover:bg-surface-container-high transition-colors min-w-[160px] justify-between"
            >
              <span>{muscles.find(m => m.value === selectedMuscle)?.label || 'Grupo Muscular'}</span>
              <span className={`material-symbols-outlined text-sm text-outline transition-transform duration-200 ${showMuscleDropdown ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {showMuscleDropdown && (
              <ul
                className="absolute top-full mt-1 z-20 w-full bg-surface-container-lowest rounded-md shadow-xl border border-outline-variant/50 max-h-48 overflow-y-auto m-0 p-0 list-none custom-scrollbar"
                role="listbox"
              >
                {muscles.map((opt, idx) => (
                  <li
                    key={opt.value}
                    id={`muscle-opt-${idx}`}
                    role="option"
                    aria-selected={idx === muscleHighlight}
                    className={`px-4 py-2 cursor-pointer text-body-md text-on-surface transition-colors ${
                      idx === muscleHighlight
                        ? 'bg-primary/10 text-primary font-semibold'
                        : selectedMuscle === opt.value
                          ? 'bg-surface-container-high font-medium'
                          : 'hover:bg-surface-container-high'
                    }`}
                    onClick={() => {
                      setSelectedMuscle(opt.value);
                      setShowMuscleDropdown(false);
                      setMuscleHighlight(-1);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Custom Difficulty Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowDifficultyDropdown(prev => !prev); setShowMuscleDropdown(false); setDifficultyHighlight(-1); }}
              onKeyDown={(e) => {
                if (!showDifficultyDropdown) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = difficultyHighlight < difficulties.length - 1 ? difficultyHighlight + 1 : 0;
                  setDifficultyHighlight(next);
                  document.getElementById(`diff-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const next = difficultyHighlight > 0 ? difficultyHighlight - 1 : difficulties.length - 1;
                  setDifficultyHighlight(next);
                  document.getElementById(`diff-opt-${next}`)?.scrollIntoView({ block: 'nearest' });
                } else if (e.key === 'Enter' && difficultyHighlight >= 0) {
                  e.preventDefault();
                  setSelectedDifficulty(difficulties[difficultyHighlight].value);
                  setShowDifficultyDropdown(false);
                  setDifficultyHighlight(-1);
                } else if (e.key === 'Escape') {
                  setShowDifficultyDropdown(false);
                  setDifficultyHighlight(-1);
                }
              }}
              className="rounded-md border border-outline-variant bg-surface-container py-2 px-3 text-label-md cursor-pointer flex items-center gap-2 hover:bg-surface-container-high transition-colors min-w-[140px] justify-between"
            >
              <span>{difficulties.find(d => d.value === selectedDifficulty)?.label || 'Dificultad'}</span>
              <span className={`material-symbols-outlined text-sm text-outline transition-transform duration-200 ${showDifficultyDropdown ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {showDifficultyDropdown && (
              <ul
                className="absolute top-full mt-1 z-20 w-full bg-surface-container-lowest rounded-md shadow-xl border border-outline-variant/50 max-h-48 overflow-y-auto m-0 p-0 list-none custom-scrollbar"
                role="listbox"
              >
                {difficulties.map((opt, idx) => (
                  <li
                    key={opt.value}
                    id={`diff-opt-${idx}`}
                    role="option"
                    aria-selected={idx === difficultyHighlight}
                    className={`px-4 py-2 cursor-pointer text-body-md text-on-surface transition-colors ${
                      idx === difficultyHighlight
                        ? 'bg-primary/10 text-primary font-semibold'
                        : selectedDifficulty === opt.value
                          ? 'bg-surface-container-high font-medium'
                          : 'hover:bg-surface-container-high'
                    }`}
                    onClick={() => {
                      setSelectedDifficulty(opt.value);
                      setShowDifficultyDropdown(false);
                      setDifficultyHighlight(-1);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Background Fetching Indicator */}
      {isFetchingNextPage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--text-h)',
          color: 'var(--bg)',
          padding: '10px 16px',
          borderRadius: '30px',
          boxShadow: 'var(--shadow)',
          fontSize: '13px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="spinner">🔄</span>
          Cargando más ejercicios en segundo plano...
        </div>
      )}

      {/* STATE 1: Idle State */}
      {isIdle && (
        <div className="border-2 border-dashed border-outline-variant rounded-none p-xl flex flex-col items-center justify-center text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-surface-container rounded-none flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
            <img src={musculoImg} alt="Músculo" className="w-10 h-10 object-contain" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">Esperando búsqueda</h3>
          <p className="font-body-md text-body-md text-outline mt-xs max-w-sm">
            Escribe un nombre o selecciona un filtro muscular/dificultad para explorar.
          </p>
        </div>
      )}

      {/* STATE 2: Loading State (initial page loading) */}
      {!isIdle && isLoading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text)' }}>
          <span className="spinner" style={{ fontSize: '24px', marginBottom: '12px' }}>🔄</span>
          <div>Cargando listado de ejercicios...</div>
        </div>
      )}

      {/* STATE 3: Error State */}
      {!isIdle && isError && (
        <div style={{ padding: '16px', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', fontSize: '14px', margin: '20px 0' }}>
          <strong>Error de consulta:</strong> {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      )}

      {/* STATE 4: Success State (results render) */}
      {!isIdle && !isLoading && !isError && data && (
        <div className="space-y-lg">
          {data.pages[0].length === 0 ? (
            <p style={{ color: 'var(--text)', fontSize: '14px', textAlign: 'center', margin: '30px 0' }}>
              No se encontraron ejercicios con los filtros seleccionados.
            </p>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                {data.pages.flatMap((page) => page).map((item) => {
                  return (
                    <div
                      key={item.name}
                      className="bento-card bg-surface-container-lowest rounded-none overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Dynamic image based on muscle */}
                        <div className="h-48 relative overflow-hidden bg-surface-container-high">
                          <img
                            src={getMuscleImage(item.muscle)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className={`absolute top-sm right-sm text-[10px] px-sm py-1 rounded-none uppercase font-bold tracking-tighter ${getDifficultyClass(item.difficulty)}`}
                          >
                            {translateDifficulty(item.difficulty)}
                          </span>
                        </div>

                        <div className="p-sm text-left">
                          <p className="font-label-md text-label-md text-on-surface capitalize" style={{ margin: '0 0 4px 0' }}>{item.name}</p>
                          <p className="text-caption text-outline" style={{ margin: '0 0 12px 0' }}>Músculo objetivo: {translateMuscle(item.muscle)}</p>
                          
                          <div className="flex gap-xs items-center mb-sm">
                            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                            <span className="text-caption text-tertiary capitalize">{translateType(item.type)}</span>
                          </div>

                          {/* Trigger Modal Popup instead of accordion expand */}
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedExercise(item)}
                              className="text-secondary font-label-md text-caption hover:underline cursor-pointer border-none bg-transparent p-0 flex items-center gap-xs"
                            >
                              <span>Ver instrucciones</span>
                              <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-primary"
                    style={{ width: 'auto' }}
                  >
                    {isFetchingNextPage ? 'Cargando...' : 'Cargar más ejercicios'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions Modal Overlay */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-none max-w-lg w-full p-lg shadow-2xl border border-outline-variant/30 flex flex-col max-h-[80vh] relative animate-in zoom-in-95 duration-200">
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setSelectedExercise(null)}
              className="absolute top-md right-md text-outline hover:text-on-surface cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Modal Title */}
            <h3 className="font-headline-md text-headline-md text-primary pr-xl capitalize mb-xs text-left" style={{ margin: '0 0 4px 0' }}>
              {selectedExercise.name}
            </h3>

            {/* Badges Grid */}
            <div className="flex gap-xs flex-wrap mb-md text-left">
              <span className={`text-[10px] px-sm py-1 rounded-none uppercase font-bold tracking-tighter ${getDifficultyClass(selectedExercise.difficulty)}`}>
                {translateDifficulty(selectedExercise.difficulty)}
              </span>
              <span className="text-[10px] bg-surface-container px-sm py-1 rounded-none text-on-surface-variant font-bold">
                {translateMuscle(selectedExercise.muscle)}
              </span>
              <span className="text-[10px] bg-surface-container px-sm py-1 rounded-none text-on-surface-variant font-bold">
                {translateType(selectedExercise.type)}
              </span>
            </div>

            {/* Instructions Content (Isolated Scroll) */}
            <div className="flex-grow text-left overflow-y-auto pr-xs custom-scrollbar max-h-[50vh] space-y-md my-sm">
              <div>
                <h4 className="font-label-md text-label-md text-on-surface mb-xs" style={{ margin: '0 0 6px 0', fontWeight: 'bold' }}>Instrucciones Paso a Paso:</h4>
                <ol className="list-decimal pl-md space-y-sm text-body-md text-on-surface-variant">
                  {selectedExercise.instructions
                    .split(/(?<=\.)\s+/) // split by period followed by whitespace
                    .filter((step) => step.trim().length > 0)
                    .map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step.trim()}
                      </li>
                    ))}
                </ol>
              </div>

              {selectedExercise.safety_info && selectedExercise.safety_info.trim() && (
                <div className="p-sm bg-red-50 border-l-4 border-red-500 text-red-800 rounded-none text-caption">
                  <div className="flex items-center gap-xs font-bold mb-xs text-red-900">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>Información de Seguridad:</span>
                  </div>
                  <p style={{ margin: 0, lineHeight: '140%' }}>{selectedExercise.safety_info}</p>
                </div>
              )}
            </div>

            {/* Footer Close Button */}
            <div className="mt-md pt-md border-t border-outline-variant flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="bg-secondary text-white px-md py-xs rounded-none font-label-md hover:opacity-90 transition-opacity border-none cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
