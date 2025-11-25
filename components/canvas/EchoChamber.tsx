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

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EchoEntry from './EchoEntry';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface Echo {
  id: string;
  text: string;
  timestamp: Date;
}

// ====================================
// MOCK DATA (Replace with Supabase later)
// ====================================

const INITIAL_ECHOES: Echo[] = [
  {
    id: '1',
    text: 'A mistake I cherish...',
    timestamp: new Date('2025-01-20'),
  },
  {
    id: '2',
    text: 'The sound of a room after everyone leaves',
    timestamp: new Date('2025-01-19'),
  },
  {
    id: '3',
    text: 'Learning is remembering in reverse',
    timestamp: new Date('2025-01-18'),
  },
  {
    id: '4',
    text: 'I build systems that listen',
    timestamp: new Date('2025-01-17'),
  },
  {
    id: '5',
    text: 'The best ideas arrive sideways',
    timestamp: new Date('2025-01-16'),
  },
  {
    id: '6',
    text: 'Silence is also a texture',
    timestamp: new Date('2025-01-15'),
  },
  {
    id: '7',
    text: 'What if teaching is just curated curiosity?',
    timestamp: new Date('2025-01-14'),
  },
  {
    id: '8',
    text: 'Trust compounds exponentially',
    timestamp: new Date('2025-01-13'),
  },
];

// ====================================
// COMPONENT
// ====================================

export default function EchoChamber() {
  const [echoes, setEchoes] = useState<Echo[]>(INITIAL_ECHOES);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);

  /**
   * Handle new echo submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    // Validate length (max 100 characters)
    if (input.length > 100) {
      alert('Echo must be 100 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with Supabase insert
      const newEcho: Echo = {
        id: Date.now().toString(),
        text: input.trim(),
        timestamp: new Date(),
      };

      setEchoes((prev) => [...prev, newEcho]);
      setInput('');
      setShowInput(false);

      // In production, this would be:
      // await supabaseClient.from('echoes').insert({ text: input.trim() })
    } catch (error) {
      console.error('Failed to submit echo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="fixed bottom-8 right-8 pointer-events-auto z-50 p-4 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowInput(!showInput)}
        aria-label="Add echo"
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
                    className="flex-1 px-4 py-2 text-sm border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isSubmitting}
                    className="flex-1 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Echo'}
                  </button>
                </div>
              </form>

              <p className="text-xs text-black/40 mt-4 leading-relaxed">
                Your echo will float among others. Brief thoughts work best.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
