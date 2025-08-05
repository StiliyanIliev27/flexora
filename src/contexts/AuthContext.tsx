'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { AuthContextType, AuthUser, UserProfile } from '@/types/auth.types'
import { redirect } from 'next/navigation'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
    const supabase = createBrowserSupabaseClient()
  
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user as AuthUser)
          // Start profile fetch but don't wait for it to finish loading
          fetchUserProfile(session.user.id)
        }
      } catch (err) {
        console.error('Error getting session:', err)
      }
      // Set loading to false immediately after session check
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes including token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle all auth events including token refresh
        if (event === 'TOKEN_REFRESHED') {
          // For token refresh, only update user but keep existing profile
          if (session?.user) {
            setUser(session.user as AuthUser)
            // Don't clear profile during token refresh - just silently update it
            fetchUserProfile(session.user.id) // No await - runs in background
          }
        } else if (event === 'SIGNED_IN') {
          // For sign in, update both user and profile
          if (session?.user) {
            setUser(session.user as AuthUser)
            await fetchUserProfile(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
        
        // Only set loading false for non-refresh events
        if (event !== 'TOKEN_REFRESHED') {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Reduced timeout from 10s to 3s
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      )
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        // If user doesn't exist, try to create profile
        if (error.code === 'PGRST116') {
          await createUserProfile(userId)
          return
        }
        throw error
      }
      
      setProfile(data)
    } catch (error: any) {
      // Continue with null profile - don't block the app
      setProfile(null)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.user?.email || '',
          full_name: authUser.user?.user_metadata?.full_name || null,
          avatar_url: authUser.user?.user_metadata?.avatar_url || null,
          role: 'user'
        })
        .select()
        .single()

      if (error) {
        throw error
      }
      
      setProfile(data)
    } catch (error) {
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    else {
      redirect('/')
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) throw error
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 