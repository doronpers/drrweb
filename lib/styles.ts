/**
 * ====================================
 * TYPOGRAPHY & STYLE CONFIGURATION
 * ====================================
 *
 * Centralized typography and style configuration for all view modes.
 * Following Dieter Rams principles: systematic, timeless, clear hierarchy.
 *
 * Typography scale uses Major Third ratio (1.25) for consistency.
 * Spacing follows 8px base unit system.
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
  h4: string;
  p: string;
  small: string;
  label: string;
  link: string;
  // Focus state utilities
  focus: string;
}

// ====================================
// MODE CONFIGURATIONS
// ====================================
// Refined with consistent scale, improved hierarchy, timeless choices

const typography: Record<ViewMode, TypographyConfig> = {
  architect: {
    container: 'bg-architect-bg text-architect-text font-sans',
    // Swiss precision: clear hierarchy, high contrast
    h1: 'text-5xl font-black tracking-tight leading-tight', // 49px, boldest
    h2: 'text-3xl font-bold tracking-tight leading-snug',   // 31px, strong
    h3: 'text-2xl font-bold tracking-tight leading-normal', // 25px, emphasis
    h4: 'text-xl font-semibold tracking-tight leading-normal', // 20px, subheading
    p: 'text-lg font-light leading-relaxed',                // 18px, body
    small: 'text-sm font-light leading-relaxed',            // 14px, secondary
    label: 'text-xs font-medium tracking-wider uppercase',  // 12px, labels
    link: 'hover:text-architect-accent transition-colors duration-normal focus:outline-none focus:ring-2 focus:ring-architect-accent focus:ring-offset-2',
    focus: 'focus:outline-none focus:ring-2 focus:ring-architect-accent focus:ring-offset-2',
  },
  author: {
    container: 'bg-author-bg text-author-text font-serif',
    // Editorial warmth: generous spacing, readable
    h1: 'text-6xl font-light tracking-tight text-balance leading-tight', // 61px, elegant
    h2: 'text-4xl font-light tracking-tight leading-snug',   // 39px, section
    h3: 'text-2xl font-semibold tracking-tight leading-normal', // 25px, subsection
    h4: 'text-xl font-medium tracking-tight leading-normal', // 20px, minor heading
    p: 'text-lg leading-loose',                             // 18px, body (no weight override)
    small: 'text-base leading-relaxed',                     // 16px, secondary
    label: 'text-sm font-semibold tracking-wide',           // 14px, labels
    link: 'hover:text-author-accent transition-colors duration-normal focus:outline-none focus:ring-2 focus:ring-author-accent focus:ring-offset-2',
    focus: 'focus:outline-none focus:ring-2 focus:ring-author-accent focus:ring-offset-2',
  },
  lab: {
    container: 'bg-lab-bg text-lab-text font-mono',
    // Terminal aesthetic: monospace, clear structure
    h1: 'text-4xl font-bold tracking-tight leading-tight',  // 39px, terminal header
    h2: 'text-2xl font-bold tracking-tight leading-normal', // 25px, section
    h3: 'text-xl font-bold tracking-tight leading-normal', // 20px, subsection
    h4: 'text-lg font-semibold tracking-tight leading-normal', // 18px, minor
    p: 'text-sm opacity-80 leading-relaxed',               // 14px, body (reduced opacity)
    small: 'text-xs opacity-70 leading-relaxed',           // 12px, secondary
    label: 'text-xs font-bold tracking-wider uppercase',   // 12px, labels
    link: 'hover:text-lab-accent transition-colors duration-normal focus:outline-none focus:ring-2 focus:ring-lab-accent focus:ring-offset-2',
    focus: 'focus:outline-none focus:ring-2 focus:ring-lab-accent focus:ring-offset-2',
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
 * Following Dieter Rams: purposeful, not excessive.
 */
export const transitions = {
  // Smooth, theatrical (for major transitions)
  smooth: {
    duration: 0.6,
    ease: [0.645, 0.045, 0.355, 1], // Custom cubic-bezier
  },

  // Quick and snappy (for micro-interactions)
  snappy: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },

  // Normal (default for most interactions)
  normal: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },

  // Springy, playful (for bouncy elements)
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

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Get focus ring classes for a specific mode
 */
export function getFocusRing(mode: ViewMode): string {
  return typography[mode].focus;
}

/**
 * Get spacing utility classes (8px base unit)
 */
export const spacing = {
  xs: 'space-y-2',      // 8px
  sm: 'space-y-4',       // 16px
  md: 'space-y-6',       // 24px
  lg: 'space-y-8',       // 32px
  xl: 'space-y-12',      // 48px
} as const;
