"use client"

import { useState, useEffect, useMemo } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { 
  User, 
  UserUpdate, 
  FitnessGoal, 
  UserFitnessGoal,
  UserFitnessGoalInsert,
  Equipment,
  UserEquipment,
  UserEquipmentInsert,
  ProfileFormData,
  ProfileCompletionStatus
} from '@/types/profile.types'

export function useProfile() {
  const { user, profile, fetchUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fitness goals state
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([])
  const [userFitnessGoals, setUserFitnessGoals] = useState<UserFitnessGoal[]>([])
  
  // Equipment state
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  
  const supabase = createBrowserSupabaseClient()

  // Fetch fitness goals
  const fetchFitnessGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('fitness_goals')
        .select('*')
        .order('name')

      if (error) throw error
      setFitnessGoals(data || [])
    } catch (err) {
      console.error('Error fetching fitness goals:', err)
      setError('Failed to load fitness goals')
    }
  }

  // Fetch user's fitness goals
  const fetchUserFitnessGoals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_fitness_goals')
        .select(`
          *,
          fitness_goal:fitness_goals(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority')

      if (error) throw error
      setUserFitnessGoals(data || [])
    } catch (err) {
      console.error('Error fetching user fitness goals:', err)
      setError('Failed to load your fitness goals')
    }
  }

  // Fetch equipment
  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_active', true)
        .order('category, name')

      if (error) throw error
      setEquipment(data || [])
    } catch (err) {
      console.error('Error fetching equipment:', err)
      setError('Failed to load equipment')
    }
  }

  // Fetch user's equipment
  const fetchUserEquipment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_equipment')
        .select(`
          *,
          equipment:equipment(*)
        `)
        .eq('user_id', userId)

      if (error) throw error
      setUserEquipment(data || [])
    } catch (err) {
      console.error('Error fetching user equipment:', err)
      setError('Failed to load your equipment')
    }
  }

  // Update profile basic info
  const updateProfile = async (updates: UserUpdate): Promise<boolean> => {
    if (!user?.id) return false

    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      // Refresh the profile data
      await fetchUserProfile(user.id)
      return true
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Update user fitness goals
  const updateFitnessGoals = async (goalUpdates: Array<{
    fitness_goal_id: string
    priority: number
    target_date?: string
    notes?: string
  }>): Promise<boolean> => {
    if (!user?.id) return false

    setSaving(true)
    setError(null)

    try {
      // First, deactivate all current goals
      await supabase
        .from('user_fitness_goals')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Then insert/update the new goals
      const goalsToInsert: UserFitnessGoalInsert[] = goalUpdates.map(goal => ({
        user_id: user.id,
        fitness_goal_id: goal.fitness_goal_id,
        priority: goal.priority,
        target_date: goal.target_date || null,
        notes: goal.notes || null,
        is_active: true
      }))

      const { error } = await supabase
        .from('user_fitness_goals')
        .upsert(goalsToInsert, {
          onConflict: 'user_id,fitness_goal_id'
        })

      if (error) throw error

      // Refresh user fitness goals
      await fetchUserFitnessGoals(user.id)
      return true
    } catch (err) {
      console.error('Error updating fitness goals:', err)
      setError('Failed to update fitness goals')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Update user equipment
  const updateEquipment = async (equipmentUpdates: Array<{
    equipment_id: string
    location: 'home' | 'gym' | 'both'
    notes?: string
  }>): Promise<boolean> => {
    if (!user?.id) return false

    setSaving(true)
    setError(null)

    try {
      // First, delete all current equipment associations
      await supabase
        .from('user_equipment')
        .delete()
        .eq('user_id', user.id)

      // Then insert the new equipment associations
      if (equipmentUpdates.length > 0) {
        const equipmentToInsert: UserEquipmentInsert[] = equipmentUpdates.map(eq => ({
          user_id: user.id,
          equipment_id: eq.equipment_id,
          location: eq.location,
          notes: eq.notes || null,
          has_access: true
        }))

        const { error } = await supabase
          .from('user_equipment')
          .insert(equipmentToInsert)

        if (error) throw error
      }

      // Refresh user equipment
      await fetchUserEquipment(user.id)
      return true
    } catch (err) {
      console.error('Error updating equipment:', err)
      setError('Failed to update equipment')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Calculate profile completion (memoized to prevent constant recalculation)
  const calculateProfileCompletion = useMemo((): ProfileCompletionStatus => {
    if (!profile) {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingFields: [],
        requiredFields: ['full_name', 'height_cm', 'weight_kg', 'age', 'gender', 'workout_availability', 'fitness_goals', 'equipment']
      }
    }

    const requiredFields = [
      'full_name',
      'height_cm', 
      'weight_kg',
      'age',
      'gender',
      'workout_availability'
    ]

    const missingFields = requiredFields.filter(field => {
      const value = profile[field as keyof typeof profile]
      return value === null || value === undefined || value === ''
    })

    // Add fitness goals requirement (required)
    const hasFitnessGoals = userFitnessGoals.length > 0
    if (!hasFitnessGoals) {
      missingFields.push('fitness_goals')
    }

    // Add equipment requirement (required)
    const hasEquipment = userEquipment.length > 0
    if (!hasEquipment) {
      missingFields.push('equipment')
    }

    const totalRequiredFields = requiredFields.length + 2 // +2 for fitness_goals and equipment
    const completionPercentage = Math.round(
      ((totalRequiredFields - missingFields.length) / totalRequiredFields) * 100
    )

    return {
      isComplete: missingFields.length === 0,
      completionPercentage,
      missingFields,
      requiredFields: [...requiredFields, 'fitness_goals', 'equipment']
    }
  }, [profile, userFitnessGoals, userEquipment])

  // Load all profile-related data
  const loadProfileData = async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      await Promise.all([
        fetchFitnessGoals(),
        fetchUserFitnessGoals(user.id),
        fetchEquipment(),
        fetchUserEquipment(user.id)
      ])
    } catch (err) {
      console.error('Error loading profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      loadProfileData()
    }
  }, [user?.id])

  return {
    // Profile data
    profile,
    user,
    
    // Related data
    fitnessGoals,
    userFitnessGoals,
    equipment,
    userEquipment,
    
    // States
    loading,
    saving,
    error,
    
    // Actions
    updateProfile,
    updateFitnessGoals,
    updateEquipment,
    loadProfileData,
    
    // Utils
    calculateProfileCompletion
  }
}

