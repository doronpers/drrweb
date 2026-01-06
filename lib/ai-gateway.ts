/**
 * ====================================
 * AI GATEWAY UTILITY - SHARED CONFIGURATION
 * ====================================
 *
 * Centralized configuration for AI providers.
 * Supports both Anthropic (direct) and Vercel AI Gateway.
 * Used by both intent detection and whisper generation.
 *
 * Priority:
 * 1. ANTHROPIC_API_KEY (direct Anthropic API)
 * 2. AI_GATEWAY_API_KEY (Vercel AI Gateway)
 */

import { createGateway } from '@ai-sdk/gateway';
import { createAnthropic } from '@ai-sdk/anthropic';

// ====================================
// PROVIDER TYPES
// ====================================

type AIProvider = 'anthropic' | 'gateway' | null;

// ====================================
// PROVIDER INSTANCES
// ====================================

let anthropicProvider: ReturnType<typeof createAnthropic> | null = null;
let gateway: ReturnType<typeof createGateway> | null = null;
let activeProvider: AIProvider = null;

// ====================================
// INITIALIZATION
// ====================================

/**
 * Initialize AI providers based on available API keys.
 * Priority: Anthropic direct > Vercel Gateway
 */
try {
  // Check for Anthropic API key first (direct access)
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicApiKey) {
    anthropicProvider = createAnthropic({
      apiKey: anthropicApiKey,
    });
    activeProvider = 'anthropic';
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Anthropic API configured (direct)');
    }
  } else {
    // Fall back to Vercel AI Gateway
    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;
    if (gatewayApiKey) {
      gateway = createGateway({
        apiKey: gatewayApiKey,
      });
      activeProvider = 'gateway';
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Vercel AI Gateway configured');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No AI API keys found. Set ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY');
      }
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize AI providers:', error);
  activeProvider = null;
}

// ====================================
// MODEL HELPERS
// ====================================

/**
 * Get the appropriate model identifier based on active provider
 */
function getModelIdentifier(modelName: string): string {
  if (activeProvider === 'anthropic') {
    // Anthropic model names (e.g., 'claude-3-5-sonnet-20241022')
    return modelName;
  } else if (activeProvider === 'gateway') {
    // Gateway model names (e.g., 'anthropic/claude-3-5-sonnet-20241022')
    return `anthropic/${modelName}`;
  }
  throw new Error('No AI provider available');
}

/**
 * Get model instance for use with AI SDK
 * Returns a model compatible with the AI SDK's generateObject and generateText functions
 * Type is flexible to support both V2 and V3 model specifications
 */
export function getModel(
  modelName: string = 'claude-3-5-sonnet-20241022'
): ReturnType<NonNullable<typeof anthropicProvider>> | ReturnType<NonNullable<typeof gateway>> {
  if (activeProvider === 'anthropic' && anthropicProvider) {
    return anthropicProvider(modelName) as ReturnType<NonNullable<typeof anthropicProvider>>;
  } else if (activeProvider === 'gateway' && gateway) {
    return gateway(getModelIdentifier(modelName)) as ReturnType<NonNullable<typeof gateway>>;
  }
  throw new Error('No AI provider available');
}

// ====================================
// EXPORTS
// ====================================

/**
 * Get the active AI provider type
 */
export function getActiveProvider(): AIProvider {
  return activeProvider;
}

/**
 * Check if any AI provider is available
 */
export function isAIGatewayAvailable(): boolean {
  return activeProvider !== null;
}

/**
 * Get Anthropic provider (if configured)
 */
export function getAnthropicProvider(): ReturnType<typeof createAnthropic> | null {
  return anthropicProvider;
}

/**
 * Get Gateway instance (if configured)
 */
export function getAIGateway(): ReturnType<typeof createGateway> | null {
  return gateway;
}

