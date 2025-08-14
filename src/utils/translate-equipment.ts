import { useLanguage } from '@/contexts/LanguageContext'

// Helper function to translate equipment names
export function translateEquipmentName(equipmentName: string | null | undefined, t: ReturnType<typeof useLanguage>['t']): string {
  if (!equipmentName) return ''
  
  // Try to get translated name from profile.equipmentNames
  const translatedName = t(`profile.equipmentNames.${equipmentName}` as any)
  
  // If translation exists and is different from the key, return it
  if (translatedName && translatedName !== `profile.equipmentNames.${equipmentName}`) {
    return translatedName
  }
  
  // Fallback to original name if no translation found
  return equipmentName
}

// Helper function for muscle group names (for future use)
export function translateMuscleGroupName(muscleGroupName: string | null | undefined, t: ReturnType<typeof useLanguage>['t']): string {
  if (!muscleGroupName) return ''
  
  // For now, return the original name (can be expanded later)
  return muscleGroupName
}
