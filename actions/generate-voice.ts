'use server';

/**
 * ====================================
 * VOICE GENERATION - ELEVENLABS INTEGRATION
 * ====================================
 *
 * Server action for generating voice audio from text using ElevenLabs API.
 * Handles API calls, error handling, and returns audio data for playback.
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// ====================================
// CLIENT INITIALIZATION
// ====================================

let client: ElevenLabsClient | null = null;

try {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (apiKey) {
    client = new ElevenLabsClient({
      apiKey,
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ElevenLabs client initialized');
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ ELEVENLABS_API_KEY not set. Voice generation will be unavailable.');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize ElevenLabs client:', error);
  client = null;
}

// ====================================
// TYPE DEFINITIONS
// ====================================

export interface GenerateVoiceResult {
  success: boolean;
  audioData?: ArrayBuffer;
  audioUrl?: string;
  error?: string;
}

// ====================================
// SERVER ACTION
// ====================================

/**
 * Generate voice audio from text using ElevenLabs API.
 * 
 * @param text - The text to convert to speech
 * @param voiceId - The ElevenLabs voice ID to use
 * @returns Audio data as ArrayBuffer and optional URL for caching
 */
export async function generateVoice(
  text: string,
  voiceId: string
): Promise<GenerateVoiceResult> {
  if (!client) {
    return {
      success: false,
      error: 'ElevenLabs API not configured (ELEVENLABS_API_KEY not set)',
    };
  }

  // Validate inputs
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: 'Text cannot be empty',
    };
  }

  if (!voiceId || voiceId.trim().length === 0) {
    return {
      success: false,
      error: 'Voice ID cannot be empty',
    };
  }

  // Limit text length to prevent abuse (whispers are short anyway)
  const sanitized = text.trim().slice(0, 500);
  if (sanitized.length === 0) {
    return {
      success: false,
      error: 'Text is too short after sanitization',
    };
  }

  try {
    // Generate voice using ElevenLabs API
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text: sanitized,
      modelId: 'eleven_monolingual_v1', // High quality model
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        useSpeakerBoost: true,
      },
    });

    // Convert ReadableStream to ArrayBuffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Combine chunks into single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioData = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }

    // Create blob URL for caching (client-side will handle this)
    // We return the ArrayBuffer and let the client create the URL
    return {
      success: true,
      audioData: audioData.buffer,
    };
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return {
          success: false,
          error: 'Voice generation quota exceeded. Please try again later.',
        };
      }
      if (error.message.includes('invalid') || error.message.includes('not found')) {
        return {
          success: false,
          error: 'Invalid voice ID or API configuration.',
        };
      }
      return {
        success: false,
        error: `Voice generation failed: ${error.message}`,
      };
    }

    return {
      success: false,
      error: 'Unknown error during voice generation',
    };
  }
}

/**
 * Get list of available voices from ElevenLabs.
 * Useful for voice selector UI.
 */
export async function getAvailableVoices(): Promise<{
  success: boolean;
  voices?: Array<{ voice_id: string; name: string; category?: string }>;
  error?: string;
}> {
  if (!client) {
    return {
      success: false,
      error: 'ElevenLabs API not configured',
    };
  }

  try {
    const voices = await client.voices.getAll();
    
    // Format voices for UI
    const formattedVoices = voices.voices
      .filter((voice) => voice.voiceId && voice.name) // Filter out invalid voices
      .map((voice) => ({
        voice_id: voice.voiceId,
        name: voice.name || 'Unknown',
        category: voice.category || 'premade',
      }));

    return {
      success: true,
      voices: formattedVoices,
    };
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch voices',
    };
  }
}
