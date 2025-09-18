'use client'

import { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
import { useLanguage } from '@/contexts/LanguageContext'
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans'
import { DeletePlanModal } from '@/components/workouts/DeletePlanModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Calendar, Clock, Dumbbell, Edit, Trash2, Play, AlertCircle, Power, PowerOff } from 'lucide-react'
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
import Link from 'next/link'

export default function WorkoutPlansPage() {
  const { t } = useLanguage()
  const { plans, stats, loading, error, deletePlan, togglePlanActive } = useWorkoutPlans()
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    planId: string
    planName: string
  }>({
    isOpen: false,
    planId: '',
    planName: ''
  })

  const handleDeleteClick = (planId: string, planName: string) => {
    setDeleteModal({
      isOpen: true,
      planId,
      planName
    })
  }

  const handleDeleteConfirm = async (): Promise<boolean> => {
    const success = await deletePlan(deleteModal.planId)
    if (success) {
      setDeleteModal({ isOpen: false, planId: '', planName: '' })
    }
    return success
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, planId: '', planName: '' })
  }

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    await togglePlanActive(planId, !currentStatus)
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('nav.workoutPlans')}</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold tracking-tight">{t('workouts.workoutPlans')}</h1>
                <p className="text-muted-foreground">
                  Manage your workout plans and track your training progress
                </p>
              </div>
              <Link href="/workouts/builder">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('workouts.createPlan')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <LoadingSkeleton />
          ) : plans.length === 0 ? (
            /* Empty State */
            <Card className="text-center py-12">
              <CardContent>
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('workouts.noPlansYet')}</h3>
                <p className="text-muted-foreground mb-4">{t('workouts.createFirstPlan')}</p>
                <Link href="/workouts/builder">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('workouts.createPlan')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            /* Plans Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {plan.description || 'No description'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(plan.id, plan.is_active)}
                          className="p-1"
                        >
                          {plan.is_active ? (
                            <Power className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <PowerOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? t('workouts.isActive') : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Plan Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {plan.duration_weeks} {plan.duration_weeks === 1 ? 'week' : 'weeks'}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Dumbbell className="h-4 w-4 mr-2" />
                        {plan.totalExercises} {t('workouts.exercises').toLowerCase()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {plan.estimatedDuration} min/session
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {plan.trainingDays}/7 days
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/workouts/builder?plan=${plan.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          {t('workouts.edit')}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!plan.is_active}
                        title={!plan.is_active ? 'Activate plan to start workout' : 'Start workout session'}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t('workouts.start')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(plan.id, plan.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {plans.length > 0 && !loading && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('workouts.totalExercises')}</p>
                      <p className="text-2xl font-bold">{stats.totalExercises}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Power className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Plans</p>
                      <p className="text-2xl font-bold text-emerald-600">{stats.activePlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      <p className="text-2xl font-bold">{stats.avgDuration}m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Plans</p>
                      <p className="text-2xl font-bold">{stats.totalPlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SidebarInset>

      {/* Delete Confirmation Modal */}
      <DeletePlanModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        planName={deleteModal.planName}
      />
    </SidebarProvider>
  )
}
