import { Database } from './database.types'
import { ExerciseWithDetails } from './profile.types'

// Database table types
export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row']
export type WorkoutDay = Database['public']['Tables']['workout_days']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type ExerciseSet = Database['public']['Tables']['exercise_sets']['Row']

// Insert types for creating new records
export type WorkoutPlanInsert = Database['public']['Tables']['workout_plans']['Insert']
export type WorkoutDayInsert = Database['public']['Tables']['workout_days']['Insert']
export type WorkoutExerciseInsert = Database['public']['Tables']['workout_exercises']['Insert']
export type ExerciseSetInsert = Database['public']['Tables']['exercise_sets']['Insert']

// Update types for modifying records
export type WorkoutPlanUpdate = Database['public']['Tables']['workout_plans']['Update']
export type WorkoutDayUpdate = Database['public']['Tables']['workout_days']['Update']
export type WorkoutExerciseUpdate = Database['public']['Tables']['workout_exercises']['Update']
export type ExerciseSetUpdate = Database['public']['Tables']['exercise_sets']['Update']

// Enhanced types with relations
export interface WorkoutPlanWithDetails extends WorkoutPlan {
  workout_days: WorkoutDayWithExercises[]
  totalExercises: number
  estimatedDuration: number // in minutes
}

export interface WorkoutDayWithExercises extends WorkoutDay {
  workout_exercises: WorkoutExerciseWithDetails[]
  exerciseCount: number
  estimatedDuration: number // in minutes
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise: ExerciseWithDetails
  exercise_sets: ExerciseSet[]
  totalSets: number
  estimatedDuration: number // in minutes
}

// UI-specific types for the workout builder
export interface WorkoutBuilderState {
  currentPlan: WorkoutPlanWithDetails | null
  selectedDay: number | null // day_of_week (0-6)
  isEditingExercise: string | null // workout_exercise.id
  isDragging: boolean
  draggedExercise: ExerciseWithDetails | null
  unsavedChanges: boolean
  tempExercises?: any[] // Temporary exercises before plan is saved
}

// Form data types
export interface WorkoutPlanFormData {
  name: string
  description?: string
  duration_weeks: number
  is_active: boolean
}

export interface WorkoutExerciseFormData {
  exercise_id: string
  exercise_order: number
  default_sets?: number
  default_reps?: number
  default_weight?: number
  default_rest_seconds: number
  default_rpe?: number
  notes?: string
  // Custom sets configuration (optional)
  custom_sets?: ExerciseSetFormData[]
}

export interface ExerciseSetFormData {
  set_number: number
  reps: number
  weight?: number
  rest_seconds: number
  rpe?: number
  notes?: string
}

// Drag and drop types
export interface DragItem {
  type: 'exercise' | 'workout-exercise'
  id: string
  exercise: ExerciseWithDetails
  sourceDay?: number
  sourceIndex?: number
}

export interface DropResult {
  targetDay: number
  targetIndex: number
}

// Day of week utilities
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
] as const


// Exercise substitution types
export interface ExerciseSubstitution {
  original_exercise_id: string
  substitute_exercise_id: string
  reason: 'equipment' | 'difficulty' | 'muscle_group' | 'preference'
  compatibility_score: number // 0-1
}

// Workout validation types
export interface WorkoutValidationError {
  type: 'missing_rest_day' | 'too_many_exercises' | 'conflicting_muscle_groups' | 'equipment_unavailable'
  message: string
  day_of_week?: number
  exercise_id?: string
  severity: 'warning' | 'error'
}

// Workout statistics
export interface WorkoutPlanStatistics {
  total_exercises: number
  exercises_by_muscle_group: Record<string, number>
  exercises_by_equipment: Record<string, number>
  exercises_by_difficulty: Record<string, number>
  estimated_total_duration: number // minutes per week
  rest_days: number[]
  training_days: number[]
}

// Export constants
export const DEFAULT_REST_TIME = 60 // seconds
export const DEFAULT_RPE = 7
export const MAX_EXERCISES_PER_DAY = 12
export const MIN_REST_TIME = 30 // seconds
export const MAX_REST_TIME = 300 // seconds (5 minutes)
export const MIN_RPE = 1
export const MAX_RPE = 10
