import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'instructor'
  created_at: string
  updated_at: string
  language_preference: string
}

export interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
} 