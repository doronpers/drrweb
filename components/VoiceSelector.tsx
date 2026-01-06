'use client';

/**
 * ====================================
 * VOICE SELECTOR - ELEVENLABS VOICE CHOICE
 * ====================================
 *
 * Subtle UI component for selecting ElevenLabs voice.
 * Stores preference in localStorage and integrates with voice manager.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvailableVoices } from '@/actions/generate-voice';
import { voiceManager } from '@/lib/voice';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
}

// ====================================
// COMPONENT
// ====================================

export default function VoiceSelector() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load voices and selected preference on mount
   */
  useEffect(() => {
    async function loadVoices() {
      try {
        const result = await getAvailableVoices();
        if (result.success && result.voices) {
          setVoices(result.voices);
          
          // Set default to first voice if none selected
          const stored = localStorage.getItem('elevenlabs-voice-id');
          const defaultVoice = stored || result.voices[0]?.voice_id || '21m00Tcm4TlvDq8ikWAM'; // Rachel fallback
          setSelectedVoiceId(defaultVoice);
          voiceManager.setDefaultVoice(defaultVoice);
        } else {
          // Fallback to default voice if API fails
          const defaultVoice = '21m00Tcm4TlvDq8ikWAM'; // Rachel
          setSelectedVoiceId(defaultVoice);
          voiceManager.setDefaultVoice(defaultVoice);
        }
      } catch (error) {
        console.error('Failed to load voices:', error);
        // Fallback to default
        const defaultVoice = '21m00Tcm4TlvDq8ikWAM';
        setSelectedVoiceId(defaultVoice);
        voiceManager.setDefaultVoice(defaultVoice);
      } finally {
        setIsLoading(false);
      }
    }

    loadVoices();
  }, []);

  /**
   * Handle voice selection
   */
  const handleVoiceChange = useCallback((voiceId: string) => {
    setSelectedVoiceId(voiceId);
    voiceManager.setDefaultVoice(voiceId);
    setIsOpen(false);
    
    if (process.env.NODE_ENV === 'development') {
      const voice = voices.find(v => v.voice_id === voiceId);
      console.log(`🎤 Voice changed to: ${voice?.name || voiceId}`);
    }
  }, [voices]);

  const selectedVoice = voices.find(v => v.voice_id === selectedVoiceId);

  // Don't render if no voices loaded
  if (isLoading || voices.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-colors text-xs font-medium text-black/60 hover:text-black/80 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
          aria-label="Select voice for whisper narration"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          title="Select voice for whisper narration"
        >
          <span className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            {selectedVoice?.name || 'Voice'}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-white/90 backdrop-blur-md rounded-lg border border-black/10 shadow-2xl overflow-hidden"
              role="listbox"
            >
              <div className="max-h-64 overflow-y-auto">
                {voices.map((voice) => (
                  <button
                    key={voice.voice_id}
                    onClick={() => handleVoiceChange(voice.voice_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleVoiceChange(voice.voice_id);
                      }
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-inset ${
                      voice.voice_id === selectedVoiceId
                        ? 'bg-black/10 font-medium'
                        : 'text-black/70'
                    }`}
                    role="option"
                    aria-selected={voice.voice_id === selectedVoiceId}
                  >
                    <div className="flex items-center justify-between">
                      <span>{voice.name}</span>
                      {voice.voice_id === selectedVoiceId && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
