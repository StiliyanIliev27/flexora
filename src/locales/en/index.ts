import { common } from './common'
import { navigation } from './navigation'
import { auth } from './auth'
import { dashboard } from './dashboard'
import { profile } from './profile'
import { exercises } from './exercises'

export const en = {
  // Common translations
  common,
  
  // Navigation
  nav: navigation,
  
  // Authentication
  auth,
  
  // Dashboard
  dashboard,
  
  // Profile
  profile,
  
  // Exercises
  exercises,
  
  // Fitness Goals (keeping existing structure for now)
  fitnessGoals: {
    weightLoss: 'Weight Loss',
    muscleGain: 'Muscle Gain',
    enduranceImprovement: 'Endurance Improvement',
    generalFitness: 'General Fitness',
    strengthBuilding: 'Strength Building',
    toningDefinition: 'Toning & Definition',
    flexibilityMobility: 'Flexibility & Mobility',
    sportSpecificTraining: 'Sport-Specific Training',
  },

  // Equipment Categories (keeping existing structure for now)
  equipmentCategories: {
    bodyweight: 'Bodyweight',
    strength: 'Strength',
    cardio: 'Cardio',
    flexibility: 'Flexibility',
  },

  // Muscle Groups (keeping existing structure for now)
  muscleGroups: {
    // Upper Body
    chest: 'Chest',
    upperChest: 'Upper Chest',
    lowerChest: 'Lower Chest',
    triceps: 'Triceps',
    shoulders: 'Shoulders',
    frontDeltoids: 'Front Deltoids',
    sideDeltoids: 'Side Deltoids',
    rearDeltoids: 'Rear Deltoids',
    back: 'Back',
    lats: 'Lats',
    rhomboids: 'Rhomboids',
    traps: 'Traps',
    middleTraps: 'Middle Traps',
    lowerTraps: 'Lower Traps',
    biceps: 'Biceps',
    forearms: 'Forearms',
    
    // Lower Body
    quadriceps: 'Quadriceps',
    hamstrings: 'Hamstrings',
    glutes: 'Glutes',
    calves: 'Calves',
    shins: 'Shins',
    hipFlexors: 'Hip Flexors',
    itBand: 'IT Band',
    
    // Core
    abs: 'Abs',
    upperAbs: 'Upper Abs',
    lowerAbs: 'Lower Abs',
    obliques: 'Obliques',
    lowerBack: 'Lower Back',
    erectorSpinae: 'Erector Spinae',
    
    // Categories
    upper: 'Upper Body',
    lower: 'Lower Body',
    core: 'Core',
    fullBody: 'Full Body',
  },
} as const
