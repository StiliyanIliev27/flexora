'use client'

import { useState } from 'react'
import { ExerciseLibrarySidebar } from './ExerciseLibrarySidebar'
import { WorkoutCanvas } from './WorkoutCanvas'
import { WorkoutSettingsModal } from './WorkoutSettingsModal'
import { useWorkoutPlanBuilder } from '@/hooks/useWorkoutPlanBuilder'
import { WorkoutPlanFormData, WorkoutBuilderState } from '@/types/workout.types'
import { ExerciseWithDetails } from '@/types/profile.types'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

interface WorkoutBuilderLayoutProps {
  currentPlan: WorkoutPlanFormData
  onPlanChange: (updates: Partial<WorkoutPlanFormData>) => void
  planId?: string // For editing existing plans
}

export function WorkoutBuilderLayout({ currentPlan, onPlanChange, planId }: WorkoutBuilderLayoutProps) {
  const { addExerciseToDay, removeExerciseFromDay, updateExerciseInDay, updateWorkoutDay, getPlanStatistics, saveTempExercises } = useWorkoutPlanBuilder()
  
  const [builderState, setBuilderState] = useState<WorkoutBuilderState>({
    currentPlan: null,
    selectedDay: null,
    isEditingExercise: null,
    isDragging: false,
    draggedExercise: null,
    unsavedChanges: false,
    tempExercises: [],
  })

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleDragStart = (exercise: ExerciseWithDetails) => {
    setBuilderState(prev => ({
      ...prev,
      isDragging: true,
      draggedExercise: exercise,
    }))
  }

  const handleDragEnd = () => {
    setBuilderState(prev => ({
      ...prev,
      isDragging: false,
      draggedExercise: null,
    }))
  }

  const handleDaySelect = (dayOfWeek: number) => {
    setBuilderState(prev => ({
      ...prev,
      selectedDay: dayOfWeek,
    }))
  }

  const handleStateChange = (updates: Partial<WorkoutBuilderState>) => {
    setBuilderState(prev => ({ ...prev, ...updates }))
  }

  return (
    <>
      <div className="h-full border rounded-lg overflow-hidden bg-background">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Exercise Library Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <ExerciseLibrarySidebar
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={builderState.isDragging}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Workout Canvas */}
          <ResizablePanel defaultSize={75} minSize={65}>
            <WorkoutCanvas
              currentPlan={currentPlan}
              builderState={builderState}
              onStateChange={handleStateChange}
              onDaySelect={handleDaySelect}
              onDragEnd={handleDragEnd}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              planId={planId}
              onAddExercise={addExerciseToDay}
              onRemoveExercise={removeExerciseFromDay}
              onUpdateExercise={updateExerciseInDay}
              onUpdateDay={updateWorkoutDay}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Settings Modal */}
      <WorkoutSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentPlan={currentPlan}
        onPlanChange={onPlanChange}
        builderState={builderState}
        onStateChange={handleStateChange}
        planId={planId}
        onGetStatistics={getPlanStatistics}
        onSaveTempExercises={saveTempExercises}
      />
    </>
  )
}
