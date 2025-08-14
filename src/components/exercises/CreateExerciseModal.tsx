"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Equipment, MuscleGroup } from '@/types/profile.types'

interface CreateExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  equipment: Equipment[]
  muscleGroups: MuscleGroup[]
}

export function CreateExerciseModal({ isOpen, onClose, equipment, muscleGroups }: CreateExerciseModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('exercises.createCustom')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Custom exercise creation will be implemented in the next iteration.
          </p>
          
          <div className="flex justify-end">
            <Button onClick={onClose}>{t('common.cancel')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

