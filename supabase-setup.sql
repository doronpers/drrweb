-- ====================================
-- SUPABASE SETUP SQL
-- ====================================
-- 
-- Copy and paste this entire file into:
-- Supabase Dashboard → SQL Editor → New Query
-- Then click "Run"
--
-- This will create the echoes table and set up security policies
-- ====================================

-- Create the echoes table
CREATE TABLE echoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL CHECK (char_length(text) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved echoes
CREATE POLICY "Public can read approved echoes"
ON echoes FOR SELECT
USING (approved = true);

-- Policy: Anyone can insert new echoes (they'll need approval)
CREATE POLICY "Anyone can insert echoes for moderation"
ON echoes FOR INSERT
WITH CHECK (true);

-- ====================================
-- Done! You should see "Success. No rows returned"
-- ====================================

