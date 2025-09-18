'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWorkoutPlanBuilder } from '@/hooks/useWorkoutPlanBuilder'
import { WorkoutPlanFormData, WorkoutBuilderState } from '@/types/workout.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Settings, 
  FileText, 
  Calendar, 
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface WorkoutSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: WorkoutPlanFormData
  onPlanChange: (updates: Partial<WorkoutPlanFormData>) => void
  builderState: WorkoutBuilderState
  onStateChange: (updates: Partial<WorkoutBuilderState>) => void
  planId?: string // For editing existing plans
  onGetStatistics?: (planId: string) => Promise<any>
  onSaveTempExercises?: (planId: string, tempExercises: any[]) => Promise<boolean>
}

export function WorkoutSettingsModal({ 
  isOpen,
  onClose,
  currentPlan, 
  onPlanChange, 
  builderState, 
  onStateChange,
  planId,
  onGetStatistics,
  onSaveTempExercises
}: WorkoutSettingsModalProps) {
  const { t } = useLanguage()
  const { savePlan, isSaving, error } = useWorkoutPlanBuilder()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [statistics, setStatistics] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  const handleSave = async () => {
    try {
      setSaveError(null)
      const savedPlanId = await savePlan(currentPlan, planId)
      
      if (savedPlanId) {
        // If this is a new plan and we have temporary exercises, save them
        if (!planId && builderState.tempExercises && builderState.tempExercises.length > 0 && onSaveTempExercises) {
          console.log('Saving temporary exercises for new plan:', builderState.tempExercises.length)
          const exercisesSaved = await onSaveTempExercises(savedPlanId, builderState.tempExercises)
          
          if (exercisesSaved) {
            // Clear temp exercises from state
            onStateChange({ 
              unsavedChanges: false, 
              tempExercises: [] 
            })
            console.log('Successfully saved temporary exercises to database')
          } else {
            console.warn('Failed to save some temporary exercises')
          }
        } else {
          onStateChange({ unsavedChanges: false })
        }
        
        // Update the URL if this was a new plan (so we stay on the plan)
        if (!planId && savedPlanId) {
          const newUrl = `/workouts/builder?plan=${savedPlanId}`
          window.history.replaceState({}, '', newUrl)
        }
        
        // Don't close automatically - let user choose what to do next
        setSaveSuccess(true)
        
        // Show success toast
        const { toast } = await import('sonner')
        toast.success('Workout plan saved successfully')
      } else {
        setSaveError(error || 'Failed to save plan')
      }
    } catch (err) {
      console.error('Error saving plan:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save plan'
      setSaveError(errorMessage)
      
      // Show error toast
      const { toast } = await import('sonner')
      toast.error(errorMessage)
    }
  }

  const handleInputChange = (field: keyof WorkoutPlanFormData, value: any) => {
    onPlanChange({ [field]: value })
    onStateChange({ unsavedChanges: true })
  }

  // Load statistics when modal opens
  useEffect(() => {
    const loadStatistics = async () => {
      if (isOpen && planId && onGetStatistics) {
        setLoadingStats(true)
        try {
          const stats = await onGetStatistics(planId)
          setStatistics(stats)
        } catch (error) {
          console.error('Failed to load statistics:', error)
        } finally {
          setLoadingStats(false)
        }
      } else {
        setStatistics(null)
      }
    }

    if (isOpen) {
      setSaveSuccess(false)
      setSaveError(null)
      loadStatistics()
    }
  }, [isOpen, planId, onGetStatistics])

  const isFormValid = currentPlan.name.trim().length > 0 && currentPlan.duration_weeks > 0
  const tempExerciseCount = builderState.tempExercises?.length || 0
  const hasExercises = (statistics?.totalExercises > 0) || tempExerciseCount > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            {t('workouts.workoutPlans')} Settings
          </DialogTitle>
          <DialogDescription>
            Configure your workout plan details and preferences.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Error Alert */}
            {(saveError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{saveError || error}</AlertDescription>
              </Alert>
            )}

            {/* Plan Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Plan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">{t('workouts.planName')} *</Label>
                  <Input
                    id="plan-name"
                    value={currentPlan.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter plan name..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-description">{t('workouts.planDescription')}</Label>
                  <Textarea
                    id="plan-description"
                    value={currentPlan.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your workout plan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plan-duration">{t('workouts.durationWeeks')} *</Label>
                    <Select 
                      value={currentPlan.duration_weeks.toString()} 
                      onValueChange={(value) => handleInputChange('duration_weeks', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration..." />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 4, 6, 8, 12, 16, 20, 24].map(weeks => (
                          <SelectItem key={weeks} value={weeks.toString()}>
                            {weeks} {weeks === 1 ? 'week' : 'weeks'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plan-active">{t('workouts.isActive')}</Label>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">Make this plan active</span>
                      <Switch
                        id="plan-active"
                        checked={currentPlan.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('workouts.statistics')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingStats ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-xs text-muted-foreground mt-2">Loading statistics...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {(statistics?.totalExercises || 0) + tempExerciseCount}
                            {tempExerciseCount > 0 && (
                              <span className="text-xs text-amber-600 ml-1">
                                (+{tempExerciseCount} pending)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{t('workouts.totalExercises')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{statistics?.trainingDays || 0}</p>
                          <p className="text-xs text-muted-foreground">{t('workouts.trainingDays')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{statistics?.estimatedSessionTime || 0}m</p>
                          <p className="text-xs text-muted-foreground">Avg. session</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{Math.round((statistics?.weeklyTime || 0) / 60)}h</p>
                          <p className="text-xs text-muted-foreground">Per week</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Plan Status</p>
                      <div className="text-xs text-muted-foreground">
                        {(statistics?.totalExercises > 0 || tempExerciseCount > 0)
                          ? `${(statistics?.totalExercises || 0) + tempExerciseCount} exercises${statistics?.trainingDays > 0 ? ` across ${statistics.trainingDays} training days` : ''}${tempExerciseCount > 0 ? ` (${tempExerciseCount} pending save)` : ''}`
                          : 'No exercises added yet'
                        }
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Validation & Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Plan Validation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Plan name</span>
                    <Badge variant={currentPlan.name.trim() ? "secondary" : "destructive"}>
                      {currentPlan.name.trim() ? "✓" : "Required"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Duration set</span>
                    <Badge variant={currentPlan.duration_weeks > 0 ? "secondary" : "destructive"}>
                      {currentPlan.duration_weeks > 0 ? "✓" : "Required"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Has exercises</span>
                    <Badge variant={hasExercises ? "secondary" : "destructive"}>
                      {hasExercises ? "✓" : "Add exercises"}
                    </Badge>
                  </div>
                </div>

                {!isFormValid && (
                  <div className="p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-xs text-red-800 dark:text-red-200">
                      Complete required fields to save the plan
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {builderState.unsavedChanges && (
              <div className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved changes
              </div>
            )}
          </div>
          
          {saveSuccess ? (
            // Show navigation options after successful save
            <div className="flex gap-2 w-full">
              <Link href="/workouts/plans" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('workouts.backToPlans')}
                </Button>
              </Link>
              <Link href="/workouts/preview" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  {t('workouts.previewPlan')}
                </Button>
              </Link>
              <Button onClick={onClose} className="flex-1">
                {t('workouts.continueEditing')}
              </Button>
            </div>
          ) : (
            // Show regular save/cancel buttons
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isFormValid || isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : t('workouts.save')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
