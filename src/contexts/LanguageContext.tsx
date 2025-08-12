"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { LanguageOption } from '@/types/language.types'
import { useLanguages } from '@/hooks/useLanguages'
import { translations, getNestedValue, type NestedTranslationKey, type Language } from '@/locales'
import { createBrowserSupabaseClient } from '@/lib/supabase'

interface LanguageContextType {
  currentLanguage: LanguageOption | null
  changeLanguage: (language: LanguageOption) => void
  t: (key: NestedTranslationKey) => string
  isLoading: boolean
  updateUserLanguagePreference: (languageCode: string) => Promise<void>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  userId?: string | null
  userLanguagePreference?: string | null
}

export function LanguageProvider({ children, userId, userLanguagePreference }: LanguageProviderProps) {
  const { languages, loading: languagesLoading } = useLanguages()
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption | null>(null)
  const [currentLangCode, setCurrentLangCode] = useState<Language>('en')
  const supabase = createBrowserSupabaseClient()

  // Initialize language from user preference, localStorage, or default to English
  useEffect(() => {
    if (languages.length > 0 && !currentLanguage) {
      // Priority: userLanguagePreference > localStorage > default
      const savedLanguageCode = localStorage.getItem('flexora-language')
      const preferredLangCode = userLanguagePreference || savedLanguageCode || 'en'
      
      const defaultLang = languages.find(lang => lang.code === preferredLangCode) || languages[0]
      
      setCurrentLanguage(defaultLang)
      setCurrentLangCode(defaultLang.code as Language)
    }
  }, [languages, currentLanguage, userLanguagePreference])

  const updateUserLanguagePreference = async (languageCode: string) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ language_preference: languageCode })
        .eq('id', userId)

      if (error) {
        console.error('Error updating language preference:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to update language preference:', error)
      throw error
    }
  }

  const changeLanguage = async (language: LanguageOption) => {
    setCurrentLanguage(language)
    setCurrentLangCode(language.code as Language)
    localStorage.setItem('flexora-language', language.code)

    // Update user preference in database if user is logged in
    if (userId) {
      try {
        await updateUserLanguagePreference(language.code)
      } catch (error) {
        console.error('Failed to save language preference to database:', error)
        // Continue with local change even if database update fails
      }
    }
  }

  const t = (key: NestedTranslationKey): string => {
    const currentTranslations = translations[currentLangCode]
    if (!currentTranslations) return key
    
    const translation = getNestedValue(currentTranslations, key)
    return translation || key
  }

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    isLoading: languagesLoading,
    updateUserLanguagePreference,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}