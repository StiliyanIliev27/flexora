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
  created_at: string
  updated_at: string
}

interface ExerciseBase {
  id: string
  name: string
  description: string | null
  muscle_groups: string[]
  equipment: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  instructions: string | null
  video_url: string | null
  created_by: string | null
  is_public: boolean
  created_at: string
  updated_at: string
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
    }
  }
} 