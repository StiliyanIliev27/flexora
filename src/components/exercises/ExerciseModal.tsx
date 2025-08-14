"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Dumbbell, Heart, User } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ExerciseWithDetails } from '@/types/profile.types'
import { translateEquipmentName } from '@/utils/translate-equipment'
import Image from 'next/image'

interface ExerciseModalProps {
  exercise: ExerciseWithDetails
  isOpen: boolean
  onClose: () => void
}

export function ExerciseModal({ exercise, isOpen, onClose }: ExerciseModalProps) {
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
  const secondaryMuscles = exercise.muscle_group_details?.secondary || []
  const equipmentList = exercise.equipment_details || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Image */}
          {exercise.image_url && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-muted">
              <Image
                src={exercise.image_url}
                alt={exercise.name}
                width={400}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty_level)}>
              {t(`exercises.${exercise.difficulty_level}` as any)}
            </Badge>
            
            {exercise.created_by && (
              <Badge variant="secondary">
                <User className="h-3 w-3 mr-1" />
                {t('exercises.custom')}
              </Badge>
            )}
          </div>

          {/* Description */}
          {exercise.description && (
            <div>
              <h3 className="font-semibold mb-2">{t('exercises.description')}</h3>
              <p className="text-muted-foreground">{exercise.description}</p>
            </div>
          )}

          {/* Muscle Groups */}
          {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
            <div>
              <h3 className="font-semibold mb-3">{t('exercises.muscleGroups')}</h3>
              <div className="space-y-2">
                {primaryMuscles.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('exercises.primaryMuscles')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {primaryMuscles.map(muscle => (
                        <Badge key={muscle.id} variant="default">
                          {muscle.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {secondaryMuscles.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t('exercises.secondaryMuscles')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {secondaryMuscles.map(muscle => (
                        <Badge key={muscle.id} variant="outline">
                          {muscle.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment */}
          {equipmentList.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{t('exercises.equipmentNeeded')}</h3>
              <div className="flex flex-wrap gap-1">
                {equipmentList.map(equipment => (
                  <Badge key={equipment.id} variant="outline">
                    <Dumbbell className="h-3 w-3 mr-1" />
                    {translateEquipmentName(equipment.name, t)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions && (
            <div>
              <h3 className="font-semibold mb-2">{t('exercises.instructions')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{exercise.instructions}</p>
            </div>
          )}

          {/* TODO: Add tips field to database schema and uncomment */}
          {/* {exercise.tips && (
            <div>
              <h3 className="font-semibold mb-2">{t('exercises.tips')}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{exercise.tips}</p>
            </div>
          )} */}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {exercise.video_url && (
              <Button asChild>
                <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4 mr-2" />
                  {t('exercises.watchVideo')}
                </a>
              </Button>
            )}
            
            <Button variant="secondary">
              <Heart className="h-4 w-4 mr-2" />
              {t('exercises.addToWorkout')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

