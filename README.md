# VitalMetrics - Dashboard Premium de Balance Energético y Salud

VitalMetrics es un dashboard clínico e inteligente desarrollado para gestionar el balance calórico diario de forma reactiva y precisa. Combina un analizador de nutrientes, un calculador de gasto por ejercicio físico, un explorador interactivo de entrenamientos con auto-scroll y navegación por teclado, y una calculadora metabólica exacta basada en fórmulas científicas.

---

## 🏗️ Arquitectura de la Aplicación

La aplicación está construida sobre una arquitectura moderna basada en componentes React, bajo un tipado estricto y un entorno ágil de desarrollo.

### Estructura de Capas
1. **Componentes de UI (`src/components/*`)**: Componentes modulares y reutilizables de presentación (`Card.tsx`, `NutritionSearch.tsx`, `CaloriesCalculator.tsx`, `DailyBalance.tsx`, `ExerciseExplorer.tsx`, `BMRCalculatorModal.tsx`).
2. **Capas de Servicios (`src/services/api.ts`)**: Encargada de modularizar y realizar las peticiones HTTP externas. Centraliza el consumo de la API de *API Ninjas*.
3. **Hooks Personalizados (`src/hooks/*`)**: Hooks reutilizables para encapsular la lógica de negocio y llamadas asíncronas (`useNutrition.ts`, `useCalories.ts`, `useExercises.ts`) utilizando **TanStack Query (React Query)**.
4. **Vistas Principales (`src/views/*`)**: Vista del `Dashboard.tsx` que orquesta la composición de todos los componentes y maneja el estado global del día.
5. **Tipado Estricto (`src/types/*`)**: Definición de interfaces sólidas en TypeScript para alimentos, actividades físicas y registros históricos (`history.ts`).

---

## 🛠️ Decisiones Técnicas Clave

### 1. Persistencia y Ciclo de Vida del Estado (Daily Reset)
Para emular la persistencia de un producto en producción:
- El estado de la sesión activa y el historial de registros anteriores se sincronizan en tiempo real con `localStorage`.
- Se implementó un algoritmo de **Reinicio Diario**: al montar la aplicación, se compara la fecha local actual del sistema (formato `YYYY-MM-DD`) con `vitalmetrics_last_date`. Si ha cambiado el día (es decir, se cruzó la medianoche), los inputs activos de comida y ejercicio se limpian a `0` de forma segura, manteniendo el historial intacto.
- Al guardar el registro actual del día, la bitácora superior se reinicia y los alimentos se archivan, permitiendo al usuario comenzar un registro limpio sin perder la sumatoria del progreso acumulado durante las últimas 24 horas.

### 2. Calculadora Científica de Metabolismo Basal (BMR)
Se descartó la estimación manual por una calculadora integrada de alta precisión que utiliza la **Fórmula de Harris-Benedict (Revisada por Roza y Shizgal en 1984)**:
- **Hombres**: $BMR = 88.362 + (13.397 \times \text{peso en kg}) + (4.799 \times \text{altura en cm}) - (5.677 \times \text{edad en años})$
- **Mujeres**: $BMR = 447.593 + (9.247 \times \text{peso en kg}) + (3.098 \times \text{altura en cm}) - (4.330 \times \text{edad en años})$
- El valor calculado se acopla inmediatamente con la gráfica de balance en tiempo real y se persiste en `localStorage`.

### 3. Navegación por Teclado y Accesibilidad Premium (UX)
Se implementó un motor personalizado de captura de teclado en los campos de entrada autocompletables (`NutritionSearch`, `CaloriesCalculator` y los filtros de `ExerciseExplorer`):
- **Flechas `Up`/`Down`** permiten desplazarse interactivamente por las sugerencias en pantalla.
- **Enter** selecciona el elemento resaltado y **Escape** cierra la caja flotante.
- Incorporación de **Auto-Scroll Inteligente**: mediante `scrollIntoView({ block: 'nearest' })`, el contenedor del dropdown se desplaza de manera automática para mantener el ítem seleccionado con el teclado siempre visible en la pantalla.

### 4. Consultas y Paginación Eficientes con TanStack Query
- Caching automático y desbouncers implementados en búsquedas de red para reducir peticiones innecesarias.
- En el `ExerciseExplorer.tsx`, se implementó una **paginación por cursor infinita** (usando `offset` nativo de la API) para evitar la carga lenta y habilitar el scroll infinito de ejercicios clínicos de forma asíncrona.

---

## 🚀 Guía de Ejecución Local

Sigue estos pasos detallados para configurar y arrancar la aplicación en tu entorno de desarrollo local.

### Requisitos Previos
- **Node.js** (versión 18 o superior recomendada)
- **npm** (gestor de paquetes de Node)

### Paso 1: Clonar e instalar dependencias
Entra en la carpeta raíz del proyecto e instala los módulos de Node necesarios:
```bash
npm install
```

### Paso 2: Configuración de Variables de Entorno (.env)
La aplicación consume datos en tiempo real de la API de **API Ninjas**. Necesitas proveer una API Key válida para que las llamadas de red funcionen.

1. Crea un archivo llamado `.env` en la carpeta raíz del proyecto (al mismo nivel que `package.json`).
2. Agrega la siguiente variable de entorno, reemplazando con tu clave:
```env
VITE_API_KEY=TU_API_KEY_AQUÍ
```
*(Nota: Vite expone las variables que inician con `VITE_` al código del cliente mediante `import.meta.env.VITE_API_KEY`).*

### Paso 3: Servidor de Desarrollo
Inicia el servidor local de desarrollo con Vite:
```bash
npm run dev
```
Esto levantará la aplicación en una dirección local (comúnmente [http://localhost:5173](http://localhost:5173)). Abre tu navegador para visualizarla.

### Paso 4: Configuración de Proxy (Opcional - CORS)
En la mayoría de los casos de desarrollo local, la API de API Ninjas responde a peticiones directas desde el navegador gracias a sus cabeceras CORS. 

Si en tu red de desarrollo experimentas bloqueos de tipo **CORS**, puedes habilitar el proxy de Vite en tu archivo `vite.config.ts` de la siguiente forma:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-ninjas': {
        target: 'https://api.api-ninjas.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ninjas/, ''),
      },
    },
  },
});
```
Y luego actualizar las URLs base en `src/services/api.ts` apuntando a `/api-ninjas/` en lugar del dominio completo.

---

## 🧪 Pruebas y Aseguramiento de Calidad

- **Ejecución de Pruebas Unitarias** (Vitest):
  ```bash
  npm run test
  ```
- **Validación del Tipado Strict**:
  ```bash
  npx tsc --noEmit
  ```
- **Verificación de Linter**:
  ```bash
  npm run lint
  ```
