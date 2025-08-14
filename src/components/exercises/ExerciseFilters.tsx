"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Equipment, MuscleGroup, ExerciseFilters as ExerciseFiltersType } from '@/types/profile.types'

interface ExerciseFiltersProps {
  equipment: Equipment[]
  muscleGroups: MuscleGroup[]
  filters: ExerciseFiltersType
  onFiltersChange: (filters: Partial<ExerciseFiltersType>) => void
  onClose: () => void
}

export function ExerciseFilters({ equipment, muscleGroups, filters, onFiltersChange, onClose }: ExerciseFiltersProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{t('exercises.filters')}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Advanced filtering will be implemented in the next iteration.
          </p>
          <p className="text-xs text-muted-foreground">
            For now, use the search bar to find exercises by name or description.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

