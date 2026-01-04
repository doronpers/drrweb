'use server';

/**
 * ====================================
 * AI WHISPER GENERATION - SERVER ACTION
 * ====================================
 *
 * Generates contextual whispers using AI when available.
 * Falls back gracefully to curated content if AI is unavailable.
 *
 * Uses Vercel AI Gateway (same as intent detection) for generation.
 */

import { createGateway } from '@ai-sdk/gateway';
import { generateText } from 'ai';
import { type ViewMode, type TimeOfDay, type WhisperMood } from '@/lib/whispers';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface GenerateWhisperParams {
  mode: ViewMode;
  timeOfDay: TimeOfDay;
  userIntent?: string;
  mood?: WhisperMood;
  existingWhispers?: string[];
}

interface GenerateWhisperResult {
  success: boolean;
  whisper?: string;
  mood?: WhisperMood;
  error?: string;
}

// ====================================
// GATEWAY CONFIGURATION
// ====================================

/**
 * Creates the Vercel AI Gateway instance.
 * Uses AI_GATEWAY_API_KEY environment variable (same as intent detection).
 */
let gateway: ReturnType<typeof createGateway> | null = null;

try {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (apiKey) {
    gateway = createGateway({
      apiKey: apiKey,
    });
  }
} catch (error) {
  console.error('❌ Failed to initialize AI Gateway for whispers:', error);
  gateway = null;
}

// ====================================
// CONFIGURATION
// ====================================

const SYSTEM_PROMPT = `You are a poetic, philosophical voice that generates short, evocative text fragments.
Your whispers should be:
- Brief (5-15 words typically)
- Thought-provoking but not pretentious
- Contextually relevant but not obvious
- Slightly mysterious, like fragments of overheard conversation
- Never promotional or salesy
- Never questions directed AT the reader (avoid "you")
- Mix of statements, fragments, and occasional gentle questions

Style references: fortune cookies meets design museum wall text meets haiku meets wisdom literature.`;

const MODE_PROMPTS: Record<ViewMode, string> = {
  landing: 'The viewer is at a threshold, about to choose their path. Themes: possibility, beginnings, anticipation, the liminal.',
  architect: 'The viewer seeks structure, systems, professional capability. Themes: building, efficiency, elegance in complexity, the satisfaction of good architecture.',
  author: 'The viewer seeks narrative, ideas, creative expression. Themes: story, voice, the craft of words, ideas taking shape.',
  lab: 'The viewer seeks process, experimentation, raw creation. Themes: iteration, failure as learning, the joy of making, emergence.',
};

const TIME_PROMPTS: Record<TimeOfDay, string> = {
  dawn: 'It is early morning - fresh starts, quiet potential.',
  morning: 'It is morning - clarity, building momentum.',
  afternoon: 'It is afternoon - sustained effort, midpoint reflection.',
  dusk: 'It is evening - transitions, winding down, golden hour thinking.',
  night: 'It is night - deeper thoughts, the subconscious surfacing.',
  witching: 'It is the small hours - liminal time, when strange thoughts feel natural.',
};

// ====================================
// AI GENERATION FUNCTION
// ====================================

/**
 * Generate a contextual whisper using Vercel AI Gateway
 */
/**
 * Sanitize user input to prevent prompt injection
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>{}[\]]/g, '') // Remove brackets
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .slice(0, 200) // Limit length
    .trim();
}

export async function generateWhisper(
  params: GenerateWhisperParams
): Promise<GenerateWhisperResult> {
  const { mode, timeOfDay, userIntent, mood, existingWhispers = [] } = params;

  // Sanitize user intent if provided
  const safeUserIntent = userIntent ? sanitizeInput(userIntent) : undefined;
  
  // Sanitize existing whispers
  const safeExistingWhispers = existingWhispers
    .slice(0, 10) // Limit number
    .map(w => sanitizeInput(w));

  // Check for API key
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'AI generation not configured (AI_GATEWAY_API_KEY not set)',
    };
  }

  if (!gateway) {
    return {
      success: false,
      error: 'AI Gateway not initialized',
    };
  }

  try {
    // Build the prompt with sanitized inputs
    const contextPrompt = `
${MODE_PROMPTS[mode]}
${TIME_PROMPTS[timeOfDay]}
${safeUserIntent ? `The user's stated intent was: "${safeUserIntent}"` : ''}
${mood ? `Lean toward a ${mood} mood.` : ''}
${safeExistingWhispers.length > 0 ? `\nAvoid these existing whispers:\n${safeExistingWhispers.slice(0, 5).map(w => `- "${w}"`).join('\n')}` : ''}

Generate ONE short whisper fragment. Just the text, no quotes, no explanation.`;

    // Add timeout to prevent hanging (10 second limit)
    const timeoutMs = 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const { text } = await generateText({
        model: gateway('google/gemini-1.5-flash'), // Same model as intent detection
        system: SYSTEM_PROMPT,
        prompt: contextPrompt + '\n\n(Keep response under 20 words)',
        temperature: 0.9, // Higher creativity for varied whispers
        abortSignal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!text) {
        return {
          success: false,
          error: 'No content in response',
        };
      }

      // Clean up the response (remove quotes if present)
      const cleanedWhisper = text
        .replace(/^["']|["']$/g, '')
        .replace(/^\.{3}|\.{3}$/g, '')
        .trim();

      // Validate whisper length (should be brief)
      if (cleanedWhisper.length > 150) {
        return {
          success: false,
          error: 'Generated whisper too long',
        };
      }

      if (cleanedWhisper.length < 3) {
        return {
          success: false,
          error: 'Generated whisper too short',
        };
      }

      // Determine mood based on content (simple heuristic)
      const inferredMood = inferMood(cleanedWhisper, mode);

      if (process.env.NODE_ENV === 'development') {
        console.log('✨ AI whisper generated:', cleanedWhisper);
      }

      return {
        success: true,
        whisper: cleanedWhisper,
        mood: inferredMood,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    // Handle abort specifically
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Whisper generation timed out');
      return {
        success: false,
        error: 'Generation timed out',
      };
    }
    
    console.error('Whisper generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate multiple whispers at once (batch)
 */
export async function generateWhisperBatch(
  params: GenerateWhisperParams,
  count: number = 3
): Promise<GenerateWhisperResult[]> {
  // For now, generate sequentially to avoid rate limits
  // Could be parallelized with proper rate limiting
  const results: GenerateWhisperResult[] = [];
  const generated: string[] = [...(params.existingWhispers || [])];

  for (let i = 0; i < count; i++) {
    const result = await generateWhisper({
      ...params,
      existingWhispers: generated,
    });
    
    results.push(result);
    
    if (result.success && result.whisper) {
      generated.push(result.whisper);
    }
    
    // Small delay between requests
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Infer mood from whisper content
 */
function inferMood(text: string, mode: ViewMode): WhisperMood {
  const lower = text.toLowerCase();
  
  // Check for mood indicators
  if (/\?$/.test(text) || /wonder|question|seek|what if/i.test(lower)) {
    return 'contemplative';
  }
  
  if (/code|system|build|architecture|pattern|structure/i.test(lower)) {
    return 'technical';
  }
  
  if (/story|voice|word|write|narrative|character/i.test(lower)) {
    return 'creative';
  }
  
  if (/shadow|hidden|beneath|secret|unknown|emerge/i.test(lower)) {
    return 'mysterious';
  }
  
  // Fall back to mode-based mood
  switch (mode) {
    case 'architect': return 'technical';
    case 'author': return 'creative';
    case 'lab': return 'mysterious';
    default: return 'philosophical';
  }
}
