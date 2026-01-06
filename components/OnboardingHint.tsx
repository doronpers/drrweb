'use client';

/**
 * ====================================
 * ONBOARDING HINT
 * ====================================
 * 
 * Subtle, dismissible hints for first-time visitors.
 * Following Dieter Rams: unobtrusive, helpful, minimal.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingHintProps {
  id: string;
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function OnboardingHint({
  id,
  message,
  position = 'bottom',
  delay = 3000,
}: OnboardingHintProps) {
  // Initialize dismissed state from localStorage (SSR-safe)
  // Using lazy initialization to avoid calling localStorage during render
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Check localStorage in effect, not during render
  // Initialize dismissed state from localStorage on mount only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const dismissed = localStorage.getItem(`onboarding-${id}-dismissed`);
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
    // Only run once on mount - empty dependency array is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // If already dismissed, don't show
    if (isDismissed) return;

    // Show hint after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(`onboarding-${id}-dismissed`, 'true');
  };

  if (isDismissed) return null;

  const positionClasses = {
    top: 'top-8 left-1/2 -translate-x-1/2',
    bottom: 'bottom-8 left-1/2 -translate-x-1/2',
    left: 'left-8 top-1/2 -translate-y-1/2',
    right: 'right-8 top-1/2 -translate-y-1/2',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${positionClasses[position]} z-50 pointer-events-auto`}
        >
          <div className="bg-white/90 backdrop-blur-sm border border-black/10 rounded-lg px-4 py-3 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <p className="text-sm text-black/70 flex-1">{message}</p>
              <button
                onClick={handleDismiss}
                className="text-black/40 hover:text-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded"
                aria-label="Dismiss hint"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="4" x2="4" y2="12" />
                  <line x1="4" y1="4" x2="12" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
