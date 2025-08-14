import { en } from './en'
import { bg } from './bg'

export const translations = {
  en,
  bg,
} as const

export type TranslationKey = keyof typeof en

// Enhanced nested translation key types
export type NestedTranslationKey = 
  | `nav.${keyof typeof en.nav}`
  | `dashboard.${keyof typeof en.dashboard}`
  | `common.${keyof typeof en.common}`
  | `auth.${keyof typeof en.auth}`
  | `profile.${keyof typeof en.profile}`
  | `exercises.${keyof typeof en.exercises}`
  | `fitnessGoals.${keyof typeof en.fitnessGoals}`
  | `equipmentCategories.${keyof typeof en.equipmentCategories}`
  | `muscleGroups.${keyof typeof en.muscleGroups}`

export type Language = keyof typeof translations
export type Translations = typeof en

// Helper function to get nested value from object
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}