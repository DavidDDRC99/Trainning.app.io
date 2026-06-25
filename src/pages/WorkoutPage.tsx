import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTimer } from '../hooks/useTimer'
import { RestTimer } from '../components/RestTimer'
import type { WorkoutExercici } from '../types'

function calcTotalUnits(exercises: WorkoutExercici[]) {
  return exercises.reduce((t, e) => t + (e.type === 'duration' ? 1 : e.sets), 0)
}

function calcCompletedUnits(exercises: WorkoutExercici[], idx: number, set: number) {
  let done = 0
  for (let i = 0; i < idx; i++) {
    done += exercises[i].type === 'duration' ? 1 : exercises[i].sets
  }
  done += set - 1
  return done
}

export function WorkoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const exercises = (location.state as { exercises?: WorkoutExercici[] })?.exercises ?? []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const current = exercises[currentIdx]
  const totalExercises = exercises.length
  const isDuration = current?.type === 'duration'

  const execTotalSeconds = isDuration
    ? (current?.durationMinutes ?? 0) * 60
    : (current?.reps ?? 0) * (current?.execTimePerRep ?? 0)

  const timer = useTimer(execTotalSeconds)
  const [phase, setPhase] = useState<'executing' | 'paused' | 'resting'>('executing')

  const totalUnits = calcTotalUnits(exercises)
  const completedUnits = calcCompletedUnits(exercises, currentIdx, currentSet)
  const progressPct = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0

  useEffect(() => {
    setCurrentSet(1)
    setPhase('executing')
  }, [currentIdx])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [currentIdx, currentSet])

  useEffect(() => {
    if (phase === 'executing' && !timer.isRunning) {
      timer.start(execTotalSeconds)
    }
  }, [phase, timer.isRunning])

  useEffect(() => {
    if (phase === 'executing' && timer.isRunning && timer.time === 0) {
      if (isDuration) {
        if (currentIdx < totalExercises - 1) {
          setCurrentIdx((i) => i + 1)
        } else {
          setIsComplete(true)
        }
      } else {
        setPhase('resting')
      }
    }
  }, [timer.time, timer.isRunning, phase, isDuration, currentIdx, totalExercises])

  const handlePause = useCallback(() => {
    timer.stop()
    setPhase('paused')
  }, [timer])

  const handleResume = useCallback(() => {
    timer.start()
    setPhase('executing')
  }, [timer])

  const handleSkip = useCallback(() => {
    timer.stop()
    if (isDuration) {
      if (currentIdx < totalExercises - 1) {
        setCurrentIdx((i) => i + 1)
      } else {
        setIsComplete(true)
      }
    } else {
      setPhase('resting')
    }
  }, [timer, isDuration, currentIdx, totalExercises])

  const handleRestEnd = useCallback(() => {
    if (currentSet < current.sets) {
      setCurrentSet((s) => s + 1)
    } else if (currentIdx < totalExercises - 1) {
      setCurrentIdx((i) => i + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentSet, current, currentIdx, totalExercises])

  const handlePrevExercise = useCallback(() => {
    if (currentIdx > 0) {
      timer.stop()
      setCurrentIdx((i) => i - 1)
    }
  }, [currentIdx, timer])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (exercises.length === 0) {
    navigate('/')
    return null
  }

  if (isComplete) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-5">
        <span className="mb-4 text-6xl">&#127881;</span>
        <h1 className="text-2xl font-bold text-white">Entrenament completat!</h1>
        <p className="mt-2 text-sm text-slate-400">{exercises.length} exercicis fets</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
        >
          Tornar a l&apos;inici
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-950">
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Sortir
        </button>
        <span className="text-xs text-slate-600">
          {currentIdx + 1}/{totalExercises}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="px-5">
          <h1 className="text-xl font-bold text-white">{current.name}</h1>
          {isDuration ? (
            <p className="mt-0.5 text-sm text-slate-500">
              {current.speedKmh} km/h &middot; {current.durationMinutes} min
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-slate-500">
              S&egrave;rie {currentSet} de {current.sets}
            </p>
          )}
        </div>

        <div className="relative mx-5 mt-4 flex-1 overflow-hidden rounded-2xl bg-slate-900">
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}${current.videoUrl}`}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-white/20">&#9654;</span>
          </div>
        </div>

        <div className="px-5 py-6">
          {phase === 'resting' && !isDuration ? (
            <RestTimer
              duration={current.restTime}
              isResting={true}
              onRestEnd={handleRestEnd}
            />
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-slate-400">
                  {isDuration ? 'Temps restant' : `${current.reps} repeticions`}
                </span>
                <span className="text-5xl font-bold text-white tabular-nums">
                  {formatTime(timer.time)}
                </span>
                {!isDuration && (
                  <span className="text-xs text-slate-600">
                    {current.reps} &times; {current.execTimePerRep}s = {execTotalSeconds}s
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {phase === 'paused' ? (
                  <button
                    onClick={handleResume}
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
                  >
                    Reprendre
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="rounded-xl bg-slate-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 cursor-pointer"
                  >
                    Pausa
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isDuration ? 'Finalitzar' : 'Omet'}
                </button>
              </div>

              {!isDuration && (
                <p className="text-xs text-slate-600">
                  {currentSet < current.sets
                    ? `Següent: Descans ${current.restTime}s`
                    : currentIdx < totalExercises - 1
                    ? `Següent: ${exercises[currentIdx + 1].name}`
                    : 'Últim exercici'}
                </p>
              )}

              {currentIdx > 0 && (
                <button
                  onClick={handlePrevExercise}
                  className="text-sm text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                >
                  &larr; Exercici anterior
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  )
}
