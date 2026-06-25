import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { exercises } from '../data/exercises'
import { getConfigs, saveAllConfigs, getDefaultExecTime, getDefaultRestTime } from '../utils/config'
import type { RepsConfig, DurationConfig } from '../utils/config'

function getUniqueNames() {
  const seen = new Set<string>()
  const result: { name: string; hasDuration: boolean }[] = []
  for (const ex of exercises) {
    if (!seen.has(ex.name)) {
      seen.add(ex.name)
      result.push({ name: ex.name, hasDuration: ex.type === 'duration' })
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name, 'ca'))
}

export function ConfigPage() {
  const navigate = useNavigate()
  const uniqueNames = getUniqueNames()
  const [configs, setConfigs] = useState<Record<string, { execTime?: number; restTime?: number; duration?: number; speed?: number }>>({})

  useEffect(() => {
    const loaded = getConfigs()
    const mapped: Record<string, any> = {}
    for (const { name } of uniqueNames) {
      const c = loaded[name]
      if (c && 'execTimePerRep' in c) {
        mapped[name] = { execTime: c.execTimePerRep, restTime: c.restTime }
      } else if (c && 'durationMinutes' in c) {
        mapped[name] = { duration: c.durationMinutes, speed: c.speedKmh }
      } else {
        mapped[name] = { execTime: getDefaultExecTime(), restTime: getDefaultRestTime() }
      }
    }
    setConfigs(mapped)
  }, [uniqueNames])

  const updateReps = useCallback((name: string, field: 'execTime' | 'restTime', value: number) => {
    setConfigs((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: Math.max(1, value) },
    }))
  }, [])

  const updateDuration = useCallback((name: string, field: 'duration' | 'speed', value: number) => {
    setConfigs((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: Math.max(1, value) },
    }))
  }, [])

  const handleSave = useCallback(() => {
    const toSave: Record<string, any> = {}
    for (const { name, hasDuration } of uniqueNames) {
      const c = configs[name]
      if (hasDuration) {
        toSave[name] = { durationMinutes: c?.duration ?? 20, speedKmh: c?.speed ?? 10 } satisfies DurationConfig
      } else {
        toSave[name] = { execTimePerRep: c?.execTime ?? 30, restTime: c?.restTime ?? 60 } satisfies RepsConfig
      }
    }
    saveAllConfigs(toSave)
    navigate('/')
  }, [configs, uniqueNames, navigate])

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <header className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-sm text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Enrere
        </button>
        <h1 className="text-2xl font-bold text-white">Configuració</h1>
        <p className="mt-1 text-sm text-slate-500">Temps per defecte per cada exercici</p>
      </header>

      <div className="flex flex-col gap-4">
        {uniqueNames.map(({ name, hasDuration }) => {
          const c = configs[name]
          return (
            <div key={name} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">{name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {hasDuration ? (
                  <>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Durada (min)</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateDuration(name, 'duration', (c?.duration ?? 20) - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >-</button>
                        <span className="w-10 text-center text-sm text-white">{c?.duration ?? 20}</span>
                        <button
                          onClick={() => updateDuration(name, 'duration', (c?.duration ?? 20) + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Velocitat (km/h)</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateDuration(name, 'speed', (c?.speed ?? 10) - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >-</button>
                        <span className="w-10 text-center text-sm text-white">{c?.speed ?? 10}</span>
                        <button
                          onClick={() => updateDuration(name, 'speed', (c?.speed ?? 10) + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Temps per rep (s)</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateReps(name, 'execTime', (c?.execTime ?? 30) - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >-</button>
                        <span className="w-10 text-center text-sm text-white">{c?.execTime ?? 30}</span>
                        <button
                          onClick={() => updateReps(name, 'execTime', (c?.execTime ?? 30) + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-slate-500">Descans (s)</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateReps(name, 'restTime', (c?.restTime ?? 60) - 5)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >-</button>
                        <span className="w-10 text-center text-sm text-white">{c?.restTime ?? 60}</span>
                        <button
                          onClick={() => updateReps(name, 'restTime', (c?.restTime ?? 60) + 5)}
                          className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >+</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
      >
        Guardar i tornar
      </button>
    </div>
  )
}
