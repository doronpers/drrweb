/**
 * ====================================
 * VOICE MANAGER - ELEVENLABS PLAYBACK
 * ====================================
 *
 * Manages voice playback for whispers with:
 * - Subtle audio ducking integration
 * - IndexedDB caching for persistent storage
 * - Sequential playback queue
 * - Error handling and graceful degradation
 */

'use client';

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { audioManager } from './audio';
import { generateVoice } from '@/actions/generate-voice';

// ====================================
// TYPE DEFINITIONS
// ====================================

interface VoiceCacheSchema extends DBSchema {
  voices: {
    key: string; // Cache key: whisper-${text}-${voiceId}
    value: {
      audioData: ArrayBuffer;
      timestamp: number;
      text: string;
      voiceId: string;
    };
  };
}

// ====================================
// CONFIGURATION
// ====================================

const CACHE_DB_NAME = 'whisper-voices';
const CACHE_DB_VERSION = 1;
const CACHE_STORE_NAME = 'voices';
const DUCK_AMOUNT = -2; // dB (subtle, barely noticeable)
const DUCK_RAMP_TIME = 0.3; // seconds

// ====================================
// CACHE MANAGEMENT
// ====================================

let db: IDBPDatabase<VoiceCacheSchema> | null = null;

/**
 * Initialize IndexedDB for voice caching
 */
async function initCache(): Promise<IDBPDatabase<VoiceCacheSchema> | null> {
  if (typeof window === 'undefined') return null;
  if (db) return db;

  try {
    db = await openDB<VoiceCacheSchema>(CACHE_DB_NAME, CACHE_DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(CACHE_STORE_NAME)) {
          database.createObjectStore(CACHE_STORE_NAME);
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Failed to initialize voice cache:', error);
    return null;
  }
}

/**
 * Generate cache key from text and voice ID
 */
function getCacheKey(text: string, voiceId: string): string {
  // Normalize text for consistent caching (lowercase, trim)
  const normalized = text.toLowerCase().trim();
  return `whisper-${normalized}-${voiceId}`;
}

/**
 * Get cached audio data
 */
async function getCachedAudio(
  text: string,
  voiceId: string
): Promise<ArrayBuffer | null> {
  const cache = await initCache();
  if (!cache) return null;

  try {
    const key = getCacheKey(text, voiceId);
    const cached = await cache.get(CACHE_STORE_NAME, key);
    
    if (cached && cached.audioData) {
      // Check if cache is still valid (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - cached.timestamp < maxAge) {
        return cached.audioData;
      } else {
        // Remove expired cache
        await cache.delete(CACHE_STORE_NAME, key);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get cached audio:', error);
    return null;
  }
}

/**
 * Store audio data in cache
 */
async function cacheAudio(
  text: string,
  voiceId: string,
  audioData: ArrayBuffer
): Promise<void> {
  const cache = await initCache();
  if (!cache) return;

  try {
    // Check cache size and evict if needed (simple LRU - remove oldest)
    const allKeys = await cache.getAllKeys(CACHE_STORE_NAME);
    if (allKeys.length > 100) {
      // Remove oldest 20 entries
      const allEntries = await cache.getAll(CACHE_STORE_NAME);
      const sorted = allEntries.sort((a, b) => a.timestamp - b.timestamp);
      for (let i = 0; i < Math.min(20, sorted.length); i++) {
        const key = getCacheKey(sorted[i].text, sorted[i].voiceId);
        await cache.delete(CACHE_STORE_NAME, key);
      }
    }

    const key = getCacheKey(text, voiceId);
    await cache.put(CACHE_STORE_NAME, {
      audioData,
      timestamp: Date.now(),
      text,
      voiceId,
    }, key);
  } catch (error) {
    console.error('Failed to cache audio:', error);
    // Non-fatal - continue without caching
  }
}

// ====================================
// VOICE PLAYBACK
// ====================================

interface PlaybackQueueItem {
  text: string;
  voiceId?: string;
  priority?: number;
}

class VoiceManager {
  private playbackQueue: PlaybackQueueItem[] = [];
  private isPlaying: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private defaultVoiceId: string = '21m00Tcm4TlvDq8ikWAM'; // Rachel - neutral, clear

  /**
   * Get default voice ID from localStorage or use fallback
   */
  private getVoiceId(): string {
    if (typeof window === 'undefined') return this.defaultVoiceId;
    const stored = localStorage.getItem('elevenlabs-voice-id');
    return (stored && stored.length > 0) ? stored : this.defaultVoiceId;
  }

  /**
   * Play voice audio with subtle ducking
   */
  async playVoice(text: string, voiceId?: string): Promise<boolean> {
    const selectedVoiceId = voiceId || this.getVoiceId();
    
    // Note: We don't check audioManager.isMuted() here because whispers should play
    // even when UI sounds are muted. Whispers are ambient content, not interaction feedback.
    // If users want to mute whispers, they can mute their system audio or we can add
    // a separate whisper mute setting in the future.

    if (process.env.NODE_ENV === 'development') {
      console.log(`🎤 Attempting to play voice for: "${text.slice(0, 30)}..." (voice: ${selectedVoiceId})`);
    }

    // Check cache first
    let audioData: ArrayBuffer | null = await getCachedAudio(text, selectedVoiceId);

    if (audioData) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Using cached audio');
      }
    } else {
      // If not cached, generate
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Generating new voice audio...');
      }
      try {
        const result = await generateVoice(text, selectedVoiceId);
        if (!result.success || !result.audioData) {
          console.error('❌ Voice generation failed:', result.error);
          return false;
        }
        audioData = result.audioData;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Voice audio generated successfully');
        }
        
        // Cache for future use
        await cacheAudio(text, selectedVoiceId, audioData);
      } catch (error) {
        console.error('❌ Voice generation error:', error);
        return false;
      }
    }

    // Play audio
    return this.playAudioData(audioData, text);
  }

  /**
   * Play audio data with ducking
   */
  private async playAudioData(
    audioData: ArrayBuffer,
    text: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Validate audio data
        if (!audioData || audioData.byteLength === 0) {
          console.error('❌ Invalid audio data: empty or null');
          resolve(false);
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`🎵 Creating audio playback (${audioData.byteLength} bytes)`);
        }

        // Create blob URL from audio data
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        // Create audio element
        const audio = new Audio(url);
        this.currentAudio = audio;

        // Set volume (ensure it's audible)
        audio.volume = 1.0;

        // Duck ambient on playback start (if audio manager is initialized)
        // This is optional - whispers can play even if audio manager isn't ready
        try {
          if (audioManager && typeof audioManager.duckAmbient === 'function') {
            audioManager.duckAmbient(DUCK_AMOUNT, DUCK_RAMP_TIME);
          }
        } catch (error) {
          // Non-fatal - continue playback even if ducking fails
          if (process.env.NODE_ENV === 'development') {
            console.warn('Could not duck ambient audio:', error);
          }
        }

        // Restore ambient on playback end
        audio.addEventListener('ended', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Voice playback completed');
          }
          try {
            if (audioManager && typeof audioManager.restoreAmbient === 'function') {
              audioManager.restoreAmbient(DUCK_RAMP_TIME);
            }
          } catch (error) {
            // Non-fatal
          }
          URL.revokeObjectURL(url);
          this.currentAudio = null;
          this.isPlaying = false;
          
          // Process next item in queue
          this.processQueue();
          resolve(true);
        });

        // Handle errors
        audio.addEventListener('error', (error) => {
          console.error('❌ Audio playback error:', error);
          console.error('Audio element error details:', {
            error: audio.error,
            code: audio.error?.code,
            message: audio.error?.message,
            networkState: audio.networkState,
            readyState: audio.readyState,
          });
          try {
            if (audioManager && typeof audioManager.restoreAmbient === 'function') {
              audioManager.restoreAmbient(DUCK_RAMP_TIME);
            }
          } catch (error) {
            // Non-fatal
          }
          URL.revokeObjectURL(url);
          this.currentAudio = null;
          this.isPlaying = false;
          this.processQueue();
          resolve(false);
        });

        // Handle load events for debugging
        audio.addEventListener('loadeddata', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('📦 Audio data loaded, duration:', audio.duration, 'seconds');
          }
        });

        audio.addEventListener('canplay', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('▶️ Audio ready to play');
          }
        });

        // Start playback
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
              if (process.env.NODE_ENV === 'development') {
                console.log(`🔊 Playing voice: "${text.slice(0, 30)}..." (duration: ${audio.duration.toFixed(2)}s)`);
              }
            })
            .catch((error) => {
              console.error('❌ Failed to play audio:', error);
              console.error('Play error details:', {
                name: error.name,
                message: error.message,
                networkState: audio.networkState,
                readyState: audio.readyState,
              });
              try {
            if (audioManager && typeof audioManager.restoreAmbient === 'function') {
              audioManager.restoreAmbient(DUCK_RAMP_TIME);
            }
          } catch (error) {
            // Non-fatal
          }
              URL.revokeObjectURL(url);
              this.currentAudio = null;
              this.isPlaying = false;
              this.processQueue();
              resolve(false);
            });
        } else {
          // Fallback for older browsers
          this.isPlaying = true;
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔊 Playing voice (legacy): "${text.slice(0, 30)}..."`);
          }
        }
      } catch (error) {
        console.error('❌ Failed to create audio playback:', error);
        resolve(false);
      }
    });
  }

  /**
   * Add whisper to playback queue
   */
  queueWhisper(text: string, voiceId?: string, priority: number = 0): void {
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Cannot queue empty whisper text');
      return;
    }

    this.playbackQueue.push({ text, voiceId, priority });
    
    // Sort by priority (higher first)
    this.playbackQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 Queued whisper: "${text.slice(0, 30)}..." (queue size: ${this.playbackQueue.length}, playing: ${this.isPlaying})`);
    }
    
    // Process queue if not currently playing
    if (!this.isPlaying) {
      this.processQueue();
    }
  }

  /**
   * Process playback queue
   */
  private async processQueue(): Promise<void> {
    if (this.isPlaying) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏸️ Already playing, queue will process after current playback');
      }
      return;
    }
    
    if (this.playbackQueue.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📭 Queue is empty');
      }
      return;
    }

    const item = this.playbackQueue.shift();
    if (!item) return;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🎵 Processing queue item: "${item.text.slice(0, 30)}..." (${this.playbackQueue.length} remaining)`);
    }

    // Small delay between whispers for natural pacing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await this.playVoice(item.text, item.voiceId);
  }

  /**
   * Stop current playback and clear queue
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    audioManager.restoreAmbient(DUCK_RAMP_TIME);
    this.playbackQueue = [];
    this.isPlaying = false;
  }

  /**
   * Check if currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Set default voice ID
   */
  setDefaultVoice(voiceId: string): void {
    if (typeof window !== 'undefined' && voiceId) {
      localStorage.setItem('elevenlabs-voice-id', voiceId);
    }
    if (voiceId) {
      this.defaultVoiceId = voiceId;
    }
  }

  /**
   * Get default voice ID
   */
  getDefaultVoice(): string {
    return this.getVoiceId();
  }
}

// ====================================
// SINGLETON EXPORT
// ====================================

export const voiceManager = new VoiceManager();
