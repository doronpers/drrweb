'use client';

/**
 * ====================================
 * ECHO CHAMBER - FLOATING GUESTBOOK
 * ====================================
 *
 * A communal space for ephemeral thoughts.
 * Messages float in the background with physics-based motion.
 *
 * Features:
 * - Input for new echoes
 * - Physics-based floating animation
 * - Varying opacities for "distance"
 * - Validation and moderation
 */

import { useState, FormEvent, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EchoEntry from './EchoEntry';
import { fetchEchoes, submitEcho, type Echo as SupabaseEcho } from '@/lib/supabase';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface Echo {
  id: string;
  text: string;
  timestamp: Date;
}

interface SubmissionError {
  message: string;
  type: 'validation' | 'rate-limit' | 'network' | 'unknown';
}

// ====================================
// RATE LIMITING
// ====================================

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const lastSubmissions = new Map<string, number[]>();

function checkRateLimit(): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const key = 'default'; // In a real app, use user ID or IP
  
  const submissions = lastSubmissions.get(key) || [];
  const recentSubmissions = submissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const remainingTime = Math.ceil(
      (RATE_LIMIT_WINDOW - (now - oldestSubmission)) / 1000
    );
    return { allowed: false, remainingTime };
  }

  recentSubmissions.push(now);
  lastSubmissions.set(key, recentSubmissions);
  return { allowed: true };
}

// ====================================
// INPUT SANITIZATION
// ====================================

function sanitizeInput(input: string): string {
  // Remove control characters except newlines and tabs
  // Using Unicode escapes for security - intentional for XSS prevention
  return input
    // eslint-disable-next-line no-control-regex -- Intentional: security sanitization
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function validateInput(input: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(input);
  
  if (!sanitized) {
    return { valid: false, error: 'Echo cannot be empty' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Echo must be 100 characters or less' };
  }
  
  // Check for potentially malicious patterns (XSS prevention)
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i,
  ];
  
  if (maliciousPatterns.some(pattern => pattern.test(sanitized))) {
    return { valid: false, error: 'Invalid characters detected' };
  }
  
  return { valid: true };
}

// ====================================
// COMPONENT
// ====================================

export default function EchoChamber() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<SubmissionError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch echoes on mount
  useEffect(() => {
    async function loadEchoes() {
      try {
        setIsLoading(true);
        const data = await fetchEchoes();
        const formattedEchoes: Echo[] = data.map((echo: SupabaseEcho) => ({
          id: echo.id,
          text: echo.text,
          timestamp: new Date(echo.created_at),
        }));
        setEchoes(formattedEchoes);
      } catch (err) {
        console.error('Failed to load echoes:', err);
        // Fallback to empty array - Echo Chamber will work but show no echoes
        // This is graceful degradation - the site remains functional
        setEchoes([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadEchoes();
  }, []);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  /**
   * Handle new echo submission
   */
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    // Clear previous errors
    setError(null);

    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      setError({
        message: validation.error || 'Invalid input',
        type: 'validation',
      });
      return;
    }

    // Check rate limit
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setError({
        message: `Please wait ${rateLimit.remainingTime} seconds before submitting again`,
        type: 'rate-limit',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitized = sanitizeInput(input);
      const success = await submitEcho(sanitized);

      if (success) {
        // Optimistically add to local state
        const newEcho: Echo = {
          id: `temp-${Date.now()}`,
          text: sanitized,
          timestamp: new Date(),
        };
        setEchoes((prev) => [newEcho, ...prev]);
        setInput('');
        setShowInput(false);
        
        // Refresh from server to get actual ID (but don't fail if this fails)
        try {
          const data = await fetchEchoes();
          const formattedEchoes: Echo[] = data.map((echo: SupabaseEcho) => ({
            id: echo.id,
            text: echo.text,
            timestamp: new Date(echo.created_at),
          }));
          setEchoes(formattedEchoes);
        } catch (refreshError) {
          // If refresh fails, keep the optimistic echo
          console.warn('Failed to refresh echoes after submission, keeping optimistic update:', refreshError);
        }
      } else {
        setError({
          message: 'Failed to submit echo. The service may be temporarily unavailable. Please try again later.',
          type: 'network',
        });
      }
    } catch (err) {
      console.error('Failed to submit echo:', err);
      setError({
        message: 'An error occurred. Please try again later.',
        type: 'unknown',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [input, isSubmitting]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Floating Echoes */}
      <div className="absolute inset-0 overflow-hidden">
        {echoes.map((echo, index) => (
          <EchoEntry
            key={echo.id}
            id={echo.id}
            text={echo.text}
            timestamp={echo.timestamp}
            index={index}
          />
        ))}
      </div>

      {/* Input Toggle Button */}
      <motion.button
        className="fixed bottom-8 right-8 pointer-events-auto z-50 p-4 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowInput(!showInput)}
        aria-label="Add echo"
        aria-expanded={showInput}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black/60"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      {/* Input Form */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-8 pointer-events-auto z-50 w-96 max-w-[calc(100vw-4rem)]"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-lg border border-black/10 shadow-2xl p-6">
              <h3 className="text-sm font-medium mb-4 text-black/60 tracking-wide">
                LEAVE AN ECHO
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="A thought, a question, a fragment..."
                    maxLength={100}
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/50 border border-black/10 rounded-lg focus:border-black/30 focus:outline-none transition-colors resize-none text-sm disabled:opacity-50"
                    autoFocus
                  />
                  <div className="text-xs text-black/40 mt-2 text-right">
                    {input.length}/100
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInput(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowInput(false);
                      }
                    }}
                    className="flex-1 px-4 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
                    aria-label="Cancel echo submission"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isSubmitting}
                    className="flex-1 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
                    aria-label="Send echo"
                    aria-disabled={!input.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Echo'}
                  </button>
                </div>
              </form>

              <p className="text-xs text-black/40 mt-4 leading-relaxed">
                Your echo will float among others. Brief thoughts work best.
              </p>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-xs text-red-600">{error.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && echoes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-black/20 text-sm">Loading echoes...</div>
        </div>
      )}
    </div>
  );
}
