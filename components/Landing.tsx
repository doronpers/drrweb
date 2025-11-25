'use client';

/**
 * ====================================
 * THE ANTECHAMBER - LANDING COMPONENT
 * ====================================
 *
 * The entry point. A clean slate that listens.
 * The user's first utterance determines their path through the prism.
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewMode, parseIntent } from '@/contexts/ViewModeContext';
import { audioManager } from '@/lib/audio';

// ====================================
// COMPONENT
// ====================================

export default function Landing() {
  const { setMode } = useViewMode();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Initialize audio on first user interaction.
   * Required due to browser autoplay policies.
   */
  const initializeAudio = useCallback(async () => {
    if (audioInitialized) return;

    try {
      await audioManager.init();
      setAudioInitialized(true);

      // Start ambient drone if not muted
      if (!isMuted) {
        audioManager.startAmbient();
      }
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }, [audioInitialized, isMuted]);

  /**
   * Handle form submission.
   * Parse user intent and transition to appropriate mode.
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isSubmitting) return;

      setIsSubmitting(true);

      // Initialize audio if not already done
      await initializeAudio();

      // Play UI sound on submit
      audioManager.playUISound('click-dry');

      // Parse intent from input
      const targetMode = parseIntent(input);

      // Slight delay for dramatic effect
      setTimeout(() => {
        setMode(targetMode);
      }, 300);
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

    audioManager.toggleMute();
    setIsMuted(audioManager.isMuted());
  }, [audioInitialized, initializeAudio]);

  /**
   * Handle input focus with audio feedback.
   */
  const handleFocus = useCallback(async () => {
    setIsFocused(true);
    await initializeAudio();
    audioManager.playUISound('click-warm');
  }, [initializeAudio]);

  /**
   * Cleanup audio on unmount.
   */
  useEffect(() => {
    return () => {
      if (audioInitialized) {
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
        className="fixed top-8 right-8 z-50 p-3 text-black/30 hover:text-black/60 transition-colors"
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
        {/* Centered prompt text */}
        <motion.h1
          className="text-center mb-12 text-black/40 tracking-wide"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 300,
            letterSpacing: '0.15em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0.6 : 0.4 }}
          transition={{ duration: 0.6 }}
        >
          What do you seek?
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
                bg-transparent border-b-2 border-black/10
                text-black text-lg tracking-wide
                placeholder:text-black/20
                focus:border-black/30 focus:outline-none
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                fontWeight: isFocused ? 400 : 300,
              }}
              autoFocus
            />

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-black"
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
                className="text-center mt-6 text-black/30 text-sm tracking-wider"
              >
                Press <kbd className="px-2 py-1 bg-black/5 rounded">Enter</kbd> to proceed
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
                className="text-center mt-6 text-black/30 text-sm tracking-wider"
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
          className="mt-16 text-center text-black/20 text-xs tracking-widest space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p>Try: hire • story • process</p>
        </motion.div>
      </motion.div>

      {/* ====================================
          CORNER SIGNATURE
          ==================================== */}
      <motion.div
        className="fixed bottom-8 left-8 text-black/20 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p>AN INTERACTIVE INSTALLATION</p>
        <p className="mt-1 font-light">©2025</p>
      </motion.div>
    </div>
  );
}
