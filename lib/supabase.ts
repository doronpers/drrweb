/**
 * ====================================
 * SUPABASE CLIENT CONFIGURATION
 * ====================================
 *
 * Client for interacting with Supabase backend.
 * Currently used for the Echo Chamber feature.
 *
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Create an 'echoes' table with the following schema:
 *
 *    CREATE TABLE echoes (
 *      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *      text TEXT NOT NULL CHECK (char_length(text) <= 100),
 *      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *      approved BOOLEAN DEFAULT false
 *    );
 *
 * 3. Enable Row Level Security (RLS):
 *
 *    ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;
 *
 * 4. Create a policy for public reads of approved echoes:
 *
 *    CREATE POLICY "Public can read approved echoes"
 *    ON echoes FOR SELECT
 *    USING (approved = true);
 *
 * 5. Create a policy for authenticated inserts:
 *
 *    CREATE POLICY "Anyone can insert echoes for moderation"
 *    ON echoes FOR INSERT
 *    WITH CHECK (true);
 *
 * 6. Add your Supabase credentials to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=your_project_url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 */

import { createClient } from '@supabase/supabase-js';

// ====================================
// TYPE DEFINITIONS
// ====================================

export interface Echo {
  id: string;
  text: string;
  created_at: string;
  approved: boolean;
}

// ====================================
// CLIENT INITIALIZATION
// ====================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client (will be undefined if env vars not set)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ====================================
// ECHO CHAMBER FUNCTIONS
// ====================================

/**
 * Fetch approved echoes from the database.
 * Returns empty array if Supabase is not configured.
 */
export async function fetchEchoes(): Promise<Echo[]> {
  if (!supabase) {
    console.warn('Supabase not configured. Using mock data.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('echoes')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching echoes:', error);
    return [];
  }
}

/**
 * Submit a new echo for moderation.
 * Returns success boolean.
 */
export async function submitEcho(text: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured. Echo not submitted.');
    return false;
  }

  try {
    const { error } = await supabase.from('echoes').insert({
      text: text.trim(),
      approved: false, // Requires manual approval
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting echo:', error);
    return false;
  }
}
