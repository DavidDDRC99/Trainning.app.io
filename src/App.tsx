import { HashRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ModePage } from './pages/ModePage'
import { ExercisePage } from './pages/ExercisePage'
import { WorkoutPage } from './pages/WorkoutPage'

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-slate-950 text-white antialiased">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:sport" element={<ModePage />} />
          <Route path="/:sport/:mode" element={<ExercisePage />} />
          <Route path="/:sport/:mode/workout" element={<WorkoutPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
