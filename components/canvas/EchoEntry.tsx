'use client';

/**
 * ====================================
 * ECHO ENTRY - SINGLE FLOATING MESSAGE
 * ====================================
 *
 * Individual entry in the Echo Chamber.
 * Uses physics-based motion to create organic floating effect.
 */

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

/**
 * Props for EchoEntry component
 */
interface EchoEntryProps {
  /** Unique identifier for the echo entry */
  id: string;
  /** The message text to display */
  text: string;
  /** When the echo was created */
  timestamp: Date;
  /** Position in the list for staggered animation */
  index: number;
}

/**
 * EchoEntry component - renders a single floating message in the Echo Chamber
 * 
 * Displays a user-submitted message that floats organically across the screen
 * with physics-based motion. Each entry has randomized starting position,
 * drift direction, duration, opacity (to simulate depth), and rotation.
 * 
 * @param props - Component props
 * @returns A memoized motion.div with animated floating message
 */
function EchoEntry({ id, text, timestamp, index }: EchoEntryProps) {
  // Random starting position and movement parameters
  // Memoized to prevent recalculation on re-renders
  // Empty dependency array - these are random values that should be stable per component instance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const floatParams = useMemo(() => ({
    startX: Math.random() * 80 + 10, // 10-90% of width
    startY: Math.random() * 80 + 10, // 10-90% of height
    driftX: (Math.random() - 0.5) * 100, // Random drift direction
    driftY: (Math.random() - 0.5) * 100,
    duration: Math.random() * 30 + 40, // 40-70 seconds
    opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5 opacity for "distance"
    rotation: Math.random() * 10 - 5, // -5 to 5 degrees
  }), []); // Empty array - values are random but should be stable per instance

  return (
    <motion.div
      key={id}
      className="absolute pointer-events-none select-none"
      initial={{
        x: `${floatParams.startX}vw`,
        y: `${floatParams.startY}vh`,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: [
          `${floatParams.startX}vw`,
          `${floatParams.startX + floatParams.driftX}vw`,
          `${floatParams.startX}vw`,
        ],
        y: [
          `${floatParams.startY}vh`,
          `${floatParams.startY + floatParams.driftY}vh`,
          `${floatParams.startY}vh`,
        ],
        opacity: [0, floatParams.opacity, floatParams.opacity, 0],
        scale: [0.8, 1, 1, 0.8],
        rotate: [0, floatParams.rotation, 0],
      }}
      transition={{
        duration: floatParams.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.5, // Stagger appearance
      }}
      style={{
        willChange: 'transform, opacity',
      }}
    >
      <div className="bg-black/5 backdrop-blur-sm px-4 py-2 rounded-full border border-black/10 max-w-xs">
        <p className="text-sm font-light text-black/60 truncate">{text}</p>
      </div>
    </motion.div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(EchoEntry);
