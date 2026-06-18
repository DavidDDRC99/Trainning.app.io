import type { Exercise } from '../types'

interface ExerciseCardProps {
  exercise: Exercise
  onAdd: (exercise: Exercise) => void
}

export function ExerciseCard({ exercise, onAdd }: ExerciseCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all duration-200 hover:border-slate-700">
      <div className="relative aspect-video bg-slate-800">
        {exercise.videoUrl ? (
          <video
            src={`${import.meta.env.BASE_URL}${exercise.videoUrl}`}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl text-slate-700">&#9654;</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-slate-300">
          Demo
        </div>
      </div>
      <div className="flex items-center justify-between p-3">
        <h3 className="truncate text-sm font-medium text-white">{exercise.name}</h3>
        <button
          onClick={() => onAdd(exercise)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-hover cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </div>
  )
}
