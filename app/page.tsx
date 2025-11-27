'use client';

/**
 * ====================================
 * ROOT PAGE - THE PRISM ROUTER
 * ====================================
 *
 * This component acts as the central router for the Prism system.
 * Based on the current ViewMode, it renders:
 * - Landing (Antechamber)
 * - Architect (Business view)
 * - Author (Editorial view)
 * - Lab (Process view)
 *
 * Also includes:
 * - Echo Chamber (floating guestbook)
 * - Anti-Portfolio footer (for non-landing modes)
 * - Mode-switching navigation
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useViewMode } from '@/contexts/ViewModeContext';
import Landing from '@/components/Landing';
import Architect from '@/components/modes/Architect';
import Author from '@/components/modes/Author';
import Lab from '@/components/modes/Lab';
import EchoChamber from '@/components/canvas/EchoChamber';
import AntiPortfolio from '@/components/AntiPortfolio';

export default function Home() {
  const { currentMode, setMode } = useViewMode();

  return (
    <main className="relative min-h-screen">
      {/* Echo Chamber - always present in background */}
      {currentMode !== 'landing' && <EchoChamber />}

      {/* Mode-specific content */}
      <AnimatePresence mode="wait">
        {currentMode === 'landing' && <Landing key="landing" />}
        {currentMode === 'architect' && (
          <div key="architect">
            <Architect />
            <AntiPortfolio />
          </div>
        )}
        {currentMode === 'author' && (
          <div key="author">
            <Author />
            <AntiPortfolio />
          </div>
        )}
        {currentMode === 'lab' && (
          <div key="lab">
            <Lab />
            <AntiPortfolio />
          </div>
        )}
      </AnimatePresence>

      {/* Mode Navigation - visible when not on landing */}
      {currentMode !== 'landing' && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed top-4 left-4 md:top-8 md:left-8 z-50 flex gap-2 md:gap-3"
        >
          {/* Back to Landing */}
          <motion.button
            onClick={() => setMode('landing')}
            className="px-3 py-2 md:px-4 md:py-2 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Return to entrance"
          >
            ←
          </motion.button>

          {/* Mode Switcher Pills */}
          <div className="flex gap-2 bg-black/5 backdrop-blur-sm rounded-full border border-black/10 p-1">
            <ModeButton
              mode="architect"
              currentMode={currentMode}
              onClick={() => setMode('architect')}
              label="A"
              title="The Architect"
            />
            <ModeButton
              mode="author"
              currentMode={currentMode}
              onClick={() => setMode('author')}
              label="B"
              title="The Author"
            />
            <ModeButton
              mode="lab"
              currentMode={currentMode}
              onClick={() => setMode('lab')}
              label="C"
              title="The Lab"
            />
          </div>
        </motion.nav>
      )}
    </main>
  );
}

// ====================================
// MODE BUTTON COMPONENT
// ====================================

interface ModeButtonProps {
  mode: 'architect' | 'author' | 'lab';
  currentMode: string;
  onClick: () => void;
  label: string;
  title: string;
}

function ModeButton({
  mode,
  currentMode,
  onClick,
  label,
  title,
}: ModeButtonProps) {
  const isActive = currentMode === mode;

  return (
    <motion.button
      onClick={onClick}
      className={`
        px-3 py-2 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all
        ${
          isActive
            ? 'bg-black text-white'
            : 'bg-transparent text-black/60 hover:text-black/80'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={title}
    >
      {label}
    </motion.button>
  );
}
