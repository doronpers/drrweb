/**
 * ====================================
 * HARMONIC KEY SYSTEM
 * ====================================
 *
 * Provides musical keys and scales to ensure all tones
 * are harmonically related. Supports major and minor keys.
 */

// ====================================
// TYPE DEFINITIONS
// ====================================

export type MusicalKey = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type KeyMode = 'major' | 'minor';

export interface KeyConfig {
  key: MusicalKey;
  mode: KeyMode;
}

// ====================================
// MUSICAL INTERVALS
// ====================================

// Semitone intervals for major scale: 2-2-1-2-2-2-1
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];
// Semitone intervals for minor scale: 2-1-2-2-1-2-2
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10, 12];

// Base frequency for C4 (middle C)
const C4_FREQUENCY = 261.63;

// Semitone multipliers (12th root of 2)
const SEMITONE_RATIO = Math.pow(2, 1 / 12);

// ====================================
// KEY TO SEMITONE OFFSET
// ====================================

const KEY_OFFSETS: Record<MusicalKey, number> = {
  'C': 0,
  'C#': 1,
  'D': 2,
  'D#': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'G': 7,
  'G#': 8,
  'A': 9,
  'A#': 10,
  'B': 11,
};

// ====================================
// SCALE FUNCTIONS
// ====================================

/**
 * Get the scale intervals for a given mode
 */
function getScaleIntervals(mode: KeyMode): number[] {
  return mode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
}

/**
 * Calculate frequency for a note in a given key
 * @param key - The root key (e.g., 'C', 'D', 'A')
 * @param mode - Major or minor
 * @param octave - Octave number (3 = C3, 4 = C4, etc.)
 * @param scaleDegree - Degree in the scale (0 = root, 1 = second, etc.)
 */
export function getNoteFrequency(
  key: MusicalKey,
  mode: KeyMode,
  octave: number,
  scaleDegree: number
): number {
  const intervals = getScaleIntervals(mode);
  const degree = scaleDegree % intervals.length;
  const octaveOffset = Math.floor(scaleDegree / intervals.length);
  
  // Calculate semitones from C4
  const keyOffset = KEY_OFFSETS[key];
  const scaleInterval = intervals[degree];
  const totalSemitones = keyOffset + scaleInterval + (octaveOffset * 12) + ((octave - 4) * 12);
  
  return C4_FREQUENCY * Math.pow(SEMITONE_RATIO, totalSemitones);
}

/**
 * Get all notes in a key across multiple octaves
 * Returns frequencies for pentatonic subset (1, 2, 3, 5, 6) of the scale
 */
export function getKeyNotes(keyConfig: KeyConfig): {
  [octave: number]: {
    [note: string]: number;
  };
} {
  const { key, mode } = keyConfig;
  const notes: { [octave: number]: { [note: string]: number } } = {};
  
  // Pentatonic degrees: 1, 2, 3, 5, 6 (0-indexed: 0, 1, 2, 4, 5)
  const pentatonicDegrees = [0, 1, 2, 4, 5];
  const noteNames = mode === 'major' 
    ? ['I', 'II', 'III', 'V', 'VI']
    : ['i', 'ii', 'III', 'v', 'vi'];
  
  // Generate notes for octaves 3-6
  for (let octave = 3; octave <= 6; octave++) {
    notes[octave] = {};
    pentatonicDegrees.forEach((degree, index) => {
      const frequency = getNoteFrequency(key, mode, octave, degree);
      notes[octave][noteNames[index]] = frequency;
    });
  }
  
  return notes;
}

/**
 * Get a harmonically related note set for UI sounds
 * Returns frequencies organized by mode (architect, author, lab)
 */
export function getHarmonicNoteSet(keyConfig: KeyConfig): {
  architect: number[];
  author: number[];
  lab: number[];
} {
  const { key, mode } = keyConfig;
  
  // Architect: Higher octaves, brighter tones (octaves 4-6, degrees 0, 2, 4)
  const architectDegrees = [0, 2, 4, 7, 9, 11, 14, 16, 18, 21]; // Mix of root, third, fifth across octaves
  const architect = architectDegrees.map(deg => getNoteFrequency(key, mode, 4 + Math.floor(deg / 7), deg % 7));
  
  // Author: Middle to lower octaves, warmer tones (octaves 3-5, degrees 0, 1, 2, 4, 5)
  const authorDegrees = [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 16]; // Full pentatonic range
  const author = authorDegrees.map(deg => getNoteFrequency(key, mode, 3 + Math.floor(deg / 7), deg % 7));
  
  // Lab: Varied octaves, interesting intervals (octaves 3-5, degrees 0, 2, 4, 5, 7)
  const labDegrees = [2, 4, 5, 7, 9, 11, 12, 14, 16, 18, 19, 21]; // Mix of thirds, fifths, sixths
  const lab = labDegrees.map(deg => getNoteFrequency(key, mode, 3 + Math.floor(deg / 7), deg % 7));
  
  return { architect, author, lab };
}

// ====================================
// DEFAULT CONFIGURATION
// ====================================

export const DEFAULT_KEY_CONFIG: KeyConfig = {
  key: 'D',
  mode: 'minor',
};

/**
 * Load key configuration from localStorage
 */
export function loadKeyConfig(): KeyConfig {
  if (typeof window === 'undefined') return DEFAULT_KEY_CONFIG;
  
  try {
    const stored = localStorage.getItem('audio-key-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.key && parsed.mode) {
        return parsed as KeyConfig;
      }
    }
  } catch (error) {
    console.warn('Failed to load key config from localStorage:', error);
  }
  
  return DEFAULT_KEY_CONFIG;
}

/**
 * Save key configuration to localStorage
 */
export function saveKeyConfig(config: KeyConfig): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('audio-key-config', JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save key config to localStorage:', error);
  }
}
