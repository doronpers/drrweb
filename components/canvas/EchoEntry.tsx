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
function EchoEntry({ id, text, index }: EchoEntryProps) {
  // Generate deterministic pseudo-random values based on the id
  // This ensures stable values per component instance while appearing random
  // Using a simple hash of the id for deterministic randomness
  const floatParams = useMemo(() => {
    // Simple hash function to convert id to a number
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Use hash to generate pseudo-random values in deterministic way
    const rand1 = Math.abs(Math.sin(hash * 1.0)) * 80 + 10;
    const rand2 = Math.abs(Math.sin(hash * 2.0)) * 80 + 10;
    const rand3 = (Math.sin(hash * 3.0)) * 100;
    const rand4 = (Math.sin(hash * 4.0)) * 100;
    const rand5 = Math.abs(Math.sin(hash * 5.0)) * 30 + 40;
    const rand6 = Math.abs(Math.sin(hash * 6.0)) * 0.3 + 0.2;
    const rand7 = (Math.sin(hash * 7.0)) * 10 - 5;
    
    return {
      startX: rand1, // 10-90% of width
      startY: rand2, // 10-90% of height
      driftX: rand3, // Random drift direction
      driftY: rand4,
      duration: rand5, // 40-70 seconds
      opacity: rand6, // 0.2-0.5 opacity for "distance"
      rotation: rand7, // -5 to 5 degrees
    };
  }, [id]); // Depend on id for deterministic stability

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
