// This file will be auto-generated from Supabase CLI
// For now, we'll create simplified types using base types and utility types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Base table types
interface UserBase {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'instructor'
  language_preference: string
  // New profile fields
  height_cm: number | null
  weight_kg: number | null
  age: number | null
  gender: 'male' | 'female' | null
  medical_notes: string | null
  workout_availability: number | null // 1, 2, 3, 4, 5, 6, 7 days per week
  gym_access: boolean
  created_at: string
  updated_at: string
}

interface ExerciseBase {
  id: string
  name: string
  description: string | null
  muscle_groups: string[] // Legacy field - will be deprecated
  equipment: string | null // Legacy field - will be deprecated
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  instructions: string | null
  video_url: string | null
  image_url: string | null
  created_by: string | null
  is_public: boolean
  // New fields
  equipment_ids: string[] // UUID array
  muscle_group_ids: Json // JSON: {"primary": ["uuid1"], "secondary": ["uuid2"]}
  created_at: string
  updated_at: string
}

interface FitnessGoalBase {
  id: string
  name: string
}

interface UserFitnessGoalBase {
  id: string
  user_id: string
  fitness_goal_id: string
  priority: number
  target_date: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface EquipmentBase {
  id: string
  name: string
  category: string | null
  description: string | null
  is_gym_equipment: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UserEquipmentBase {
  id: string
  user_id: string
  equipment_id: string
  has_access: boolean
  location: 'home' | 'gym' | 'both' | null
  notes: string | null
  created_at: string
}

interface MuscleGroupBase {
  id: string
  name: string
  category: 'upper' | 'lower' | 'core' | 'full-body' | null
  is_active: boolean
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserBase
        Insert: Omit<UserBase, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<UserBase, 'id' | 'created_at' | 'updated_at'>>
      }
      exercises: {
        Row: ExerciseBase
        Insert: Omit<ExerciseBase, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ExerciseBase, 'id' | 'created_at' | 'updated_at'>>
      }
      fitness_goals: {
        Row: FitnessGoalBase
        Insert: Omit<FitnessGoalBase, 'id'> & { id?: string }
        Update: Partial<Omit<FitnessGoalBase, 'id'>>
      }
      user_fitness_goals: {
        Row: UserFitnessGoalBase
        Insert: Omit<UserFitnessGoalBase, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<UserFitnessGoalBase, 'id' | 'created_at' | 'updated_at'>>
      }
      equipment: {
        Row: EquipmentBase
        Insert: Omit<EquipmentBase, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<EquipmentBase, 'id' | 'created_at' | 'updated_at'>>
      }
      user_equipment: {
        Row: UserEquipmentBase
        Insert: Omit<UserEquipmentBase, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<UserEquipmentBase, 'id' | 'created_at'>>
      }
      muscle_groups: {
        Row: MuscleGroupBase
        Insert: Omit<MuscleGroupBase, 'id'> & { id?: string }
        Update: Partial<Omit<MuscleGroupBase, 'id'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_enum: 'beginner' | 'intermediate' | 'advanced'
      user_role: 'user' | 'instructor'
      gender_enum: 'male' | 'female'
      equipment_location_enum: 'home' | 'gym' | 'both'
      muscle_category_enum: 'upper' | 'lower' | 'core' | 'full-body'
    }
  }
} 