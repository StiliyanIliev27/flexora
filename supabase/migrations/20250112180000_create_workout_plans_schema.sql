-- Create workout plans schema
-- This migration creates the database structure for manual workout plan builder

-- Main workout plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    is_active BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Days of the week for each workout plan
CREATE TABLE IF NOT EXISTS public.workout_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
    day_name VARCHAR(100), -- Optional custom name like "Push Day", "Pull Day"
    is_rest_day BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workout_plan_id, day_of_week)
);

-- Exercises within each workout day
CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    exercise_order INTEGER NOT NULL DEFAULT 0,
    default_sets INTEGER,
    default_reps INTEGER,
    default_weight DECIMAL(6,2), -- Optional weight in kg
    default_rest_seconds INTEGER DEFAULT 60,
    default_rpe INTEGER CHECK (default_rpe >= 1 AND default_rpe <= 10), -- Rate of Perceived Exertion
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Individual sets for each exercise (for custom set configurations)
CREATE TABLE IF NOT EXISTS public.exercise_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(6,2), -- Optional weight in kg
    rest_seconds INTEGER DEFAULT 60,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workout_exercise_id, set_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_is_active ON public.workout_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_workout_days_plan_id ON public.workout_days(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_days_day_of_week ON public.workout_days(day_of_week);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_day_id ON public.workout_exercises(workout_day_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_order ON public.workout_exercises(exercise_order);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise_id ON public.exercise_sets(workout_exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_set_number ON public.exercise_sets(set_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_plans
CREATE POLICY "Users can view their own workout plans" ON public.workout_plans
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own workout plans" ON public.workout_plans
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workout plans" ON public.workout_plans
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own workout plans" ON public.workout_plans
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for workout_days
CREATE POLICY "Users can view their workout days" ON public.workout_days
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = workout_plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workout days for their plans" ON public.workout_days
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = workout_plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their workout days" ON public.workout_days
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = workout_plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their workout days" ON public.workout_days
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = workout_plan_id AND user_id = auth.uid()
        )
    );

-- RLS Policies for workout_exercises
CREATE POLICY "Users can view their workout exercises" ON public.workout_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_days wd
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE wd.id = workout_day_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workout exercises for their days" ON public.workout_exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_days wd
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE wd.id = workout_day_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their workout exercises" ON public.workout_exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_days wd
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE wd.id = workout_day_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their workout exercises" ON public.workout_exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_days wd
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE wd.id = workout_day_id AND wp.user_id = auth.uid()
        )
    );

-- RLS Policies for exercise_sets
CREATE POLICY "Users can view their exercise sets" ON public.exercise_sets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workout_days wd ON we.workout_day_id = wd.id
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE we.id = workout_exercise_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create exercise sets for their exercises" ON public.exercise_sets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workout_days wd ON we.workout_day_id = wd.id
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE we.id = workout_exercise_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their exercise sets" ON public.exercise_sets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workout_days wd ON we.workout_day_id = wd.id
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE we.id = workout_exercise_id AND wp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their exercise sets" ON public.exercise_sets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workout_days wd ON we.workout_day_id = wd.id
            JOIN public.workout_plans wp ON wd.workout_plan_id = wp.id
            WHERE we.id = workout_exercise_id AND wp.user_id = auth.uid()
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
