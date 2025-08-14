"use client"

import { useState, useEffect, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { 
  Exercise,
  ExerciseWithDetails,
  ExerciseInsert,
  ExerciseUpdate,
  ExerciseFilters,
  ExerciseSearchResults,
  Equipment,
  MuscleGroup,
  DifficultyLevel
} from '@/types/profile.types'

const DEFAULT_LIMIT = 20

export function useExercises() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<ExerciseWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<ExerciseFilters>({})
  
  // Lookup data
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  
  const supabase = createBrowserSupabaseClient()

  // Fetch equipment for filters
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
    }
  }

  // Fetch muscle groups for filters
  const fetchMuscleGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('muscle_groups')
        .select('*')
        .eq('is_active', true)
        .order('category, name')

      if (error) throw error
      setMuscleGroups(data || [])
    } catch (err) {
      console.error('Error fetching muscle groups:', err)
    }
  }

  // Build query with filters
  const buildQuery = useCallback(() => {
    let query = supabase
      .from('exercises')
      .select(`
        *,
        created_by_user:users!exercises_created_by_fkey(
          id,
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,instructions.ilike.%${filters.search}%`)
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty_level', filters.difficulty)
    }

    if (filters.equipment && filters.equipment.length > 0) {
      query = query.overlaps('equipment_ids', filters.equipment)
    }

    if (filters.muscle_groups && filters.muscle_groups.length > 0) {
      // Search in both primary and secondary muscle groups
      const muscleGroupFilters = filters.muscle_groups.map(id => 
        `muscle_group_ids->primary.cs.[\"${id}\"],muscle_group_ids->secondary.cs.[\"${id}\"]`
      ).join(',')
      query = query.or(muscleGroupFilters)
    }

    if (filters.is_user_created !== undefined) {
      if (filters.is_user_created) {
        query = query.not('created_by', 'is', null)
      } else {
        query = query.is('created_by', null)
      }
    }

    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by)
    }

    // Only show public exercises or exercises created by the current user
    if (user?.id) {
      query = query.or(`is_public.eq.true,created_by.eq.${user.id}`)
    } else {
      query = query.eq('is_public', true)
    }

    return query
  }, [filters, user?.id, supabase])

  // Fetch exercises with filters and pagination
  const fetchExercises = useCallback(async (page: number = 1, limit: number = DEFAULT_LIMIT) => {
    setLoading(true)
    setError(null)

    try {
      const offset = (page - 1) * limit
      const query = buildQuery()

      const { data, error, count } = await query
        .order('name')
        .range(offset, offset + limit - 1)

      if (error) throw error

      // Enhance exercises with equipment and muscle group details
      const enhancedExercises: ExerciseWithDetails[] = await Promise.all(
        (data || []).map(async (exercise) => {
          // Get equipment details
          const equipmentDetails = equipment.filter(eq => 
            exercise.equipment_ids?.includes(eq.id)
          )

          // Get muscle group details
          let muscleGroupDetails: { primary: MuscleGroup[], secondary: MuscleGroup[] } = {
            primary: [],
            secondary: []
          }

          if (exercise.muscle_group_ids) {
            const mgIds = exercise.muscle_group_ids as any
            if (mgIds.primary) {
              muscleGroupDetails.primary = muscleGroups.filter(mg => mgIds.primary.includes(mg.id))
            }
            if (mgIds.secondary) {
              muscleGroupDetails.secondary = muscleGroups.filter(mg => mgIds.secondary.includes(mg.id))
            }
          }

          return {
            ...exercise,
            equipment_details: equipmentDetails,
            muscle_group_details: muscleGroupDetails
          }
        })
      )

      setExercises(enhancedExercises)
      setTotalCount(count || 0)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching exercises:', err)
      setError('Failed to load exercises')
    } finally {
      setLoading(false)
    }
  }, [buildQuery, equipment, muscleGroups])

  // Create new exercise
  const createExercise = async (exerciseData: Omit<ExerciseInsert, 'created_by'>): Promise<boolean> => {
    if (!user?.id) {
      setError('You must be logged in to create exercises')
      return false
    }

    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('exercises')
        .insert({
          ...exerciseData,
          created_by: user.id
        })

      if (error) throw error

      // Refresh exercises
      await fetchExercises(currentPage)
      return true
    } catch (err) {
      console.error('Error creating exercise:', err)
      setError('Failed to create exercise')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Update exercise
  const updateExercise = async (id: string, updates: ExerciseUpdate): Promise<boolean> => {
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      // Refresh exercises
      await fetchExercises(currentPage)
      return true
    } catch (err) {
      console.error('Error updating exercise:', err)
      setError('Failed to update exercise')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Delete exercise
  const deleteExercise = async (id: string): Promise<boolean> => {
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh exercises
      await fetchExercises(currentPage)
      return true
    } catch (err) {
      console.error('Error deleting exercise:', err)
      setError('Failed to delete exercise')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Update filters and refresh
  const updateFilters = useCallback((newFilters: Partial<ExerciseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Load next page
  const loadNextPage = useCallback(() => {
    const nextPage = currentPage + 1
    const maxPage = Math.ceil(totalCount / DEFAULT_LIMIT)
    if (nextPage <= maxPage) {
      fetchExercises(nextPage)
    }
  }, [currentPage, totalCount, fetchExercises])

  // Load previous page
  const loadPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchExercises(currentPage - 1)
    }
  }, [currentPage, fetchExercises])

  // Search exercises
  const searchExercises = useCallback((searchTerm: string) => {
    updateFilters({ search: searchTerm })
  }, [updateFilters])

  // Load initial data
  useEffect(() => {
    Promise.all([
      fetchEquipment(),
      fetchMuscleGroups()
    ])
  }, [])

  // Fetch exercises when filters change
  useEffect(() => {
    if (equipment.length > 0 && muscleGroups.length > 0) {
      fetchExercises(currentPage)
    }
  }, [filters, equipment.length, muscleGroups.length, fetchExercises, currentPage])

  const searchResults: ExerciseSearchResults = {
    exercises,
    total: totalCount,
    page: currentPage,
    limit: DEFAULT_LIMIT,
    filters
  }

  return {
    // Data
    searchResults,
    equipment,
    muscleGroups,
    
    // States
    loading,
    saving,
    error,
    
    // Actions
    createExercise,
    updateExercise,
    deleteExercise,
    updateFilters,
    clearFilters,
    searchExercises,
    
    // Pagination
    loadNextPage,
    loadPreviousPage,
    hasNextPage: currentPage < Math.ceil(totalCount / DEFAULT_LIMIT),
    hasPreviousPage: currentPage > 1,
    
    // Utils
    refresh: () => fetchExercises(currentPage)
  }
}

