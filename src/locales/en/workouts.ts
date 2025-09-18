export const workouts = {
  // Workout Plans
  workoutPlans: 'Workout Plans',
  createPlan: 'Create Plan',
  editPlan: 'Edit Plan',
  deletePlan: 'Delete Plan',
  duplicatePlan: 'Duplicate Plan',
  activatePlan: 'Activate Plan',
  deactivatePlan: 'Deactivate Plan',
  
  // Plan Details
  planName: 'Plan Name',
  planDescription: 'Plan Description',
  duration: 'Duration',
  durationWeeks: 'Duration (weeks)',
  isActive: 'Active Plan',
  isPublic: 'Public Plan',
  createdAt: 'Created',
  updatedAt: 'Last Updated',
  
  // Days of Week
  daysOfWeek: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat'
  },
  
  // Workout Days
  workoutDay: 'Workout Day',
  restDay: 'Rest Day',
  dayName: 'Day Name',
  customDayName: 'Custom Day Name',
  setAsRestDay: 'Set as Rest Day',
  setAsWorkoutDay: 'Set as Workout Day',
  dayNotes: 'Day Notes',
  
  // Exercises
  exercises: 'Exercises',
  addExercise: 'Add Exercise',
  removeExercise: 'Remove Exercise',
  moveExercise: 'Move Exercise',
  exerciseOrder: 'Exercise Order',
  exerciseCount: 'Exercise Count',
  
  // Exercise Configuration
  sets: 'Sets',
  reps: 'Reps',
  weight: 'Weight',
  weightKg: 'Weight (kg)',
  weightLbs: 'Weight (lbs)',
  restTime: 'Rest Time',
  restSeconds: 'Rest (seconds)',
  rpe: 'RPE',
  rpeScale: 'RPE (1-10)',
  notes: 'Notes',
  exerciseNotes: 'Exercise Notes',
  
  // Set Configuration
  customSets: 'Custom Sets',
  useCustomSets: 'Use Custom Sets',
  setNumber: 'Set',
  addSet: 'Add Set',
  removeSet: 'Remove Set',
  duplicateSet: 'Duplicate Set',
  
  // Drag and Drop
  dragExercise: 'Drag exercise here',
  dropExercise: 'Drop exercise to add',
  dragToReorder: 'Drag to reorder',
  dropZone: 'Drop Zone',
  
  // Exercise Library Sidebar
  exerciseLibrary: 'Exercise Library',
  searchExercises: 'Search Exercises',
  filterExercises: 'Filter Exercises',
  noExercisesFound: 'No exercises found',
  dragToAdd: 'Drag to add to workout',
  
  // Plan Statistics
  statistics: 'Statistics',
  totalExercises: 'Total Exercises',
  estimatedDuration: 'Estimated Duration',
  minutesPerSession: 'minutes per session',
  minutesPerWeek: 'minutes per week',
  exercisesByMuscleGroup: 'Exercises by Muscle Group',
  exercisesByEquipment: 'Exercises by Equipment',
  exercisesByDifficulty: 'Exercises by Difficulty',
  trainingDays: 'Training Days',
  restDays: 'Rest Days',
  
  // Exercise Substitutions
  substitutions: 'Exercise Substitutions',
  suggestSubstitute: 'Suggest Substitute',
  replaceExercise: 'Replace Exercise',
  substituteReason: {
    equipment: 'Equipment not available',
    difficulty: 'Different difficulty level',
    muscleGroup: 'Different muscle group focus',
    preference: 'Personal preference'
  },
  
  // Validation Messages
  validation: {
    planNameRequired: 'Plan name is required',
    planNameTooLong: 'Plan name must be less than 255 characters',
    durationRequired: 'Duration is required',
    durationMinimum: 'Duration must be at least 1 week',
    durationMaximum: 'Duration must be less than 52 weeks',
    noExercisesAdded: 'Add at least one exercise to save the plan',
    tooManyExercises: 'Too many exercises for one day (maximum {{max}})',
    missingRestDay: 'Consider adding at least one rest day',
    conflictingMuscleGroups: 'Same muscle groups trained on consecutive days',
    equipmentUnavailable: 'Exercise requires equipment you don\'t have access to',
    invalidRpe: 'RPE must be between 1 and 10',
    invalidWeight: 'Weight must be a positive number',
    invalidReps: 'Reps must be a positive number',
    invalidSets: 'Sets must be a positive number',
    invalidRestTime: 'Rest time must be between 30 and 300 seconds'
  },
  
  // Actions
  save: 'Save Plan',
  cancel: 'Cancel',
  delete: 'Delete',
  duplicate: 'Duplicate',
  edit: 'Edit',
  preview: 'Preview',
  start: 'Start Workout',
  
  // Navigation
  backToPlans: 'Back to Plans',
  previewPlan: 'Preview Plan',
  continueEditing: 'Continue Editing',
  
  // Confirmation Messages
  confirmDelete: 'Delete Workout Plan',
  deleteWarning: 'This action cannot be undone',
  confirmDeleteExercise: 'Remove Exercise',
  unsavedChanges: 'You have unsaved changes. Do you want to save before leaving?',
  planSaved: 'Workout plan saved successfully',
  planDeleted: 'Workout plan deleted successfully',
  exerciseAdded: 'Exercise added to workout',
  exerciseRemoved: 'Exercise removed from workout',
  
  // Status Messages
  noPlansYet: 'No workout plans created yet',
  createFirstPlan: 'Create your first workout plan',
  planEmpty: 'This plan doesn\'t have any exercises yet',
  addFirstExercise: 'Add your first exercise',
  loading: 'Loading workout plans...',
  saving: 'Saving plan...',
  deleting: 'Deleting plan...',
  
  // Accessibility
  a11y: {
    exerciseCard: 'Exercise card for {{exerciseName}}',
    dragHandle: 'Drag handle for {{exerciseName}}',
    removeExerciseButton: 'Remove {{exerciseName}} from workout',
    dayColumn: 'Workout day column for {{dayName}}',
    dropZone: 'Drop zone for {{dayName}}',
    exerciseOrderUp: 'Move {{exerciseName}} up',
    exerciseOrderDown: 'Move {{exerciseName}} down'
  }
} as const
