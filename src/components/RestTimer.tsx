import { useTimer } from '../hooks/useTimer'
import { useEffect } from 'react'

interface RestTimerProps {
  duration: number
  isResting: boolean
  onRestEnd: () => void
}

export function RestTimer({ duration, isResting, onRestEnd }: RestTimerProps) {
  const { time, isRunning, isFinished, start, stop, reset } = useTimer(duration)

  useEffect(() => {
    if (isResting) {
      start(duration)
    }
  }, [isResting])

  useEffect(() => {
    if (isResting && isFinished) {
      onRestEnd()
    }
  }, [isFinished])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  if (!isResting) return null

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-sm font-medium text-slate-400">Descans</p>
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#1e293b" strokeWidth="4" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
            strokeDasharray={213.6}
            strokeDashoffset={213.6 * (1 - time / duration)}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={isRunning ? stop : () => start()}
          className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer"
        >
          {isRunning ? 'Pausa' : 'Reprendre'}
        </button>
        <button
          onClick={() => reset(duration)}
          className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer"
        >
          Reiniciar
        </button>
        <button
          onClick={onRestEnd}
          className="rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
        >
          Saltar
        </button>
      </div>
    </div>
  )
}
