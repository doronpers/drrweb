'use client';

/**
 * ====================================
 * AUDIO CONTROLS - TONE, VELOCITY, KEY
 * ====================================
 *
 * User interface for adjusting audio parameters:
 * - Musical key and mode (major/minor)
 * - Tone/timbre (oscillator type)
 * - Velocity/volume (UI sound volume)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audio';
import { 
  MusicalKey, 
  KeyMode, 
  KeyConfig, 
  loadKeyConfig, 
  saveKeyConfig,
  getHarmonicNoteSet 
} from '@/lib/audio-keys';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface AudioSettings {
  key: MusicalKey;
  mode: KeyMode;
  tone: 'sine' | 'triangle' | 'sawtooth' | 'square';
  velocity: number; // 0-100
}

// ====================================
// CONSTANTS
// ====================================

const MUSICAL_KEYS: MusicalKey[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KEY_MODES: KeyMode[] = ['major', 'minor'];
const TONE_TYPES: Array<{ value: 'sine' | 'triangle' | 'sawtooth' | 'square'; label: string }> = [
  { value: 'sine', label: 'Sine' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'sawtooth', label: 'Sawtooth' },
  { value: 'square', label: 'Square' },
];

// ====================================
// COMPONENT
// ====================================

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>(() => {
    const keyConfig = loadKeyConfig();
    const stored = typeof window !== 'undefined' 
      ? localStorage.getItem('audio-settings')
      : null;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          key: parsed.key || keyConfig.key,
          mode: parsed.mode || keyConfig.mode,
          tone: parsed.tone || 'sine',
          velocity: parsed.velocity ?? 50,
        };
      } catch {
        // Fall through to defaults
      }
    }
    
    return {
      key: keyConfig.key,
      mode: keyConfig.mode,
      tone: 'sine',
      velocity: 50,
    };
  });

  /**
   * Save settings and update audio manager
   */
  const updateSettings = useCallback((updates: Partial<AudioSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-settings', JSON.stringify(newSettings));
      
      // Save key config separately for audio manager
      const keyConfig: KeyConfig = {
        key: newSettings.key,
        mode: newSettings.mode,
      };
      saveKeyConfig(keyConfig);
    }
    
    // Update audio manager
    audioManager.updateSettings({
      key: newSettings.key,
      mode: newSettings.mode,
      tone: newSettings.tone,
      velocity: newSettings.velocity,
    });
  }, [settings]);

  /**
   * Load settings on mount
   */
  useEffect(() => {
    const keyConfig = loadKeyConfig();
    const stored = typeof window !== 'undefined' 
      ? localStorage.getItem('audio-settings')
      : null;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        updateSettings({
          key: parsed.key || keyConfig.key,
          mode: parsed.mode || keyConfig.mode,
          tone: parsed.tone,
          velocity: parsed.velocity,
        });
      } catch {
        updateSettings({
          key: keyConfig.key,
          mode: keyConfig.mode,
        });
      }
    } else {
      updateSettings({
        key: keyConfig.key,
        mode: keyConfig.mode,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed bottom-8 left-32 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-colors text-xs font-medium text-black/60 hover:text-black/80 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
          aria-label="Audio controls"
          aria-expanded={isOpen}
          title="Adjust audio settings"
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
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
            {settings.key} {settings.mode}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 w-80 bg-white/90 backdrop-blur-md rounded-lg border border-black/10 shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Key Selection */}
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-2">
                    Musical Key
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MUSICAL_KEYS.map((key) => (
                      <button
                        key={key}
                        onClick={() => updateSettings({ key })}
                        className={`px-3 py-1.5 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 ${
                          settings.key === key
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black/70 hover:bg-black/10'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-2">
                    Mode
                  </label>
                  <div className="flex gap-2">
                    {KEY_MODES.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSettings({ mode })}
                        className={`flex-1 px-3 py-2 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 capitalize ${
                          settings.mode === mode
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black/70 hover:bg-black/10'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone/Timbre Selection */}
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-2">
                    Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONE_TYPES.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => updateSettings({ tone: value })}
                        className={`px-3 py-2 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 ${
                          settings.tone === value
                            ? 'bg-black text-white'
                            : 'bg-black/5 text-black/70 hover:bg-black/10'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Velocity/Volume Slider */}
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-2">
                    Volume: {settings.velocity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.velocity}
                    onChange={(e) => updateSettings({ velocity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-black/40 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Preview Button */}
                <button
                  onClick={() => audioManager.playUISound('click-dry')}
                  className="w-full px-3 py-2 text-xs bg-black/5 hover:bg-black/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  Preview Sound
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
