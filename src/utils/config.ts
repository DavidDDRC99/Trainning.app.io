const STORAGE_KEY = 'exercise-configs'

export interface RepsConfig {
  execTimePerRep: number
  restTime: number
}

export interface DurationConfig {
  durationMinutes: number
  speedKmh: number
}

export type ExerciseConfig = RepsConfig | DurationConfig

export type ExerciseConfigMap = Record<string, ExerciseConfig>

export function getConfigs(): ExerciseConfigMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveConfig(name: string, config: ExerciseConfig): void {
  const all = getConfigs()
  all[name] = config
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function saveAllConfigs(configs: ExerciseConfigMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

export function getDefaultExecTime(): number {
  return 30
}

export function getDefaultRestTime(): number {
  return 60
}
