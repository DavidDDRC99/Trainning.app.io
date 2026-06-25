import { HashRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ExercisePage } from './pages/ExercisePage'
import { WorkoutPage } from './pages/WorkoutPage'
import { ConfigPage } from './pages/ConfigPage'

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-slate-950 text-white antialiased">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<ConfigPage />} />
          <Route path="/:sport" element={<ExercisePage />} />
          <Route path="/:sport/workout" element={<WorkoutPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
