/**
 * ====================================
 * AI GATEWAY UTILITY - SHARED CONFIGURATION
 * ====================================
 *
 * Centralized configuration for Vercel AI Gateway.
 * Used by both intent detection and whisper generation.
 *
 * This module provides a singleton gateway instance that is
 * initialized once and reused across server actions.
 */

import { createGateway } from '@ai-sdk/gateway';

// ====================================
// GATEWAY INSTANCE
// ====================================

/**
 * Creates the Vercel AI Gateway instance.
 * Uses AI_GATEWAY_API_KEY environment variable.
 * Returns null if API key is not available to prevent errors.
 */
let gateway: ReturnType<typeof createGateway> | null = null;

try {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (apiKey) {
    gateway = createGateway({
      apiKey: apiKey,
    });
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ AI_GATEWAY_API_KEY not set, AI Gateway will not be available');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize AI Gateway:', error);
  gateway = null;
}

// ====================================
// EXPORTS
// ====================================

/**
 * Get the AI Gateway instance.
 * Returns null if not configured.
 */
export function getAIGateway(): ReturnType<typeof createGateway> | null {
  return gateway;
}

/**
 * Check if AI Gateway is available.
 */
export function isAIGatewayAvailable(): boolean {
  return gateway !== null;
}

