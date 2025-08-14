"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProfile } from '@/hooks/useProfile'
import { useLanguage } from '@/contexts/LanguageContext'
import { WORKOUT_AVAILABILITY_OPTIONS, GENDER_OPTIONS } from '@/types/profile.types'
import { translateEquipmentName } from '@/utils/translate-equipment'
import { Loader2, User, Dumbbell, Heart, AlertCircle, CheckCircle, ChevronDown, X, Plus, ArrowUp, ArrowDown, Calendar, FileText, Target, Asterisk, Search, Filter } from 'lucide-react'

// Required field label component
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="flex items-center gap-1">
    {children}
    <Asterisk className="h-3 w-3 text-destructive" />
  </Label>
)

// Form validation schema
const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  height_cm: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm').optional(),
  weight_kg: z.number().min(30, 'Weight must be at least 30kg').max(200, 'Weight must be less than 200kg').optional(),
  age: z.number().min(13, 'Must be at least 13 years old').max(100, 'Must be less than 100 years old').optional(),
  gender: z.enum(['male', 'female']).optional(),
  medical_notes: z.string().optional(),
  workout_availability: z.number().min(1).max(7).optional(),
  gym_access: z.boolean(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { t } = useLanguage()
  
  // Track if component has hydrated to prevent SSR mismatches
  const [isClient, setIsClient] = useState(false)
  const [todayString, setTodayString] = useState('')
  
  // Track changes in goals and equipment to enable save button
  const [hasGoalsChanged, setHasGoalsChanged] = useState(false)
  const [hasEquipmentChanged, setHasEquipmentChanged] = useState(false)
  
  // Equipment notes modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [selectedEquipmentForNotes, setSelectedEquipmentForNotes] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState('')
  
  // Goals details modal state
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<string | null>(null)
  const [tempGoalData, setTempGoalData] = useState<{
    target_date?: string
    notes?: string
  }>({})
  
  // Equipment modal state
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('')
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState<string>('all')
  
  useEffect(() => {
    setIsClient(true)
    setTodayString(new Date().toISOString().split('T')[0])
  }, [])
  
  const {
    profile,
    user,
    fitnessGoals,
    userFitnessGoals,
    equipment,
    userEquipment,
    loading,
    saving,
    error,
    updateProfile,
    updateFitnessGoals,
    updateEquipment,
    calculateProfileCompletion
  } = useProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      height_cm: (profile as unknown as {height_cm?: number})?.height_cm || undefined,
      weight_kg: (profile as unknown as {weight_kg?: number})?.weight_kg || undefined,
      age: (profile as unknown as {age?: number})?.age || undefined,
      gender: (profile as unknown as {gender?: 'male' | 'female'})?.gender || undefined,
      medical_notes: (profile as unknown as {medical_notes?: string})?.medical_notes || '',
      workout_availability: (profile as unknown as {workout_availability?: number})?.workout_availability || undefined,
      gym_access: (profile as unknown as {gym_access?: boolean})?.gym_access || false,
    }
  })

  // Initialize selected goals and equipment from profile data
  const [selectedGoals, setSelectedGoals] = useState([] as Array<{
    fitness_goal_id: string
    priority: number
    target_date?: string
    notes?: string
  }>)

  const [selectedEquipment, setSelectedEquipment] = useState([] as Array<{
    equipment_id: string
    location: 'home' | 'gym' | 'both'
    notes?: string
  }>)

  // Sync form data when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        height_cm: (profile as unknown as {height_cm?: number}).height_cm || undefined,
        weight_kg: (profile as unknown as {weight_kg?: number}).weight_kg || undefined,
        age: (profile as unknown as {age?: number}).age || undefined,
        gender: (profile as unknown as {gender?: 'male' | 'female'}).gender || undefined,
        medical_notes: (profile as unknown as {medical_notes?: string}).medical_notes || '',
        workout_availability: (profile as unknown as {workout_availability?: number}).workout_availability || undefined,
        gym_access: (profile as unknown as {gym_access?: boolean}).gym_access || false,
      })
    }
  }, [profile, reset])

  // Sync goals and equipment when profile data loads
  useEffect(() => {
    if (userFitnessGoals.length > 0) {
      setSelectedGoals(userFitnessGoals.map(goal => ({
        fitness_goal_id: goal.fitness_goal_id,
        priority: goal.priority,
        target_date: goal.target_date || undefined,
        notes: goal.notes || undefined
      })).sort((a, b) => a.priority - b.priority))
    }
  }, [userFitnessGoals])

  useEffect(() => {
    if (userEquipment.length > 0) {
      setSelectedEquipment(userEquipment.map(eq => ({
        equipment_id: eq.equipment_id,
        location: eq.location as 'home' | 'gym' | 'both',
        notes: eq.notes || undefined
      })))
    }
  }, [userEquipment])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Update basic profile info
      await updateProfile({
        full_name: data.full_name,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        age: data.age,
        gender: data.gender,
        medical_notes: data.medical_notes,
        workout_availability: data.workout_availability,
        gym_access: data.gym_access,
      })

      // Update fitness goals if changed
      if (hasGoalsChanged) {
        await updateFitnessGoals(selectedGoals)
      }

      // Update equipment if changed
      if (hasEquipmentChanged) {
        await updateEquipment(selectedEquipment)
      }
      
      // Reset change flags after successful save
      setHasGoalsChanged(false)
      setHasEquipmentChanged(false)
      
      // Success feedback could be added here
    } catch (err) {
      console.error('Error saving profile:', err)
    }
  }

  const handleGoalAdd = (goalId: string) => {
    setSelectedGoals(prev => {
      // Don't add if already exists
      if (prev.find(g => g.fitness_goal_id === goalId)) return prev
      
      const newGoal = {
        fitness_goal_id: goalId,
        priority: prev.length + 1,
        target_date: undefined,
        notes: undefined
      }
      setHasGoalsChanged(true)
      return [...prev, newGoal]
    })
  }

  const handleGoalRemove = (goalId: string) => {
    setSelectedGoals(prev => {
      const filtered = prev.filter(g => g.fitness_goal_id !== goalId)
      // Reorder priorities
      setHasGoalsChanged(true)
      return filtered.map((goal, index) => ({
        ...goal,
        priority: index + 1
      }))
    })
  }

  const handleGoalUpdate = (goalId: string, updates: Partial<{ target_date?: string; notes?: string }>) => {
    setSelectedGoals(prev => 
      prev.map(goal => 
        goal.fitness_goal_id === goalId 
          ? { ...goal, ...updates }
          : goal
      )
    )
    setHasGoalsChanged(true)
  }

  const moveGoalPriority = (goalId: string, direction: 'up' | 'down') => {
    setSelectedGoals(prev => {
      const currentIndex = prev.findIndex(g => g.fitness_goal_id === goalId)
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newArray = [...prev]
      const temp = newArray[currentIndex]
      newArray[currentIndex] = newArray[newIndex]
      newArray[newIndex] = temp
      
      // Update priorities based on new positions
      setHasGoalsChanged(true)
      return newArray.map((goal, index) => ({
        ...goal,
        priority: index + 1
      }))
    })
  }

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => {
      const existing = prev.find(eq => eq.equipment_id === equipmentId)
      setHasEquipmentChanged(true)
      if (existing) {
        return prev.filter(eq => eq.equipment_id !== equipmentId)
      } else {
        return [...prev, { equipment_id: equipmentId, location: 'home' }]
      }
    })
  }

  const updateEquipmentLocation = (equipmentId: string, location: 'home' | 'gym' | 'both') => {
    setSelectedEquipment(prev => 
      prev.map(eq => 
        eq.equipment_id === equipmentId 
          ? { ...eq, location }
          : eq
      )
    )
    setHasEquipmentChanged(true)
  }

  const updateEquipmentNotes = (equipmentId: string, notes: string) => {
    setSelectedEquipment(prev => 
      prev.map(eq => 
        eq.equipment_id === equipmentId 
          ? { ...eq, notes: notes || undefined }
          : eq
      )
    )
    setHasEquipmentChanged(true)
  }

  const openNotesModal = (equipmentId: string) => {
    const equipment = selectedEquipment.find(eq => eq.equipment_id === equipmentId)
    setSelectedEquipmentForNotes(equipmentId)
    setTempNotes(equipment?.notes || '')
    setNotesModalOpen(true)
  }

  const saveNotes = () => {
    if (selectedEquipmentForNotes) {
      updateEquipmentNotes(selectedEquipmentForNotes, tempNotes)
    }
    setNotesModalOpen(false)
    setSelectedEquipmentForNotes(null)
    setTempNotes('')
  }

  const cancelNotes = () => {
    setNotesModalOpen(false)
    setSelectedEquipmentForNotes(null)
    setTempNotes('')
  }

  const openGoalModal = (goalId: string) => {
    const goal = selectedGoals.find(g => g.fitness_goal_id === goalId)
    setSelectedGoalForEdit(goalId)
    setTempGoalData({
      target_date: goal?.target_date || '',
      notes: goal?.notes || ''
    })
    setGoalModalOpen(true)
  }

  const saveGoalData = () => {
    if (selectedGoalForEdit) {
      handleGoalUpdate(selectedGoalForEdit, tempGoalData)
    }
    setGoalModalOpen(false)
    setSelectedGoalForEdit(null)
    setTempGoalData({})
  }

  const cancelGoalData = () => {
    setGoalModalOpen(false)
    setSelectedGoalForEdit(null)
    setTempGoalData({})
  }
  
  // Equipment modal handlers
  const openEquipmentModal = () => {
    setEquipmentSearchTerm('')
    setEquipmentCategoryFilter('all')
    setEquipmentModalOpen(true)
  }
  
  const closeEquipmentModal = () => {
    setEquipmentModalOpen(false)
    setEquipmentSearchTerm('')
    setEquipmentCategoryFilter('all')
  }
  
  // Filter equipment based on search term and category
  const filteredEquipment = equipment.filter(eq => {
    const translatedName = translateEquipmentName(eq.name, t)
    const matchesSearch = eq.name.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
                         translatedName.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
                         (eq.category || '').toLowerCase().includes(equipmentSearchTerm.toLowerCase())
    const matchesCategory = equipmentCategoryFilter === 'all' || eq.category === equipmentCategoryFilter
    return matchesSearch && matchesCategory
  })
  
  // Get unique categories for filter
  const equipmentCategories = [...new Set(equipment.map(eq => eq.category).filter(Boolean))].sort()

  // Helper function to convert fitness goal names to translation keys
  const getGoalTranslationKey = (goalName: string): string => {
    const keyMap: { [key: string]: string } = {
      'Weight Loss': 'weightLoss',
      'Muscle Gain': 'muscleGain', 
      'Endurance Improvement': 'enduranceImprovement',
      'General Fitness': 'generalFitness',
      'Strength Building': 'strengthBuilding',
      'Toning & Definition': 'toningDefinition',
      'Flexibility & Mobility': 'flexibilityMobility',
      'Sport-Specific Training': 'sportSpecificTraining'
    }
    
    return keyMap[goalName] || goalName.toLowerCase().replace(/\s+/g, '')
  }

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Page Header with Profile Completeness */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
          <p className="text-muted-foreground">
            {calculateProfileCompletion.isComplete ? t('profile.profileComplete') : t('profile.profileIncomplete')}
          </p>
        </div>
        
        {/* Profile Completeness Status */}
        <div className="flex items-center gap-3">
          {/* Completion Percentage with Icon */}
          <div className="flex items-center gap-2">
            {calculateProfileCompletion.isComplete ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">100%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{calculateProfileCompletion.completionPercentage}%</span>
              </div>
            )}
          </div>
          
          {/* Required Fields Counter */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground border-l pl-3">
            <span className="font-medium">
              {calculateProfileCompletion.requiredFields.length - calculateProfileCompletion.missingFields.length}/{calculateProfileCompletion.requiredFields.length}
            </span>
            <span>{t('profile.requiredFields')}</span>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal & Physical Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              {t('profile.personalInfo')} & {t('profile.physicalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel>{t('profile.fullName')}</RequiredLabel>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder={t('profile.fullName')}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('profile.email')}</Label>
                <Input value={user?.email || ''} disabled className="bg-muted" />
              </div>
            </div>
            
            {/* Physical Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <RequiredLabel>{t('profile.height')}</RequiredLabel>
                <Input
                  id="height_cm"
                  type="number"
                  {...register('height_cm', { valueAsNumber: true })}
                  placeholder="180"
                />
                {errors.height_cm && (
                  <p className="text-xs text-destructive">{errors.height_cm.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <RequiredLabel>{t('profile.weight')}</RequiredLabel>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  {...register('weight_kg', { valueAsNumber: true })}
                  placeholder="70.5"
                />
                {errors.weight_kg && (
                  <p className="text-xs text-destructive">{errors.weight_kg.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <RequiredLabel>{t('profile.age')}</RequiredLabel>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="25"
                />
                {errors.age && (
                  <p className="text-xs text-destructive">{errors.age.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <RequiredLabel>{t('profile.gender')}</RequiredLabel>
                <Select value={watch('gender')} onValueChange={(value) => setValue('gender', value as 'male' | 'female')}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('profile.genderPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(`profile.${option.key}` as keyof typeof import('@/locales/en/profile').profile)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fitness Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-4 w-4" />
              {t('profile.fitnessInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fitness Goals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <RequiredLabel>{t('profile.fitnessGoals')}</RequiredLabel>
                <Badge variant="secondary" className="text-xs">
                  {selectedGoals.length} {t('profile.goalsSelected')}
                </Badge>
              </div>
              
              {/* Goal Selection */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Plus className="h-3 w-3" />
                      {t('profile.addNewGoal')}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>{t('profile.availableGoals')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fitnessGoals.map(goal => {
                    const isSelected = selectedGoals.some(g => g.fitness_goal_id === goal.id)
                    return (
                      <DropdownMenuItem
                        key={goal.id}
                        onClick={() => !isSelected && handleGoalAdd(goal.id)}
                        className={`flex items-center justify-between cursor-pointer ${isSelected ? 'opacity-50' : ''}`}
                        disabled={isSelected}
                      >
                        <span>{t(`fitnessGoals.${getGoalTranslationKey(goal.name)}` as keyof typeof import('@/locales/en').en.fitnessGoals)}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Selected Goals as Badges */}
              {selectedGoals.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{t('profile.yourGoals')} ({t('profile.priorityOrder')})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGoals.map((selectedGoal, index) => {
                      const goal = fitnessGoals.find(g => g.id === selectedGoal.fitness_goal_id)
                      if (!goal) return null
                      
                      const hasRequiredData = selectedGoal.target_date
                      const hasNotes = selectedGoal.notes && selectedGoal.notes.length > 0
                      
                      return (
                        <div key={selectedGoal.fitness_goal_id} className="group">
                          <Badge 
                            variant="secondary" 
                            className="flex items-center gap-1.5 px-2 py-1 text-xs"
                          >
                            {/* Priority Number */}
                            <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            
                            {/* Goal Name */}
                            <span className="font-medium text-xs">
                              {t(`fitnessGoals.${getGoalTranslationKey(goal.name)}` as keyof typeof import('@/locales/en').en.fitnessGoals)}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              {/* Target Date Status */}
                              <span 
                                className={`w-1.5 h-1.5 rounded-full ${hasRequiredData ? 'bg-emerald-500' : 'bg-destructive'}`} 
                                title={hasRequiredData ? t('profile.hasTargetDate') : t('profile.missingTargetDate')} 
                              />
                              
                              {/* Priority Controls */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-3 w-3 p-0 hover:bg-transparent"
                                onClick={() => moveGoalPriority(goal.id, 'up')}
                                disabled={index === 0}
                                title={t('profile.movePriorityUp')}
                              >
                                <ArrowUp className="h-2 w-2" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-3 w-3 p-0 hover:bg-transparent"
                                onClick={() => moveGoalPriority(goal.id, 'down')}
                                disabled={index === selectedGoals.length - 1}
                                title={t('profile.movePriorityDown')}
                              >
                                <ArrowDown className="h-2 w-2" />
                              </Button>
                              
                              {/* Edit Details Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-3 w-3 p-0 hover:bg-transparent ${hasRequiredData ? 'text-emerald-600' : 'text-amber-600'}`}
                                onClick={() => openGoalModal(goal.id)}
                                title={hasRequiredData ? t('profile.editGoalDetails') : t('profile.addGoalDetails')}
                              >
                                <Calendar className="h-2 w-2" />
                              </Button>
                              
                              {/* Notes Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-3 w-3 p-0 hover:bg-transparent ${hasNotes ? 'text-emerald-600' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => openGoalModal(goal.id)}
                                title={hasNotes ? t('profile.hasNotes') : t('profile.addNotes')}
                              >
                                <FileText className="h-2 w-2" />
                              </Button>
                              
                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-3 w-3 p-0 hover:bg-transparent text-muted-foreground hover:text-destructive"
                                onClick={() => handleGoalRemove(goal.id)}
                                title={t('profile.removeGoal')}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </div>
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {selectedGoals.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">{t('profile.noGoalsSelected')}</p>
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Workout Availability & Gym Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel>{t('profile.workoutAvailability')}</RequiredLabel>
                <Select 
                  value={watch('workout_availability')?.toString()} 
                  onValueChange={(value) => setValue('workout_availability', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('profile.workoutAvailabilityPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKOUT_AVAILABILITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {t(`profile.${option.key}` as keyof typeof import('@/locales/en/profile').profile)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="gym_access"
                  checked={watch('gym_access')}
                  onCheckedChange={(checked) => setValue('gym_access', !!checked)}
                />
                <Label htmlFor="gym_access">{t('profile.gymAccessLabel')}</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Access */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CardTitle className="flex items-center gap-1 text-lg">
                  <Dumbbell className="h-4 w-4" />
                  {t('profile.equipmentAccessTitle')}
                  <Asterisk className="h-3 w-3 text-destructive" />
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedEquipment.length} {t('profile.selected')}
              </Badge>
            </div>
            <CardDescription className="text-xs">{t('profile.equipmentAccessHelp')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Equipment Selection Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between" 
              onClick={openEquipmentModal}
            >
              <span className="flex items-center gap-2">
                <Plus className="h-3 w-3" />
                {t('profile.addEquipment')}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>

            {/* Selected Equipment as Badges */}
            {selectedEquipment.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t('profile.selectedEquipment')}</Label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEquipment.map(selected => {
                    const eq = equipment.find(e => e.id === selected.equipment_id)
                    if (!eq) return null
                    
                    return (
                      <div key={selected.equipment_id} className="group">
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1.5 px-2 py-1 text-xs"
                        >
                          <span className="text-xs">{translateEquipmentName(eq.name, t)}</span>
                          <div className="flex items-center gap-0.5">
                            {/* Location indicator */}
                            <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                              selected.location === 'home' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                : selected.location === 'gym'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            }`}>
                              {selected.location === 'home' 
                                ? 'H'
                                : selected.location === 'gym'
                                ? 'G'
                                : 'B'
                              }
                            </span>
                            
                            {/* Location change dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-3 w-3 p-0 hover:bg-transparent">
                                  <ChevronDown className="h-2 w-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => updateEquipmentLocation(eq.id, 'home')}
                                  className={selected.location === 'home' ? 'bg-accent' : ''}
                                >
                                  {t('profile.equipmentLocationHome')}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateEquipmentLocation(eq.id, 'gym')}
                                  className={selected.location === 'gym' ? 'bg-accent' : ''}
                                >
                                  {t('profile.equipmentLocationGym')}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateEquipmentLocation(eq.id, 'both')}
                                  className={selected.location === 'both' ? 'bg-accent' : ''}
                                >
                                  {t('profile.equipmentLocationBoth')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Notes button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-3 w-3 p-0 hover:bg-transparent ${
                                selected.notes ? 'text-emerald-600' : 'text-muted-foreground hover:text-foreground'
                              }`}
                              onClick={() => openNotesModal(eq.id)}
                              title={selected.notes ? t('profile.hasNotes') : t('profile.addNotes')}
                            >
                              <FileText className="h-2 w-2" />
                            </Button>
                            
                            {/* Remove button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-3 w-3 p-0 hover:bg-transparent text-muted-foreground hover:text-destructive"
                              onClick={() => handleEquipmentToggle(eq.id)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-4 w-4" />
              {t('profile.medicalInfo')}
            </CardTitle>
            <CardDescription className="text-xs">{t('profile.medicalNotesHelp')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="medical_notes" className="text-sm">{t('profile.medicalNotes')}</Label>
              <Textarea
                id="medical_notes"
                {...register('medical_notes')}
                placeholder={t('profile.medicalNotesPlaceholder')}
                rows={3}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={saving || (!isDirty && !hasGoalsChanged && !hasEquipmentChanged)}
            size="sm"
            className="min-w-28"
          >
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-2" />
                {t('profile.updateProfile')}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Equipment Selection Modal */}
      <Dialog open={equipmentModalOpen} onOpenChange={setEquipmentModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              {t('profile.selectEquipment')}
            </DialogTitle>
            <DialogDescription>
              {t('profile.equipmentAccessHelp')}
            </DialogDescription>
          </DialogHeader>
          
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`${t('common.search')} ${t('profile.equipment')}...`}
                  value={equipmentSearchTerm}
                  onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={equipmentCategoryFilter} onValueChange={setEquipmentCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {equipmentCategories.map(category => (
                    <SelectItem key={category} value={category || ''}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Equipment Grid */}
          <div className="overflow-y-auto max-h-[50vh] border rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
              {filteredEquipment.map(eq => {
                const isSelected = selectedEquipment.find(sel => sel.equipment_id === eq.id)
                return (
                  <div
                    key={eq.id}
                    onClick={() => handleEquipmentToggle(eq.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      isSelected ? 'bg-accent border-primary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{translateEquipmentName(eq.name, t)}</span>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{eq.category}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {filteredEquipment.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('common.noResults')}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              {selectedEquipment.length} {t('profile.selected')}
            </span>
            <Button onClick={closeEquipmentModal}>
              {t('common.done')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Equipment Notes Modal */}
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('profile.equipmentNotes')}
            </DialogTitle>
            <DialogDescription>
              {selectedEquipmentForNotes && (() => {
                const eq = equipment.find(e => e.id === selectedEquipmentForNotes)
                return eq ? `${t('profile.addNotesFor')} ${translateEquipmentName(eq.name, t) || t('profile.equipment')}` : ''
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('profile.equipmentNotesPlaceholder')}</Label>
              <Textarea
                placeholder={t('profile.equipmentNotesPlaceholder')}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground text-right">
                {tempNotes.length}/200
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelNotes}>
                {t('common.cancel')}
              </Button>
              <Button onClick={saveNotes}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Details Modal */}
      <Dialog open={goalModalOpen} onOpenChange={setGoalModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('profile.goalDetails')}
            </DialogTitle>
            <DialogDescription>
              {selectedGoalForEdit && (() => {
                const goal = fitnessGoals.find(g => g.id === selectedGoalForEdit)
                return goal ? `${t('profile.editDetailsFor')} ${t(`fitnessGoals.${getGoalTranslationKey(goal.name)}` as keyof typeof import('@/locales/en').en.fitnessGoals)}` : ''
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Target Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {t('profile.targetDate')} 
                <Asterisk className="h-3 w-3 text-destructive" />
              </Label>
              <Input
                type="date"
                value={tempGoalData.target_date || ''}
                onChange={(e) => setTempGoalData(prev => ({ ...prev, target_date: e.target.value }))}
                min={isClient ? todayString : undefined}
              />
              {/* Quick Date Presets */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: t('profile.oneMonth'), months: 1 },
                  { label: t('profile.threeMonths'), months: 3 },
                  { label: t('profile.sixMonths'), months: 6 },
                ].map(preset => (
                  <Button
                    key={preset.months}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      if (!isClient) return
                      const targetDate = new Date()
                      targetDate.setMonth(targetDate.getMonth() + preset.months)
                      setTempGoalData(prev => ({ 
                        ...prev, 
                        target_date: targetDate.toISOString().split('T')[0] 
                      }))
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {t('profile.goalNotes')} ({t('profile.optional')})
              </Label>
              <Textarea
                placeholder={t('profile.goalNotesPlaceholder')}
                value={tempGoalData.notes || ''}
                onChange={(e) => setTempGoalData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {(tempGoalData.notes || '').length}/500
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelGoalData}>
                {t('common.cancel')}
              </Button>
              <Button onClick={saveGoalData}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
