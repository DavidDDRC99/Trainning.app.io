import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RestTimer } from '../components/RestTimer'
import type { WorkoutExercici } from '../types'

export function WorkoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const exercises = (location.state as { exercises?: WorkoutExercici[] })?.exercises ?? []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [repsDone, setRepsDone] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const current = exercises[currentIdx]
  const totalExercises = exercises.length
  const totalSets = current?.sets ?? 0

  useEffect(() => {
    setCurrentSet(1)
    setRepsDone(0)
    setIsResting(false)
  }, [currentIdx])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [currentIdx, currentSet])

  const handleRep = useCallback(() => {
    if (repsDone < current.reps) {
      setRepsDone((r) => r + 1)
    }
  }, [repsDone, current])

  const handleSetComplete = useCallback(() => {
    if (currentSet < totalSets) {
      setIsResting(true)
    } else if (currentIdx < totalExercises - 1) {
      setIsResting(true)
      setCurrentIdx((i) => i + 1)
    } else {
      setIsComplete(true)
    }
    setRepsDone(0)
  }, [currentSet, totalSets, currentIdx, totalExercises])

  const handleRestEnd = useCallback(() => {
    setIsResting(false)
    if (currentSet < totalSets) {
      setCurrentSet((s) => s + 1)
    }
  }, [currentSet, totalSets])

  const handlePrevExercise = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1)
      setIsResting(false)
    }
  }, [currentIdx])

  if (exercises.length === 0) {
    navigate('/')
    return null
  }

  if (isComplete) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-950 px-5">
        <span className="mb-4 text-6xl">🎉</span>
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
          <p className="mt-0.5 text-sm text-slate-500">
            Sèrie {currentSet} de {totalSets}
          </p>
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
          {isResting ? (
            <RestTimer isResting={isResting} onRestEnd={handleRestEnd} />
          ) : (
            <div className="flex flex-col items-center gap-5">
              <button
                onClick={handleRep}
                className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-accent text-4xl font-bold text-white transition-all active:scale-95 cursor-pointer"
              >
                {repsDone}
              </button>
              <p className="text-sm text-slate-500">
                Toca per comptar repeticions &mdash; {repsDone}/{current.reps}
              </p>

              <button
                onClick={handleSetComplete}
                disabled={repsDone < current.reps}
                className="w-full rounded-xl bg-accent py-4 text-center text-base font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {currentSet < totalSets
                  ? 'Completar sèrie'
                  : currentIdx < totalExercises - 1
                    ? 'Següent exercici'
                    : 'Finalitzar entrenament'}
              </button>

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
          style={{
            width: `${
              ((currentIdx * totalSets + currentSet - 1) / (totalExercises * totalSets)) * 100
            }%`,
          }}
        />
      </div>
    </div>
  )
}
