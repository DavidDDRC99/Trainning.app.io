import { useState } from 'react'
import type { Exercise, WorkoutExercici } from '../types'
import { getConfigs, getDefaultExecTime, getDefaultRestTime } from '../utils/config'

interface AddExerciseModalProps {
  exercise: Exercise
  onConfirm: (entry: WorkoutExercici) => void
  onCancel: () => void
}

export function AddExerciseModal({ exercise, onConfirm, onCancel }: AddExerciseModalProps) {
  const isDuration = exercise.type === 'duration'

  const configs = getConfigs()
  const existing = configs[exercise.name]

  const [sets, setSets] = useState(exercise.defaultSets)
  const [reps, setReps] = useState(exercise.defaultReps)
  const [execTime, setExecTime] = useState(
    existing && 'execTimePerRep' in existing ? existing.execTimePerRep : getDefaultExecTime(),
  )
  const [restTime, setRestTime] = useState(
    existing && 'execTimePerRep' in existing ? existing.restTime : getDefaultRestTime(),
  )
  const [duration, setDuration] = useState(
    existing && 'durationMinutes' in existing
      ? existing.durationMinutes
      : exercise.defaultDurationMinutes ?? 20,
  )
  const [speed, setSpeed] = useState(
    existing && 'durationMinutes' in existing
      ? existing.speedKmh
      : exercise.defaultSpeedKmh ?? 10,
  )

  const handleConfirm = () => {
    if (isDuration) {
      onConfirm({
        id: exercise.id,
        name: exercise.name,
        videoUrl: exercise.videoUrl,
        type: 'duration',
        sets: 1,
        reps: 1,
        execTimePerRep: 0,
        restTime: 0,
        durationMinutes: duration,
        speedKmh: speed,
      })
    } else {
      onConfirm({
        id: exercise.id,
        name: exercise.name,
        videoUrl: exercise.videoUrl,
        type: 'reps',
        sets,
        reps,
        execTimePerRep: execTime,
        restTime,
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <h2 className="mb-1 text-lg font-bold text-white">{exercise.name}</h2>
        <p className="mb-5 text-xs text-slate-500">Configura els paràmetres</p>

        {isDuration ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Durada (minuts)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setDuration((v) => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{duration}</span>
                <button onClick={() => setDuration((v) => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Velocitat (km/h)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setSpeed((v) => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{speed}</span>
                <button onClick={() => setSpeed((v) => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Sèries</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setSets((v) => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{sets}</span>
                <button onClick={() => setSets((v) => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Repeticions</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setReps((v) => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{reps}</span>
                <button onClick={() => setReps((v) => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Temps execució per rep (s)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setExecTime((v) => Math.max(1, v - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{execTime}</span>
                <button onClick={() => setExecTime((v) => v + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-400">Descans entre sèries (s)</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setRestTime((v) => Math.max(5, v - 5))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">-</button>
                <span className="min-w-[3ch] text-center text-xl font-bold text-white">{restTime}</span>
                <button onClick={() => setRestTime((v) => v + 5)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 cursor-pointer">+</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel·lar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
          >
            Afegir
          </button>
        </div>
      </div>
    </div>
  )
}
