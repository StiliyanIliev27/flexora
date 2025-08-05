"use client"

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { Language, LanguageOption } from '@/types/language.types'

export function useLanguages() {
  const [languages, setLanguages] = useState<LanguageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const supabase = createBrowserSupabaseClient()
        
        const { data, error: fetchError } = await supabase
          .from('languages')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')

        if (fetchError) {
          throw fetchError
        }

        // Transform database data to component-friendly format
        const transformedLanguages: LanguageOption[] = (data || []).map((lang: Language) => ({
          code: lang.code,
          name: lang.name,
          nativeName: lang.native_name,
          flagIcon: lang.flag_icon || `/flags/${lang.code}.png`,
          direction: lang.direction,
        }))

        setLanguages(transformedLanguages)
      } catch (err) {
        console.error('Error fetching languages:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch languages')
      } finally {
        setLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  return { languages, loading, error }
}