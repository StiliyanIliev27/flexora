'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { WorkoutPlanFormData, WorkoutPlanInsert, WorkoutPlanUpdate } from '@/types/workout.types'
import { DAYS_OF_WEEK } from '@/types/workout.types'

export function useWorkoutPlanBuilder() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user, supabase } = useAuth()

  const createDefaultWorkoutDays = useCallback(async (planId: string) => {
    if (!user) return

    try {
      // Create a workout day for each day of the week
      const workoutDaysData = DAYS_OF_WEEK.map(day => ({
        workout_plan_id: planId,
        day_of_week: day.value,
        day_name: day.label,
        is_rest_day: day.value === 0 || day.value === 6, // Default Sunday and Saturday as rest days
        notes: null
      }))

      const { error } = await supabase
        .from('workout_days')
        .insert(workoutDaysData)

      if (error) throw error
    } catch (err) {
      console.error('Error creating default workout days:', err)
      throw err
    }
  }, [user, supabase])

  const savePlan = useCallback(async (planData: WorkoutPlanFormData, planId?: string): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    try {
      setIsSaving(true)
      setError(null)
      

      if (planId) {
        // Update existing plan
        const updateData: WorkoutPlanUpdate = {
          name: planData.name,
          description: planData.description || null,
          duration_weeks: planData.duration_weeks,
          is_active: planData.is_active
        }

        // If setting this plan to active, first deactivate all other plans
        if (planData.is_active) {
          await supabase
            .from('workout_plans')
            .update({ is_active: false })
            .eq('user_id', user.id)
            .neq('id', planId)
        }

        const { data, error } = await supabase
          .from('workout_plans')
          .update(updateData)
          .eq('id', planId)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error
        return data.id
      } else {
        // Create new plan
        const insertData: WorkoutPlanInsert = {
          name: planData.name,
          description: planData.description || null,
          duration_weeks: planData.duration_weeks,
          is_active: planData.is_active,
          is_public: false,
          user_id: user.id
        }
        

        // If setting this plan to active, first deactivate all other plans
        if (planData.is_active) {
          await supabase
            .from('workout_plans')
            .update({ is_active: false })
            .eq('user_id', user.id)
        }

        const { data, error } = await supabase
          .from('workout_plans')
          .insert(insertData)
          .select()
          .single()

        if (error) throw error

        // Create default workout days for the new plan
        await createDefaultWorkoutDays(data.id)
        
        return data.id
      }
    } catch (err) {
      console.error('Error saving workout plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to save workout plan')
      return null
    } finally {
      setIsSaving(false)
    }
  }, [user, supabase, createDefaultWorkoutDays])

  const loadPlan = useCallback(async (planId: string) => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
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
          workout_days (
            id,
            day_of_week,
            day_name,
            is_rest_day,
            notes,
            workout_exercises (
              id,
              exercise_id,
              exercise_order,
              default_sets,
              default_reps,
              default_weight,
              default_rest_seconds,
              default_rpe,
              notes,
              exercises (
                id,
                name,
                description,
                difficulty_level,
                instructions,
                equipment_ids,
                muscle_group_ids,
                image_url
              ),
              exercise_sets (
                id,
                set_number,
                reps,
                weight,
                rest_seconds,
                rpe,
                notes
              )
            )
          )
        `)
        .eq('id', planId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error loading workout plan:', err)
      const errorMessage = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to load workout plan'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase])

  const addExerciseToDay = useCallback(async (planId: string, dayOfWeek: number, exerciseId: string, exerciseOrder: number) => {
    if (!user) return false

    try {
      // First, get the workout day ID
      const { data: dayData, error: dayError } = await supabase
        .from('workout_days')
        .select('id')
        .eq('workout_plan_id', planId)
        .eq('day_of_week', dayOfWeek)
        .single()

      if (dayError) throw dayError

      // Insert the workout exercise
      const { data, error } = await supabase
        .from('workout_exercises')
        .insert({
          workout_day_id: dayData.id,
          exercise_id: exerciseId,
          exercise_order: exerciseOrder,
          default_sets: 3,
          default_reps: 10,
          default_rest_seconds: 60
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error adding exercise to day:', err)
      setError(err instanceof Error ? err.message : 'Failed to add exercise')
      return false
    }
  }, [user, supabase])

  const removeExerciseFromDay = useCallback(async (workoutExerciseId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('id', workoutExerciseId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Error removing exercise:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove exercise')
      return false
    }
  }, [user, supabase])

  const updateExerciseInDay = useCallback(async (workoutExerciseId: string, updates: any) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('workout_exercises')
        .update(updates)
        .eq('id', workoutExerciseId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error updating exercise:', err)
      setError(err instanceof Error ? err.message : 'Failed to update exercise')
      return false
    }
  }, [user, supabase])

  const getPlanStatistics = useCallback(async (planId: string) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          id,
          duration_weeks,
          workout_days (
            id,
            day_of_week,
            is_rest_day,
            workout_exercises (
              id,
              exercise_id,
              default_sets,
              default_reps,
              default_rest_seconds
            )
          )
        `)
        .eq('id', planId)
        .single()

      if (error) throw error

      // Calculate statistics
      const allExercises = data.workout_days?.flatMap(day => day.workout_exercises || []) || []
      const trainingDays = data.workout_days?.filter(day => !day.is_rest_day && day.workout_exercises && day.workout_exercises.length > 0).length || 0
      const estimatedSessionTime = trainingDays > 0 ? Math.round((allExercises.length * 2.5)) : 0 // 2.5 minutes per exercise average
      const weeklyTime = estimatedSessionTime * trainingDays

      return {
        totalExercises: allExercises.length,
        trainingDays,
        restDays: 7 - trainingDays,
        estimatedSessionTime,
        weeklyTime,
        exercisesPerDay: trainingDays > 0 ? Math.round(allExercises.length / trainingDays) : 0
      }
    } catch (err) {
      console.error('Error getting plan statistics:', err)
      return null
    }
  }, [user, supabase])

  const saveTempExercises = useCallback(async (planId: string, tempExercises: any[]) => {
    if (!user || tempExercises.length === 0) return true

    try {
      console.log('Saving temporary exercises to database:', tempExercises.length)
      
      // Get all workout days for this plan first
      const { data: workoutDays, error: daysError } = await supabase
        .from('workout_days')
        .select('id, day_of_week')
        .eq('workout_plan_id', planId)

      if (daysError) throw daysError

      // Group temp exercises by day and prepare for bulk insert
      const exercisesToInsert = []
      
      for (const tempEx of tempExercises) {
        const workoutDay = workoutDays.find(day => day.day_of_week === tempEx.day_of_week)
        if (workoutDay) {
          exercisesToInsert.push({
            workout_day_id: workoutDay.id,
            exercise_id: tempEx.exercise_id,
            exercise_order: tempEx.exercise_order,
            default_sets: tempEx.default_sets || 3,
            default_reps: tempEx.default_reps || 10,
            default_weight: tempEx.default_weight,
            default_rest_seconds: tempEx.default_rest_seconds || 60,
            default_rpe: tempEx.default_rpe,
            notes: tempEx.notes
          })
        }
      }

      if (exercisesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert)

        if (insertError) throw insertError
        console.log('Successfully saved', exercisesToInsert.length, 'temporary exercises')
      }

      return true
    } catch (err) {
      console.error('Error saving temporary exercises:', err)
      setError(err instanceof Error ? err.message : 'Failed to save exercises')
      return false
    }
  }, [user, supabase])

  const updateWorkoutDay = useCallback(async (planId: string, dayOfWeek: number, updates: any) => {
    if (!user) return false

    try {
      console.log('Updating workout day:', { planId, dayOfWeek, updates })
      
      // First, get the workout day ID
      const { data: dayData, error: dayError } = await supabase
        .from('workout_days')
        .select('id')
        .eq('workout_plan_id', planId)
        .eq('day_of_week', dayOfWeek)
        .single()

      if (dayError) throw dayError

      // Update the workout day
      const { error: updateError } = await supabase
        .from('workout_days')
        .update({
          day_name: updates.day_name,
          is_rest_day: updates.is_rest_day,
          notes: updates.notes
        })
        .eq('id', dayData.id)

      if (updateError) throw updateError
      
      console.log('Workout day updated successfully')
      return true
    } catch (err) {
      console.error('Error updating workout day:', err)
      setError(err instanceof Error ? err.message : 'Failed to update workout day')
      return false
    }
  }, [user, supabase])

  return {
    savePlan,
    loadPlan,
    addExerciseToDay,
    removeExerciseFromDay,
    updateExerciseInDay,
    updateWorkoutDay,
    getPlanStatistics,
    saveTempExercises,
    isSaving,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}
