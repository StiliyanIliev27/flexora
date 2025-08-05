"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  TrendingUp,
  Users,
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

// Flexora navigation data
const getFlexoraNavigation = (userRole: "user" | "instructor") => {
  const baseNavigation = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Workouts",
      url: "/workouts",
      icon: Dumbbell,
      items: [
        {
          title: "My Workouts",
          url: "/workouts",
        },
        {
          title: "Exercise Library",
          url: "/workouts/exercises",
        },
        {
          title: "Create Workout",
          url: "/workouts/create",
        },
      ],
    },
    {
      title: "Nutrition",
      url: "/nutrition",
      icon: Apple,
      items: [
        {
          title: "Meal Plans",
          url: "/nutrition/plans",
        },
        {
          title: "Food Library",
          url: "/nutrition/foods",
        },
        {
          title: "Track Meals",
          url: "/nutrition/track",
        },
      ],
    },
    {
      title: "Progress",
      url: "/progress",
      icon: TrendingUp,
      items: [
        {
          title: "Overview",
          url: "/progress",
        },
        {
          title: "Body Measurements",
          url: "/progress/measurements",
        },
        {
          title: "Photos",
          url: "/progress/photos",
        },
        {
          title: "Achievements",
          url: "/progress/achievements",
        },
      ],
    },
  ]

  // Add instructor-specific navigation
  if (userRole === "instructor") {
    baseNavigation.push(
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
        items: [
          {
            title: "All Clients",
            url: "/clients",
          },
          {
            title: "Invitations",
            url: "/clients/invitations",
          },
          {
            title: "Progress Reports",
            url: "/clients/reports",
          },
        ],
      },
      {
        title: "Schedule",
        url: "/schedule",
        icon: Calendar,
        items: [
          {
            title: "Appointments",
            url: "/schedule/appointments",
          },
          {
            title: "Availability",
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
  const [currentRole, setCurrentRole] = React.useState<"user" | "instructor">(
    profile?.role || "user"
  )

  const navigationItems = getFlexoraNavigation(currentRole)

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
