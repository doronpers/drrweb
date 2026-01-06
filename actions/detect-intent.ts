/**
 * ====================================
 * GHOST ROUTER - INTENT DETECTION SERVER ACTION
 * ====================================
 *
 * This Server Action uses Anthropic Claude (or Vercel AI Gateway) to analyze
 * user input and route to the appropriate view mode.
 *
 * Philosophy:
 * - Generate routing data, not chat responses
 * - Fast inference with Claude Sonnet
 * - Audio parameters derived from intent
 * - Fallback to keyword matching if AI unavailable
 *
 * Input: User string from Landing Page
 * Output: { targetMode, audioParams }
 */

'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { ViewMode, parseIntent } from '@/contexts/ViewModeContext';
import { getModel, isAIGatewayAvailable } from '@/lib/ai-gateway';

// ====================================
// TYPE DEFINITIONS
// ====================================

/**
 * Narrow type for modes that have fallback responses.
 * Excludes "landing" which is only used for initial state.
 */
type NarrowMode = 'architect' | 'author' | 'lab';

/**
 * Response schema for intent detection
 */
const IntentSchema = z.object({
  targetMode: z.enum(['architect', 'author', 'lab']).describe(
    'The view mode that best matches the user intent'
  ),
  audioParams: z.object({
    reverb: z.number().min(0).max(1).describe(
      'Reverb wet/dry amount (0 = dry/architect, 1 = wet/author)'
    ),
    filter: z.number().min(200).max(2000).describe(
      'Filter cutoff frequency in Hz (200 = dark/lab, 2000 = bright/architect)'
    ),
  }).describe('Audio parameters for the soundscape'),
});

export type IntentResponse = z.infer<typeof IntentSchema>;

// ====================================
// GATEWAY CONFIGURATION
// ====================================
// Gateway is now initialized in lib/ai-gateway.ts and shared across server actions

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
// SERVER ACTION
// ====================================

/**
 * Analyzes user input and returns routing information.
 * Uses hybrid approach:
 * - Single word: Fast keyword matching (free, instant)
 * - Multiple words: AI Gateway for natural language understanding (uses credits)
 *
 * @param input - The user's search query
 * @returns Promise<IntentResponse> - Target mode and audio parameters
 */
export async function detectIntent(input: string): Promise<IntentResponse> {
  // Validate input
  if (!input || input.trim().length === 0) {
    return createFallbackResponse('architect');
  }

  const trimmedInput = input.trim();
  const words = trimmedInput.split(/\s+/).filter(word => word.length > 0);
  const isSingleWord = words.length === 1;

  // Single word: Use fast keyword matching
  if (isSingleWord) {
    if (process.env.NODE_ENV === 'development') {
      console.log('⚡ Single word detected, using keyword matching...');
    }
    const mode = parseIntent(trimmedInput); // returns ViewMode (may include "landing")
    const result = createFallbackResponse(toNarrowMode(mode));
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Keyword matching result:', result.targetMode);
    }
    return result;
  }

  // Multiple words: Use AI for natural language understanding
  if (!isAIGatewayAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  No AI API key set (ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY). Falling back to keyword matching.');
    }
    const mode = parseIntent(trimmedInput); // returns ViewMode (may include "landing")
    const fallbackResult = createFallbackResponse(toNarrowMode(mode));
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Keyword matching result:', fallbackResult.targetMode);
    }
    return fallbackResult;
  }

  try {
    // Use Anthropic Claude (or Gateway) for intent detection
    if (process.env.NODE_ENV === 'development') {
      console.log('🤖 Multiple words detected, using AI for intent detection...');
    }
    
    // Safely get model - catch errors if provider isn't actually available
    let model;
    try {
      model = getModel('claude-3-5-sonnet-20241022');
    } catch (modelError) {
      console.error('❌ Failed to get AI model:', modelError);
      // Fallback to keyword matching if model unavailable
      const mode = parseIntent(trimmedInput);
      return createFallbackResponse(toNarrowMode(mode));
    }
    
    const { object } = await generateObject({
      model: model as any, // Type assertion needed for V2/V3 compatibility
      schema: IntentSchema,
      prompt: buildPrompt(trimmedInput),
      temperature: 0.3, // Lower temperature for more consistent routing
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ AI intent detected:', object.targetMode);
    }
    return object;

  } catch (error) {
    console.error('❌ AI Gateway request failed:', error);
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Falling back to keyword matching...');
    }
    // Fallback to keyword matching on error
    const mode = parseIntent(trimmedInput); // returns ViewMode (may include "landing")
    const fallbackResult = createFallbackResponse(toNarrowMode(mode));
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Keyword matching result:', fallbackResult.targetMode);
    }
    return fallbackResult;
  }
}

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Builds the AI prompt for intent detection.
 * Clear instructions for routing, not chat.
 */
function buildPrompt(input: string): string {
  return `You are a routing assistant for a personal website with three distinct view modes. Analyze the user's intent and route them to the most appropriate mode.

User input: "${input}"

View Modes:
1. ARCHITECT - For business, hiring, professional services, CV, credentials, ROI
   - Keywords: hire, work, business, consulting, professional, portfolio, experience
   - Audio: Dry, precise (low reverb, high filter)
   
2. AUTHOR - For reading, learning, philosophy, teaching, exploration
   - Keywords: story, read, philosophy, teaching, learning, thought, ideas
   - Audio: Warm, spacious (high reverb, medium filter)
   
3. LAB - For process, code, making, technical details, behind-the-scenes
   - Keywords: how, process, build, code, technical, experiment, making
   - Audio: Raw, textured (medium reverb, low filter)

Instructions:
- Analyze the intent behind the user's input
- Choose the mode that best matches their goal
- Set audio parameters that match the mode aesthetic:
  * Architect: reverb: 0.1, filter: 1500-2000 Hz (dry, bright)
  * Author: reverb: 0.8, filter: 800-1200 Hz (warm, medium)
  * Lab: reverb: 0.3, filter: 300-600 Hz (textured, dark)
- Be decisive - choose one mode
- If ambiguous, default to ARCHITECT

Return ONLY the routing data. Do not generate conversational responses.`;
}

/**
 * Creates a fallback response using keyword matching.
 * Used when AI is unavailable or errors occur.
 */
function createFallbackResponse(mode: NarrowMode): IntentResponse {
  // Map modes to audio parameters
  const audioParamsMap: Record<NarrowMode, { reverb: number; filter: number }> = {
    architect: { reverb: 0.1, filter: 1800 },
    author: { reverb: 0.8, filter: 1000 },
    lab: { reverb: 0.3, filter: 400 },
  };

  return {
    targetMode: mode,
    audioParams: audioParamsMap[mode],
  };
}

// ====================================
// VALIDATION & TESTING HELPERS
// ====================================

/**
 * Test function for validating intent detection (dev only).
 * Can be called from dev tools or test files.
 */
export async function testIntentDetection(inputs: string[]): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.error('Test function disabled in production');
    return;
  }

  console.log('🧪 Testing intent detection...\n');
  
  for (const input of inputs) {
    const result = await detectIntent(input);
    console.log(`Input: "${input}"`);
    console.log(`→ Mode: ${result.targetMode}`);
    console.log(`→ Audio: reverb=${result.audioParams.reverb}, filter=${result.audioParams.filter}Hz\n`);
  }
}
