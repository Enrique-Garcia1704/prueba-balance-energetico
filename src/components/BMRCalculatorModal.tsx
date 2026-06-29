import React, { useState } from 'react';

interface BMRCalculatorModalProps {
  onClose: () => void;
  onCalculate: (bmr: number) => void;
}

export function BMRCalculatorModal({ onClose, onCalculate }: BMRCalculatorModalProps) {
  const [age, setAge] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !weight || !height) return;

    let bmr = 0;
    // Harris-Benedict (Roza and Shizgal, 1984)
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    onCalculate(Math.round(bmr));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-surface-container-lowest w-full max-w-md rounded-md shadow-2xl p-6 border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <h2 className="text-title-lg font-bold text-on-surface m-0">Calcular BMR Exacto</h2>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-outline hover:text-on-surface cursor-pointer p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <p className="text-sm text-outline m-0">
            Ingresa tus datos físicos para estimar científicamente las calorías que tu cuerpo quema en reposo absoluto.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">Edad (años)</label>
              <input 
                type="number" 
                required 
                min="1" 
                max="120"
                value={age}
                onChange={e => setAge(Number(e.target.value) || '')}
                className="bg-surface-container border border-outline-variant rounded-md p-2 text-on-surface text-sm w-full box-border"
                placeholder="Ej. 25"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">Género</label>
              <select 
                value={gender}
                onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="bg-surface-container border border-outline-variant rounded-md p-2 text-on-surface text-sm w-full box-border"
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">Peso (kg)</label>
              <input 
                type="number" 
                required 
                min="20"
                max="300"
                step="0.1"
                value={weight}
                onChange={e => setWeight(Number(e.target.value) || '')}
                className="bg-surface-container border border-outline-variant rounded-md p-2 text-on-surface text-sm w-full box-border"
                placeholder="Ej. 75"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-outline uppercase tracking-wider">Altura (cm)</label>
              <input 
                type="number" 
                required 
                min="50"
                max="250"
                value={height}
                onChange={e => setHeight(Number(e.target.value) || '')}
                className="bg-surface-container border border-outline-variant rounded-md p-2 text-on-surface text-sm w-full box-border"
                placeholder="Ej. 175"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-outline-variant/30">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-primary font-bold rounded-md hover:bg-surface-container cursor-pointer border-none"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white font-bold rounded-md hover:opacity-90 cursor-pointer border-none flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">calculate</span>
              Calcular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
