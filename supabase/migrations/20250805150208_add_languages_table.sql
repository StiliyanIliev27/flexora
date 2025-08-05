-- Create languages table for internationalization support
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE, -- ISO language code (en, bg, es, fr, etc.)
  name VARCHAR(100) NOT NULL, -- Language name in English
  native_name VARCHAR(100) NOT NULL, -- Language name in native script
  flag_icon VARCHAR(255), -- URL to flag image in Supabase storage bucket
  direction VARCHAR(3) DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')), -- Text direction
  is_active BOOLEAN DEFAULT true, -- Enable/disable language
  sort_order INTEGER DEFAULT 0, -- Display order
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read languages (needed for language switcher)
CREATE POLICY "Languages are viewable by everyone" ON public.languages
    FOR SELECT USING (is_active = true);

-- Only authenticated users can suggest language updates (for future admin panel)
CREATE POLICY "Authenticated users can view all languages" ON public.languages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_languages
    BEFORE UPDATE ON public.languages
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Insert initial language data (flag URLs will be added after storage setup)
INSERT INTO public.languages (code, name, native_name, flag_icon, direction, is_active, sort_order) VALUES
  ('en', 'English', 'English', '/flags/en.png', 'ltr', true, 1),
  ('bg', 'Bulgarian', 'Български', '/flags/bg.png', 'ltr', true, 2);

-- Add index for performance
CREATE INDEX idx_languages_code ON public.languages(code);
CREATE INDEX idx_languages_active ON public.languages(is_active, sort_order);
