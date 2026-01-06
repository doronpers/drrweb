'use client';

/**
 * ====================================
 * THE ANTECHAMBER - LANDING COMPONENT
 * ====================================
 *
 * The entry point. A clean slate that listens.
 * The user's first utterance determines their path through the prism.
 */

import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewMode, parseIntent } from '@/contexts/ViewModeContext';
import { detectIntent } from '@/actions/detect-intent';
import OnboardingHint from '@/components/OnboardingHint';

// Lazy load audio module to reduce initial bundle size
// Using regular dynamic import instead of Next.js dynamic() since we're importing a module, not a component

// ====================================
// COMPONENT
// ====================================

export default function Landing() {
  const { setMode } = useViewMode();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cache audio manager once loaded
  const audioManagerRef = useRef<typeof import('@/lib/audio').audioManager | null>(null);
  
  // Form ref for programmatic submission
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Initialize audio on first user interaction.
   * Required due to browser autoplay policies.
   */
  const initializeAudio = useCallback(async () => {
    if (audioInitialized && audioManagerRef.current) return;

    try {
      // Dynamic import of audio module (only loads when needed)
      const audioModule = await import('@/lib/audio');
      audioManagerRef.current = audioModule.audioManager;
      await audioModule.audioManager.init();
      
      // Set muted state immediately after initialization
      if (isMuted) {
        audioModule.audioManager.setMuted(true);
      }
      
      setAudioInitialized(true);

      // Start ambient drone only if not muted
      if (!isMuted) {
        audioModule.audioManager.startAmbient();
      }
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }, [audioInitialized, isMuted]);

  /**
   * Handle form submission.
   * Uses Server Action (AI) for intent detection when available,
   * falls back to client-side keyword matching.
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isSubmitting) return;

      setIsSubmitting(true);

      // Initialize audio if not already done
      await initializeAudio();

      // Play UI sound on submit
      const audioManager = audioManagerRef.current;
      if (audioManager) {
        audioManager.playUISound('click-dry');
      }

      try {
        // Try to use Server Action for AI-powered intent detection
        const intentResult = await detectIntent(input);
        const targetMode = intentResult.targetMode;
        
        // Log audio params for future use (Phase 4) - only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🎵 Suggested audio params:', intentResult.audioParams);
        }
        
        // Slight delay for dramatic effect
        // Pass the user's input as intent for whispers personalization
        setTimeout(() => {
          setMode(targetMode, input);
        }, 300);
      } catch (error) {
        console.error('Intent detection failed, using fallback:', error);
        
        // Fallback to client-side parsing with error handling
        try {
          const targetMode = parseIntent(input);
          setTimeout(() => {
            setMode(targetMode, input);
          }, 300);
        } catch (fallbackError) {
          console.error('Fallback parsing also failed:', fallbackError);
          // Graceful degradation: default to architect mode
          setTimeout(() => {
            setMode('architect', input);
          }, 300);
        }
      } finally {
        // Reset submitting state after transition
        setTimeout(() => {
          setIsSubmitting(false);
        }, 500);
      }
    },
    [input, isSubmitting, initializeAudio, setMode]
  );

  /**
   * Toggle audio mute state.
   */
  const handleMuteToggle = useCallback(async () => {
    // Initialize audio if needed
    if (!audioInitialized) {
      await initializeAudio();
    }

    const audioManager = audioManagerRef.current;
    if (audioManager) {
      audioManager.toggleMute();
      setIsMuted(audioManager.isMuted());
    }
  }, [audioInitialized, initializeAudio]);

  /**
   * Handle input focus with audio feedback.
   */
  const handleFocus = useCallback(async () => {
    setIsFocused(true);
    await initializeAudio();
    const audioManager = audioManagerRef.current;
    if (audioManager) {
      // Play a gentle musical welcome tone
      audioManager.playUISound('click-warm');
    }
  }, [initializeAudio]);

  /**
   * Cleanup audio on unmount.
   */
  useEffect(() => {
    return () => {
      const audioManager = audioManagerRef.current;
      if (audioManager && audioInitialized) {
        audioManager.stopAmbient();
      }
    };
  }, [audioInitialized]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* ====================================
          BREATHING BACKGROUND GRADIENT
          ==================================== */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 50%)',
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 50%)',
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ====================================
          MUTE TOGGLE
          ==================================== */}
      <motion.button
        onClick={handleMuteToggle}
        className="fixed top-8 right-8 z-50 p-3 text-black/30 hover:text-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        aria-pressed={!isMuted}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.svg
              key="muted"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </motion.svg>
          ) : (
            <motion.svg
              key="unmuted"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ====================================
          MAIN CONTENT - THE HANDSHAKE
          ==================================== */}
      <motion.div
        className="relative z-10 w-full max-w-2xl px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Input form */}
        <form ref={formRef} onSubmit={handleSubmit}>
          <motion.div
            className="relative"
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                // Explicitly handle Enter/Return key for form submission
                if (e.key === 'Enter' && input.trim() && !isSubmitting) {
                  e.preventDefault();
                  // Use requestSubmit to properly trigger form's onSubmit handler
                  formRef.current?.requestSubmit();
                }
              }}
              placeholder="How may I inform your journey?"
              disabled={isSubmitting}
              className={`
                w-full px-6 py-5 text-center
                bg-transparent border-b-2 border-black/10
                text-black text-lg tracking-wide
                placeholder:text-black/20
                focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2
                transition-all duration-normal
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                fontWeight: isFocused ? 400 : 300,
              }}
              autoFocus
              aria-label="Enter your intent or question"
            />

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-black"
              initial={{ width: '0%' }}
              animate={{ width: isFocused ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Hidden submit button for form submission via Enter key */}
          <button type="submit" className="sr-only" aria-hidden="true">
            Submit
          </button>

          {/* Submit hint */}
          <AnimatePresence>
            {input.trim() && !isSubmitting && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mt-6 text-black/30 text-sm tracking-wider"
              >
                Press <kbd className="px-2 py-1 bg-black/5 rounded text-xs">Enter</kbd> to proceed
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submitting state with skeleton loader */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mt-6 space-y-3"
                aria-live="polite"
                aria-busy="true"
              >
                {/* Loading indicator */}
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-1.5 h-1.5 bg-black/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-black/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-black/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                  />
                </div>
                <motion.p
                  className="text-black/30 text-sm tracking-wider"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Analyzing intent...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Mode previews */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          aria-label="Mode descriptions"
        >
          <ModePreview
            letter="A"
            title="Architect"
            description="Business & professional"
            keywords={['hire', 'resume', 'experience']}
          />
          <ModePreview
            letter="B"
            title="Author"
            description="Editorial & narrative"
            keywords={['story', 'philosophy', 'teaching']}
          />
          <ModePreview
            letter="C"
            title="Lab"
            description="Process & technical"
            keywords={['code', 'process', 'build']}
          />
        </motion.div>
      </motion.div>

      {/* Onboarding hint for first-time visitors */}
      <OnboardingHint
        id="landing-intent"
        message="Type what you're looking for. The site will guide you to the right view."
        position="bottom"
        delay={3000}
      />

      {/* ====================================
          CORNER SIGNATURE
          ==================================== */}
      <motion.div
        className="fixed bottom-8 right-8 text-black/20 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p>AN INTERACTIVE INSTALLATION</p>
        <p className="mt-2 font-light">©2025</p>
      </motion.div>
    </div>
  );
}

// ====================================
// MODE PREVIEW COMPONENT
// ====================================

interface ModePreviewProps {
  letter: string;
  title: string;
  description: string;
  keywords: string[];
}

function ModePreview({ letter, title, description, keywords }: ModePreviewProps) {
  return (
    <motion.div
      className="text-center p-6 border border-black/5 rounded-lg hover:border-black/10 transition-colors"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-2xl font-bold mb-2 text-black/40">{letter}</div>
      <h3 className="text-sm font-semibold mb-1 text-black/70">{title}</h3>
      <p className="text-xs text-black/50 mb-3">{description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="text-xs px-2 py-1 bg-black/5 rounded text-black/40"
          >
            {keyword}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
