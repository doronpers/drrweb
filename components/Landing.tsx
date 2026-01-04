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
        
        // Log audio params for future use (Phase 4)
        console.log('🎵 Suggested audio params:', intentResult.audioParams);
        
        // Slight delay for dramatic effect
        // Pass the user's input as intent for whispers personalization
        setTimeout(() => {
          setMode(targetMode, input);
        }, 300);
      } catch (error) {
        console.error('Intent detection failed, using fallback:', error);
        
        // Fallback to client-side parsing
        const targetMode = parseIntent(input);
        setTimeout(() => {
          setMode(targetMode, input);
        }, 300);
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
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-white overflow-hidden">
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
        className="fixed top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 text-black/30 hover:text-black/60 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.svg
              key="muted"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              width="20"
              height="20"
              className="md:w-6 md:h-6"
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
              width="20"
              height="20"
              className="md:w-6 md:h-6"
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
          INTERACTIVE CONTENT - THE HANDSHAKE
          ==================================== */}
      <motion.div
        className="relative z-10 w-full max-w-2xl px-8 pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        {/* Centered prompt text */}
        <motion.h1
          className="text-center mb-12 text-black/50 tracking-widest font-light"
          style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
            letterSpacing: '0.2em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0.7 : 0.5 }}
          transition={{ duration: 0.6 }}
        >
          How may I inform your journey?
        </motion.h1>

        {/* Input form */}
        <form onSubmit={handleSubmit}>
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
              placeholder="Type your intent..."
              disabled={isSubmitting}
              className={`
                w-full px-6 py-5 text-center
                bg-transparent border-b border-black/10
                text-black text-base md:text-lg tracking-wider
                placeholder:text-black/25 placeholder:tracking-widest
                focus:border-black/25 focus:outline-none
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                font-light
              `}
              autoFocus
            />

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-black/80"
              initial={{ width: '0%' }}
              animate={{ width: isFocused ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Submit hint */}
          <AnimatePresence>
            {input.trim() && !isSubmitting && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mt-6 text-black/30 text-xs tracking-widest"
              >
                Press <kbd className="px-2 py-0.5 bg-black/5 rounded text-black/40 font-mono">Enter</kbd> to proceed
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submitting state */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mt-6 text-black/30 text-xs tracking-widest"
              >
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Refracting...
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Subtle hint about modes */}
        <motion.div
          className="mt-16 text-center text-black/25 text-[10px] md:text-xs tracking-widest space-y-2 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p>Try: hire • story • process</p>
        </motion.div>
      </motion.div>

      {/* ====================================
          STATIC INTRO SECTION
          Added for accessibility and fast skimming; interactive experience remains above.
          ==================================== */}
      <section
        id="intro"
        className="intro-section relative z-10 w-full max-w-3xl px-8 pt-8 pb-16"
      >
        <div className="intro-content text-center">
          <p className="intro-text text-black/70 text-base md:text-lg leading-relaxed mb-3 font-light">
            Audio engineer and educator focused on audio authenticity under adversarial conditions. 
            I build and test short-slice evaluation tooling (10–15s) and review workflows that surface 
            uncertainty rather than hide it.
          </p>
          <p className="intro-subtext text-black/60 text-sm md:text-base leading-relaxed mb-6 font-light">
            Current work: stress-testing synthetic speech, calibrated deferral signals, and audit-grade evidence records.
          </p>
          
          <nav aria-label="Primary" className="intro-nav">
            <ul className="flex justify-center gap-4 md:gap-6 text-sm md:text-base">
              <li>
                <a 
                  href="https://github.com/doronpers/sonotheia-examples" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="intro-link text-black/60 hover:text-black/90 transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm px-1"
                >
                  GitHub
                </a>
              </li>
              <li aria-hidden="true" className="text-black/30">·</li>
              <li>
                <a 
                  href="/about"
                  className="intro-link text-black/60 hover:text-black/90 transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm px-1"
                >
                  About
                </a>
              </li>
              <li aria-hidden="true" className="text-black/30">·</li>
              <li>
                <a 
                  href="/contact"
                  className="intro-link text-black/60 hover:text-black/90 transition-colors underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm px-1"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* ====================================
          CORNER SIGNATURE
          ==================================== */}
      <motion.div
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 text-black/25 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="text-[9px] md:text-[10px] font-light uppercase">An Interactive Installation</p>
        <p className="mt-0.5 text-[9px] md:text-[10px] font-light">©2025</p>
      </motion.div>
    </div>
  );
}
