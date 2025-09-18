"use client"

import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
import { ExerciseLibrary } from "@/components/exercises/ExerciseLibrary"
import { useLanguage } from "@/contexts/LanguageContext"
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
import { LoadingSpinner } from '@/components/loading/LoadingSpinner'

export default function ExercisesPage() {
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  
  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
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
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('exercises.title')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4">
            <HeaderControls hasNotifications={true} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <ExerciseLibrary />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

