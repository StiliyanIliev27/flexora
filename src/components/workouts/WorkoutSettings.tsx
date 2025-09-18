'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
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
import { 
  Settings, 
  Save, 
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

interface WorkoutSettingsProps {
  currentPlan: WorkoutPlanFormData
  onPlanChange: (updates: Partial<WorkoutPlanFormData>) => void
  builderState: WorkoutBuilderState
  onStateChange: (updates: Partial<WorkoutBuilderState>) => void
}

export function WorkoutSettings({ 
  currentPlan, 
  onPlanChange, 
  builderState, 
  onStateChange 
}: WorkoutSettingsProps) {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save functionality
    setTimeout(() => {
      setIsSaving(false)
      onStateChange({ unsavedChanges: false })
    }, 1000)
  }

  const handleInputChange = (field: keyof WorkoutPlanFormData, value: any) => {
    onPlanChange({ [field]: value })
    onStateChange({ unsavedChanges: true })
  }

  const isFormValid = currentPlan.name.trim().length > 0 && currentPlan.duration_weeks > 0

  // Show loading during hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="h-full flex flex-col border-l bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border-l bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          {t('workouts.workoutPlans')} Settings
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Plan Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Plan Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plan-name">{t('workouts.planName')} *</Label>
                <Input
                  id="plan-name"
                  value={currentPlan.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter plan name..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="plan-description">{t('workouts.planDescription')}</Label>
                <Textarea
                  id="plan-description"
                  value={currentPlan.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your workout plan..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="plan-duration">{t('workouts.durationWeeks')} *</Label>
                <Select 
                  value={currentPlan.duration_weeks.toString()} 
                  onValueChange={(value) => handleInputChange('duration_weeks', parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
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

              <div className="flex items-center justify-between">
                <Label htmlFor="plan-active">{t('workouts.isActive')}</Label>
                <Switch
                  id="plan-active"
                  checked={currentPlan.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
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
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">0</p>
                    <p className="text-xs text-muted-foreground">{t('workouts.totalExercises')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">5</p>
                    <p className="text-xs text-muted-foreground">{t('workouts.trainingDays')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">60m</p>
                    <p className="text-xs text-muted-foreground">Avg. session</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">5h</p>
                    <p className="text-xs text-muted-foreground">Per week</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Muscle Groups</p>
                <div className="text-xs text-muted-foreground">
                  No exercises added yet
                </div>
              </div>
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
                  <Badge variant="destructive">
                    Add exercises
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

      {/* Footer Actions */}
      <div className="p-4 border-t bg-muted/50">
        <div className="space-y-2">
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid || isSaving}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : t('workouts.save')}
          </Button>
          
          {builderState.unsavedChanges && (
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
