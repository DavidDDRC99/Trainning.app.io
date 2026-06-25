export type Sport = 'halterofilia' | 'atletisme' | 'calisthenia'

export type TrainingMode = 'preparacio' | 'directe'

export interface Exercise {
  id: string
  name: string
  sport: Sport
  mode: TrainingMode
  videoUrl: string
  defaultSets: number
  defaultReps: number
  type?: 'duration'
  defaultDurationMinutes?: number
  defaultSpeedKmh?: number
}

export interface WorkoutExercici {
  id: string
  name: string
  videoUrl: string
  type: 'reps' | 'duration'
  sets: number
  reps: number
  execTimePerRep: number
  restTime: number
  durationMinutes?: number
  speedKmh?: number
}
