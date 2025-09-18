export const workouts = {
  // Workout Plans
  workoutPlans: 'Тренировъчни Планове',
  createPlan: 'Създай План',
  editPlan: 'Редактирай План',
  deletePlan: 'Изтрий План',
  duplicatePlan: 'Копирай План',
  activatePlan: 'Активирай План',
  deactivatePlan: 'Деактивирай План',
  
  // Plan Details
  planName: 'Име на Плана',
  planDescription: 'Описание на Плана',
  duration: 'Продължителност',
  durationWeeks: 'Продължителност (седмици)',
  isActive: 'Активен План',
  isPublic: 'Публичен План',
  createdAt: 'Създаден',
  updatedAt: 'Последно Обновен',
  
  // Days of Week
  daysOfWeek: {
    sunday: 'Неделя',
    monday: 'Понеделник',
    tuesday: 'Вторник',
    wednesday: 'Сряда',
    thursday: 'Четвъртък',
    friday: 'Петък',
    saturday: 'Събота',
    sun: 'Нед',
    mon: 'Пон',
    tue: 'Вто',
    wed: 'Сря',
    thu: 'Чет',
    fri: 'Пет',
    sat: 'Съб'
  },
  
  // Workout Days
  workoutDay: 'Тренировъчен Ден',
  restDay: 'Почивен Ден',
  dayName: 'Име на Деня',
  customDayName: 'Персонализирано Име',
  setAsRestDay: 'Задай като Почивен Ден',
  setAsWorkoutDay: 'Задай като Тренировъчен Ден',
  dayNotes: 'Бележки за Деня',
  
  // Exercises
  exercises: 'Упражнения',
  addExercise: 'Добави Упражнение',
  removeExercise: 'Премахни Упражнение',
  moveExercise: 'Премести Упражнение',
  exerciseOrder: 'Ред на Упражнението',
  exerciseCount: 'Брой Упражнения',
  
  // Exercise Configuration
  sets: 'Серии',
  reps: 'Повторения',
  weight: 'Тежест',
  weightKg: 'Тежест (кг)',
  weightLbs: 'Тежест (паунда)',
  restTime: 'Време за Почивка',
  restSeconds: 'Почивка (секунди)',
  rpe: 'RPE',
  rpeScale: 'RPE (1-10)',
  notes: 'Бележки',
  exerciseNotes: 'Бележки за Упражнението',
  
  // Set Configuration
  customSets: 'Персонализирани Серии',
  useCustomSets: 'Използвай Персонализирани Серии',
  setNumber: 'Серия',
  addSet: 'Добави Серия',
  removeSet: 'Премахни Серия',
  duplicateSet: 'Копирай Серия',
  
  // Drag and Drop
  dragExercise: 'Влачи упражнението тук',
  dropExercise: 'Пусни упражнението за добавяне',
  dragToReorder: 'Влачи за преподреждане',
  dropZone: 'Зона за Пускане',
  
  // Exercise Library Sidebar
  exerciseLibrary: 'Библиотека с Упражнения',
  searchExercises: 'Търси Упражнения',
  filterExercises: 'Филтрирай Упражнения',
  noExercisesFound: 'Няма намерени упражнения',
  dragToAdd: 'Влачи за добавяне към тренировката',
  
  // Plan Statistics
  statistics: 'Статистики',
  totalExercises: 'Общо Упражнения',
  estimatedDuration: 'Приблизителна Продължителност',
  minutesPerSession: 'минути на сесия',
  minutesPerWeek: 'минути на седмица',
  exercisesByMuscleGroup: 'Упражнения по Мускулна Група',
  exercisesByEquipment: 'Упражнения по Оборудване',
  exercisesByDifficulty: 'Упражнения по Трудност',
  trainingDays: 'Тренировъчни Дни',
  restDays: 'Почивни Дни',
  
  // Exercise Substitutions
  substitutions: 'Заместители на Упражнения',
  suggestSubstitute: 'Предложи Заместител',
  replaceExercise: 'Замести Упражнение',
  substituteReason: {
    equipment: 'Оборудването не е налично',
    difficulty: 'Различно ниво на трудност',
    muscleGroup: 'Различен фокус върху мускулна група',
    preference: 'Лично предпочитание'
  },
  
  // Validation Messages
  validation: {
    planNameRequired: 'Името на плана е задължително',
    planNameTooLong: 'Името на плана трябва да бъде по-малко от 255 символа',
    durationRequired: 'Продължителността е задължителна',
    durationMinimum: 'Продължителността трябва да бъде поне 1 седмица',
    durationMaximum: 'Продължителността трябва да бъде по-малко от 52 седмици',
    noExercisesAdded: 'Добави поне едно упражнение за да запазиш плана',
    tooManyExercises: 'Твърде много упражнения за един ден (максимум {{max}})',
    missingRestDay: 'Помисли за добавяне на поне един почивен ден',
    conflictingMuscleGroups: 'Същите мускулни групи се тренират в последователни дни',
    equipmentUnavailable: 'Упражнението изисква оборудване, до което нямаш достъп',
    invalidRpe: 'RPE трябва да бъде между 1 и 10',
    invalidWeight: 'Теглото трябва да бъде положително число',
    invalidReps: 'Повторенията трябва да бъдат положително число',
    invalidSets: 'Сериите трябва да бъдат положително число',
    invalidRestTime: 'Времето за почивка трябва да бъде между 30 и 300 секунди'
  },
  
  // Actions
  save: 'Запази План',
  cancel: 'Откажи',
  delete: 'Изтрий',
  duplicate: 'Копирай',
  edit: 'Редактирай',
  preview: 'Преглед',
  start: 'Започни Тренировка',
  
  // Navigation
  backToPlans: 'Обратно към Планове',
  previewPlan: 'Преглед на План',
  continueEditing: 'Продължи Редактирането',
  
  // Confirmation Messages
  confirmDelete: 'Изтриване на тренировъчен план',
  deleteWarning: 'Това действие не може да бъде отменено',
  confirmDeleteExercise: 'Сигурен ли си, че искаш да премахнеш това упражнение?',
  unsavedChanges: 'Имаш незапазени промени. Искаш ли да запазиш преди да излезеш?',
  planSaved: 'Тренировъчният план е запазен успешно',
  planDeleted: 'Тренировъчният план е изтрит успешно',
  exerciseAdded: 'Упражнението е добавено към тренировката',
  exerciseRemoved: 'Упражнението е премахнато от тренировката',
  
  // Status Messages
  noPlansYet: 'Все още няма създадени тренировъчни планове',
  createFirstPlan: 'Създай своя първи тренировъчен план',
  planEmpty: 'Този план все още няма упражнения',
  addFirstExercise: 'Добави първото си упражнение',
  loading: 'Зареждане на тренировъчни планове...',
  saving: 'Запазване на план...',
  deleting: 'Изтриване на план...',
  
  // Accessibility
  a11y: {
    exerciseCard: 'Карта на упражнението за {{exerciseName}}',
    dragHandle: 'Дръжка за влачене на {{exerciseName}}',
    removeExerciseButton: 'Премахни {{exerciseName}} от тренировката',
    dayColumn: 'Колона за тренировъчния ден {{dayName}}',
    dropZone: 'Зона за пускане за {{dayName}}',
    exerciseOrderUp: 'Премести {{exerciseName}} нагоре',
    exerciseOrderDown: 'Премести {{exerciseName}} надолу'
  }
} as const
