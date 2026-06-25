import { useState, useEffect, useRef, useCallback } from 'react'

interface RestTimerProps {
  duration: number
  isResting: boolean
  onRestEnd: () => void
}

export function RestTimer({ duration, isResting, onRestEnd }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerStartedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback((seconds: number) => {
    clearTimer()
    setTimeLeft(seconds)
    setRunning(true)
    timerStartedRef.current = true
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  useEffect(() => {
    if (isResting) {
      startTimer(duration)
    }
  }, [isResting])

  useEffect(() => {
    if (timeLeft === 0 && timerStartedRef.current) {
      timerStartedRef.current = false
      onRestEnd()
    }
  }, [timeLeft, onRestEnd])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

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
            strokeDashoffset={213.6 * (1 - timeLeft / duration)}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (running) {
              clearTimer()
              setRunning(false)
            } else {
              setRunning(true)
              intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                  if (prev <= 1) {
                    clearInterval(intervalRef.current!)
                    intervalRef.current = null
                    setRunning(false)
                    return 0
                  }
                  return prev - 1
                })
              }, 1000)
            }
          }}
          className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer"
        >
          {running ? 'Pausa' : 'Reprendre'}
        </button>
        <button
          onClick={() => startTimer(duration)}
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
