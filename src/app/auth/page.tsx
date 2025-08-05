'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { SkeletonLayout } from '@/components/loading'
import { useAuth } from '@/contexts/AuthContext'
import { Dumbbell, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { loading } = useAuth()

  // Show skeleton while checking authentication state
  if (loading) {
    return <SkeletonLayout layout="auth" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Flexora</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Auth Section */}
      <div className="flex flex-col justify-center py-12 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border bg-muted/50">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Welcome to Flexora</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin 
                ? 'Sign in to continue your fitness journey' 
                : 'Start your personalized fitness journey today'
              }
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card border rounded-xl p-8 shadow-lg">
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <SignUpForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Why choose Flexora?</h3>
            <p className="text-muted-foreground">Join thousands who have transformed their fitness journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-medium mb-1">Personalized Plans</h4>
              <p className="text-sm text-muted-foreground">AI-generated workouts tailored to you</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-medium mb-1">Progress Tracking</h4>
              <p className="text-sm text-muted-foreground">Monitor your fitness journey</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="font-medium mb-1">Expert Support</h4>
              <p className="text-sm text-muted-foreground">Connect with certified trainers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 