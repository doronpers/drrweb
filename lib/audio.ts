/**
 * ====================================
 * AUDIO ENGINE - TONE.JS IMPLEMENTATION
 * ====================================
 *
 * This module handles all audio synthesis and playback.
 * Audio is a first-class citizen in this installation.
 *
 * Features:
 * - Biophilic ambient drone (filtered noise)
 * - Mode-specific UI sounds (dry clicks, warm tones, glitches)
 * - Graceful handling of browser autoplay policies
 * - Real-time audio processing (filters, reverb, granular synthesis)
 */

import * as Tone from 'tone';

// ====================================
// TYPE DEFINITIONS
// ====================================

type UISoundType = 'click-dry' | 'click-warm' | 'glitch';

// ====================================
// AUDIO MANAGER CLASS
// ====================================

class AudioManager {
  private initialized: boolean = false;
  private muted: boolean = false;

  // Ambient drone components
  private noise: Tone.Noise | null = null;
  private filter: Tone.Filter | null = null;
  private ambientVolume: Tone.Volume | null = null;

  // UI sound synthesizers
  private clickSynth: Tone.Synth | null = null;
  private warmSynth: Tone.MembraneSynth | null = null;
  private glitchSynth: Tone.NoiseSynth | null = null;

  // Effects
  private reverb: Tone.Reverb | null = null;
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
      console.log('🔊 Audio context started');

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
      // UI SOUND SYNTHESIS
      // ====================================

      // Reverb effect for warm sounds
      this.reverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0.4,
      });
      await this.reverb.generate(); // Pre-compute impulse response

      this.uiVolume = new Tone.Volume(-8);
      this.uiVolume.toDestination();

      // DRY CLICK (Architect mode)
      // Short, percussive, no reverb
      this.clickSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.05,
          sustain: 0,
          release: 0.05,
        },
      });
      this.clickSynth.connect(this.uiVolume);

      // WARM CLICK (Author mode)
      // Membrane synth with reverb for warmth
      this.warmSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2,
        },
      });
      this.warmSynth.connect(this.reverb);
      this.reverb.connect(this.uiVolume);

      // GLITCH (Lab mode)
      // Noise burst with fast envelope
      this.glitchSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.03,
          sustain: 0,
          release: 0.02,
        },
      });
      this.glitchSynth.connect(this.uiVolume);

      this.initialized = true;
      console.log('✅ Audio system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      throw error;
    }
  }

  /**
   * Start the ambient biophilic drone.
   * Uses 2-second fade-in for smooth entrance.
   */
  startAmbient(): void {
    if (!this.initialized || this.muted || !this.noise) return;

    try {
      this.noise.start();
      // Fade in over 2 seconds
      this.ambientVolume?.volume.rampTo(-25, 2);
      console.log('🌬️  Ambient drone started');
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
      setTimeout(() => {
        this.noise?.stop();
      }, 1000);
      console.log('🌬️  Ambient drone stopped');
    } catch (error) {
      console.error('Failed to stop ambient:', error);
    }
  }

  /**
   * Play a UI interaction sound based on the current mode.
   *
   * @param type - The type of UI sound to play
   */
  playUISound(type: UISoundType): void {
    if (!this.initialized || this.muted) return;

    const now = Tone.now();

    try {
      switch (type) {
        case 'click-dry':
          // Sharp, precise click at 800Hz
          this.clickSynth?.triggerAttackRelease('800hz', '0.05', now);
          break;

        case 'click-warm':
          // Lower, warmer tone with reverb
          this.warmSynth?.triggerAttackRelease('200hz', '0.2', now);
          break;

        case 'glitch':
          // Random pitch noise burst
          this.glitchSynth?.triggerAttackRelease('0.03', now);
          break;
      }
    } catch (error) {
      console.error(`Failed to play ${type}:`, error);
    }
  }

  /**
   * Toggle mute state for all audio.
   */
  toggleMute(): void {
    this.muted = !this.muted;

    if (this.muted) {
      this.stopAmbient();
      Tone.Destination.mute = true;
    } else {
      Tone.Destination.mute = false;
      this.startAmbient();
    }

    console.log(`🔇 Audio ${this.muted ? 'muted' : 'unmuted'}`);
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
    this.clickSynth?.dispose();
    this.warmSynth?.dispose();
    this.glitchSynth?.dispose();
    this.reverb?.dispose();
    this.uiVolume?.dispose();

    this.initialized = false;
    console.log('🗑️  Audio system disposed');
  }
}

// ====================================
// SINGLETON INSTANCE
// ====================================

// Export a single instance to be used throughout the app
export const audioManager = new AudioManager();
