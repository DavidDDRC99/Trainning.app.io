import { useState, useRef, useEffect, useCallback } from 'react'

export function useTimer(initialTime: number = 0) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(
    (seconds?: number) => {
      clearTimer()
      setIsFinished(false)
      if (seconds !== undefined) setTime(seconds)
      setIsRunning(true)
    },
    [clearTimer],
  )

  const stop = useCallback(() => {
    clearTimer()
    setIsRunning(false)
  }, [clearTimer])

  const reset = useCallback(
    (seconds?: number) => {
      clearTimer()
      setIsRunning(false)
      setIsFinished(false)
      setTime(seconds ?? initialTime)
    },
    [clearTimer, initialTime],
  )

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clearTimer
  }, [isRunning, clearTimer])

  return { time, isRunning, isFinished, start, stop, reset }
}
