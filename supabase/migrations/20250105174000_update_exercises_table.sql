-- Migration: Update exercises table structure
-- Description: Adds new columns for equipment IDs and muscle group IDs, preserves existing data

-- Add new columns to exercises table
ALTER TABLE public.exercises 
  ADD COLUMN IF NOT EXISTS equipment_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS muscle_group_ids JSONB DEFAULT '{"primary": [], "secondary": []}',
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add check constraint for muscle_group_ids JSON structure
ALTER TABLE public.exercises ADD CONSTRAINT check_muscle_group_ids_structure 
  CHECK (
    muscle_group_ids ? 'primary' AND 
    muscle_group_ids ? 'secondary' AND
    jsonb_typeof(muscle_group_ids->'primary') = 'array' AND
    jsonb_typeof(muscle_group_ids->'secondary') = 'array'
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercises_equipment_ids ON public.exercises USING GIN(equipment_ids);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group_ids ON public.exercises USING GIN(muscle_group_ids);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_public ON public.exercises(is_public);
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON public.exercises(created_by);
