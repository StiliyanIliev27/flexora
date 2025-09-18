'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cleanupModalState } from '@/utils/modal-cleanup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  Calendar, 
  Bed, 
  Dumbbell, 
  Clock,
  Hash,
  Target,
  FileText,
  Save,
  X,
  AlertCircle
} from 'lucide-react'

interface DayData {
  day_of_week: number
  day_name: string | null
  is_rest_day: boolean
  exercises: any[]
  notes: string | null
}

interface DayInfo {
  value: number
  label: string
  short: string
}

interface EditDayModalProps {
  isOpen: boolean
  onClose: () => void
  day: DayInfo
  dayData: DayData
  onSave: (updatedDayData: Partial<DayData>) => void
}

export function EditDayModal({ 
  isOpen, 
  onClose, 
  day,
  dayData, 
  onSave 
}: EditDayModalProps) {
  const { t } = useLanguage()
  
  // Form state
  const [dayName, setDayName] = useState(dayData?.day_name || '')
  const [isRestDay, setIsRestDay] = useState(dayData?.is_rest_day || false)
  const [notes, setNotes] = useState(dayData?.notes || '')

  if (!dayData || !day) return null

  const handleSave = () => {
    try {
      const updatedDayData = {
        day_name: dayName.trim() || null,
        is_rest_day: isRestDay,
        notes: notes.trim() || null,
      }
      
      onSave(updatedDayData)
      
      // Apply cleanup to prevent UI freeze
      cleanupModalState('EditDayModal save')
      
      onClose()
    } catch (error) {
      console.error('Error saving day data:', error)
    }
  }

  const handleClose = () => {
    console.log('EditDayModal handleClose called')
    
    // Reset form to original values when closing
    setDayName(dayData?.day_name || '')
    setIsRestDay(dayData?.is_rest_day || false)
    setNotes(dayData?.notes || '')
    
    // Apply cleanup to prevent UI freeze
    cleanupModalState('EditDayModal close')
    
    onClose()
  }

  const dayLabel = t(`workouts.daysOfWeek.${day.label.toLowerCase()}` as any) || day.label
  const exerciseCount = dayData.exercises?.length || 0
  const estimatedDuration = isRestDay ? 0 : exerciseCount * 3 // Rough estimate: 3 minutes per exercise

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('EditDayModal onOpenChange called with:', open)
      if (!open) {
        handleClose()
      }
    }} modal={true}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit {dayLabel}
          </DialogTitle>
          <DialogDescription>
            Configure this day in your workout plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Day Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={isRestDay ? "secondary" : "default"}>
                {isRestDay ? (
                  <>
                    <Bed className="h-3 w-3 mr-1" />
                    Rest Day
                  </>
                ) : (
                  <>
                    <Dumbbell className="h-3 w-3 mr-1" />
                    Training Day
                  </>
                )}
              </Badge>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {exerciseCount} exercises
                </div>
                {!isRestDay && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ~{estimatedDuration}min
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Day Configuration */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="day-name" className="text-sm font-medium">Custom Day Name</Label>
              <Input
                id="day-name"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                placeholder={`e.g., Push Day, Leg Day, ${dayLabel} Workout`}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Optional custom name for this day (e.g., "Push Day", "Upper Body")
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label htmlFor="rest-day" className="text-sm font-medium">Rest Day</Label>
                <p className="text-xs text-muted-foreground">
                  Mark this day as a rest day (no exercises)
                </p>
              </div>
              <Switch
                id="rest-day"
                checked={isRestDay}
                onCheckedChange={setIsRestDay}
              />
            </div>

            {isRestDay && exerciseCount > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      Warning: Exercises will be hidden
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      This day has {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}. 
                      Marking it as a rest day will hide them, but they won't be deleted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="day-notes" className="text-sm font-medium">Day Notes</Label>
              <Textarea
                id="day-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for this day (e.g., focus areas, reminders, modifications...)"
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Notes about this training day, special instructions, or reminders
              </p>
            </div>
          </div>

          {/* Exercise Summary */}
          {!isRestDay && exerciseCount > 0 && (
            <>
              <Separator />
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4" />
                  Exercise Summary ({exerciseCount} exercises)
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {dayData.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {index + 1}. {exercise.exercise_name || exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.default_sets || 3} × {exercise.default_reps || 10}
                          {exercise.default_weight && ` @ ${exercise.default_weight}kg`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!isRestDay && exerciseCount === 0 && (
            <>
              <Separator />
              <div className="text-center py-4">
                <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No exercises added to this day yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag exercises from the library to add them
                </p>
              </div>
            </>
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
