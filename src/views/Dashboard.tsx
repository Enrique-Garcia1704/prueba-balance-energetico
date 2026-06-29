import React, { useState, useCallback, useEffect } from 'react';
import { NutritionSearch } from '../components/NutritionSearch';
import { CaloriesCalculator } from '../components/CaloriesCalculator';
import { DailyBalance } from '../components/DailyBalance';
import { ExerciseExplorer } from '../components/ExerciseExplorer';
import type { NutritionItem } from '../types/nutrition';
import type { CaloriesBurnedItem } from '../types/calories';
import type { HistoryRecord } from '../types/history';

function HistoryRecordItem({ record, isOpen, onToggle, onDelete }: { record: HistoryRecord; isOpen: boolean; onToggle: () => void; onDelete: (id: string) => void }) {
  return (
    <div 
      className="bg-surface-container-lowest border-l-4 border-primary border-t border-r border-b border-outline-variant/30 rounded-md p-md shadow-sm transition-all hover:bg-surface-container-low flex flex-col gap-md text-left cursor-pointer" 
      onClick={onToggle}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface m-0">{record.title}</h3>
            <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </div>
          <p className="text-caption text-outline m-0 mb-2">
            {record.foods.length} alimentos, {record.activities.length} ejercicios
          </p>
          <div className="flex flex-wrap gap-sm">
            <span className="text-xs bg-surface-container px-2 py-1 rounded-md border border-outline-variant text-on-surface-variant font-mono">Consumidas: {record.totalConsumed} kcal</span>
            <span className="text-xs bg-surface-container px-2 py-1 rounded-md border border-outline-variant text-on-surface-variant font-mono">Quemadas: {record.totalBurned} kcal</span>
            <span className={`text-xs px-2 py-1 rounded-md font-bold border ${record.netBalance > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              Neto: {record.netBalance > 0 ? '+' : ''}{record.netBalance} kcal
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
            className="bg-error/10 text-error hover:bg-error/20 p-2 rounded-md border-none cursor-pointer flex items-center justify-center transition-colors"
            title="Eliminar registro"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      
      {/* Accordion content */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-outline-variant/30 pt-sm flex flex-col md:flex-row gap-lg">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-on-surface mb-2">Alimentos</h4>
            {record.foods.length === 0 ? (
              <p className="text-sm text-outline italic m-0">Ninguno</p>
            ) : (
              <ul className="m-0 pl-4 space-y-1 text-sm text-outline">
                {record.foods.map((food, i) => (
                  <li key={i}>{food.name} ({typeof food.calories === 'number' ? food.calories : parseFloat(food.calories as any) || 0} kcal)</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-on-surface mb-2">Ejercicios</h4>
            {record.activities.length === 0 ? (
              <p className="text-sm text-outline italic m-0">Ninguno</p>
            ) : (
              <ul className="m-0 pl-4 space-y-1 text-sm text-outline">
                {record.activities.map((act, i) => (
                  <li key={i}>{act.name} ({act.total_calories} kcal - {act.duration_minutes} min)</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [selectedFoods, setSelectedFoods] = useState<NutritionItem[]>(() => {
    const saved = localStorage.getItem('vitalmetrics_foods');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedActivities, setSelectedActivities] = useState<CaloriesBurnedItem[]>(() => {
    const saved = localStorage.getItem('vitalmetrics_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
    const saved = localStorage.getItem('vitalmetrics_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedHistoryLog, setSelectedHistoryLog] = useState<string | null>(null);

  const activeRecord = historyRecords.find(r => r.id === selectedHistoryLog);
  const displayFoods = activeRecord ? activeRecord.foods : selectedFoods;
  const displayActivities = activeRecord ? activeRecord.activities : selectedActivities;

  useEffect(() => {
    localStorage.setItem('vitalmetrics_foods', JSON.stringify(selectedFoods));
  }, [selectedFoods]);

  useEffect(() => {
    localStorage.setItem('vitalmetrics_activities', JSON.stringify(selectedActivities));
  }, [selectedActivities]);

  useEffect(() => {
    localStorage.setItem('vitalmetrics_history', JSON.stringify(historyRecords));
  }, [historyRecords]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const lastDate = localStorage.getItem('vitalmetrics_last_date');

    if (lastDate && lastDate !== today) {
      // It's a new day -> Reset active tracking
      setSelectedFoods([]);
      setSelectedActivities([]);
      localStorage.setItem('vitalmetrics_last_date', today);
    } else if (!lastDate) {
      localStorage.setItem('vitalmetrics_last_date', today);
    }
  }, []);

  const handleAddFood = useCallback((food: NutritionItem) => {
    setSelectedFoods((prev) => [...prev, food]);
  }, []);

  const handleRemoveFood = useCallback((index: number) => {
    setSelectedFoods((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddActivity = useCallback((activity: CaloriesBurnedItem) => {
    setSelectedActivities((prev) => [...prev, activity]);
  }, []);

  const handleRemoveActivity = useCallback((index: number) => {
    setSelectedActivities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistoryRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const getFoodCalories = (item: NutritionItem) => typeof item.calories === 'number' ? item.calories : parseFloat(item.calories as any) || 0;

  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayHistoryRecords = historyRecords.filter(r => {
    return new Date(r.timestamp).toLocaleDateString('en-CA') === todayStr;
  });

  const currentSessionConsumed = selectedFoods.reduce((acc, item) => acc + getFoodCalories(item), 0);
  const currentSessionBurned = selectedActivities.reduce((acc, item) => acc + item.total_calories, 0);

  const accumulatedConsumed = todayHistoryRecords.reduce((acc, r) => acc + r.totalConsumed, 0) + currentSessionConsumed;
  const accumulatedBurned = todayHistoryRecords.reduce((acc, r) => acc + r.totalBurned, 0) + currentSessionBurned;

  const displayConsumed = activeRecord ? activeRecord.totalConsumed : accumulatedConsumed;
  const displayBurned = activeRecord ? activeRecord.totalBurned : accumulatedBurned;

  const handleSaveRecord = () => {
    if (selectedFoods.length === 0 && selectedActivities.length === 0) return;

    const totalConsumed = currentSessionConsumed;
    const totalBurned = currentSessionBurned;
    const netBalance = totalConsumed - totalBurned;

    const now = new Date();
    const title = `Registro ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    const newRecord: HistoryRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      timestamp: Date.now(),
      title,
      foods: [...selectedFoods],
      activities: [...selectedActivities],
      totalConsumed,
      totalBurned,
      netBalance
    };

    setHistoryRecords(prev => [newRecord, ...prev]);
    setSelectedFoods([]);
    setSelectedActivities([]);
  };

  const scrollToSection = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const hasCurrentData = selectedFoods.length > 0 || selectedActivities.length > 0;

  return (
    <>
      {/* Sidebar Navigation (Web) */}
      <aside className="hidden md:flex flex-col gap-md p-md border-r border-outline-variant bg-surface-container-low h-screen w-64 fixed left-0 top-0 z-40">
        <div className="flex items-center gap-base mb-xl">
          <span className="material-symbols-outlined text-primary text-[32px]">monitoring</span>
          <div className="text-left">
            <h1 className="font-headline-md text-headline-md font-extrabold text-primary" style={{ margin: 0 }}>VitalMetrics</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline" style={{ margin: 0 }}>Precisión Clínica</p>
          </div>
        </div>
        <nav className="flex flex-col gap-sm">
          <a
            href="#balance-section"
            onClick={scrollToSection('balance-section')}
            className="flex items-center gap-base text-secondary font-bold hover:bg-surface-container-high rounded-none p-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Dashboard
          </a>
          <a
            href="#history-section"
            onClick={scrollToSection('history-section')}
            className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-high rounded-none p-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">history</span>
            Historial
          </a>
          <a
            href="#nutrition-section"
            onClick={scrollToSection('nutrition-section')}
            className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-high rounded-none p-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">restaurant</span>
            Nutrición
          </a>
          <a
            href="#exercises-section"
            onClick={scrollToSection('exercises-section')}
            className="flex items-center gap-base text-on-surface-variant hover:bg-surface-container-high rounded-none p-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">fitness_center</span>
            Ejercicios
          </a>
        </nav>
      </aside>

      {/* Top App Bar (Universal) */}
      <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface/80 backdrop-blur-md shadow-sm z-30">
        <div className="flex justify-between items-center px-md py-sm max-w-container-max mx-auto">
          <div className="md:hidden flex items-center justify-center w-full">
            <span className="font-headline-md text-headline-md font-bold text-primary">VitalMetrics</span>
          </div>
          <div className="hidden md:block">
            <h2 className="font-headline-md text-headline-md text-primary" style={{ margin: 0 }}>Panel de Salud</h2>
          </div>
          <div className="hidden md:flex items-center gap-md">
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-xl pb-32 md:pb-6 md:ml-64 min-h-screen px-md">
        <div className="max-w-container-max mx-auto space-y-xl mt-md">

          {/* Daily Balance Wrapper with ID */}
          <div id="balance-section" className="scroll-mt-24 space-y-md">
            <DailyBalance 
              selectedFoods={displayFoods}
              selectedActivities={displayActivities}
              onRemoveFood={activeRecord ? () => {} : handleRemoveFood}
              onRemoveActivity={activeRecord ? () => {} : handleRemoveActivity}
              overrideTotalConsumed={displayConsumed}
              overrideTotalBurned={displayBurned}
            />
            
            {/* Guardar Registro Button */}
            {hasCurrentData && (
              <div className="flex justify-end mt-md">
                <button
                  onClick={handleSaveRecord}
                  className="bg-primary text-white px-xl py-md rounded-none font-sans font-bold text-base flex items-center gap-xs hover:opacity-90 transition-all active:scale-95 border-none cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Guardar Registro Actual
                </button>
              </div>
            )}
          </div>

          {/* History Section */}
          <div id="history-section" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-primary text-[28px]">history</span>
              <h2 className="font-headline-md text-headline-md text-primary m-0">Historial de Registros</h2>
            </div>
            
            {historyRecords.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-none p-xl text-center shadow-sm">
                <span className="material-symbols-outlined text-outline text-[48px] mb-2 opacity-50">auto_stories</span>
                <p className="text-outline m-0">No hay registros guardados aún. Empieza agregando alimentos y ejercicios, y guarda tu día.</p>
              </div>
            ) : (
              <div className="space-y-sm">
                {historyRecords.map(record => (
                  <HistoryRecordItem 
                    key={record.id} 
                    record={record} 
                    isOpen={selectedHistoryLog === record.id}
                    onToggle={() => setSelectedHistoryLog(prev => prev === record.id ? null : record.id)}
                    onDelete={(id) => {
                      if (selectedHistoryLog === id) setSelectedHistoryLog(null);
                      handleDeleteRecord(id);
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tools Grid: Nutrition Analyzer + Burn Calculator */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl text-left">
            <div id="nutrition-section" className="scroll-mt-24">
              <NutritionSearch onAddFood={handleAddFood} />
            </div>
            <div>
              <CaloriesCalculator onAddActivity={handleAddActivity} />
            </div>
          </section>

          {/* Bottom Module: Exercise Explorer Wrapper with ID */}
          <div id="exercises-section" className="scroll-mt-24">
            <ExerciseExplorer />
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant flex justify-around py-sm z-50">
        <a
          href="#balance-section"
          onClick={scrollToSection('balance-section')}
          className="flex flex-col items-center gap-xs text-secondary cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </a>
        <a
          href="#history-section"
          onClick={scrollToSection('history-section')}
          className="flex flex-col items-center gap-xs text-on-surface-variant cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] font-bold">Historial</span>
        </a>
        <a
          href="#nutrition-section"
          onClick={scrollToSection('nutrition-section')}
          className="flex flex-col items-center gap-xs text-on-surface-variant cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined">restaurant</span>
          <span className="text-[10px] font-bold">Nutrición</span>
        </a>
      </nav>
    </>
  );
}
