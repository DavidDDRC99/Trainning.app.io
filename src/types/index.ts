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
}

export interface WorkoutExercici {
  id: string
  name: string
  videoUrl: string
  sets: number
  reps: number
}
