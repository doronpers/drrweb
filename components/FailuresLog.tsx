'use client';

/**
 * ====================================
 * FAILURES LOG - ANTI-PORTFOLIO COMPONENT
 * ====================================
 *
 * A brutally honest, terminal-style table of failures.
 * No hover effects. Pure data. Builds trust through transparency.
 *
 * Data Source: /data/failures.json
 *
 * Design Philosophy:
 * - Monospace font throughout
 * - Minimal styling, maximum clarity
 * - No animations or hover effects
 * - Let the content speak for itself
 */

import { useEffect, useState } from 'react';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface FailureEntry {
  year: string;
  project: string;
  outcome: string;
  lesson: string;
}

// ====================================
// COMPONENT
// ====================================

export default function FailuresLog() {
  const [failures, setFailures] = useState<FailureEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load failures data on mount
  useEffect(() => {
    async function loadFailures() {
      try {
        const response = await fetch('/data/failures.json');
        const data = await response.json();
        setFailures(data);
      } catch (error) {
        console.error('Failed to load failures.json:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFailures();
  }, []);

  if (loading) {
    return (
      <div className="font-mono text-sm text-black/40 p-8">
        Loading failures.json...
      </div>
    );
  }

  return (
    <section className="font-mono text-sm border-t border-black/10 bg-black/[0.02] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">FAILURES.JSON</h2>
          <p className="text-xs text-black/50">
            A simple, brutally honest table. No hover effects. Pure data.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black/20">
                <th className="text-left py-3 px-4 font-bold text-black/70">YEAR</th>
                <th className="text-left py-3 px-4 font-bold text-black/70">PROJECT</th>
                <th className="text-left py-3 px-4 font-bold text-black/70">OUTCOME</th>
                <th className="text-left py-3 px-4 font-bold text-black/70">LESSON</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((failure, index) => (
                <tr key={index} className="border-b border-black/10">
                  <td className="py-3 px-4 text-black/60 align-top">{failure.year}</td>
                  <td className="py-3 px-4 text-black/80 align-top font-medium">
                    {failure.project}
                  </td>
                  <td className="py-3 px-4 text-black/60 align-top">
                    {failure.outcome}
                  </td>
                  <td className="py-3 px-4 text-black/70 align-top italic">
                    {failure.lesson}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-black/10">
          <p className="text-xs text-black/40 leading-relaxed max-w-2xl">
            <strong className="text-black/60">NOTE:</strong> Precision without context 
            is waste. Rigidity breaks; adaptability bends. Every failure here became 
            a foundation for something better.
          </p>
        </div>
      </div>
    </section>
  );
}
