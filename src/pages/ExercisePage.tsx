import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getExercises } from '../data/exercises'
import { ExerciseCard } from '../components/ExerciseCard'
import { WorkoutSummary } from '../components/WorkoutSummary'
import type { Exercise, Sport, TrainingMode, WorkoutExercici } from '../types'

const sportNames: Record<Sport, string> = {
  halterofilia: 'Halterofília',
  atletisme: 'Atletisme',
  calisthenia: 'Calistènia',
}

const modeNames: Record<TrainingMode, string> = {
  preparacio: 'Preparació Física',
  directe: 'Entrenament Directe',
}

export function ExercisePage() {
  const { sport, mode } = useParams<{ sport: Sport; mode: TrainingMode }>()
  const navigate = useNavigate()
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercici[]>([])

  if (!sport || !mode) {
    navigate('/')
    return null
  }

  const exercises = getExercises(sport, mode)

  const handleAdd = useCallback(
    (exercise: Exercise) => {
      setSelectedExercises((prev) => {
        if (prev.find((e) => e.id === exercise.id)) return prev
        return [
          ...prev,
          {
            id: exercise.id,
            name: exercise.name,
            videoUrl: exercise.videoUrl,
            sets: exercise.defaultSets,
            reps: exercise.defaultReps,
          },
        ]
      })
    },
    [],
  )

  const handleUpdateSets = useCallback((id: string, sets: number) => {
    setSelectedExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, sets } : e)),
    )
  }, [])

  const handleUpdateReps = useCallback((id: string, reps: number) => {
    setSelectedExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, reps } : e)),
    )
  }, [])

  const handleRemove = useCallback((id: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const handleStart = useCallback(() => {
    navigate(`/${sport}/${mode}/workout`, { state: { exercises: selectedExercises } })
  }, [navigate, sport, mode, selectedExercises])

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-44 pt-8">
      <header className="mb-6">
        <button
          onClick={() => navigate(`/${sport}`)}
          className="mb-4 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Enrere
        </button>
        <h1 className="text-2xl font-bold text-white">{sportNames[sport]}</h1>
        <p className="mt-1 text-sm text-slate-500">{modeNames[mode]}</p>
      </header>

      {exercises.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-600">Cap exercici disponible</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onAdd={handleAdd} />
          ))}
        </div>
      )}

      <WorkoutSummary
        exercises={selectedExercises}
        onUpdateSets={handleUpdateSets}
        onUpdateReps={handleUpdateReps}
        onRemove={handleRemove}
        onStart={handleStart}
      />
    </div>
  )
}
