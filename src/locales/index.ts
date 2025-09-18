import { en } from './en'
import { bg } from './bg'

export const translations = {
  en,
  bg,
} as const

export type TranslationKey = keyof typeof en

// Enhanced nested translation key types with support for deeper nesting
type WorkoutKeys = keyof typeof en.workouts
type DaysOfWeekKeys = keyof typeof en.workouts.daysOfWeek
type ValidationKeys = keyof typeof en.workouts.validation
type SubstituteReasonKeys = keyof typeof en.workouts.substituteReason
type A11yKeys = keyof typeof en.workouts.a11y

export type NestedTranslationKey = 
  | `nav.${keyof typeof en.nav}`
  | `dashboard.${keyof typeof en.dashboard}`
  | `common.${keyof typeof en.common}`
  | `auth.${keyof typeof en.auth}`
  | `profile.${keyof typeof en.profile}`
  | `exercises.${keyof typeof en.exercises}`
  | `workouts.${WorkoutKeys}`
  | `workouts.daysOfWeek.${DaysOfWeekKeys}`
  | `workouts.validation.${ValidationKeys}`
  | `workouts.substituteReason.${SubstituteReasonKeys}`
  | `workouts.a11y.${A11yKeys}`
  | `fitnessGoals.${keyof typeof en.fitnessGoals}`
  | `equipmentCategories.${keyof typeof en.equipmentCategories}`
  | `muscleGroups.${keyof typeof en.muscleGroups}`

export type Language = keyof typeof translations
export type Translations = typeof en

// Helper function to get nested value from object
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}