'use client';

/**
 * ====================================
 * THE PRISM ENGINE - VIEW MODE CONTEXT
 * ====================================
 *
 * This context manages the three "refractions" of the website:
 * - Mode A: "The Architect" (Recruiter/Business)
 * - Mode B: "The Author" (Explorer/Student)
 * - Mode C: "The Lab" (Raw/Process)
 *
 * Like light passing through a prism, the same content source
 * splits into different presentations based on the viewer's intent.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ====================================
// TYPE DEFINITIONS
// ====================================

export type ViewMode = 'landing' | 'architect' | 'author' | 'lab';

interface ViewModeContextType {
  currentMode: ViewMode;
  previousMode: ViewMode | null;
  setMode: (mode: ViewMode, intent?: string) => void;
  isTransitioning: boolean;
  /** The user's original input/intent from the landing page */
  userIntent: string | null;
}

interface ViewModeProviderProps {
  children: ReactNode;
}

// ====================================
// CONTEXT CREATION
// ====================================

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

// ====================================
// PROVIDER COMPONENT
// ====================================

export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ViewMode>('landing');
  const [previousMode, setPreviousMode] = useState<ViewMode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userIntent, setUserIntent] = useState<string | null>(null);

  /**
   * Handles mode transitions with a brief transitioning state
   * to allow for smooth animations between modes.
   *
   * @param mode - The target ViewMode to transition to
   * @param intent - Optional user input that triggered the transition
   */
  const setMode = useCallback((mode: ViewMode, intent?: string) => {
    if (mode === currentMode) return;

    // Store user intent if provided (for whispers/personalization)
    if (intent) {
      setUserIntent(intent);
    }

    // Mark the start of transition
    setIsTransitioning(true);
    setPreviousMode(currentMode);

    // Allow CSS transitions to initiate before changing mode
    requestAnimationFrame(() => {
      setCurrentMode(mode);

      // End transition state after animation duration
      // (matches --transition-prism in globals.css: 800ms)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    });
  }, [currentMode]);

  const value: ViewModeContextType = {
    currentMode,
    previousMode,
    setMode,
    isTransitioning,
    userIntent,
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

// ====================================
// CUSTOM HOOK
// ====================================

/**
 * Hook to access the ViewMode context.
 * Must be used within a ViewModeProvider.
 *
 * @throws Error if used outside of ViewModeProvider
 * @returns ViewModeContextType
 */
export function useViewMode(): ViewModeContextType {
  const context = useContext(ViewModeContext);

  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }

  return context;
}

// ====================================
// MODE CONFIGURATION
// ====================================

/**
 * Configuration object for each view mode.
 * Defines visual theme, typography, and audio characteristics.
 */
export const MODE_CONFIG = {
  architect: {
    name: 'The Architect',
    theme: {
      bg: 'bg-architect-bg',
      text: 'text-architect-text',
      accent: 'text-architect-accent',
      font: 'font-sans',
    },
    audio: {
      uiSound: 'click-dry',
      ambience: 'none',
    },
    description: 'Utilitarian. Swiss Style. High contrast. For those who hire.',
  },
  author: {
    name: 'The Author',
    theme: {
      bg: 'bg-author-bg',
      text: 'text-author-text',
      accent: 'text-author-accent',
      font: 'font-serif',
    },
    audio: {
      uiSound: 'click-warm',
      ambience: 'reverb-pad',
    },
    description: 'Editorial. Breathable. For explorers and students.',
  },
  lab: {
    name: 'The Lab',
    theme: {
      bg: 'bg-lab-bg',
      text: 'text-lab-text',
      accent: 'text-lab-accent',
      font: 'font-mono',
    },
    audio: {
      uiSound: 'glitch',
      ambience: 'granular-noise',
    },
    description: 'Brutalist. Raw. Unfinished. The workshop.',
  },
} as const;

// ====================================
// KEYWORD MAPPING FOR INPUT ROUTING
// ====================================

/**
 * Maps user input keywords to their corresponding view modes.
 * Used by the Landing component to route users based on intent.
 */
export const KEYWORD_MAP: Record<string, ViewMode> = {
  // MODE A: The Architect (Business/Recruiter)
  'hire': 'architect',
  'cv': 'architect',
  'resume': 'architect',
  'business': 'architect',
  'work': 'architect',
  'professional': 'architect',
  'consulting': 'architect',
  'services': 'architect',
  'portfolio': 'architect',
  'experience': 'architect',
  'job': 'architect',
  'recruiter': 'architect',

  // MODE B: The Author (Explorer/Student)
  'story': 'author',
  'read': 'author',
  'philosophy': 'author',
  'writing': 'author',
  'essay': 'author',
  'teach': 'author',
  'teaching': 'author',
  'learn': 'author',
  'student': 'author',
  'education': 'author',
  'thought': 'author',
  'ideas': 'author',
  'literature': 'author',

  // MODE C: The Lab (Process/Raw)
  'how': 'lab',
  'process': 'lab',
  'sketch': 'lab',
  'experiment': 'lab',
  'code': 'lab',
  'github': 'lab',
  'tech': 'lab',
  'build': 'lab',
  'making': 'lab',
  'raw': 'lab',
  'draft': 'lab',
  'wip': 'lab',
  'behind': 'lab',
};

/**
 * Analyzes user input and returns the best matching view mode.
 * Falls back to 'architect' if no keywords match.
 *
 * @param input - The user's search query
 * @returns ViewMode that best matches the intent
 */
export function parseIntent(input: string): ViewMode {
  const normalized = input.toLowerCase().trim();

  // Check for exact keyword matches
  for (const [keyword, mode] of Object.entries(KEYWORD_MAP)) {
    if (normalized.includes(keyword)) {
      return mode;
    }
  }

  // Default fallback to architect (professional view)
  return 'architect';
}
