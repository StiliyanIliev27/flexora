export const profile = {
  languagePreference: 'Language Preference',
  languageUpdated: 'Language preference updated successfully',
  languageUpdateError: 'Failed to update language preference',
  
  // Profile Management
  title: 'Profile',
  personalInfo: 'Personal Information',
  physicalInfo: 'Physical Information',
  fitnessInfo: 'Fitness Information',
  medicalInfo: 'Medical Information',
  equipmentAccess: 'Equipment Access',
  
  // Personal Info Fields
  fullName: 'Full Name',
  email: 'Email',
  avatar: 'Profile Picture',
  
  // Physical Info Fields
  height: 'Height',
  heightPlaceholder: 'Height in cm',
  weight: 'Weight',
  weightPlaceholder: 'Weight in kg',
  age: 'Age',
  agePlaceholder: 'Age in years',
  gender: 'Gender',
  genderPlaceholder: 'Select gender',
  
  // Gender Options
  male: 'Male',
  female: 'Female',
  
  // Fitness Info Fields
  fitnessGoals: 'Fitness Goals',
  fitnessGoalsPlaceholder: 'Select your fitness goals',
  workoutAvailability: 'Workout Availability',
  workoutAvailabilityPlaceholder: 'How many days per week can you work out?',
  gymAccess: 'Gym Access',
  gymAccessLabel: 'I have access to a gym',
  
  // Medical Info Fields
  medicalNotes: 'Medical Notes',
  medicalNotesPlaceholder: 'Any medical conditions, injuries, or limitations...',
  medicalNotesHelp: 'Please include any medical conditions, injuries, or physical limitations that might affect your workout routine.',
  
  // Equipment Access
  equipmentAccessTitle: 'Available Equipment',
  equipmentAccessHelp: 'Select the equipment you have access to at home or gym',
  equipmentLocation: 'Location',
  equipmentLocationHome: 'Home',
  equipmentLocationGym: 'Gym',
  equipmentLocationBoth: 'Both',
  equipmentNotes: 'Notes',
  equipmentNotesPlaceholder: 'Any additional notes about this equipment...',
  
  // Profile Completion
  profileCompletion: 'Profile Completion',
  profileIncomplete: 'Complete your profile to get personalized workouts',
  profileComplete: 'Your profile is complete!',
  missingFields: 'Missing fields',
  requiredFields: 'Required fields',
  
  // Actions
  updateProfile: 'Update Profile',
  profileUpdated: 'Profile updated successfully',
  profileUpdateError: 'Failed to update profile',
  uploadAvatar: 'Upload Avatar',
  removeAvatar: 'Remove Avatar',
  
  // Equipment (new)
  availableEquipment: 'Available Equipment',
  addEquipment: 'Add Equipment',
  selectEquipment: 'Select Equipment',
  selectedEquipment: 'Selected Equipment',
  location: 'Location',
  equipmentNotes: 'Notes',
  equipmentNotesPlaceholder: 'Add notes about this equipment (condition, model, specific details, etc.)',
  addNotesFor: 'Add notes for',
  hasNotes: 'Has notes - click to edit',
  addNotes: 'Click to add notes',
  
  // Enhanced Goals (new)
  goalsSelected: 'goals selected',
  addNewGoal: 'Add New Goal',
  selectGoal: 'Select Goal',
  availableGoals: 'Available Goals',
  yourGoals: 'Your Goals',
  priorityOrder: 'in priority order',
  targetDate: 'Target Date',
  quickSelect: 'Quick Select',
  oneMonth: '1M',
  threeMonths: '3M',
  sixMonths: '6M',
  goalNotes: 'Notes',
  optional: 'optional',
  goalNotesPlaceholder: 'Add personal notes about this goal (motivation, specific targets, etc.)',
  noGoalsSelected: 'No fitness goals selected',
  selectGoalsToStart: 'Select your fitness goals to create a personalized plan',
  
  // Goal Management (new)
  goalDetails: 'Goal Details',
  editDetailsFor: 'Edit details for',
  hasTargetDate: 'Has target date',
  missingTargetDate: 'Missing target date - required',
  movePriorityUp: 'Move priority up',
  movePriorityDown: 'Move priority down', 
  editGoalDetails: 'Edit goal details',
  addGoalDetails: 'Add target date and details',
  removeGoal: 'Remove goal',
  
  // Additional fields needed for compact UI
  selected: 'selected',
  equipment: 'equipment',
  
  // Workout availability options
  oneDayPerWeek: '1 day per week',
  twoDaysPerWeek: '2 days per week',
  threeDaysPerWeek: '3 days per week',
  fourDaysPerWeek: '4 days per week',
  fiveDaysPerWeek: '5 days per week',
  sixDaysPerWeek: '6 days per week',
  sevenDaysPerWeek: '7 days per week',
  
  // Equipment translations
  equipmentNames: {
    'Bodyweight': 'Bodyweight',
    'Dumbbells': 'Dumbbells',
    'Resistance Bands': 'Resistance Bands',
    'Pull-up Bar': 'Pull-up Bar',
    'Yoga Mat': 'Yoga Mat',
    'Kettlebell': 'Kettlebell',
    'Barbell': 'Barbell',
    'Olympic Barbell': 'Olympic Barbell',
    'EZ Curl Bar': 'EZ Curl Bar',
    'Bench': 'Bench',
    'Incline Bench': 'Incline Bench',
    'Decline Bench': 'Decline Bench',
    'Power Rack': 'Power Rack',
    'Smith Machine': 'Smith Machine',
    'Cable Machine': 'Cable Machine',
    'Lat Pulldown Machine': 'Lat Pulldown Machine',
    'Leg Press Machine': 'Leg Press Machine',
    'Leg Curl Machine': 'Leg Curl Machine',
    'Leg Extension Machine': 'Leg Extension Machine',
    'Treadmill': 'Treadmill',
    'Stationary Bike': 'Stationary Bike',
    'Elliptical': 'Elliptical',
    'Rowing Machine': 'Rowing Machine',
    'Stair Climber': 'Stair Climber',
  },
} as const
