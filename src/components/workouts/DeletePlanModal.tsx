'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeletePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean>
  planName: string
}

export function DeletePlanModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  planName
}: DeletePlanModalProps) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const success = await onConfirm()
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Error during deletion:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">
                {t('workouts.confirmDelete')}
              </DialogTitle>
              <DialogDescription className="text-left">
                {t('workouts.deleteWarning')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">&ldquo;{planName}&rdquo;</span>? 
            This action cannot be undone and will permanently remove all workout days, exercises, and progress data.
          </p>
        </div>

        <DialogFooter className="gap-5 sm:gap-0">
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('workouts.deleting')}
                </>
              ) : (
                t('workouts.delete')
              )}
            </Button>
          </div>            
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

