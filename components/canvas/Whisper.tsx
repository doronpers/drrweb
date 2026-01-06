'use client';

/**
 * ====================================
 * WHISPER - ETHEREAL FLOATING TEXT
 * ====================================
 *
 * Individual whisper in the ambient text system.
 * Distinguished from user Echoes by visual treatment:
 * - More transparent, ghostly appearance
 * - Slower, more organic motion
 * - Subtle blur and glow effects
 * - Typography feels more "voice-like"
 */

import { motion } from 'framer-motion';
import { memo, useMemo, forwardRef } from 'react';
import { type WhisperMood } from '@/lib/whispers';

interface WhisperProps {
  id: string;
  text: string;
  mood: WhisperMood;
  index: number;
  totalCount: number;
}

/**
 * Get mood-specific styling
 */
function getMoodStyles(mood: WhisperMood): {
  className: string;
  baseOpacity: number;
} {
  // Reduced opacity for all moods - more subtle, less obtrusive
  switch (mood) {
    case 'technical':
      return {
        className: 'font-mono text-xs tracking-widest uppercase',
        baseOpacity: 0.08, // Reduced from 0.15
      };
    case 'creative':
      return {
        className: 'font-serif italic text-sm',
        baseOpacity: 0.1, // Reduced from 0.2
      };
    case 'mysterious':
      return {
        className: 'font-light text-sm tracking-wide',
        baseOpacity: 0.06, // Reduced from 0.12
      };
    case 'philosophical':
      return {
        className: 'font-extralight text-base tracking-normal',
        baseOpacity: 0.09, // Reduced from 0.18
      };
    case 'contemplative':
    default:
      return {
        className: 'font-light text-sm tracking-wide',
        baseOpacity: 0.08, // Reduced from 0.16
      };
  }
}

/**
 * Generate random float parameters for whisper animation
 * Extracted to function for clarity and reusability
 * 
 * Note: Math.random() is intentionally used here to create unique visual
 * positioning. The values are memoized per component instance to ensure
 * stability across re-renders.
 */
function generateWhisperFloatParams(index: number, totalCount: number): {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  duration: number;
  floatY: number;
  rotation: number;
  delay: number;
  opacityVariation: number;
} {
  const phi = 1.618033988749895;
  const safeTotal = Math.max(totalCount, 1);
  const seed = index / safeTotal;
  const goldenAngle = seed * phi * 360;
  
  // Distribute across screen using golden angle spiral
  const radius = 25 + (seed * 35); // 25-60% from center
  const angleRad = (goldenAngle * Math.PI) / 180;
  
  const baseX = 50 + Math.cos(angleRad) * radius;
  const baseY = 50 + Math.sin(angleRad) * radius;
  
  // Generate all random values upfront
  const r1 = Math.random();
  const r2 = Math.random();
  const r3 = Math.random();
  const r4 = Math.random();
  const r5 = Math.random();
  const r6 = Math.random();
  const r7 = Math.random();
  const r8 = Math.random();
  const r9 = Math.random();
  
  return {
    startX: Math.max(5, Math.min(95, baseX + (r1 - 0.5) * 20)),
    startY: Math.max(10, Math.min(90, baseY + (r2 - 0.5) * 20)),
    // Slow, gentle drift
    driftX: (r3 - 0.5) * 30,
    driftY: (r4 - 0.5) * 25,
    // Longer durations for dreamlike quality
    duration: 50 + r5 * 40, // 50-90 seconds
    // Slight vertical float
    floatY: 5 + r6 * 10,
    // Very subtle rotation
    rotation: (r7 - 0.5) * 3,
    // Stagger the appearance
    delay: index * 2.5 + r8 * 3,
    // Opacity variation (stable per instance)
    opacityVariation: 0.8 + r9 * 0.4,
  };
}

const Whisper = forwardRef<HTMLDivElement, WhisperProps>(function Whisper(
  { id, text, mood, index, totalCount },
  ref
) {
  // Use useMemo to generate random parameters per instance
  // Dependencies: index and totalCount ensure values update if positioning changes
  const floatParams = useMemo(
    () => generateWhisperFloatParams(index, totalCount),
    [index, totalCount]
  );

  const { className: moodClassName, baseOpacity } = getMoodStyles(mood);
  
  // Use memoized opacity variation
  const instanceOpacity = baseOpacity * floatParams.opacityVariation;

  return (
    <motion.div
      ref={ref}
      key={id}
      className="absolute pointer-events-none select-none"
      initial={{
        x: `${floatParams.startX}vw`,
        y: `${floatParams.startY}vh`,
        opacity: 0,
        scale: 0.95,
        filter: 'blur(2px)',
      }}
      animate={{
        x: [
          `${floatParams.startX}vw`,
          `${floatParams.startX + floatParams.driftX * 0.5}vw`,
          `${floatParams.startX + floatParams.driftX}vw`,
          `${floatParams.startX + floatParams.driftX * 0.5}vw`,
          `${floatParams.startX}vw`,
        ],
        y: [
          `${floatParams.startY}vh`,
          `${floatParams.startY - floatParams.floatY}vh`,
          `${floatParams.startY + floatParams.driftY}vh`,
          `${floatParams.startY - floatParams.floatY * 0.5}vh`,
          `${floatParams.startY}vh`,
        ],
        opacity: [
          0,
          instanceOpacity * 0.5,
          instanceOpacity,
          instanceOpacity * 0.5,
          0,
        ],
        scale: [0.95, 1, 1, 1, 0.95],
        rotate: [0, floatParams.rotation, 0, -floatParams.rotation, 0],
        filter: [
          'blur(2px)',
          'blur(0.5px)',
          'blur(0px)',
          'blur(0.5px)',
          'blur(2px)',
        ],
      }}
      transition={{
        duration: floatParams.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatParams.delay,
        times: [0, 0.2, 0.5, 0.8, 1],
      }}
      style={{
        willChange: 'transform, opacity, filter',
        transform: 'translateX(-50%)', // Center the text
      }}
    >
      <p
        className={`
          ${moodClassName}
          text-black/80
          max-w-[280px]
          text-center
          leading-relaxed
          whitespace-nowrap
        `}
        style={{
          textShadow: '0 0 30px rgba(0,0,0,0.05)',
        }}
      >
        {text}
      </p>
    </motion.div>
  );
});

Whisper.displayName = 'Whisper';

export default memo(Whisper);

