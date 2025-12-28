/**
 * ====================================
 * AUDIO ENGINE - TONE.JS IMPLEMENTATION
 * ====================================
 *
 * This module handles all audio synthesis and playback.
 * Audio is a first-class citizen in this installation.
 *
 * Features:
 * - Musical ambient drone (filtered noise + harmonic tones)
 * - Mode-specific UI sounds (musical intervals, cohesive scale)
 * - Graceful handling of browser autoplay policies
 * - Real-time audio processing (filters, reverb, musical synthesis)
 * - Pentatonic scale for universal musical appeal
 */

import * as Tone from 'tone';

// ====================================
// TYPE DEFINITIONS
// ====================================

type UISoundType = 'click-dry' | 'click-warm' | 'glitch';

/**
 * Detune configuration for humanization.
 * Values are in cents (100 cents = 1 semitone).
 */
interface DetuneConfig {
  /** Minimum detune in cents (typically negative) */
  min: number;
  /** Maximum detune in cents (typically positive) */
  max: number;
}

/**
 * Generate a random detune value within a bounded musical range.
 * This creates subtle pitch variation that humanizes the sound.
 *
 * @param config - The detune range configuration
 * @returns A random detune value in cents
 */
function getRandomDetune(config: DetuneConfig = { min: -5, max: 5 }): number {
  return config.min + Math.random() * (config.max - config.min);
}

// Detune presets for different modes (values in cents)
// ±5 cents is subtle humanization, ±10-15 for more character
const DETUNE_PRESETS = {
  architect: { min: -3, max: 3 },   // Subtle: clean, precise feel
  author: { min: -8, max: 8 },      // Warmer: more organic variation
  lab: { min: -12, max: 12 },       // Character: slightly experimental
} as const;

// Musical scale: Pentatonic (C, D, E, G, A) - universally pleasing
// Using frequencies in Hz for multiple octaves
// Also includes relative minor (A minor pentatonic uses same notes)
const PENTATONIC_SCALE = {
  // Lower octave (C3)
  C3: 130.81,  // C
  D3: 146.83,  // D
  E3: 164.81,  // E
  G3: 196.00,  // G
  A3: 220.00,  // A
  
  // Middle octave (C4) - primary range
  C4: 261.63,  // C
  D4: 293.66,  // D
  E4: 329.63,  // E
  G4: 392.00,  // G
  A4: 440.00,  // A
  
  // Upper octave (C5)
  C5: 523.25,  // C
  D5: 587.33,  // D
  E5: 659.25,  // E
  G5: 783.99,  // G
  A5: 880.00,  // A
  
  // Extended range (C6) for high notes
  C6: 1046.50, // C
  D6: 1174.66, // D
  E6: 1318.51, // E
};

// ====================================
// AUDIO MANAGER CLASS
// ====================================

class AudioManager {
  private initialized: boolean = false;
  private muted: boolean = true; // Default to muted
  private interactionCount: number = 0; // Track interactions for musical progression
  private lastSoundTime: number = 0; // Track last sound time to prevent timing conflicts

  // Ambient drone components
  private noise: Tone.Noise | null = null;
  private filter: Tone.Filter | null = null;
  private ambientVolume: Tone.Volume | null = null;
  
  // Musical ambient tones (subtle harmonic layers)
  private ambientTone1: Tone.Oscillator | null = null;
  private ambientTone2: Tone.Oscillator | null = null;
  private ambientToneVolume: Tone.Volume | null = null;

  // UI sound synthesizers (more musical, less percussive)
  private clickSynth: Tone.Synth | null = null;
  private warmSynth: Tone.Synth | null = null;
  private glitchSynth: Tone.Synth | null = null; // Changed from NoiseSynth to Synth

  // Effects
  private reverb: Tone.Reverb | null = null;
  private warmReverb: Tone.Reverb | null = null; // Store warm reverb as class property
  private labReverb: Tone.Reverb | null = null; // Store lab reverb as class property
  private architectReverb: Tone.Reverb | null = null; // Store architect reverb as class property
  private uiVolume: Tone.Volume | null = null;

  /**
   * Initialize the audio context and create all synthesizers.
   * Must be called after a user interaction due to browser autoplay policies.
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Start the Tone.js audio context
      await Tone.start();
      
      // Set muted state immediately after starting context
      Tone.Destination.mute = this.muted;
      
      console.log('🔊 Audio context started', this.muted ? '(muted)' : '');

      // ====================================
      // AMBIENT DRONE SYNTHESIS
      // ====================================

      // Create pink noise generator (more natural than white noise)
      this.noise = new Tone.Noise('pink');

      // Low-pass filter to create "wind-like" texture
      // The cutoff frequency oscillates to create movement
      this.filter = new Tone.Filter({
        type: 'lowpass',
        frequency: 400,
        rolloff: -24,
        Q: 2,
      });

      // Subtle volume automation for breathing effect
      this.ambientVolume = new Tone.Volume(-25);

      // Route: Noise → Filter → Volume → Destination
      this.noise.connect(this.filter);
      this.filter.connect(this.ambientVolume);
      this.ambientVolume.toDestination();

      // Create slow LFO for filter cutoff modulation (breathing)
      const lfo = new Tone.LFO({
        frequency: 0.08, // ~12.5 second cycle
        min: 300,
        max: 800,
      });
      lfo.connect(this.filter.frequency);
      lfo.start();

      // ====================================
      // MUSICAL AMBIENT TONES
      // ====================================
      // Add subtle harmonic tones to create musical cohesion
      // These are very quiet, just adding texture and musicality

      this.ambientToneVolume = new Tone.Volume(-28); // More audible musical tones
      this.ambientToneVolume.toDestination();

      // Subtle vibrato for movement (create before oscillators)
      const vibrato1 = new Tone.Vibrato({
        frequency: 0.5,
        depth: 0.1,
      });
      const vibrato2 = new Tone.Vibrato({
        frequency: 0.3,
        depth: 0.08,
      });
      
      // Connect vibratos to volume
      vibrato1.connect(this.ambientToneVolume);
      vibrato2.connect(this.ambientToneVolume);

      // First harmonic tone (C4, fundamental)
      this.ambientTone1 = new Tone.Oscillator({
        type: 'sine',
        frequency: PENTATONIC_SCALE.C4,
        volume: -30, // More audible
      });
      // Route: Oscillator → Vibrato → Volume
      this.ambientTone1.connect(vibrato1);

      // Second harmonic tone (G4, perfect fifth - most harmonious interval)
      this.ambientTone2 = new Tone.Oscillator({
        type: 'sine',
        frequency: PENTATONIC_SCALE.G4,
        volume: -32, // More audible
      });
      // Route: Oscillator → Vibrato → Volume
      this.ambientTone2.connect(vibrato2);

      // ====================================
      // UI SOUND SYNTHESIS (MUSICAL)
      // ====================================

      // Reverb effect for warm sounds (longer decay for more musical tail)
      this.reverb = new Tone.Reverb({
        decay: 3.5, // Longer decay for more musical reverb tail
        wet: 0.5,   // More reverb for cohesion
      });
      await this.reverb.generate(); // Pre-compute impulse response

      this.uiVolume = new Tone.Volume(-2); // Slightly below unity to avoid clipping
      this.uiVolume.toDestination();

      // DRY CLICK (Architect mode) - More musical, less percussive
      // Uses pentatonic scale, longer duration, gentle attack
      // Add subtle reverb for cohesion (still "dry" but with a touch of space)
      this.architectReverb = new Tone.Reverb({
        decay: 1.5,  // Short decay for subtlety
        wet: 0.2,    // Light reverb (20% wet) - just a touch
      });
      await this.architectReverb.generate();
      
      this.clickSynth = new Tone.Synth({
        oscillator: { type: 'sine' }, // Pure sine for smoothness
        envelope: {
          attack: 0.01,   // Gentle attack (was 0.001)
          decay: 0.15,    // Longer decay (was 0.05)
          sustain: 0.1,   // Small sustain for musicality (was 0)
          release: 0.2,   // Longer release (was 0.05)
        },
      });
      // Route: Synth → Reverb → Volume (subtle reverb for cohesion)
      this.clickSynth.connect(this.architectReverb);
      this.architectReverb.connect(this.uiVolume);

      // WARM CLICK (Author mode) - Very musical, warm, spacious
      // Uses lower pentatonic notes with reverb
      // Create a separate reverb for warm sounds to avoid routing issues
      this.warmReverb = new Tone.Reverb({
        decay: 5.0, // Longer decay for more noticeable reverb
        wet: 0.75,  // Much more reverb (75% wet) - very noticeable
      });
      await this.warmReverb.generate();
      
      this.warmSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.02,   // Gentle attack
          decay: 0.5,     // Longer decay
          sustain: 0.3,   // More sustain for musicality
          release: 0.8,    // Very long release for musical tail
        },
      });
      // Route: Synth → Reverb → Volume
      this.warmSynth.connect(this.warmReverb);
      this.warmReverb.connect(this.uiVolume);

      // GLITCH (Lab mode) - Smooth and musical, less ticky
      // Using sine wave for pure, smooth tones with gentle filtering
      this.glitchSynth = new Tone.Synth({
        oscillator: { 
          type: 'sine',    // Pure sine wave - smoothest, most pleasing
        },
        envelope: {
          attack: 0.05,    // Slower attack for softer start (less ticky)
          decay: 0.4,      // Longer decay
          sustain: 0.3,    // More sustain for musicality
          release: 0.8,    // Much longer release for smooth fade (less abrupt)
        },
      });
      // Add gentle low-pass filter for warmth and smoothness
      const labFilter = new Tone.Filter({
        type: 'lowpass',
        frequency: 1500, // Lower cutoff for warmer, smoother sound
        Q: 0.5,          // Lower Q for gentler filtering
      });
      // Add noticeable reverb for smoothness and cohesion
      this.labReverb = new Tone.Reverb({
        decay: 3.5,      // Longer decay for more noticeable reverb
        wet: 0.6,        // More reverb (60% wet) - clearly noticeable
      });
      await this.labReverb.generate();
      
      // Route: Synth → Filter → Reverb → Volume
      this.glitchSynth.connect(labFilter);
      labFilter.connect(this.labReverb);
      this.labReverb.connect(this.uiVolume);

      this.initialized = true;
      console.log('✅ Audio system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Start the ambient biophilic drone with musical tones.
   * Uses 2-second fade-in for smooth entrance.
   */
  startAmbient(): void {
    if (!this.initialized || this.muted || !this.noise) return;

    try {
      this.noise.start();
      // Fade in over 2 seconds
      this.ambientVolume?.volume.rampTo(-25, 2);
      
      // Start musical ambient tones
      if (this.ambientTone1 && this.ambientTone2) {
        this.ambientTone1.start();
        this.ambientTone2.start();
        // Fade in musical tones
        this.ambientToneVolume?.volume.rampTo(-28, 2);
        console.log('🎵 Musical ambient tones started (C4 + G4 pentatonic)');
      }
      
      console.log('🌬️  Ambient drone started (with musical tones)');
    } catch (error) {
      console.error('Failed to start ambient:', error);
    }
  }

  /**
   * Stop the ambient drone with fade-out.
   */
  stopAmbient(): void {
    if (!this.noise) return;

    try {
      // Fade out over 1 second before stopping
      this.ambientVolume?.volume.rampTo(-60, 1);
      this.ambientToneVolume?.volume.rampTo(-60, 1);
      setTimeout(() => {
        this.noise?.stop();
        this.ambientTone1?.stop();
        this.ambientTone2?.stop();
      }, 1000);
      console.log('🌬️  Ambient drone stopped');
    } catch (error) {
      console.error('Failed to stop ambient:', error);
    }
  }

  /**
   * Play a UI interaction sound based on the current mode.
   * Uses pentatonic scale for musical cohesion.
   *
   * @param type - The type of UI sound to play
   */
  playUISound(type: UISoundType): void {
    if (!this.initialized) {
      console.warn('⚠️ Audio not initialized yet');
      return;
    }
    
    if (this.muted) {
      console.log('🔇 Audio is muted, skipping sound');
      return;
    }

    // Ensure each sound has a unique timestamp (Tone.js requirement)
    const now = Math.max(Tone.now(), this.lastSoundTime + 0.01); // Add 10ms minimum spacing
    this.lastSoundTime = now;
    this.interactionCount++;

    console.log(`🎵 Attempting to play ${type} sound (interaction #${this.interactionCount})`);

    try {
      switch (type) {
        case 'click-dry': {
          if (!this.clickSynth) {
            console.error('❌ clickSynth not initialized');
            return;
          }
          // Musical tone from pentatonic scale (Architect: higher, clearer)
          // Expanded note set with more variation across octaves
          const architectNotes = [
            PENTATONIC_SCALE.E4,
            PENTATONIC_SCALE.G4,
            PENTATONIC_SCALE.C5,
            PENTATONIC_SCALE.D5,
            PENTATONIC_SCALE.E5,
            PENTATONIC_SCALE.G5,
            PENTATONIC_SCALE.A4,
            PENTATONIC_SCALE.C6,
            PENTATONIC_SCALE.D6,
            PENTATONIC_SCALE.E6,
          ];
          const archNoteIndex = this.interactionCount % architectNotes.length;
          const architectNote = architectNotes[archNoteIndex];
          // Apply subtle humanization detune (±3 cents for clean, precise feel)
          const archDetune = getRandomDetune(DETUNE_PRESETS.architect);
          this.clickSynth.detune.value = archDetune;
          console.log(`🎵 Playing musical tone: ${architectNote}Hz (Architect mode) - Note ${archNoteIndex + 1}/${architectNotes.length} - Detune: ${archDetune.toFixed(1)}¢`);
          this.clickSynth.triggerAttackRelease(architectNote, '0.5', now);
          break;
        }

        case 'click-warm': {
          if (!this.warmSynth) {
            console.error('❌ warmSynth not initialized');
            return;
          }
          // Lower, warmer tones from pentatonic scale (Author: warm, spacious)
          // Expanded with lower octave and middle range for more variation
          const authorNotes = [
            PENTATONIC_SCALE.C3,
            PENTATONIC_SCALE.D3,
            PENTATONIC_SCALE.E3,
            PENTATONIC_SCALE.G3,
            PENTATONIC_SCALE.A3,
            PENTATONIC_SCALE.C4,
            PENTATONIC_SCALE.D4,
            PENTATONIC_SCALE.E4,
            PENTATONIC_SCALE.G4,
            PENTATONIC_SCALE.A4,
            PENTATONIC_SCALE.C5,
            PENTATONIC_SCALE.D5,
          ];
          const authNoteIndex = this.interactionCount % authorNotes.length;
          const authorNote = authorNotes[authNoteIndex];
          // Apply organic humanization detune (±8 cents for warmer, more organic feel)
          const authDetune = getRandomDetune(DETUNE_PRESETS.author);
          this.warmSynth.detune.value = authDetune;
          console.log(`🎵 Playing musical tone: ${authorNote}Hz (Author mode) - Note ${authNoteIndex + 1}/${authorNotes.length} - Reverb: 75% wet - Detune: ${authDetune.toFixed(1)}¢`);
          this.warmSynth.triggerAttackRelease(authorNote, '1.2', now);
          break;
        }

        case 'glitch': {
          if (!this.glitchSynth) {
            console.error('❌ glitchSynth not initialized');
            return;
          }
          // Musical but with character (Lab: interesting intervals)
          // Expanded with more octave jumps and varied intervals for interest
          const labNotes = [
            PENTATONIC_SCALE.D3,
            PENTATONIC_SCALE.G3,
            PENTATONIC_SCALE.A3,
            PENTATONIC_SCALE.D4,
            PENTATONIC_SCALE.G4,
            PENTATONIC_SCALE.A4,
            PENTATONIC_SCALE.E4,
            PENTATONIC_SCALE.C5,
            PENTATONIC_SCALE.E5,
            PENTATONIC_SCALE.G5,
            PENTATONIC_SCALE.A5,
            PENTATONIC_SCALE.D5,
          ];
          const labNoteIndex = this.interactionCount % labNotes.length;
          const labNote = labNotes[labNoteIndex];
          // Apply experimental humanization detune (±12 cents for slightly experimental character)
          const labDetune = getRandomDetune(DETUNE_PRESETS.lab);
          this.glitchSynth.detune.value = labDetune;
          console.log(`🎵 Playing musical tone: ${labNote}Hz (Lab mode) - Note ${labNoteIndex + 1}/${labNotes.length} - Reverb: 60% wet - Detune: ${labDetune.toFixed(1)}¢`);
          // Longer duration for smoother, less ticky sound
          this.glitchSynth.triggerAttackRelease(labNote, '0.9', now);
          break;
        }
      }
      console.log('✅ Sound triggered successfully');
    } catch (error) {
      console.error(`❌ Failed to play ${type}:`, error);
    }
  }

  /**
   * Set mute state for all audio.
   */
  setMuted(muted: boolean): void {
    this.muted = muted;

    if (this.muted) {
      this.stopAmbient();
      Tone.Destination.mute = true;
    } else {
      Tone.Destination.mute = false;
      if (this.initialized) {
        this.startAmbient();
      }
    }

    console.log(`🔇 Audio ${this.muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Toggle mute state for all audio.
   */
  toggleMute(): void {
    this.setMuted(!this.muted);
  }

  /**
   * Get current mute state.
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Cleanup and dispose of all audio resources.
   */
  dispose(): void {
    this.stopAmbient();

    this.noise?.dispose();
    this.filter?.dispose();
    this.ambientVolume?.dispose();
    this.ambientTone1?.dispose();
    this.ambientTone2?.dispose();
    this.ambientToneVolume?.dispose();
    this.clickSynth?.dispose();
    this.warmSynth?.dispose();
    this.glitchSynth?.dispose();
    this.reverb?.dispose();
    this.warmReverb?.dispose();
    this.labReverb?.dispose();
    this.architectReverb?.dispose();
    this.uiVolume?.dispose();

    this.initialized = false;
    this.interactionCount = 0;
    console.log('🗑️  Audio system disposed');
  }
}

// ====================================
// SINGLETON INSTANCE
// ====================================

// Export a single instance to be used throughout the app
export const audioManager = new AudioManager();
