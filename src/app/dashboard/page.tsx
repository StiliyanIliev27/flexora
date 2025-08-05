import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
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

export default function DashboardPage() {
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
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4">
            <HeaderControls hasNotifications={true} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Welcome Section */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Flexora</h1>
            <p className="text-muted-foreground">
              Track your fitness journey and reach your goals
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Today's Workout</h3>
              <p className="text-sm text-muted-foreground">Push Day - Upper Body</p>
              <p className="text-2xl font-bold mt-2 text-emerald-600">45 min</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Calories Today</h3>
              <p className="text-sm text-muted-foreground">Goal: 2,200 kcal</p>
              <p className="text-2xl font-bold mt-2 text-amber-600">1,850</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Weight Progress</h3>
              <p className="text-sm text-muted-foreground">This month</p>
              <p className="text-2xl font-bold mt-2 text-indigo-600">-2.3 kg</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Streak</h3>
              <p className="text-sm text-muted-foreground">Workout days</p>
              <p className="text-2xl font-bold mt-2 text-green-600">12 days</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Recent Workouts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Push Day</p>
                    <p className="text-sm text-muted-foreground">Yesterday • 45 min</p>
                  </div>
                  <div className="text-emerald-600 font-semibold">✓</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Cardio Session</p>
                    <p className="text-sm text-muted-foreground">2 days ago • 30 min</p>
                  </div>
                  <div className="text-emerald-600 font-semibold">✓</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid gap-3">
                <button className="p-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg text-left hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
                  <p className="font-medium text-indigo-900 dark:text-indigo-100">Start Today's Workout</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">Push Day - Upper Body</p>
                </button>
                <button className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg text-left hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors">
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">Log Meal</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Track your nutrition</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
