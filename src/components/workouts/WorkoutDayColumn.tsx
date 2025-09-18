'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Plus, 
  Bed, 
  Dumbbell, 
  GripVertical,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DayInfo {
  value: number
  label: string
  short: string
}

interface DayData {
  day_of_week: number
  day_name: string | null
  is_rest_day: boolean
  exercises: any[] // Will be WorkoutExerciseWithDetails[]
  notes: string | null
}

interface WorkoutDayColumnProps {
  day: DayInfo
  dayData: DayData
  isSelected: boolean
  isDragTarget: boolean
  onSelect: () => void
  onDrop: (exercise: any) => void
  onDragOver: (e: React.DragEvent) => void
  onRestDayToggle: () => void
  onRemoveExercise?: (exerciseId: string) => void
  onUpdateExercise?: (exerciseId: string, updatedExercise: any) => void
  onReorderExercises?: (reorderedExercises: any[]) => void
  onUpdateDay?: (updatedDayData: Partial<DayData>) => void
  onOpenExerciseModal?: (exercise: any) => void
  onOpenEditDayModal?: () => void
}

export function WorkoutDayColumn({
  day,
  dayData,
  isSelected,
  isDragTarget,
  onSelect,
  onDrop,
  onDragOver,
  onRestDayToggle,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercises,
  onUpdateDay,
  onOpenExerciseModal,
  onOpenEditDayModal,
}: WorkoutDayColumnProps) {
  const { t } = useLanguage()
  const [isDraggedOver, setIsDraggedOver] = useState(false)
  const [draggedExerciseId, setDraggedExerciseId] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggedOver(false)
    
    try {
      const exerciseData = e.dataTransfer.getData('exercise')
      if (exerciseData) {
        const exercise = JSON.parse(exerciseData)
        onDrop(exercise)
      }
    } catch (error) {
      console.error('Error parsing dropped exercise:', error)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggedOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only hide if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggedOver(false)
    }
  }

  const handleExerciseClick = (exercise: any) => {
    onOpenExerciseModal?.(exercise)
  }

  const handleEditDay = () => {
    onOpenEditDayModal?.()
  }

  const handleExerciseDragStart = (e: React.DragEvent, exercise: any, index: number) => {
    console.log('🚀 Starting drag for exercise:', exercise.exercise_name, 'at index:', index)
    
    // Set data transfer with exercise info
    e.dataTransfer.setData('text/plain', JSON.stringify({
      exerciseId: exercise.id,
      sourceIndex: index,
      dayOfWeek: day.value,
      type: 'exercise-reorder'
    }))
    e.dataTransfer.effectAllowed = 'move'
    
    // Update visual state
    setDraggedExerciseId(exercise.id)
  }

  const handleExerciseDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only show drop indicator if we're dragging an exercise
    const data = e.dataTransfer.getData('text/plain')
    if (data) {
      try {
        const dragData = JSON.parse(data)
        if (dragData.type === 'exercise-reorder' && dragData.dayOfWeek === day.value) {
          setDragOverIndex(index)
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
  }

  const handleExerciseDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('📍 Drop on index:', targetIndex)
    
    const data = e.dataTransfer.getData('text/plain')
    if (data) {
      try {
        const { exerciseId, sourceIndex, dayOfWeek, type } = JSON.parse(data)
        
        console.log('📦 Drop data:', { exerciseId, sourceIndex, targetIndex, dayOfWeek, type })
        
        // Only reorder if it's a valid exercise reorder within the same day
        if (type === 'exercise-reorder' && 
            dayOfWeek === day.value && 
            sourceIndex !== targetIndex &&
            sourceIndex >= 0 && 
            targetIndex >= 0) {
          
          console.log('✅ Reordering from', sourceIndex, 'to', targetIndex)
          
          const reorderedExercises = [...dayData.exercises]
          const [movedExercise] = reorderedExercises.splice(sourceIndex, 1)
          reorderedExercises.splice(targetIndex, 0, movedExercise)
          
          // Update exercise orders
          const updatedExercises = reorderedExercises.map((ex, idx) => ({
            ...ex,
            exercise_order: idx
          }))
          
          console.log('🔄 Updated exercises:', updatedExercises.map(ex => ex.exercise_name))
          
          onReorderExercises?.(updatedExercises)
        }
      } catch (error) {
        console.error('Error parsing drop data:', error)
      }
    }
    
    // Reset drag states
    setDraggedExerciseId(null)
    setDragOverIndex(null)
  }

  const handleExerciseDragEnd = () => {
    console.log('🏁 Drag ended')
    setDraggedExerciseId(null)
    setDragOverIndex(null)
  }

  const dayLabel = t(`workouts.daysOfWeek.${day.label.toLowerCase()}` as any) || day.label

  return (
    <Card 
      className={`h-full min-h-80 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${
        isDraggedOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
      } ${
        dayData.is_rest_day ? 'bg-muted/50' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-xs font-medium">{dayLabel}</CardTitle>
            {dayData.day_name && dayData.day_name !== dayLabel && (
              <div className="text-xs text-primary font-medium mt-0.5">
                &ldquo;{dayData.day_name}&rdquo;
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRestDayToggle}>
                <Bed className="h-3 w-3 mr-2" />
                {dayData.is_rest_day ? t('workouts.setAsWorkoutDay') : t('workouts.setAsRestDay')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditDay}>
                <Edit className="h-3 w-3 mr-2" />
                Edit Day
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Day Status Badge */}
        <div className="flex items-center">
          {dayData.is_rest_day ? (
            <Badge variant="secondary" className="text-xs py-0 px-1">
              <Bed className="h-2 w-2 mr-1" />
              Rest
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs py-0 px-1">
              <Dumbbell className="h-2 w-2 mr-1" />
              {dayData.exercises.length}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent 
        className="flex-1 p-2"
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {dayData.is_rest_day ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bed className="h-6 w-6 mb-1" />
            <p className="text-xs text-center">Rest Day</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Exercise List */}
            {dayData.exercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground border-2 border-dashed border-muted-foreground/25 rounded-md">
                {isDragTarget ? (
                  <>
                    <Plus className="h-4 w-4 mb-1" />
                    <p className="text-xs text-center">Drop here</p>
                  </>
                ) : (
                  <>
                    <Dumbbell className="h-4 w-4 mb-1" />
                    <p className="text-xs text-center">Add exercise</p>
                  </>
                )}
              </div>
            ) : (
              dayData.exercises.map((exercise, index) => (
                <Card 
                  key={`${exercise.id}-${index}`} 
                  className={`p-1 cursor-pointer hover:bg-accent transition-colors ${
                    draggedExerciseId === exercise.id ? 'opacity-50 ring-2 ring-blue-300' : ''
                  } ${
                    dragOverIndex === index ? 'border-primary border-2 bg-primary/5' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleExerciseDragStart(e, exercise, index)}
                  onDragOver={(e) => handleExerciseDragOver(e, index)}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDragEnd={handleExerciseDragEnd}
                  onDrop={(e) => handleExerciseDrop(e, index)}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <GripVertical className="h-2 w-2 text-muted-foreground cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {exercise.exercise_name || exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.default_sets || exercise.sets || 3} × {exercise.default_reps || exercise.reps || 10}
                          {exercise.default_weight && ` @ ${exercise.default_weight}kg`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Use custom modal instead of browser confirm
                        onRemoveExercise?.(exercise.id)
                      }}
                      title="Remove exercise"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))
            )}

            {/* Drop Zone for Additional Exercises */}
            {dayData.exercises.length > 0 && isDragTarget && (
              <div className="border-2 border-dashed border-blue-500 rounded-md p-2 text-center">
                <Plus className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Drop here
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

