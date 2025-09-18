'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useExercises } from '@/hooks/useExercises'
import { ExerciseWithDetails } from '@/types/profile.types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Dumbbell, 
  GripVertical,
  Zap,
  Target,
  Settings
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ExerciseLibrarySidebarProps {
  onDragStart: (exercise: ExerciseWithDetails) => void
  onDragEnd: () => void
  isDragging: boolean
}

export function ExerciseLibrarySidebar({ onDragStart, onDragEnd, isDragging }: ExerciseLibrarySidebarProps) {
  const { t } = useLanguage()
  const { searchResults, loading, searchExercises } = useExercises()
  const exercises = searchResults?.exercises || []
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all')
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    // Return empty array if exercises is undefined or null
    if (!exercises || !Array.isArray(exercises)) {
      return []
    }

    let filtered = exercises

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty_level === selectedDifficulty)
    }

    // TODO: Add muscle group and equipment filtering once we have the data structure

    return filtered
  }, [exercises, searchTerm, selectedDifficulty, selectedMuscleGroup, selectedEquipment])

  const handleDragStart = (e: React.DragEvent, exercise: ExerciseWithDetails) => {
    e.dataTransfer.setData('exercise', JSON.stringify(exercise))
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart(exercise)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="h-full flex flex-col border-r bg-background">
      {/* Header */}
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold flex items-center">
          <Dumbbell className="h-4 w-4 mr-2" />
          Exercise Library
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag to add
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-3 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('workouts.searchExercises')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('workouts.filterExercises')}
        </Button>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-2 pt-1">
            <Separator />
            
            {/* Difficulty Filter */}
            <div>
              <label className="text-xs font-medium mb-1 block">
                Difficulty
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDifficulty('all')
                setSelectedMuscleGroup('all')
                setSelectedEquipment('all')
                setSearchTerm('')
              }}
              className="w-full h-7 text-xs"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Exercise List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading || !exercises ? (
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-6">
              <Dumbbell className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                No exercises found
              </p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className={`cursor-grab hover:shadow-sm transition-all duration-200 ${
                  isDragging ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, exercise)}
                onDragEnd={handleDragEnd}
              >
                <CardContent className="p-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-medium text-xs truncate">{exercise.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs py-0 px-1 ${getDifficultyColor(exercise.difficulty_level)}`}
                        >
                          <Zap className="h-2 w-2 mr-1" />
                          {exercise.difficulty_level}
                        </Badge>
                        
                        {/* Muscle groups - simplified for now */}
                        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                          <Badge variant="outline" className="text-xs py-0 px-1">
                            <Target className="h-2 w-2 mr-1" />
                            {exercise.muscle_groups[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-2 border-t bg-muted/50">
        <div className="text-xs text-muted-foreground text-center">
          {filteredExercises?.length || 0} exercises
          {searchTerm || selectedDifficulty !== 'all' ? ` (filtered)` : ''}
        </div>
      </div>
    </div>
  )
}
