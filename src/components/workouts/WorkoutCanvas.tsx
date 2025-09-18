'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { WorkoutPlanFormData, WorkoutBuilderState, DAYS_OF_WEEK } from '@/types/workout.types'
import { useWorkoutPlanBuilder } from '@/hooks/useWorkoutPlanBuilder'
import { WorkoutDayColumn } from './WorkoutDayColumn'
import { ExerciseDetailModal } from './ExerciseDetailModal'
import { EditDayModal } from './EditDayModal'
import { RemoveExerciseModal } from './RemoveExerciseModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, Clock, Dumbbell, AlertCircle, Settings } from 'lucide-react'

interface WorkoutCanvasProps {
  currentPlan: WorkoutPlanFormData
  builderState: WorkoutBuilderState
  onStateChange: (updates: Partial<WorkoutBuilderState>) => void
  onDaySelect: (dayOfWeek: number) => void
  onDragEnd: () => void
  onOpenSettings: () => void
  planId?: string
  onAddExercise: (planId: string, dayOfWeek: number, exerciseId: string, exerciseOrder: number) => Promise<any>
  onRemoveExercise: (workoutExerciseId: string) => Promise<boolean>
  onUpdateExercise: (workoutExerciseId: string, updates: any) => Promise<any>
  onUpdateDay: (planId: string, dayOfWeek: number, updates: any) => Promise<boolean>
}

export function WorkoutCanvas({ 
  currentPlan, 
  builderState, 
  onStateChange, 
  onDaySelect, 
  onDragEnd,
  onOpenSettings,
  planId,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  onUpdateDay
}: WorkoutCanvasProps) {
  const { t } = useLanguage()
  const { loadPlan } = useWorkoutPlanBuilder()
  const [isClient, setIsClient] = useState(false)
  const [isLoadingPlan, setIsLoadingPlan] = useState(false)
  
  // Modal state
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [selectedDayData, setSelectedDayData] = useState<any>(null)
  const [isEditDayModalOpen, setIsEditDayModalOpen] = useState(false)
  
  // Remove exercise modal state
  const [removeExerciseModal, setRemoveExerciseModal] = useState<{
    isOpen: boolean
    exerciseId: string
    exerciseName: string
    dayOfWeek: number
  }>({
    isOpen: false,
    exerciseId: '',
    exerciseName: '',
    dayOfWeek: -1
  })

  // Workout data for each day
  const [workoutDays, setWorkoutDays] = useState<Array<{
    day_of_week: number
    day_name: string | null
    is_rest_day: boolean
    exercises: Array<{
      id: string
      exercise_id: string
      exercise_name: string
      exercise_description: string | null
      difficulty_level: string
      exercise_order: number
      default_sets: number
      default_reps: number
      default_weight: number | null
      default_rest_seconds: number
      default_rpe: number | null
      notes: string | null
      exercise_details: any
    }>
    notes: string | null
  }>>(() => 
    DAYS_OF_WEEK.map(day => ({
      day_of_week: day.value,
      day_name: null,
      is_rest_day: day.value === 0 || day.value === 6, // Sunday and Saturday as rest days
      exercises: [], // Will store workout exercises
      notes: null,
    }))
  )

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])



  // Load workout data when planId is provided
  useEffect(() => {
    const loadWorkoutData = async () => {
      if (!planId || !isClient) return

      try {
        setIsLoadingPlan(true)
        const planData = await loadPlan(planId)
        if (planData && planData.workout_days) {
          // Transform the loaded data to match our workoutDays structure
          const loadedDays = DAYS_OF_WEEK.map(dayDef => {
            const dayData = planData.workout_days.find(
              (day: any) => day.day_of_week === dayDef.value
            )
            
            if (!dayData) {
              return {
                day_of_week: dayDef.value,
                day_name: null,
                is_rest_day: dayDef.value === 0 || dayDef.value === 6,
                exercises: [],
                notes: null,
              }
            }

            // Transform exercises to include exercise details
            const exercises = dayData.workout_exercises?.map((we: any) => ({
              id: we.id,
              exercise_id: we.exercise_id,
              exercise_name: we.exercises?.name || `Exercise ${we.exercise_id}`,
              exercise_description: we.exercises?.description || null,
              difficulty_level: we.exercises?.difficulty_level || 'beginner',
              exercise_order: we.exercise_order,
              default_sets: we.default_sets || 3,
              default_reps: we.default_reps || 10,
              default_weight: we.default_weight,
              default_rest_seconds: we.default_rest_seconds || 60,
              default_rpe: we.default_rpe,
              notes: we.notes,
              exercise_details: we.exercises || {}
            })) || []

            return {
              day_of_week: dayData.day_of_week,
              day_name: dayData.day_name,
              is_rest_day: dayData.is_rest_day,
              exercises,
              notes: dayData.notes,
            }
          })

          setWorkoutDays(loadedDays)
        }
      } catch (error) {
        console.error('Error loading workout data:', error)
      } finally {
        setIsLoadingPlan(false)
      }
    }

    loadWorkoutData()
  }, [planId, isClient])

  const handleDrop = async (dayOfWeek: number, exercise: any) => {
    console.log('Dropping exercise:', exercise, 'on day:', dayOfWeek)
    
    // If no planId, add exercise temporarily and prompt for plan save
    if (!planId) {
      console.log('No planId - adding exercise temporarily until plan is saved')
      
      // Check if exercise already exists in this day
      const targetDay = workoutDays.find(day => day.day_of_week === dayOfWeek)
      const exerciseExists = targetDay?.exercises.some(ex => ex.exercise_id === exercise.id)
      
      if (exerciseExists) {
        console.log('Exercise already exists in this day')
        onDragEnd()
        return
      }
      
      // Add exercise temporarily with temp ID
      const tempExercise = {
        id: `temp_${Date.now()}_${Math.random()}`,
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        exercise_description: exercise.description,
        difficulty_level: exercise.difficulty_level,
        exercise_order: targetDay?.exercises.length || 0,
        default_sets: 3,
        default_reps: 10,
        default_weight: null,
        default_rest_seconds: 60,
        default_rpe: null,
        notes: null,
        exercise_details: exercise
      }
      
      // Update local state
      setWorkoutDays(prev => prev.map(day => {
        if (day.day_of_week === dayOfWeek && !day.is_rest_day) {
          return {
            ...day,
            exercises: [...day.exercises, tempExercise]
          }
        }
        return day
      }))
      
      // Mark as having unsaved changes and add to temp exercises
      onStateChange({ 
        unsavedChanges: true,
        tempExercises: [...(builderState.tempExercises || []), {
          ...tempExercise,
          day_of_week: dayOfWeek
        }]
      })
      onDragEnd()
      return
    }
    
    // Find the target day
    const targetDay = workoutDays.find(day => day.day_of_week === dayOfWeek)
    
    // Check if exercise already exists in this day
    const exerciseExists = targetDay?.exercises.some(ex => ex.exercise_id === exercise.id)
    
    if (exerciseExists) {
      console.log('Exercise already exists in this day')
      onDragEnd()
      return
    }
    
    // Calculate exercise order
    const exerciseOrder = targetDay?.exercises.length || 0
    
    try {
      // Save exercise to database
      const savedExercise = await onAddExercise(planId, dayOfWeek, exercise.id, exerciseOrder)
      
      if (savedExercise) {
        // Update local state with the saved exercise
        setWorkoutDays(prev => prev.map(day => {
          if (day.day_of_week === dayOfWeek && !day.is_rest_day) {
            const newExercise = {
              id: savedExercise.id,
              exercise_id: exercise.id,
              exercise_name: exercise.name,
              exercise_description: exercise.description,
              difficulty_level: exercise.difficulty_level,
              exercise_order: savedExercise.exercise_order,
              default_sets: savedExercise.default_sets,
              default_reps: savedExercise.default_reps,
              default_weight: savedExercise.default_weight,
              default_rest_seconds: savedExercise.default_rest_seconds,
              default_rpe: savedExercise.default_rpe,
              notes: savedExercise.notes,
              exercise_details: exercise
            }
            
            return {
              ...day,
              exercises: [...day.exercises, newExercise]
            }
          }
          return day
        }))
        
        // Mark as having changes saved
        onStateChange({ unsavedChanges: false })
      }
    } catch (error) {
      console.error('Failed to add exercise:', error)
    }
    
    onDragEnd()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleRestDayToggle = (dayOfWeek: number) => {
    setWorkoutDays(prev => prev.map(day => 
      day.day_of_week === dayOfWeek 
        ? { ...day, is_rest_day: !day.is_rest_day }
        : day
    ))
    onStateChange({ unsavedChanges: true })
  }

  const handleRemoveExercise = (dayOfWeek: number, exerciseId: string) => {
    // Find the exercise to get its name for the confirmation modal
    const day = workoutDays.find(d => d.day_of_week === dayOfWeek)
    const exercise = day?.exercises.find(ex => ex.id === exerciseId)
    
    if (exercise) {
      setRemoveExerciseModal({
        isOpen: true,
        exerciseId,
        exerciseName: exercise.exercise_name,
        dayOfWeek
      })
    }
  }

  const handleConfirmRemoveExercise = async (): Promise<boolean> => {
    const { exerciseId, dayOfWeek } = removeExerciseModal
    
    try {
      // Remove from database if plan is saved
      if (planId) {
        await onRemoveExercise(exerciseId)
        // Show success toast
        const { toast } = await import('sonner')
        toast.success('Exercise removed successfully')
      }
      
      // Remove from local state
      setWorkoutDays(prev => prev.map(day => {
        if (day.day_of_week === dayOfWeek) {
          return {
            ...day,
            exercises: day.exercises.filter(ex => ex.id !== exerciseId)
          }
        }
        return day
      }))
      
      if (!planId) {
        onStateChange({ unsavedChanges: true })
      }
      
      return true
    } catch (error) {
      console.error('Failed to remove exercise:', error)
      // Show error toast
      const { toast } = await import('sonner')
      toast.error('Failed to remove exercise')
      return false
    }
  }

  const handleUpdateExercise = async (dayOfWeek: number, exerciseId: string, updatedExercise: any) => {
    // Update local state immediately for UI responsiveness
    setWorkoutDays(prev => prev.map(day => {
      if (day.day_of_week === dayOfWeek) {
        return {
          ...day,
          exercises: day.exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, ...updatedExercise } : ex
          )
        }
      }
      return day
    }))
    
    // Persist to database
    try {
      if (planId) {
        // Filter out UI-only properties and only send valid database columns
        const dbUpdates = {
          default_sets: updatedExercise.default_sets,
          default_reps: updatedExercise.default_reps,
          default_weight: updatedExercise.default_weight,
          default_rest_seconds: updatedExercise.default_rest_seconds,
          default_rpe: updatedExercise.default_rpe,
          notes: updatedExercise.notes
        }
        
        await onUpdateExercise(exerciseId, dbUpdates)
        // Show success toast
        const { toast } = await import('sonner')
        toast.success('Exercise updated successfully')
      } else {
        onStateChange({ unsavedChanges: true })
      }
    } catch (error) {
      console.error('Failed to update exercise:', error)
      // Show error toast
      const { toast } = await import('sonner')
      toast.error('Failed to update exercise')
      
      // Revert local state on error
      setWorkoutDays(prev => prev.map(day => {
        if (day.day_of_week === dayOfWeek) {
          return {
            ...day,
            exercises: day.exercises.map(ex => 
              ex.id === exerciseId ? ex : ex // Revert to original
            )
          }
        }
        return day
      }))
    }
  }

  const handleReorderExercises = async (dayOfWeek: number, reorderedExercises: any[]) => {
    // Update local state immediately for responsive UI
    setWorkoutDays(prev => prev.map(day => {
      if (day.day_of_week === dayOfWeek) {
        return {
          ...day,
          exercises: reorderedExercises
        }
      }
      return day
    }))
    
    // Persist to database if plan is saved
    try {
      if (planId) {
        // Update exercise order in database for each exercise
        const updatePromises = reorderedExercises.map(async (exercise, index) => {
          if (exercise.id) {
            return onUpdateExercise(exercise.id, { exercise_order: index })
          }
        })
        
        await Promise.all(updatePromises.filter(Boolean))
        
        // Show success toast
        const { toast } = await import('sonner')
        toast.success('Exercise order updated')
      } else {
        onStateChange({ unsavedChanges: true })
      }
    } catch (error) {
      console.error('Failed to update exercise order:', error)
      // Show error toast
      const { toast } = await import('sonner')
      toast.error('Failed to update exercise order')
      
      // Could revert local state here if needed
    }
  }

  const handleUpdateDay = async (dayOfWeek: number, updatedDayData: any) => {
    // Update local state immediately for UI responsiveness
    setWorkoutDays(prev => prev.map(day => {
      if (day.day_of_week === dayOfWeek) {
        return {
          ...day,
          ...updatedDayData
        }
      }
      return day
    }))
    
    // Persist to database if plan is saved
    try {
      if (planId) {
        await onUpdateDay(planId, dayOfWeek, updatedDayData)
        // Show success toast
        const { toast } = await import('sonner')
        toast.success('Day updated successfully')
      } else {
        onStateChange({ unsavedChanges: true })
      }
    } catch (error) {
      console.error('Failed to update day:', error)
      // Show error toast
      const { toast } = await import('sonner')
      toast.error('Failed to update day')
      
      // Revert local state on error
      setWorkoutDays(prev => prev.map(day => {
        if (day.day_of_week === dayOfWeek) {
          // Revert to original state (would need to track original)
          return day
        }
        return day
      }))
    }
  }

  // Modal handlers
  const handleOpenExerciseModal = (exercise: any, dayOfWeek?: number) => {
    setSelectedExercise({ ...exercise, dayOfWeek })
    setIsExerciseModalOpen(true)
  }

  const handleCloseExerciseModal = () => {
    setSelectedExercise(null)
    setIsExerciseModalOpen(false)
  }

  const handleOpenEditDayModal = (day: any, dayData: any) => {
    setSelectedDay(day)
    setSelectedDayData(dayData)
    setIsEditDayModalOpen(true)
  }

  const handleCloseEditDayModal = () => {
    console.log('WorkoutCanvas handleCloseEditDayModal called')
    setSelectedDay(null)
    setSelectedDayData(null)
    setIsEditDayModalOpen(false)
  }

  const handleUpdateExerciseFromModal = (updatedExercise: any) => {
    if (selectedExercise?.dayOfWeek !== undefined) {
      handleUpdateExercise(selectedExercise.dayOfWeek, updatedExercise.id, updatedExercise)
    }
  }

  const handleUpdateDayFromModal = (updatedDayData: any) => {
    if (selectedDayData) {
      handleUpdateDay(selectedDayData.day_of_week, updatedDayData)
    }
  }

  const totalExercises = workoutDays.reduce((sum, day) => sum + day.exercises.length, 0)
  const trainingDays = workoutDays.filter(day => !day.is_rest_day).length
  const restDays = workoutDays.filter(day => day.is_rest_day).length

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header with Stats */}
      <div className="p-3 border-b bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">{currentPlan.name || 'Untitled Workout Plan'}</h2>
            <p className="text-xs text-muted-foreground">
              Plan your weekly exercise routine
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {trainingDays} days
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Dumbbell className="h-3 w-3 mr-1" />
              {totalExercises}
            </Badge>
            <Button variant="outline" size="sm" onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>

        {/* Validation Messages */}
        {totalExercises === 0 && (
          <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center text-blue-800 dark:text-blue-200 text-xs">
              <AlertCircle className="h-3 w-3 mr-2" />
              {t('workouts.planEmpty')} - {t('workouts.addFirstExercise')}
            </div>
          </div>
        )}
      </div>

      {/* Days Grid */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {!isClient || isLoadingPlan ? (
            <div className="grid grid-cols-7 gap-2 min-h-80">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="bg-muted rounded-md animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 min-h-80">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = workoutDays.find(wd => wd.day_of_week === day.value)
                return (
                  <WorkoutDayColumn
                    key={day.value}
                    day={day}
                    dayData={dayData!}
                    isSelected={builderState.selectedDay === day.value}
                    isDragTarget={builderState.isDragging}
                    onSelect={() => onDaySelect(day.value)}
                    onDrop={(exercise) => handleDrop(day.value, exercise)}
                    onDragOver={handleDragOver}
                    onRestDayToggle={() => handleRestDayToggle(day.value)}
                    onRemoveExercise={(exerciseId) => handleRemoveExercise(day.value, exerciseId)}
                    onUpdateExercise={(exerciseId, updatedExercise) => handleUpdateExercise(day.value, exerciseId, updatedExercise)}
                    onReorderExercises={(reorderedExercises) => handleReorderExercises(day.value, reorderedExercises)}
                    onUpdateDay={(updatedDayData) => handleUpdateDay(day.value, updatedDayData)}
                    onOpenExerciseModal={(exercise) => handleOpenExerciseModal(exercise, day.value)}
                    onOpenEditDayModal={() => handleOpenEditDayModal(day, dayData!)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Canvas Footer */}
      <div className="p-2 border-t bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>Training: {trainingDays}</span>
            <span>Rest: {restDays}</span>
          </div>
          <div className="flex items-center gap-1">
            {builderState.isDragging && (
              <Badge variant="secondary" className="text-xs">
                {t('workouts.dragToAdd')}
              </Badge>
            )}
            {builderState.unsavedChanges && (
              <Badge variant="destructive" className="text-xs">
                Unsaved
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        isOpen={isExerciseModalOpen}
        onClose={handleCloseExerciseModal}
        exercise={selectedExercise}
        onSave={handleUpdateExerciseFromModal}
      />

      {/* Edit Day Modal */}
      <EditDayModal
        key={`edit-day-${selectedDay?.value || 'none'}`}
        isOpen={isEditDayModalOpen && !!selectedDay && !!selectedDayData}
        onClose={handleCloseEditDayModal}
        day={selectedDay}
        dayData={selectedDayData}
        onSave={handleUpdateDayFromModal}
      />

      {/* Remove Exercise Confirmation Modal */}
      <RemoveExerciseModal
        isOpen={removeExerciseModal.isOpen}
        onClose={() => setRemoveExerciseModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmRemoveExercise}
        exerciseName={removeExerciseModal.exerciseName}
      />
    </div>
  )
}
