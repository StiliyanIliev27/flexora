'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface RemoveExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean>
  exerciseName: string
}

export function RemoveExerciseModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  exerciseName 
}: RemoveExerciseModalProps) {
  const { t } = useLanguage()

  const handleConfirm = async () => {
    const success = await onConfirm()
    if (success) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('workouts.confirmDeleteExercise')}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{exerciseName}</strong> from this workout day? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {t('common.remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
