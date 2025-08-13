-- Migration: Create fitness goals and user fitness goals tables
-- Description: Creates lookup table for fitness goals and many-to-many relationship with users

-- Create fitness_goals table (simplified)
CREATE TABLE public.fitness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert predefined fitness goals
INSERT INTO public.fitness_goals (name) VALUES
('Weight Loss'),
('Muscle Gain'),
('Endurance Improvement'),
('General Fitness'),
('Strength Building'),
('Toning & Definition'),
('Flexibility & Mobility'),
('Sport-Specific Training');

-- Create user_fitness_goals junction table
CREATE TABLE public.user_fitness_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  fitness_goal_id UUID REFERENCES public.fitness_goals(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 1,
  target_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fitness_goal_id)
);

-- Enable RLS
ALTER TABLE public.fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fitness_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read fitness goals" ON public.fitness_goals FOR SELECT USING (true);
CREATE POLICY "Users can manage own fitness goals" ON public.user_fitness_goals FOR ALL USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_user_fitness_goals 
  BEFORE UPDATE ON public.user_fitness_goals 
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_fitness_goals_user_id ON public.user_fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fitness_goals_priority ON public.user_fitness_goals(user_id, priority);
