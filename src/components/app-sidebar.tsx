"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  Users,
  User,
  Calendar,
  Settings,
  FileText,
  Heart,
  Trophy,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { RoleSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

// Flexora navigation data
const getFlexoraNavigation = (userRole: "user" | "instructor", t: (key: any) => string) => {
  const baseNavigation = [
    {
      title: t('nav.dashboard'),
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: t('nav.workouts'),
      url: "/workouts",
      icon: Dumbbell,
      items: [
        {
          title: t('nav.myWorkouts'),
          url: "/workouts",
        },
        {
          title: t('nav.exerciseLibrary'),
          url: "/exercises",
        },
        {
          title: t('nav.createWorkout'),
          url: "/workouts/create",
        },
      ],
    },
    {
      title: t('nav.nutrition'),
      url: "/nutrition",
      icon: Apple,
      items: [
        {
          title: t('nav.mealPlanning'),
          url: "/nutrition/plans",
        },
        {
          title: t('nav.mealLibrary'),
          url: "/nutrition/foods",
        },
        {
          title: t('nav.nutritionTracking'),
          url: "/nutrition/track",
        },
      ],
    },
    {
      title: t('nav.progress'),
      url: "/progress",
      icon: TrendingUp,
      items: [
        {
          title: t('nav.overview'),
          url: "/progress",
        },
        {
          title: t('nav.measurements'),
          url: "/progress/measurements",
        },
        {
          title: t('nav.progressPhotos'),
          url: "/progress/photos",
        },
        {
          title: t('nav.achievements'),
          url: "/progress/achievements",
        },
      ],
    },
  ]

  // Add instructor-specific navigation
  if (userRole === "instructor") {
    baseNavigation.push(
      {
        title: t('nav.clients'),
        url: "/clients",
        icon: Users,
        items: [
          {
            title: t('nav.allClients'),
            url: "/clients",
          },
          {
            title: t('nav.invitations'),
            url: "/clients/invitations",
          },
          {
            title: t('nav.progressReports'),
            url: "/clients/reports",
          },
        ],
      },
      {
        title: t('nav.schedule'),
        url: "/schedule",
        icon: Calendar,
        items: [
          {
            title: t('nav.appointments'),
            url: "/schedule/appointments",
          },
          {
            title: t('nav.availability'),
            url: "/schedule/availability",
          },
        ],
      }
    )
  }

  return baseNavigation
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const [currentRole, setCurrentRole] = React.useState<"user" | "instructor">(
    profile?.role || "user"
  )

  const navigationItems = getFlexoraNavigation(currentRole, t)

  const handleRoleChange = (role: "user" | "instructor") => {
    setCurrentRole(role)
    // TODO: Update user role in database/context
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <RoleSwitcher 
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        {!loading && user ? (
          <NavUser user={{
            name: profile?.full_name || user.user_metadata?.full_name || "User",
            email: user.email || "user@flexora.com", 
            avatar: profile?.avatar_url || user.user_metadata?.avatar_url || undefined,
          }} />
        ) : (
          // Show loading skeleton while profile is loading
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
