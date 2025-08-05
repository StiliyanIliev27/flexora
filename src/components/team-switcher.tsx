"use client"

import * as React from "react"
import { ChevronsUpDown, User, GraduationCap } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type UserRole = "user" | "instructor"

interface RoleSwitcherProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const roles = [
  {
    value: "user" as const,
    name: "User Mode",
    description: "Track your fitness journey", 
    icon: User,
  },
  {
    value: "instructor" as const,
    name: "Instructor Mode",
    description: "Manage clients & plans",
    icon: GraduationCap,
  },
]

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const { isMobile } = useSidebar()
  const activeRole = roles.find(role => role.value === currentRole) || roles[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeRole.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeRole.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {activeRole.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Switch Role
            </DropdownMenuLabel>
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.value}
                onClick={() => onRoleChange(role.value)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <role.icon className="size-3.5 shrink-0" />
                </div>
                <div className="grid flex-1">
                  <span className="font-medium">{role.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {role.description}
                  </span>
                </div>
                {role.value === currentRole && (
                  <div className="size-2 rounded-full bg-emerald-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
