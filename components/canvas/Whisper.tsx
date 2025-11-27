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
  switch (mood) {
    case 'technical':
      return {
        className: 'font-mono text-xs tracking-widest uppercase',
        baseOpacity: 0.15,
      };
    case 'creative':
      return {
        className: 'font-serif italic text-sm',
        baseOpacity: 0.2,
      };
    case 'mysterious':
      return {
        className: 'font-light text-sm tracking-wide',
        baseOpacity: 0.12,
      };
    case 'philosophical':
      return {
        className: 'font-extralight text-base tracking-normal',
        baseOpacity: 0.18,
      };
    case 'contemplative':
    default:
      return {
        className: 'font-light text-sm tracking-wide',
        baseOpacity: 0.16,
      };
  }
}

const Whisper = forwardRef<HTMLDivElement, WhisperProps>(function Whisper(
  { id, text, mood, index, totalCount },
  ref
) {
  // Distribute whispers across the viewport more evenly
  // Using golden ratio for more organic distribution
  const phi = 1.618033988749895;
  
  // Memoize ALL random parameters per instance to prevent re-render issues
  const floatParams = useMemo(() => {
    // Guard against division by zero
    const safeTotal = Math.max(totalCount, 1);
    const seed = index / safeTotal;
    const goldenAngle = seed * phi * 360;
    
    // Distribute across screen using golden angle spiral
    const radius = 25 + (seed * 35); // 25-60% from center
    const angleRad = (goldenAngle * Math.PI) / 180;
    
    const baseX = 50 + Math.cos(angleRad) * radius;
    const baseY = 50 + Math.sin(angleRad) * radius;
    
    // Add randomness
    const startX = Math.max(5, Math.min(95, baseX + (Math.random() - 0.5) * 20));
    const startY = Math.max(10, Math.min(90, baseY + (Math.random() - 0.5) * 20));
    
    // Memoize opacity variation here to prevent flicker on re-render
    const opacityVariation = 0.8 + Math.random() * 0.4;
    
    return {
      startX,
      startY,
      // Slow, gentle drift
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 25,
      // Longer durations for dreamlike quality
      duration: 50 + Math.random() * 40, // 50-90 seconds
      // Slight vertical float
      floatY: 5 + Math.random() * 10,
      // Very subtle rotation
      rotation: (Math.random() - 0.5) * 3,
      // Stagger the appearance
      delay: index * 2.5 + Math.random() * 3,
      // Opacity variation (memoized to prevent flicker)
      opacityVariation,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

