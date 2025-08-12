"use client"

import { ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface LanguageProviderWrapperProps {
  children: ReactNode
}

export function LanguageProviderWrapper({ children }: LanguageProviderWrapperProps) {
  const { user, profile } = useAuth()

  return (
    <LanguageProvider 
      userId={user?.id || null} 
      userLanguagePreference={profile?.language_preference || null}
    >
      {children}
    </LanguageProvider>
  )
}