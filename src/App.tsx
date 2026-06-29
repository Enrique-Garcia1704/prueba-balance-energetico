import { lazy, Suspense } from 'react'
import './App.css'

// Lazy load the Dashboard named export
const Dashboard = lazy(() =>
  import('./views/Dashboard').then((m) => ({ default: m.Dashboard }))
)

function App() {
  return (
    <div className="app-container">
      <Suspense
        fallback={
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100svh', gap: '12px', color: 'var(--text)' }}>
            <span className="spinner" style={{ fontSize: '32px' }}>🔄</span>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>Cargando VitalMetrics...</div>
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  )
}

export default App
