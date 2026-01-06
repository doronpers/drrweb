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
import dynamic from 'next/dynamic';
import { useViewMode } from '@/contexts/ViewModeContext';
import Landing from '@/components/Landing';
import EchoChamber from '@/components/canvas/EchoChamber';
import WhispersChamber from '@/components/canvas/WhispersChamber';
import AntiPortfolio from '@/components/AntiPortfolio';
import VoiceSelector from '@/components/VoiceSelector';
import AudioControls from '@/components/AudioControls';
import { audioManager } from '@/lib/audio';

// Code splitting: Lazy load mode components for better performance
const Architect = dynamic(() => import('@/components/modes/Architect'), {
  loading: () => <div className="min-h-screen" aria-label="Loading Architect mode" />,
});

const Author = dynamic(() => import('@/components/modes/Author'), {
  loading: () => <div className="min-h-screen" aria-label="Loading Author mode" />,
});

const Lab = dynamic(() => import('@/components/modes/Lab'), {
  loading: () => <div className="min-h-screen" aria-label="Loading Lab mode" />,
});

export default function Home() {
  const { currentMode, setMode, userIntent } = useViewMode();

  return (
    <main className="relative min-h-screen">
      {/* Whispers Chamber - AI-generated ambient text, always present */}
      <WhispersChamber 
        mode={currentMode} 
        userIntent={userIntent || undefined}
        density={currentMode === 'landing' ? 6 : 8}
      />
      
      {/* Echo Chamber - user-submitted echoes, visible in modes */}
      {currentMode !== 'landing' && <EchoChamber />}

      {/* Voice Selector - for ElevenLabs voice preference */}
      <VoiceSelector />
      
      {/* Audio Controls - for tone, velocity, and key settings */}
      <AudioControls />

      {/* Mode-specific content */}
      <AnimatePresence mode="wait">
        {currentMode === 'landing' && (
          <div key="landing" role="main" aria-label="Landing page">
            <Landing />
          </div>
        )}
        {currentMode === 'architect' && (
          <div key="architect" role="main" aria-label="Architect mode - Business and professional view" id="architect-panel">
            <Architect />
            <AntiPortfolio />
          </div>
        )}
        {currentMode === 'author' && (
          <div key="author" role="main" aria-label="Author mode - Editorial and narrative view" id="author-panel">
            <Author />
            <AntiPortfolio />
          </div>
        )}
        {currentMode === 'lab' && (
          <div key="lab" role="main" aria-label="Lab mode - Process and technical view" id="lab-panel">
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
          className="fixed top-8 left-8 z-50 flex gap-3"
          aria-label="Mode navigation"
        >
          {/* Back to Landing */}
          <motion.button
            onClick={() => {
              audioManager.playButtonClickSound();
              setMode('landing');
            }}
            className="px-4 py-2 bg-black/5 hover:bg-black/10 backdrop-blur-sm rounded-full border border-black/10 transition-all duration-normal text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Return to entrance"
            aria-label="Return to landing page"
          >
            ←
          </motion.button>

          {/* Mode Switcher Pills */}
          <div 
            className="flex gap-2 bg-black/5 backdrop-blur-sm rounded-full border border-black/10 p-1"
            role="tablist"
            aria-label="View mode selector"
          >
            <ModeButton
              mode="architect"
              currentMode={currentMode}
              onClick={() => setMode('architect')}
              label="A"
              title="The Architect - Business and professional view"
              description="For recruiters, business partners, and decision-makers"
            />
            <ModeButton
              mode="author"
              currentMode={currentMode}
              onClick={() => setMode('author')}
              label="B"
              title="The Author - Editorial and narrative view"
              description="For explorers, students, and those seeking depth"
            />
            <ModeButton
              mode="lab"
              currentMode={currentMode}
              onClick={() => setMode('lab')}
              label="C"
              title="The Lab - Process and technical view"
              description="For makers, tinkerers, and those who want to see the process"
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
  description?: string;
}

function ModeButton({
  mode,
  currentMode,
  onClick,
  label,
  title,
  description,
}: ModeButtonProps) {
  const isActive = currentMode === mode;

  return (
    <motion.button
      onClick={() => {
        audioManager.playButtonClickSound();
        onClick();
      }}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${mode}-panel`}
      id={`${mode}-tab`}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-normal
        focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2
        ${
          isActive
            ? 'bg-black text-white'
            : 'bg-transparent text-black/60 hover:text-black/80 hover:bg-black/5'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={description ? `${title} - ${description}` : title}
      aria-label={title}
    >
      {label}
    </motion.button>
  );
}
