-- Migration: Add user profile fields
-- Description: Extends the users table with profile fields for fitness tracking

-- Add new columns to existing users table
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS height_cm INTEGER,
  ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS gender VARCHAR(20) CHECK (gender IN ('male', 'female')),
  ADD COLUMN IF NOT EXISTS medical_notes TEXT,
  ADD COLUMN IF NOT EXISTS workout_availability INTEGER,
  ADD COLUMN IF NOT EXISTS gym_access BOOLEAN DEFAULT false;

-- Add check constraint for workout_availability
ALTER TABLE public.users ADD CONSTRAINT check_workout_availability 
  CHECK (workout_availability IN (1,2,3,4,5,6,7));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_age ON public.users(age);
CREATE INDEX IF NOT EXISTS idx_users_gender ON public.users(gender);
CREATE INDEX IF NOT EXISTS idx_users_gym_access ON public.users(gym_access);
