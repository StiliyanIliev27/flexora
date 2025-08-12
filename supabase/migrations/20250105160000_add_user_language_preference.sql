-- Add language preference column to users table
ALTER TABLE public.users 
ADD COLUMN language_preference VARCHAR(5) DEFAULT 'en';

-- Add comment for documentation
COMMENT ON COLUMN public.users.language_preference IS 'User preferred language code (e.g., en, bg)';

-- Update existing users to have default language preference
UPDATE public.users 
SET language_preference = 'en' 
WHERE language_preference IS NULL;

-- Add constraint to ensure only valid language codes
ALTER TABLE public.users 
ADD CONSTRAINT users_language_preference_check 
CHECK (language_preference IN ('en', 'bg'));

-- Update the updated_at trigger to include language_preference changes
-- (The trigger already exists, this ensures it fires on language_preference updates)