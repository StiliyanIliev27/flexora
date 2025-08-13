-- Migration: Create equipment and user equipment tables
-- Description: Creates lookup table for equipment and many-to-many relationship with users

-- Create equipment table
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50),
  description TEXT,
  is_gym_equipment BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common equipment
INSERT INTO public.equipment (name, category, is_gym_equipment) VALUES
('Bodyweight', 'bodyweight', false),
('Dumbbells', 'strength', false),
('Resistance Bands', 'strength', false),
('Pull-up Bar', 'strength', false),
('Yoga Mat', 'flexibility', false),
('Kettlebell', 'strength', false),
('Barbell', 'strength', true),
('Olympic Barbell', 'strength', true),
('EZ Curl Bar', 'strength', true),
('Bench', 'strength', true),
('Incline Bench', 'strength', true),
('Decline Bench', 'strength', true),
('Power Rack', 'strength', true),
('Smith Machine', 'strength', true),
('Cable Machine', 'strength', true),
('Lat Pulldown Machine', 'strength', true),
('Leg Press Machine', 'strength', true),
('Leg Curl Machine', 'strength', true),
('Leg Extension Machine', 'strength', true),
('Treadmill', 'cardio', true),
('Stationary Bike', 'cardio', true),
('Elliptical', 'cardio', true),
('Rowing Machine', 'cardio', true),
('Stair Climber', 'cardio', true);

-- Create user_equipment junction table
CREATE TABLE public.user_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  has_access BOOLEAN DEFAULT true,
  location VARCHAR(20) CHECK (location IN ('home', 'gym', 'both')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, equipment_id)
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Users can manage own equipment" ON public.user_equipment FOR ALL USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_equipment 
  BEFORE UPDATE ON public.equipment 
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_is_gym ON public.equipment(is_gym_equipment);
CREATE INDEX IF NOT EXISTS idx_user_equipment_user_id ON public.user_equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_user_equipment_location ON public.user_equipment(user_id, location);
