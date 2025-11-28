'use client';

/**
 * ====================================
 * ANTI-PORTFOLIO - FAILURES & UNKNOWNS
 * ====================================
 *
 * A terminal-style log of failures, mistakes, and uncertainties.
 * Builds trust through authenticity and transparency.
 *
 * Design:
 * - Monospace terminal aesthetic
 * - JSON-like structure
 * - Collapsible sections
 * - Subtle hover effects
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

// ====================================
// DATA STRUCTURE
// ====================================

interface FailureEntry {
  date: string;
  project: string;
  lesson: string;
  category: 'technical' | 'business' | 'creative' | 'collaboration';
}

const FAILURES: FailureEntry[] = [
  {
    date: '2024-Q3',
    project: 'Real-time voice cloning MVP',
    lesson: 'Built for perfection, not iteration. Missed market window.',
    category: 'business',
  },
  {
    date: '2023-Q4',
    project: 'Automated grading system for writing',
    lesson: "AI can't read subtext. Scaled too early. Students felt unheard.",
    category: 'creative',
  },
  {
    date: '2023-Q2',
    project: 'Field recording marketplace',
    lesson: 'Wrong platform architecture. MongoDB for time-series was naive.',
    category: 'technical',
  },
  {
    date: '2022-Q1',
    project: 'Co-founded audio plugin company',
    lesson: 'Split equity before roles were clear. Partnership dissolved.',
    category: 'collaboration',
  },
  {
    date: '2021-Q3',
    project: 'Spatial audio installation',
    lesson: 'Underestimated setup complexity. 8-channel system crashed opening night.',
    category: 'technical',
  },
];

const UNKNOWNS: string[] = [
  'How to scale personalized education without losing the personal?',
  'Can voice fraud detection ever be 100% foolproof against deepfakes?',
  'The right balance between structure and chaos in teaching?',
  'Whether my students remember the content or just the approach?',
  'If Sonotheia should pivot to enterprise or stay consumer-first?',
  'How to document process without slowing down the making?',
  'The long-term impact of AI on sound design workflows?',
  'Whether interdisciplinary work is a strength or diffusion?',
];

// ====================================
// COMPONENT
// ====================================

export default function AntiPortfolio() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFailures = selectedCategory
    ? FAILURES.filter((f) => f.category === selectedCategory)
    : FAILURES;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="border-t border-black/10 bg-black/[0.02] backdrop-blur-sm font-mono text-sm mt-16 md:mt-24 relative z-10"
    >
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold mb-1 tracking-tight">
              ANTI_PORTFOLIO.JSON
            </h2>
            <p className="text-xs text-black/50">
              Risks, failures, and productive uncertainties
            </p>
          </div>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 border border-black/10 hover:border-black/30 hover:bg-black/5 transition-colors rounded"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? 'COLLAPSE [–]' : 'EXPAND [+]'}
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="space-y-8">
            {/* Failures Section */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-black/70 font-bold">{'"failures": ['}</h3>
                <div className="flex gap-2">
                  {['all', 'technical', 'business', 'creative', 'collaboration'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setSelectedCategory(cat === 'all' ? null : cat)
                        }
                        className={`text-xs px-2 py-1 border rounded transition-colors ${
                          (cat === 'all' && !selectedCategory) ||
                          selectedCategory === cat
                            ? 'border-black/30 bg-black/5'
                            : 'border-black/10 hover:border-black/20'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pl-8 space-y-4">
                {filteredFailures.map((failure, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-l-2 border-black/10 pl-4 py-2 hover:border-black/30 transition-colors"
                  >
                    <div className="text-black/40 text-xs mb-1">
                      <span className="text-black/60">{failure.date}</span> •{' '}
                      <span className="uppercase">{failure.category}</span>
                    </div>
                    <div className="text-black/80 font-medium mb-1">
                      {failure.project}
                    </div>
                    <div className="text-black/60 text-xs leading-relaxed italic">
                      → {failure.lesson}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-black/70 font-bold mt-4">{'],'}</div>
            </section>

            {/* Unknowns Section */}
            <section>
              <h3 className="text-black/70 font-bold mb-4">{'"unknowns": ['}</h3>

              <div className="pl-8 space-y-2">
                {UNKNOWNS.map((unknown, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="text-black/60 text-sm hover:text-black/80 transition-colors"
                  >
                    <span className="text-black/40 mr-2">?</span>
                    {unknown}
                  </motion.div>
                ))}
              </div>

              <div className="text-black/70 font-bold mt-4">{']'}</div>
            </section>

            {/* Footer Note */}
            <div className="pt-6 border-t border-black/10">
              <p className="text-xs text-black/40 leading-relaxed max-w-2xl">
                <strong className="text-black/60">NOTE:</strong> Trust is built
                through transparency, not perfection. Every project here taught
                something that successful ones couldn't. Some failures become
                foundations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Collapsed Preview */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-black/40 text-xs"
          >
            <span className="text-black/60">Preview:</span> {FAILURES.length}{' '}
            failures logged • {UNKNOWNS.length} active uncertainties
          </motion.div>
        )}
      </div>
    </motion.footer>
  );
}
