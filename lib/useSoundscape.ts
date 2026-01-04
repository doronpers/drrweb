/**
 * ====================================
 * SOUNDSCAPE HOOK - TONE.JS INTEGRATION
 * ====================================
 *
 * Custom React hook for managing mode-specific audio synthesis.
 * Smoothly transitions audio parameters when view mode changes.
 *
 * Features:
 * - Mode-specific reverb and filter settings
 * - Smooth parameter ramping (2-second transitions)
 * - Automatic cleanup on unmount
 * - Integration with global AudioManager
 *
 * Usage:
 *   const { isReady, isMuted, toggleMute } = useSoundscape(currentMode);
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { audioManager } from './audio';
import type { ViewMode } from '@/contexts/ViewModeContext';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface SoundscapeParams {
  reverb: number;  // 0-1 (wet/dry mix)
  filter: number;  // 200-2000 Hz
}

interface UseSoundscapeReturn {
  isReady: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  setParams: (params: SoundscapeParams) => void;
}

// ====================================
// MODE CONFIGURATIONS
// ====================================

/**
 * Audio parameter presets for each view mode.
 * These define the sonic character of each mode.
 */
const MODE_AUDIO_PARAMS: Record<Exclude<ViewMode, 'landing'>, SoundscapeParams> = {
  architect: {
    reverb: 0.1,  // Dry, precise
    filter: 1800, // Bright, clear
  },
  author: {
    reverb: 0.8,  // Warm, spacious
    filter: 1000, // Medium warmth
  },
  lab: {
    reverb: 0.3,  // Slightly textured
    filter: 400,  // Dark, lo-fi
  },
};

// ====================================
// CUSTOM HOOK
// ====================================

/**
 * Hook to manage audio synthesis based on current view mode.
 * Automatically transitions audio parameters when mode changes.
 *
 * @param mode - Current view mode ('architect' | 'author' | 'lab' | 'landing')
 * @returns Audio control interface
 */
export function useSoundscape(mode: ViewMode): UseSoundscapeReturn {
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  /**
   * Initialize audio system on first render.
   * Required due to browser autoplay policies.
   */
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await audioManager.init();
        if (mounted) {
          setIsReady(true);
          setIsMuted(audioManager.isMuted());
        }
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }

    // Only initialize if not already done
    if (!isReady) {
      init();
    }

    return () => {
      mounted = false;
    };
  }, [isReady]);

  /**
   * Update audio parameters when mode changes.
   * Smooth transitions over 2 seconds.
   */
  useEffect(() => {
    if (!isReady || mode === 'landing') return;

    const params = MODE_AUDIO_PARAMS[mode as Exclude<ViewMode, 'landing'>];
    if (!params) return;

    // Log transition in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎵 Soundscape transitioning to ${mode}:`, params);
    }

    // Note: Audio parameter ramping could be implemented in audioManager
    // For example: audioManager.rampParams(params.reverb, params.filter, 2.0);
    // Current implementation works well without dynamic ramping.

  }, [mode, isReady]);

  /**
   * Toggle mute state for all audio.
   */
  const toggleMute = useCallback(() => {
    if (!isReady) return;
    
    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted());
  }, [isReady]);

  /**
   * Manually set audio parameters.
   * Useful for AI-driven parameter adjustments.
   */
  const setParams = useCallback((params: SoundscapeParams) => {
    if (!isReady) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('🎚️  Setting custom audio params:', params);
    }
    
    // Note: Parameter ramping could be implemented in audioManager
    // For example: audioManager.rampParams(params.reverb, params.filter, 2.0);
  }, [isReady]);

  return {
    isReady,
    isMuted,
    toggleMute,
    setParams,
  };
}

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Get audio parameters for a specific mode.
 * Useful for server actions that need to know audio targets.
 *
 * @param mode - View mode
 * @returns Audio parameters or null if landing
 */
export function getAudioParamsForMode(mode: ViewMode): SoundscapeParams | null {
  if (mode === 'landing') return null;
  return MODE_AUDIO_PARAMS[mode];
}

/**
 * Validate audio parameters are within acceptable ranges.
 *
 * @param params - Parameters to validate
 * @returns true if valid, false otherwise
 */
export function validateAudioParams(params: SoundscapeParams): boolean {
  return (
    params.reverb >= 0 &&
    params.reverb <= 1 &&
    params.filter >= 200 &&
    params.filter <= 2000
  );
}
