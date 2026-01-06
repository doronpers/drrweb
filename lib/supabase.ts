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
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
 *    
 *    Note: Supabase calls it "publishable key" in the dashboard, but the
 *    environment variable name is still NEXT_PUBLIC_SUPABASE_ANON_KEY
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

// Validate environment variables
function validateEnvVars(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Supabase not configured. Echo Chamber will use mock data.\n' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
      );
    }
    return null;
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL format');
    return null;
  }

  // Basic key validation (should be a JWT-like string)
  if (key.length < 20) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format');
    return null;
  }

  return { url, key };
}

const envVars = validateEnvVars();

// Create Supabase client (will be null if env vars not set or invalid)
export const supabase = envVars
  ? createClient(envVars.url, envVars.key, {
      auth: {
        persistSession: false, // Don't persist sessions for anonymous access
        autoRefreshToken: false,
      },
      db: {
        schema: 'public', // Explicitly use public schema
      },
    })
  : null;

// Log connection info in development
if (envVars && process.env.NODE_ENV === 'development') {
  console.log('✅ Supabase connected:', envVars.url);
}

// ====================================
// ECHO CHAMBER FUNCTIONS
// ====================================

/**
 * Fetch approved echoes from the database.
 * Returns empty array if Supabase is not configured.
 */
export async function fetchEchoes(): Promise<Echo[]> {
  if (!supabase) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase not configured. Using mock data.');
    }
    return [];
  }

  try {
    // Try with explicit schema (public is default but being explicit helps)
    const { data, error } = await supabase
      .from('echoes')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Supabase error fetching echoes:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      // Don't throw - return empty array for graceful degradation
      return [];
    }
    return data || [];
  } catch (error) {
    // Handle network errors, DNS errors, etc.
    console.error('Error fetching echoes:', error);
    
    // Check if it's a network/DNS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error connecting to Supabase. Echo Chamber will be unavailable.');
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Always return empty array for graceful degradation
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

  // Additional server-side validation (client-side validation already done)
  const sanitized = text.trim();
  if (!sanitized || sanitized.length > 100) {
    console.error('Invalid echo text: length or content validation failed');
    return false;
  }

  try {
    const { error } = await supabase.from('echoes').insert({
      text: sanitized,
      approved: false, // Requires manual approval
    });

    if (error) {
      console.error('Supabase error submitting echo:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      // Return false instead of throwing for graceful error handling
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error submitting echo:', error);
    
    // Check if it's a network/DNS error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error connecting to Supabase. Echo submission failed.');
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Check if error has details property (Supabase error structure)
    if (error && typeof error === 'object' && 'details' in error) {
      console.error('Error details:', (error as { details?: string }).details);
    }
    
    // Always return false for graceful error handling
    return false;
  }
}
