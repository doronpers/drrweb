'use client';

/**
 * ====================================
 * MODE C: THE LAB
 * ====================================
 *
 * Brutalist. Grid-breaking. Chaotic but navigable.
 * For makers, tinkerers, and those who want to see the process.
 *
 * Design principles:
 * - Monospace everything
 * - Visible grid/structure
 * - Glitchy, granular UI sounds
 * - Raw, unfinished aesthetic
 * - Behind-the-scenes, WIP content
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';

// ====================================
// COMPONENT
// ====================================

export default function Lab() {
  const [glitchActive, setGlitchActive] = useState(false);

  // Play glitch sound on hover for interactive elements
  const handleHover = () => {
    audioManager.playUISound('glitch');
    // Trigger visual glitch effect randomly
    if (Math.random() > 0.7) {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }
  };

  useEffect(() => {
    // Random glitch effects on mount
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 50);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`min-h-screen bg-lab-bg text-lab-text font-mono relative ${
        glitchActive ? 'glitch' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00ff00 1px, transparent 1px),
              linear-gradient(to bottom, #00ff00 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Scan Lines Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-5">
        <motion.div
          className="w-full h-1 bg-lab-text"
          animate={{
            y: ['0vh', '100vh'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 py-12 max-w-7xl">
        {/* Terminal Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 border border-lab-text/30 p-6 font-mono"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lab-accent">█</span>
            <span className="text-xs tracking-wider">SYSTEM_STATUS: OPERATIONAL</span>
            <span className="ml-auto text-xs opacity-50">
              {new Date().toISOString()}
            </span>
          </div>
          <div className="space-y-1 text-sm opacity-80">
            <p>{'>'} USER: doron_pers</p>
            <p>{'>'} MODE: laboratory</p>
            <p>{'>'} ACCESS: public_read</p>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Process & WIP */}
          <motion.div
            className="col-span-12 lg:col-span-8 space-y-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Active Projects */}
            <TerminalBlock title="ACTIVE_EXPERIMENTS" onMouseEnter={handleHover}>
              <div className="space-y-4">
                <Project
                  name="sonotheia.ai"
                  status="IN_DEVELOPMENT"
                  description="voice fraud detection system. building auth layer + waveform visualization. 73% complete."
                  tech={['Next.js', 'TensorFlow', 'Web Audio API', 'Supabase']}
                  onMouseEnter={handleHover}
                />
                <Project
                  name="portfolio_pedagogy"
                  status="ACTIVE"
                  description="university course. teaching narrative construction through curation. semester 2 ongoing."
                  tech={['Figma', 'Notion', 'Peer Review Systems']}
                  onMouseEnter={handleHover}
                />
                <Project
                  name="field_recordings_archive"
                  status="ONGOING"
                  description="cataloging 10+ years of location sound. building searchable metadata system."
                  tech={['Python', 'SQLite', 'Librosa', 'Reaper']}
                  onMouseEnter={handleHover}
                />
              </div>
            </TerminalBlock>

            {/* Raw Code / Sketches */}
            <TerminalBlock title="RECENT_COMMITS" onMouseEnter={handleHover}>
              <div className="space-y-2 text-sm">
                <CommitLine
                  hash="a3f8c2e"
                  message="refactor: audio engine modular architecture"
                  time="2 hours ago"
                  onMouseEnter={handleHover}
                />
                <CommitLine
                  hash="b7d91f3"
                  message="feat: add biophilic ambient drone synthesis"
                  time="5 hours ago"
                  onMouseEnter={handleHover}
                />
                <CommitLine
                  hash="c2e8a44"
                  message="docs: update teaching notes on portfolio criticism"
                  time="1 day ago"
                  onMouseEnter={handleHover}
                />
                <CommitLine
                  hash="d9f3b12"
                  message="experiment: granular synthesis for UI feedback"
                  time="2 days ago"
                  onMouseEnter={handleHover}
                />
              </div>
            </TerminalBlock>

            {/* Sketches / Notes */}
            <TerminalBlock title="NOTES.TXT" onMouseEnter={handleHover}>
              <div className="space-y-4 text-sm opacity-80">
                <p>
                  [2025-01-15] what if portfolio course was less about "showing
                  your best work" and more about "showing your thinking"?
                </p>
                <p>
                  [2025-01-12] voice prints are like fingerprints but they drift
                  over time. age, health, context. building for drift, not stasis.
                </p>
                <p>
                  [2025-01-08] students confuse curation with censorship. need
                  better metaphor. prism? lens? filter?
                </p>
                <p className="text-lab-accent">
                  [2025-01-03] THIS WEBSITE IS A PRISM NOT A MIRROR
                </p>
              </div>
            </TerminalBlock>
          </motion.div>

          {/* Right Column - Tools & Status */}
          <motion.div
            className="col-span-12 lg:col-span-4 space-y-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Tech Stack */}
            <TerminalBlock title="STACK" onMouseEnter={handleHover}>
              <div className="space-y-3 text-xs">
                <StackItem category="FRONTEND" items={['React', 'Next.js', 'Framer Motion', 'Tailwind']} />
                <StackItem category="AUDIO" items={['Tone.js', 'Ableton Live', 'Reaper', 'Max/MSP']} />
                <StackItem category="BACKEND" items={['Node.js', 'Python', 'PostgreSQL', 'Supabase']} />
                <StackItem category="ML/AI" items={['TensorFlow', 'scikit-learn', 'Librosa']} />
              </div>
            </TerminalBlock>

            {/* Links */}
            <TerminalBlock title="EXTERNAL_LINKS" onMouseEnter={handleHover}>
              <div className="space-y-2 text-sm">
                <ExtLink href="https://github.com" label="github/doronpers" onMouseEnter={handleHover} />
                <ExtLink href="https://sonotheia.ai" label="sonotheia.ai" onMouseEnter={handleHover} />
                <ExtLink href="#" label="soundcloud/fieldwork" onMouseEnter={handleHover} />
                <ExtLink href="#" label="are.na/research" onMouseEnter={handleHover} />
              </div>
            </TerminalBlock>

            {/* System Info */}
            <TerminalBlock title="SYS_INFO" onMouseEnter={handleHover}>
              <div className="space-y-1 text-xs opacity-70">
                <p>UPTIME: {'>'}10 years</p>
                <p>DOMAINS: 3 (sound, text, code)</p>
                <p>CURRENT_ROLE: acting_president</p>
                <p>TEACHING: active</p>
                <p>STATUS: building</p>
              </div>
            </TerminalBlock>

            {/* Unfinished / Ideas */}
            <TerminalBlock title="TODO.MD" onMouseEnter={handleHover}>
              <div className="space-y-1 text-xs opacity-60">
                <p>[ ] finish waveform viz component</p>
                <p>[ ] write essay on listening forensically</p>
                <p>[ ] refactor student feedback workflow</p>
                <p>[ ] record abandoned warehouse space</p>
                <p>[x] build this website as prism</p>
              </div>
            </TerminalBlock>
          </motion.div>
        </div>

        {/* Bottom Status Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 border-t border-lab-text/30 pt-6 text-xs opacity-50"
        >
          <div className="flex justify-between items-center">
            <span>VIEWING: LAB_MODE</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-lab-accent rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
        </motion.div>
      </div>

      {/* Glitch Effect Styles */}
      <style jsx>{`
        .glitch {
          animation: glitch 0.1s infinite;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </motion.div>
  );
}

// ====================================
// UTILITY COMPONENTS
// ====================================

function TerminalBlock({
  title,
  children,
  onMouseEnter,
}: {
  title: string;
  children: React.ReactNode;
  onMouseEnter?: () => void;
}) {
  return (
    <div
      className="border border-lab-text/30 p-6 hover:border-lab-accent/50 transition-colors"
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-2 mb-4 text-lab-accent text-sm">
        <span>{'>'}</span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Project({
  name,
  status,
  description,
  tech,
  onMouseEnter,
}: {
  name: string;
  status: string;
  description: string;
  tech: string[];
  onMouseEnter?: () => void;
}) {
  return (
    <motion.div
      className="border-l-2 border-lab-accent pl-4 py-2 hover:border-lab-text transition-colors"
      whileHover={{ x: 4 }}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-sm font-bold">{name}</span>
        <span className="text-xs opacity-50">[{status}]</span>
      </div>
      <p className="text-xs opacity-70 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span key={t} className="text-xs border border-lab-text/20 px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function CommitLine({
  hash,
  message,
  time,
  onMouseEnter,
}: {
  hash: string;
  message: string;
  time: string;
  onMouseEnter?: () => void;
}) {
  return (
    <motion.div
      className="flex items-start gap-3 hover:text-lab-accent transition-colors cursor-pointer"
      whileHover={{ x: 2 }}
      onMouseEnter={onMouseEnter}
    >
      <span className="text-lab-accent opacity-70">{hash}</span>
      <span className="flex-1 opacity-80">{message}</span>
      <span className="opacity-40 text-xs">{time}</span>
    </motion.div>
  );
}

function StackItem({ category, items }: { category: string; items: string[] }) {
  return (
    <div>
      <div className="text-lab-accent mb-1">{category}:</div>
      <div className="pl-4 opacity-70">{items.join(' • ')}</div>
    </div>
  );
}

function ExtLink({
  href,
  label,
  onMouseEnter,
}: {
  href: string;
  label: string;
  onMouseEnter?: () => void;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-lab-accent transition-colors"
      whileHover={{ x: 4 }}
      onMouseEnter={onMouseEnter}
    >
      → {label}
    </motion.a>
  );
}
