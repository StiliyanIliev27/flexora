'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cleanupModalState } from '@/utils/modal-cleanup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Dumbbell, 
  Clock, 
  Hash, 
  Weight,
  Activity,
  FileText,
  Save,
  X
} from 'lucide-react'

interface ExerciseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: any // WorkoutExercise with exercise details
  onSave: (updatedExercise: any) => void
}

export function ExerciseDetailModal({ 
  isOpen, 
  onClose, 
  exercise, 
  onSave 
}: ExerciseDetailModalProps) {
  const { t } = useLanguage()
  
  // Form state
  const [sets, setSets] = useState(exercise?.default_sets || 3)
  const [reps, setReps] = useState(exercise?.default_reps || 10)
  const [weight, setWeight] = useState(exercise?.default_weight || '')
  const [restSeconds, setRestSeconds] = useState(exercise?.default_rest_seconds || 60)
  const [rpe, setRpe] = useState(exercise?.default_rpe || '')
  const [notes, setNotes] = useState(exercise?.notes || '')

  if (!exercise) return null

  const exerciseDetails = exercise.exercise_details || exercise

  const handleSave = () => {
    const updatedExercise = {
      ...exercise,
      default_sets: sets,
      default_reps: reps,
      default_weight: weight || null,
      default_rest_seconds: restSeconds,
      default_rpe: rpe || null,
      notes: notes || null
    }
    
    onSave(updatedExercise)
    
    // Apply cleanup to prevent UI freeze
    cleanupModalState('ExerciseDetailModal save')
    
    onClose()
  }

  const handleClose = () => {
    // Reset form to original values
    setSets(exercise?.default_sets || 3)
    setReps(exercise?.default_reps || 10)
    setWeight(exercise?.default_weight || '')
    setRestSeconds(exercise?.default_rest_seconds || 60)
    setRpe(exercise?.default_rpe || '')
    setNotes(exercise?.notes || '')
    
    // Apply cleanup to prevent UI freeze
    cleanupModalState('ExerciseDetailModal close')
    
    onClose()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {exerciseDetails.name}
          </DialogTitle>
          <DialogDescription>
            Configure this exercise for your workout
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(exerciseDetails.difficulty_level)}>
                {exerciseDetails.difficulty_level}
              </Badge>
              {exerciseDetails.equipment_details?.map((eq: any) => (
                <Badge key={eq.id} variant="outline" className="text-xs">
                  {eq.name}
                </Badge>
              ))}
            </div>
            
            {exerciseDetails.description && (
              <p className="text-sm text-muted-foreground">
                {exerciseDetails.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Exercise Configuration */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sets" className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4" />
                Sets
              </Label>
              <Input
                id="sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                min="1"
                max="20"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps" className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4" />
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                min="1"
                max="100"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium">
                <Weight className="h-4 w-4" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Optional"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rest" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Rest (seconds)
              </Label>
              <Input
                id="rest"
                type="number"
                value={restSeconds}
                onChange={(e) => setRestSeconds(parseInt(e.target.value) || 0)}
                min="10"
                max="600"
                className="w-full"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="rpe" className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4" />
                RPE (Rate of Perceived Exertion)
              </Label>
              <Input
                id="rpe"
                type="number"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                min="1"
                max="10"
                placeholder="1-10 scale (optional)"
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific notes for this exercise..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Instructions */}
          {exerciseDetails.instructions && (
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Instructions
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {exerciseDetails.instructions}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
