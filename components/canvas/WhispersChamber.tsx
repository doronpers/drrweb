'use client';

/**
 * ====================================
 * WHISPERS CHAMBER - AI AMBIENT TEXT
 * ====================================
 *
 * Container for the floating whisper system.
 * Manages whisper lifecycle, context adaptation, and density.
 *
 * Features:
 * - Context-aware whisper selection
 * - Automatic refresh cycle
 * - Adaptive density based on activity
 * - User intent memory
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Whisper from './Whisper';
import {
  type Whisper as WhisperType,
  type ViewMode,
  whisperEngine,
  getTimeOfDay,
  getInitialWhispers,
} from '@/lib/whispers';
import { generateWhisper } from '@/actions/generate-whisper';
import { voiceManager } from '@/lib/voice';

interface WhispersChamberProps {
  mode: ViewMode;
  userIntent?: string;
  /** Number of whispers to display (default: 8) */
  density?: number;
  /** Whether the chamber is active (default: true) */
  active?: boolean;
}

// ====================================
// CONFIGURATION
// ====================================

const CONFIG = {
  /** Minimum whispers to maintain */
  minWhispers: 5,
  /** Maximum whispers at once */
  maxWhispers: 12,
  /** How often to potentially add a new whisper (ms) */
  refreshInterval: 15000,
  /** How long before a whisper is considered "old" and can be cycled out (ms) */
  whisperLifespan: 60000,
  /** Chance to add a new whisper each refresh cycle */
  addChance: 0.4,
  /** Chance to cycle an old whisper each refresh cycle */
  cycleChance: 0.3,
  /** Chance to try AI generation instead of curated (when adding) */
  aiGenerationChance: 0.25,
  /** Minimum time between AI generation attempts (ms) */
  aiCooldown: 45000,
};

// ====================================
// COMPONENT
// ====================================

export default function WhispersChamber({
  mode,
  userIntent,
  density = 8,
  active = true,
}: WhispersChamberProps) {
  const [whispers, setWhispers] = useState<WhisperType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const whisperTimestamps = useRef<Map<string, number>>(new Map());
  const lastAiAttempt = useRef<number>(0);
  const voicedWhispers = useRef<Set<string>>(new Set()); // Track which whispers have been voiced
  // Ref to track current whispers for use in callbacks (avoids stale closures)
  const whispersRef = useRef<WhisperType[]>([]);

  // Keep whispersRef in sync with state
  useEffect(() => {
    whispersRef.current = whispers;
  }, [whispers]);

  /**
   * Initialize whispers on mount
   */
  useEffect(() => {
    if (!active) return;

    // Set initial context
    whisperEngine.setContext({
      mode,
      timeOfDay: getTimeOfDay(),
      userIntent,
    });

    // Get initial whispers
    const initial = getInitialWhispers(density);
    setWhispers(initial);

    // Track timestamps
    const now = Date.now();
    initial.forEach(w => whisperTimestamps.current.set(w.id, now));

    setIsInitialized(true);

    // Voice initial whispers (with delay for natural pacing)
    initial.forEach((whisper, index) => {
      setTimeout(() => {
        if (!voicedWhispers.current.has(whisper.id)) {
          voiceManager.queueWhisper(whisper.text);
          voicedWhispers.current.add(whisper.id);
        }
      }, 2000 + index * 3000); // Stagger: first at 2s, then every 3s
    });

    return () => {
      whisperEngine.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]); // Only run on mount/unmount

  /**
   * Update context when mode or intent changes
   */
  useEffect(() => {
    if (!isInitialized) return;

    whisperEngine.setContext({
      mode,
      timeOfDay: getTimeOfDay(),
      userIntent,
    });

    // When mode changes, gradually introduce new contextual whispers
    // Instead of replacing all at once
    const newWhispers = whisperEngine.selectMultiple(3);
    const now = Date.now();
    newWhispers.forEach(w => whisperTimestamps.current.set(w.id, now));

    setWhispers(prev => {
      // Keep some old whispers, add new contextual ones
      const toKeep = prev.slice(0, Math.max(CONFIG.minWhispers - 3, 2));
      const updated = [...toKeep, ...newWhispers].slice(0, CONFIG.maxWhispers);
      
      // Voice new whispers (use default voice from voiceManager)
      newWhispers.forEach((whisper, index) => {
        if (!voicedWhispers.current.has(whisper.id)) {
          setTimeout(() => {
            voiceManager.queueWhisper(whisper.text); // Uses default voice from localStorage
            voicedWhispers.current.add(whisper.id);
          }, 1000 + index * 2000); // Stagger new whispers
        }
      });
      
      return updated;
    });
  }, [mode, userIntent, isInitialized]);

  /**
   * Try to generate an AI whisper
   */
  const tryAiGeneration = useCallback(async (): Promise<WhisperType | null> => {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastAiAttempt.current < CONFIG.aiCooldown) {
      return null;
    }
    
    lastAiAttempt.current = now;
    
    try {
      const context = whisperEngine.getContext();
      // Use ref to get current whispers (avoids stale closure)
      const currentWhispers = whispersRef.current;
      const result = await generateWhisper({
        mode: context.mode,
        timeOfDay: context.timeOfDay,
        userIntent: context.userIntent,
        existingWhispers: currentWhispers.map(w => w.text),
      });
      
      if (result.success && result.whisper) {
        return {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          text: result.whisper,
          mood: result.mood || 'philosophical',
          source: 'ai',
        };
      }
    } catch (error) {
      console.debug('AI whisper generation skipped:', error);
    }
    
    return null;
  }, []); // No dependencies needed - uses refs

  /**
   * Periodic refresh cycle
   */
  const runRefreshCycle = useCallback(async () => {
    const now = Date.now();
    
    // Maybe try AI generation
    let aiWhisper: WhisperType | null = null;
    if (Math.random() < CONFIG.aiGenerationChance) {
      aiWhisper = await tryAiGeneration();
    }

    setWhispers(prev => {
      let updated = [...prev];

      // Maybe add a new whisper
      if (updated.length < CONFIG.maxWhispers && Math.random() < CONFIG.addChance) {
        // Use AI whisper if we got one, otherwise use curated
        const newWhisper = aiWhisper || whisperEngine.selectWhisper();
        whisperTimestamps.current.set(newWhisper.id, now);
        updated.push(newWhisper);
        aiWhisper = null; // Mark as used
        
        // Voice the new whisper (with delay for natural appearance)
        if (!voicedWhispers.current.has(newWhisper.id)) {
          setTimeout(() => {
            voiceManager.queueWhisper(newWhisper.text);
            voicedWhispers.current.add(newWhisper.id);
          }, 1500); // Small delay after whisper appears
        }
      }

      // Maybe cycle out an old whisper
      if (updated.length > CONFIG.minWhispers && Math.random() < CONFIG.cycleChance) {
        // Find oldest whisper
        let oldestId: string | null = null;
        let oldestTime = Infinity;

        updated.forEach(w => {
          const timestamp = whisperTimestamps.current.get(w.id) || 0;
          if (timestamp < oldestTime && now - timestamp > CONFIG.whisperLifespan) {
            oldestTime = timestamp;
            oldestId = w.id;
          }
        });

        if (oldestId) {
          // Remove oldest and add a fresh one
          updated = updated.filter(w => w.id !== oldestId);
          whisperTimestamps.current.delete(oldestId);
          voicedWhispers.current.delete(oldestId); // Remove from voiced set

          // Use AI whisper if available, otherwise curated
          const newWhisper = aiWhisper || whisperEngine.selectWhisper();
          whisperTimestamps.current.set(newWhisper.id, now);
          updated.push(newWhisper);
          
          // Voice the new whisper
          if (!voicedWhispers.current.has(newWhisper.id)) {
            setTimeout(() => {
              voiceManager.queueWhisper(newWhisper.text);
              voicedWhispers.current.add(newWhisper.id);
            }, 1500);
          }
        }
      }

      return updated;
    });
  }, [tryAiGeneration]);

  /**
   * Start/stop refresh timer
   */
  useEffect(() => {
    if (!active || !isInitialized) {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      return;
    }

    // Start refresh cycle
    refreshTimerRef.current = setInterval(runRefreshCycle, CONFIG.refreshInterval);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [active, isInitialized, runRefreshCycle]);

  /**
   * Update time of day periodically
   */
  useEffect(() => {
    const updateTime = () => {
      whisperEngine.setContext({ timeOfDay: getTimeOfDay() });
    };

    // Check every 15 minutes
    const timer = setInterval(updateTime, 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (!active) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout">
        {whispers.map((whisper, index) => (
          <Whisper
            key={whisper.id}
            id={whisper.id}
            text={whisper.text}
            mood={whisper.mood}
            index={index}
            totalCount={whispers.length}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

