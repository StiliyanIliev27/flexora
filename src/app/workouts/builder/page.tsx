'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
  import { useLanguage } from '@/contexts/LanguageContext'
import { useWorkoutPlanBuilder } from '@/hooks/useWorkoutPlanBuilder'
import { WorkoutBuilderLayout } from '@/components/workouts/WorkoutBuilderLayout'
import { WorkoutPlanFormData } from '@/types/workout.types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function WorkoutBuilderPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const planId = searchParams?.get('plan')
  const { loadPlan, isLoading } = useWorkoutPlanBuilder()
  
  const [isClient, setIsClient] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlanFormData>({
    name: '',
    description: '',
    duration_weeks: 4,
    is_active: false,
  })

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load existing plan if planId is provided
  useEffect(() => {
    const loadExistingPlan = async () => {
      if (planId && isClient) {
        const planData = await loadPlan(planId)
        if (planData) {
          setCurrentPlan({
            name: planData.name,
            description: planData.description || '',
            duration_weeks: planData.duration_weeks,
            is_active: planData.is_active,
          })
        }
      } else if (isClient && !planId) {
        // Reset to empty plan when no planId
        setCurrentPlan({
          name: '',
          description: '',
          duration_weeks: 4,
          is_active: false,
        })
      }
    }

    loadExistingPlan()
  }, [planId, isClient, loadPlan])

  // Handle plan data changes
  const handlePlanChange = (updates: Partial<WorkoutPlanFormData>) => {
    setCurrentPlan(prev => ({ ...prev, ...updates }))
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    {t('nav.dashboard')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/workouts/plans">
                    {t('nav.workoutPlans')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('nav.planBuilder')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4">
            <HeaderControls hasNotifications={true} />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Page Title */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Manual Workout Builder</h1>
                <p className="text-muted-foreground">
                  Create and customize your personalized workout plans
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {t('workouts.duration')}: {currentPlan.duration_weeks} {t('workouts.durationWeeks').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Workout Builder Content */}
          <div className="flex-1 min-h-0">
            {(!isClient || isLoading) ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <WorkoutBuilderLayout 
                currentPlan={currentPlan}
                onPlanChange={handlePlanChange}
                planId={planId || undefined}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
