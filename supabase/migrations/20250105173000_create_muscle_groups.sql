-- Migration: Create muscle groups table
-- Description: Creates lookup table for muscle groups to be used in exercises

-- Create muscle_groups table
CREATE TABLE public.muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50), -- 'upper', 'lower', 'core', 'full-body'
  is_active BOOLEAN DEFAULT true
);

-- Insert comprehensive muscle groups
INSERT INTO public.muscle_groups (name, category) VALUES
-- Upper Body
('Chest', 'upper'),
('Upper Chest', 'upper'),
('Lower Chest', 'upper'),
('Triceps', 'upper'),
('Shoulders', 'upper'),
('Front Deltoids', 'upper'),
('Side Deltoids', 'upper'),
('Rear Deltoids', 'upper'),
('Back', 'upper'),
('Lats', 'upper'),
('Rhomboids', 'upper'),
('Traps', 'upper'),
('Middle Traps', 'upper'),
('Lower Traps', 'upper'),
('Biceps', 'upper'),
('Forearms', 'upper'),

-- Lower Body
('Quadriceps', 'lower'),
('Hamstrings', 'lower'),
('Glutes', 'lower'),
('Calves', 'lower'),
('Shins', 'lower'),
('Hip Flexors', 'lower'),
('IT Band', 'lower'),

-- Core
('Abs', 'core'),
('Upper Abs', 'core'),
('Lower Abs', 'core'),
('Obliques', 'core'),
('Lower Back', 'core'),
('Erector Spinae', 'core'),

-- Full Body
('Full Body', 'full-body'),
('Cardio', 'full-body');

-- Enable RLS
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read muscle groups" ON public.muscle_groups FOR SELECT USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_muscle_groups_category ON public.muscle_groups(category);
CREATE INDEX IF NOT EXISTS idx_muscle_groups_active ON public.muscle_groups(is_active);
