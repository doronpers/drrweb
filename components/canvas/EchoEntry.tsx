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

interface EchoEntryProps {
  id: string;
  text: string;
  timestamp: Date;
  index: number;
}

interface FloatParams {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  duration: number;
  opacity: number;
  rotation: number;
}

/**
 * Generate random float parameters for echo animation
 * Extracted to function for clarity and reusability
 * 
 * Note: Math.random() is intentionally used here to create unique visual
 * positioning. The values are memoized per component instance to ensure
 * stability across re-renders.
 */
function generateFloatParams(): FloatParams {
  const r1 = Math.random();
  const r2 = Math.random();
  const r3 = Math.random();
  const r4 = Math.random();
  const r5 = Math.random();
  const r6 = Math.random();
  const r7 = Math.random();
  
  return {
    startX: r1 * 80 + 10, // 10-90% of width
    startY: r2 * 80 + 10, // 10-90% of height
    driftX: (r3 - 0.5) * 100, // Random drift direction
    driftY: (r4 - 0.5) * 100,
    duration: r5 * 30 + 40, // 40-70 seconds
    opacity: r6 * 0.15 + 0.1, // 0.1-0.25 opacity for "distance"
    rotation: r7 * 10 - 5, // -5 to 5 degrees
  };
}

function EchoEntry({ id, text, timestamp: _timestamp, index }: EchoEntryProps) {
  // Random starting position and movement parameters
  // Using useMemo to ensure stable values per component instance
  // Empty dependency array is intentional - values should be stable per instance
  const floatParams = useMemo(() => generateFloatParams(), []);

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
      <div className="bg-black/3 backdrop-blur-sm px-4 py-2 rounded-full border border-black/5 max-w-xs">
        <p className="text-sm font-light text-black/50 truncate">{text}</p>
      </div>
    </motion.div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(EchoEntry);
