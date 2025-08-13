-- Migration: Add sample exercise data
-- Description: Adds sample exercises with proper equipment and muscle group relationships

-- Add some popular exercises with equipment mappings for testing
-- (This will help verify the migration worked correctly)
DO $$
DECLARE
    bodyweight_id UUID;
    dumbbells_id UUID;
    barbell_id UUID;
    bench_id UUID;
    chest_id UUID;
    triceps_id UUID;
    shoulders_id UUID;
BEGIN
    -- Get equipment IDs
    SELECT id INTO bodyweight_id FROM public.equipment WHERE name = 'Bodyweight';
    SELECT id INTO dumbbells_id FROM public.equipment WHERE name = 'Dumbbells';
    SELECT id INTO barbell_id FROM public.equipment WHERE name = 'Barbell';
    SELECT id INTO bench_id FROM public.equipment WHERE name = 'Bench';
    
    -- Get muscle group IDs
    SELECT id INTO chest_id FROM public.muscle_groups WHERE name = 'Chest';
    SELECT id INTO triceps_id FROM public.muscle_groups WHERE name = 'Triceps';
    SELECT id INTO shoulders_id FROM public.muscle_groups WHERE name = 'Shoulders';
    
    -- Insert sample exercises with proper equipment and muscle group relationships
    -- Only insert if exercises with these names don't already exist
    IF NOT EXISTS (SELECT 1 FROM public.exercises WHERE name = 'Push-ups') THEN
        INSERT INTO public.exercises (
            name, 
            difficulty_level, 
            instructions, 
            video_url,
            equipment_ids,
            muscle_group_ids,
            is_public
        ) VALUES (
            'Push-ups', 
            'beginner',
            'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
            'https://example.com/pushup-video',
            ARRAY[bodyweight_id],
            ('{"primary": ["' || chest_id || '", "' || triceps_id || '"], "secondary": ["' || shoulders_id || '"]}')::jsonb,
            true
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.exercises WHERE name = 'Dumbbell Bench Press') THEN
        INSERT INTO public.exercises (
            name, 
            difficulty_level, 
            instructions, 
            video_url,
            equipment_ids,
            muscle_group_ids,
            is_public
        ) VALUES (
            'Dumbbell Bench Press',
            'intermediate',
            'Lie on a bench holding dumbbells. Press the weights up until your arms are extended, then lower with control.',
            'https://example.com/db-bench-video',
            ARRAY[dumbbells_id, bench_id],
            ('{"primary": ["' || chest_id || '"], "secondary": ["' || triceps_id || '", "' || shoulders_id || '"]}')::jsonb,
            true
        );
    END IF;
END $$;
