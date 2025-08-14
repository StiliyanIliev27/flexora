import { common } from './common'
import { navigation } from './navigation'
import { auth } from './auth'
import { dashboard } from './dashboard'
import { profile } from './profile'
import { exercises } from './exercises'

export const bg = {
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
    weightLoss: 'Отслабване',
    muscleGain: 'Увеличаване на Мускулна Маса',
    enduranceImprovement: 'Подобряване на Издръжливостта',
    generalFitness: 'Общ Фитнес',
    strengthBuilding: 'Изграждане на Сила',
    toningDefinition: 'Тониране и Дефиниция',
    flexibilityMobility: 'Гъвкавост и Подвижност',
    sportSpecificTraining: 'Специфично Спортно Тренирано',
  },

  // Equipment Categories (keeping existing structure for now)
  equipmentCategories: {
    bodyweight: 'Собствено Тегло',
    strength: 'Силова',
    cardio: 'Кардио',
    flexibility: 'Гъвкавост',
  },

  // Muscle Groups (keeping existing structure for now)
  muscleGroups: {
    // Upper Body
    chest: 'Гърди',
    upperChest: 'Горни Гърди',
    lowerChest: 'Долни Гърди',
    triceps: 'Трицепс',
    shoulders: 'Рамене',
    frontDeltoids: 'Предни Делтоиди',
    sideDeltoids: 'Странични Делтоиди',
    rearDeltoids: 'Задни Делтоиди',
    back: 'Гръб',
    lats: 'Латисимус',
    rhomboids: 'Ромбоиди',
    traps: 'Трапец',
    middleTraps: 'Среден Трапец',
    lowerTraps: 'Долен Трапец',
    biceps: 'Бицепс',
    forearms: 'Предмишници',
    
    // Lower Body
    quadriceps: 'Квадрицепс',
    hamstrings: 'Задни Бедрени',
    glutes: 'Седалищни',
    calves: 'Прасци',
    shins: 'Пищяли',
    hipFlexors: 'Тазобедрени Флексори',
    itBand: 'IT Лента',
    
    // Core
    abs: 'Коремни',
    upperAbs: 'Горни Коремни',
    lowerAbs: 'Долни Коремни',
    obliques: 'Косни Коремни',
    lowerBack: 'Долен Гръб',
    erectorSpinae: 'Изправяч на Гръбначния Стълб',
    
    // Categories
    upper: 'Горна Част на Тялото',
    lower: 'Долна Част на Тялото',
    core: 'Корпус',
    fullBody: 'Цяло Тяло',
  },
} as const

