import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BMRCalculatorModal } from './BMRCalculatorModal';

interface CaloriesChartProps {
  totalConsumed: number;
  totalExerciseBurned: number;
}

export function CaloriesChart({ totalConsumed, totalExerciseBurned }: CaloriesChartProps) {
  const [bmr, setBmr] = useState(() => {
    const saved = localStorage.getItem('vitalmetrics_bmr');
    return saved ? parseInt(saved, 10) : 1800;
  });
  
  const [isBmrModalOpen, setIsBmrModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vitalmetrics_bmr', bmr.toString());
  }, [bmr]);

  const totalBurned = totalExerciseBurned + bmr;

  // Recharts data format
  const data = [
    {
      name: 'Hoy',
      Consumidas: totalConsumed,
      Quemadas: totalBurned,
      Ejercicios: totalExerciseBurned,
      Basal: bmr,
    },
  ];

  return (
    <div className="bento-card bg-surface-container-lowest p-md sm:p-lg rounded-none border border-outline-variant/30 text-left flex flex-col justify-between h-full gap-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary" style={{ margin: 0 }}>
            Balance Calórico en Tiempo Real
          </h3>
          <p className="text-caption text-outline" style={{ margin: '4px 0 0 0' }}>
            Comparativa reactiva de calorías consumidas vs. calorías gastadas.
          </p>
        </div>

        {/* BMR Config Slider */}
        <div className="flex flex-col gap-xs w-full sm:w-auto bg-surface-container-low p-sm rounded-none border border-outline-variant/20">
          <label className="text-[11px] font-bold uppercase tracking-wider text-outline flex justify-between items-center relative group">
            <span className="flex items-center gap-1 cursor-help">
              Metabolismo Basal (BMR)
              <span className="material-symbols-outlined text-[14px]">info</span>
              <div className="absolute top-full mt-2 left-0 w-64 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/95 text-white text-xs p-3 rounded-md shadow-xl z-50 leading-relaxed text-left border border-white/10 normal-case font-normal normal-case">
                💡 ¿Cómo se calcula? El BMR se estima mediante fórmulas científicas (como Harris-Benedict) basadas en tu peso, altura, edad y género biológico. Representa el gasto de energía mínimo que tu cuerpo necesita para sobrevivir en reposo absoluto.
              </div>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsBmrModalOpen(true)}
                className="bg-primary/10 text-primary border-none rounded-md px-2 py-1 text-[10px] font-bold cursor-pointer hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                title="Calcular mi BMR exacto"
              >
                <span className="material-symbols-outlined text-[12px]">calculate</span>
                Calcular
              </button>
              <span className="text-primary font-extrabold">{bmr} kcal</span>
            </div>
          </label>
          <div className="flex items-center gap-sm">
            <input
              type="range"
              min="1000"
              max="3500"
              step="50"
              value={bmr}
              onChange={(e) => setBmr(Number(e.target.value))}
              className="accent-primary cursor-pointer w-full sm:w-40 h-1 bg-outline-variant rounded-none appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-72 md:h-80" style={{ minHeight: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={12}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis
              dataKey="name"
              stroke="var(--text)"
              tickLine={false}
              axisLine={false}
              fontSize={13}
              fontWeight="bold"
            />
            <YAxis
              stroke="var(--text)"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickFormatter={(val) => `${val} kcal`}
            />
            <Tooltip
              cursor={{ fill: 'var(--social-bg)', opacity: 0.4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface-container-lowest border border-outline-variant p-sm rounded-none shadow-lg text-left text-xs space-y-xs">
                      <p className="font-bold text-on-surface mb-xs border-b border-outline-variant/30 pb-xs">
                        Resumen del Día
                      </p>
                      <div className="flex justify-between gap-md">
                        <span className="text-outline font-semibold">Consumidas:</span>
                        <span className="font-extrabold text-primary" style={{ color: 'var(--accent)' }}>
                          {payload[0].value} kcal
                        </span>
                      </div>
                      <div className="flex justify-between gap-md border-b border-outline-variant/30 pb-xs">
                        <span className="text-[10px] text-outline pl-xs">- Alimentos:</span>
                        <span className="font-semibold text-outline text-[10px]">
                          {totalConsumed} kcal
                        </span>
                      </div>
                      <div className="flex justify-between gap-md">
                        <span className="text-outline font-semibold">Quemadas (Total):</span>
                        <span className="font-extrabold text-secondary" style={{ color: '#10b981' }}>
                          {payload[1].value} kcal
                        </span>
                      </div>
                      <div className="flex justify-between gap-md text-[10px] text-outline pl-xs">
                        <span>- Ejercicios:</span>
                        <span>{totalExerciseBurned} kcal</span>
                      </div>
                      <div className="flex justify-between gap-md text-[10px] text-outline pl-xs">
                        <span>- Basal (BMR):</span>
                        <span>{bmr} kcal</span>
                      </div>
                      <div className="pt-xs border-t border-outline-variant/30 flex justify-between gap-md font-bold">
                        <span>Balance Neto:</span>
                        <span
                          className={totalConsumed - totalBurned >= 0 ? 'text-primary' : 'text-secondary'}
                          style={{ color: totalConsumed - totalBurned >= 0 ? 'var(--accent)' : '#10b981' }}
                        >
                          {totalConsumed - totalBurned} kcal
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-body-md text-on-surface-variant font-label-md text-xs">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="Consumidas"
              name="Calorías Consumidas"
              fill="var(--accent)"
              radius={[0, 0, 0, 0]}
              animationDuration={800}
              maxBarSize={60}
            />
            <Bar
              dataKey="Quemadas"
              name="Calorías Quemadas"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
              animationDuration={800}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isBmrModalOpen && (
        <BMRCalculatorModal 
          onClose={() => setIsBmrModalOpen(false)}
          onCalculate={(calculatedBmr) => {
            setBmr(calculatedBmr);
            setIsBmrModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
