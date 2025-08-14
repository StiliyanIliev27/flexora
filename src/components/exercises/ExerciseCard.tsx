"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Dumbbell, User, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ExerciseWithDetails } from '@/types/profile.types'
import { translateEquipmentName } from '@/utils/translate-equipment'
import Image from 'next/image'

interface ExerciseCardProps {
  exercise: ExerciseWithDetails
  viewMode: 'grid' | 'list'
  onClick: () => void
}

export function ExerciseCard({ exercise, viewMode, onClick }: ExerciseCardProps) {
  const { t } = useLanguage()

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

  const primaryMuscles = exercise.muscle_group_details?.primary || []
  const equipmentList = exercise.equipment_details || []
  const isCustom = !!exercise.created_by

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {/* Exercise Image */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {exercise.image_url ? (
                <Image
                  src={exercise.image_url}
                  alt={exercise.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {/* Exercise Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">{exercise.name}</h3>
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {exercise.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className={getDifficultyColor(exercise.difficulty_level)}>
                      {t(`exercises.${exercise.difficulty_level}` as any)}
                    </Badge>
                    
                    {primaryMuscles.slice(0, 2).map(muscle => (
                      <Badge key={muscle.id} variant="outline">
                        {muscle.name}
                      </Badge>
                    ))}
                    
                    {primaryMuscles.length > 2 && (
                      <Badge variant="outline">
                        +{primaryMuscles.length - 2}
                      </Badge>
                    )}
                    
                    {isCustom && (
                      <Badge variant="secondary">
                        <User className="h-3 w-3 mr-1" />
                        {t('exercises.custom')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Equipment & Actions */}
                <div className="flex flex-col items-end gap-2">
                  {equipmentList.length > 0 && (
                    <div className="text-xs text-muted-foreground text-right">
                      {equipmentList.slice(0, 2).map(eq => eq.name).join(', ')}
                      {equipmentList.length > 2 && ` +${equipmentList.length - 2}`}
                    </div>
                  )}
                  
                  {exercise.video_url && (
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      {t('exercises.watchVideo')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow group" onClick={onClick}>
      <CardHeader className="pb-3">
        {/* Exercise Image */}
        <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center mb-3 overflow-hidden">
          {exercise.image_url ? (
            <Image
              src={exercise.image_url}
              alt={exercise.name}
              width={200}
              height={128}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <Dumbbell className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <CardTitle className="text-lg line-clamp-2 leading-tight">
          {exercise.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Description */}
        {exercise.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {exercise.description}
          </p>
        )}

        {/* Tags */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1">
            <Badge className={getDifficultyColor(exercise.difficulty_level)}>
              {t(`exercises.${exercise.difficulty_level}` as any)}
            </Badge>
            
            {isCustom && (
              <Badge variant="secondary">
                <User className="h-3 w-3 mr-1" />
                {t('exercises.custom')}
              </Badge>
            )}
          </div>
          
          {/* Primary muscles */}
          {primaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {primaryMuscles.slice(0, 3).map(muscle => (
                <Badge key={muscle.id} variant="outline" className="text-xs">
                  {muscle.name}
                </Badge>
              ))}
              {primaryMuscles.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{primaryMuscles.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Equipment */}
        {equipmentList.length > 0 && (
          <div className="text-xs text-muted-foreground mb-3">
            <strong>{t('exercises.equipmentNeeded')}:</strong><br />
            {equipmentList.slice(0, 2).map(eq => translateEquipmentName(eq.name, t)).join(', ')}
            {equipmentList.length > 2 && ` +${equipmentList.length - 2}`}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {exercise.video_url && (
            <Button size="sm" variant="outline" className="flex-1">
              <Play className="h-3 w-3 mr-1" />
              {t('exercises.watchVideo')}
            </Button>
          )}
          
          <Button size="sm" variant="secondary" className="flex-1">
            {t('exercises.addToWorkout')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

