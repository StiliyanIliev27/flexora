'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface WorkoutPlan {
  id: string
  name: string
  description: string | null
  duration_weeks: number
  is_active: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  user_id: string
  totalExercises: number
  trainingDays: number
  estimatedDuration: number
}

interface WorkoutPlanStats {
  totalPlans: number
  activePlans: number
  totalExercises: number
  avgDuration: number
}

export function useWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [stats, setStats] = useState<WorkoutPlanStats>({
    totalPlans: 0,
    activePlans: 0,
    totalExercises: 0,
    avgDuration: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user, supabase } = useAuth()

  const fetchPlans = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch workout plans with exercise counts
      const { data: plansData, error: plansError } = await supabase
        .from('workout_plans')
        .select(`
          id,
          name,
          description,
          duration_weeks,
          is_active,
          is_public,
          created_at,
          updated_at,
          user_id,
          workout_days (
            id,
            is_rest_day,
            workout_exercises (
              id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (plansError) {
        throw plansError
      }

      // Process plans data to calculate stats
      const processedPlans: WorkoutPlan[] = (plansData || []).map(plan => {
        const allExercises = plan.workout_days?.flatMap(day => day.workout_exercises || []) || []
        const trainingDays = plan.workout_days?.filter(day => !day.is_rest_day).length || 0
        
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          duration_weeks: plan.duration_weeks,
          is_active: plan.is_active,
          is_public: plan.is_public,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
          user_id: plan.user_id,
          totalExercises: allExercises.length,
          trainingDays,
          estimatedDuration: trainingDays > 0 ? Math.round((allExercises.length * 2.5) / trainingDays * 60) : 0 // Estimate based on 2.5min per exercise
        }
      })

      // Calculate stats
      const newStats: WorkoutPlanStats = {
        totalPlans: processedPlans.length,
        activePlans: processedPlans.filter(plan => plan.is_active).length,
        totalExercises: processedPlans.reduce((sum, plan) => sum + plan.totalExercises, 0),
        avgDuration: processedPlans.length > 0 
          ? Math.round(processedPlans.reduce((sum, plan) => sum + plan.estimatedDuration, 0) / processedPlans.length)
          : 0
      }

      setPlans(processedPlans)
      setStats(newStats)
    } catch (err) {
      console.error('Error fetching workout plans:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch workout plans')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const deletePlan = async (planId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id) // Extra security check

      if (error) {
        throw error
      }

      // Refresh plans after deletion
      await fetchPlans()
      return true
    } catch (err) {
      console.error('Error deleting workout plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete workout plan')
      return false
    }
  }

  const togglePlanActive = async (planId: string, isActive: boolean) => {
    if (!user) return false

    try {
      // If setting this plan to active, first deactivate all other plans
      if (isActive) {
        await supabase
          .from('workout_plans')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .neq('id', planId)
      }

      const { error } = await supabase
        .from('workout_plans')
        .update({ is_active: isActive })
        .eq('id', planId)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      // Refresh plans after update
      await fetchPlans()
      return true
    } catch (err) {
      console.error('Error updating plan status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update plan status')
      return false
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    // Initial fetch
    fetchPlans()

    // Set up real-time subscription
    const channel = supabase
      .channel('workout_plans_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_plans',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch plans when any change occurs
          fetchPlans()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchPlans, supabase])

  return {
    plans,
    stats,
    loading,
    error,
    fetchPlans,
    deletePlan,
    togglePlanActive
  }
}

