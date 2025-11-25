/**
 * ====================================
 * TYPOGRAPHY & STYLE CONFIGURATION
 * ====================================
 *
 * Centralized typography and style configuration for all view modes.
 * Makes it easy to adjust hierarchy and maintain consistency.
 *
 * Usage:
 *   import { getTypography } from '@/lib/styles';
 *   const styles = getTypography('architect');
 *   <h1 className={styles.h1}>Title</h1>
 */

export type ViewMode = 'architect' | 'author' | 'lab';

interface TypographyConfig {
  container: string;
  h1: string;
  h2: string;
  h3: string;
  p: string;
  small: string;
  label: string;
  link: string;
}

// ====================================
// MODE CONFIGURATIONS
// ====================================

const typography: Record<ViewMode, TypographyConfig> = {
  architect: {
    container: 'bg-architect-bg text-architect-text font-sans',
    h1: 'text-5xl font-black tracking-tight',
    h2: 'text-2xl font-bold tracking-tight',
    h3: 'text-xl font-bold',
    p: 'text-lg font-light leading-relaxed',
    small: 'text-sm font-light',
    label: 'text-xs font-medium tracking-wide uppercase',
    link: 'hover:text-architect-accent transition-colors',
  },
  author: {
    container: 'bg-author-bg text-author-text font-serif',
    h1: 'text-6xl font-light tracking-tight text-balance',
    h2: 'text-3xl font-light tracking-tight',
    h3: 'text-xl font-semibold',
    p: 'text-lg leading-loose',
    small: 'text-base leading-relaxed',
    label: 'text-sm font-semibold tracking-wide',
    link: 'hover:text-author-accent transition-colors',
  },
  lab: {
    container: 'bg-lab-bg text-lab-text font-mono',
    h1: 'text-4xl font-bold tracking-tight',
    h2: 'text-xl font-bold',
    h3: 'text-lg font-bold',
    p: 'text-sm opacity-70 leading-relaxed',
    small: 'text-xs opacity-60',
    label: 'text-xs font-bold tracking-wider uppercase',
    link: 'hover:text-lab-accent transition-colors',
  },
} as const;

// ====================================
// HELPER FUNCTION
// ====================================

/**
 * Get typography configuration for a specific view mode.
 *
 * @param mode - The view mode ('architect' | 'author' | 'lab')
 * @returns Typography configuration object
 */
export function getTypography(mode: ViewMode): TypographyConfig {
  return typography[mode];
}

// ====================================
// SHARED ANIMATION VARIANTS
// ====================================

/**
 * Reusable Framer Motion variants for consistent animations.
 */
export const animations = {
  // Fade in from below
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  // Fade in from side
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  // For use with staggerContainer
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

// ====================================
// TRANSITION PRESETS
// ====================================

/**
 * Consistent timing for different types of transitions.
 */
export const transitions = {
  // Smooth, theatrical
  smooth: {
    duration: 0.6,
    ease: [0.645, 0.045, 0.355, 1], // Custom cubic-bezier
  },

  // Quick and snappy
  snappy: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },

  // Springy, playful
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },

  // Layout animations (Framer Motion FLIP)
  layout: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 40,
  },
} as const;
