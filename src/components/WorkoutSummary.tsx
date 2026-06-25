import type { WorkoutExercici } from '../types'

interface WorkoutSummaryProps {
  exercises: WorkoutExercici[]
  onUpdateSets: (id: string, sets: number) => void
  onUpdateReps: (id: string, reps: number) => void
  onRemove: (id: string) => void
  onStart: () => void
}

export function WorkoutSummary({
  exercises,
  onUpdateSets,
  onUpdateReps,
  onRemove,
  onStart,
}: WorkoutSummaryProps) {
  if (exercises.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-950/95 p-4 backdrop-blur-lg">
      <div className="mx-auto max-w-lg">
        <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm text-white">{ex.name}</span>
              {ex.type === 'duration' ? (
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {ex.durationMinutes}&apos; @ {ex.speedKmh} km/h
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateSets(ex.id, Math.max(1, ex.sets - 1))}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >-</button>
                    <span className="w-8 text-center text-xs text-slate-300">{ex.sets}</span>
                    <button
                      onClick={() => onUpdateSets(ex.id, ex.sets + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >+</button>
                  </div>
                  <span className="text-xs text-slate-600">&times;</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateReps(ex.id, Math.max(1, ex.reps - 1))}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >-</button>
                    <span className="w-8 text-center text-xs text-slate-300">{ex.reps}</span>
                    <button
                      onClick={() => onUpdateReps(ex.id, ex.reps + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                    >+</button>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {ex.execTimePerRep}s / {ex.restTime}s
                  </span>
                </>
              )}
              <button
                onClick={() => onRemove(ex.id)}
                className="ml-1 flex h-6 w-6 items-center justify-center rounded text-xs text-slate-600 hover:text-red-400 cursor-pointer"
              >&times;</button>
            </div>
          ))}
        </div>
        <button
          onClick={onStart}
          className="w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
        >
          Comen&ccedil;ar entrenament ({exercises.reduce((t, e) => t + (e.type === 'duration' ? 1 : e.sets), 0)} s&egrave;ries)
        </button>
      </div>
    </div>
  )
}
