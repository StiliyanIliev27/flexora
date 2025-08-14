// User profile and fitness-related types
import { Database } from './database.types'

// Database table types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Exercise = Database['public']['Tables']['exercises']['Row']
export type ExerciseInsert = Database['public']['Tables']['exercises']['Insert']
export type ExerciseUpdate = Database['public']['Tables']['exercises']['Update']

export type FitnessGoal = Database['public']['Tables']['fitness_goals']['Row']
export type UserFitnessGoal = Database['public']['Tables']['user_fitness_goals']['Row']
export type UserFitnessGoalInsert = Database['public']['Tables']['user_fitness_goals']['Insert']
export type UserFitnessGoalUpdate = Database['public']['Tables']['user_fitness_goals']['Update']

export type Equipment = Database['public']['Tables']['equipment']['Row']
export type UserEquipment = Database['public']['Tables']['user_equipment']['Row']
export type UserEquipmentInsert = Database['public']['Tables']['user_equipment']['Insert']
export type UserEquipmentUpdate = Database['public']['Tables']['user_equipment']['Update']

export type MuscleGroup = Database['public']['Tables']['muscle_groups']['Row']

// Enums
export type Gender = Database['public']['Enums']['gender_enum']
export type EquipmentLocation = Database['public']['Enums']['equipment_location_enum']
export type MuscleCategory = Database['public']['Enums']['muscle_category_enum']
export type DifficultyLevel = Database['public']['Enums']['difficulty_enum']

// Extended types for UI
export interface UserProfile extends User {
  fitness_goals?: UserFitnessGoal[]
  equipment_access?: UserEquipment[]
}

export interface ExerciseWithDetails extends Exercise {
  equipment_details?: Equipment[]
  muscle_group_details?: {
    primary: MuscleGroup[]
    secondary: MuscleGroup[]
  }
  created_by_user?: User
}

export interface FitnessGoalWithDetails extends UserFitnessGoal {
  goal_details?: FitnessGoal
}

// Form types for profile management
export interface ProfileFormData {
  full_name?: string
  height_cm?: number
  weight_kg?: number
  age?: number
  gender?: Gender
  medical_notes?: string
  workout_availability?: number
  gym_access?: boolean
  fitness_goals?: string[] // Array of fitness goal IDs
  equipment_access?: Array<{
    equipment_id: string
    location: EquipmentLocation
    notes?: string
  }>
}

// Profile completion calculation
export interface ProfileCompletionStatus {
  isComplete: boolean
  completionPercentage: number
  missingFields: string[]
  requiredFields: string[]
}

// Exercise filtering and search
export interface ExerciseFilters {
  difficulty?: DifficultyLevel[]
  muscle_groups?: string[] // MuscleGroup IDs
  equipment?: string[] // Equipment IDs
  exercise_category?: string[]
  search?: string
  is_user_created?: boolean
  created_by?: string
}

export interface ExerciseSearchResults {
  exercises: ExerciseWithDetails[]
  total: number
  page: number
  limit: number
  filters: ExerciseFilters
}

// Workout availability options (values only, labels will be translated)
export const WORKOUT_AVAILABILITY_OPTIONS = [
  { value: 1, key: 'oneDayPerWeek' },
  { value: 2, key: 'twoDaysPerWeek' },
  { value: 3, key: 'threeDaysPerWeek' },
  { value: 4, key: 'fourDaysPerWeek' },
  { value: 5, key: 'fiveDaysPerWeek' },
  { value: 6, key: 'sixDaysPerWeek' },
  { value: 7, key: 'sevenDaysPerWeek' },
] as const

export type WorkoutAvailability = typeof WORKOUT_AVAILABILITY_OPTIONS[number]['value']

// Gender options for forms (values only, labels will be translated)
export const GENDER_OPTIONS = [
  { value: 'male', key: 'male' },
  { value: 'female', key: 'female' }
] as const
