/**
 * ====================================
 * INTENT DETECTION SERVICE
 * ====================================
 *
 * Detects user intent from input text using Google Generative AI
 * or falls back to keyword matching.
 */

import { ViewMode, parseIntent } from '@/contexts/ViewModeContext';

// ====================================
// TYPE DEFINITIONS
// ====================================

/**
 * Narrow type for modes that have fallback responses.
 * Excludes "landing" which is only used for initial state.
 */
type NarrowMode = 'architect' | 'author' | 'lab';

/**
 * Response structure for intent detection.
 */
export interface IntentResponse {
  mode: NarrowMode;
  confidence?: number;
  reasoning?: string;
}

// ====================================
// MAPPER FUNCTION
// ====================================

/**
 * Maps any ViewMode to a NarrowMode.
 * Converts "landing" and other unsupported modes to a sensible default.
 *
 * @param mode - The ViewMode to convert
 * @returns A NarrowMode that createFallbackResponse can handle
 */
function toNarrowMode(mode: ViewMode): NarrowMode {
  if (mode === 'architect' || mode === 'author' || mode === 'lab') {
    return mode;
  }

  // For unsupported modes like "landing", default to "author"
  // This makes sense as "author" is the exploratory/neutral mode
  return 'author';
}

// ====================================
// FALLBACK RESPONSE CREATOR
// ====================================

/**
 * Creates a fallback response when AI is unavailable.
 * Only accepts the narrow set of modes that have responses.
 *
 * @param mode - One of the supported modes
 * @returns IntentResponse with the specified mode
 */
export function createFallbackResponse(mode: NarrowMode): IntentResponse {
  switch (mode) {
    case 'architect':
      return {
        mode: 'architect',
        confidence: 0.7,
        reasoning: 'Keyword-based detection: professional/business intent',
      };

    case 'author':
      return {
        mode: 'author',
        confidence: 0.7,
        reasoning: 'Keyword-based detection: exploratory/educational intent',
      };

    case 'lab':
      return {
        mode: 'lab',
        confidence: 0.7,
        reasoning: 'Keyword-based detection: technical/process intent',
      };
  }
}

// ====================================
// INTENT DETECTION
// ====================================

/**
 * Detects user intent from input text.
 * Uses Google Generative AI if available, otherwise falls back to keyword matching.
 *
 * @param input - User's input text
 * @returns Promise resolving to IntentResponse
 */
export async function detectIntent(input: string): Promise<IntentResponse> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.warn(
      '⚠️  GOOGLE_GENERATIVE_AI_API_KEY not set. Falling back to keyword matching.'
    );
    const mode = parseIntent(input); // returns ViewMode (may include "landing")
    return createFallbackResponse(toNarrowMode(mode)); // narrowed to valid union
  }

  // TODO: Implement Google Generative AI integration
  // For now, fall back to keyword matching even if API key is set
  // This allows the type system to be correct while AI integration is added later
  const mode = parseIntent(input);
  return createFallbackResponse(toNarrowMode(mode));
}

