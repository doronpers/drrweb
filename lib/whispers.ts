/**
 * ====================================
 * WHISPERS - AI-POWERED AMBIENT TEXT
 * ====================================
 *
 * A system for generating and selecting contextual,
 * ephemeral text fragments that drift through the experience.
 *
 * Features:
 * - Mode-aware content selection
 * - Time-of-day sensitivity
 * - User intent memory
 * - Curated + AI-generated blend
 */

// ====================================
// TYPE DEFINITIONS
// ====================================

export type ViewMode = 'landing' | 'architect' | 'author' | 'lab';
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night' | 'witching';
export type WhisperMood = 'contemplative' | 'technical' | 'creative' | 'mysterious' | 'philosophical';

export interface Whisper {
  id: string;
  text: string;
  mood: WhisperMood;
  source: 'curated' | 'ai' | 'echo';
}

export interface WhisperContext {
  mode: ViewMode;
  timeOfDay: TimeOfDay;
  userIntent?: string;
  sessionDuration?: number; // minutes
}

// ====================================
// TIME DETECTION
// ====================================

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'dusk';
  if (hour >= 20 || hour < 2) return 'night';
  return 'witching'; // 2am - 5am
}

// ====================================
// CURATED WHISPER COLLECTIONS
// ====================================

const UNIVERSAL_WHISPERS: string[] = [
  "What patterns emerge from chaos?",
  "Between intention and execution lies craft",
  "The space between thoughts holds meaning",
  "Every system has a pulse",
  "Fragments coalesce into understanding",
  "The edge is where growth happens",
  "Silence is its own language",
  "What remains when everything else fades?",
  "Complexity hides simple truths",
  "The map is not the territory",
  "Constraints breed creativity",
  "Emergence happens at boundaries",
  "What you seek is seeking you",
  "The question shapes the answer",
  "Iteration reveals intention",
];

const MODE_WHISPERS: Record<ViewMode, string[]> = {
  landing: [
    "What brings you here?",
    "The threshold holds all possibilities",
    "Every journey begins with a question",
    "The door opens inward",
    "Intention precedes creation",
    "What will you become today?",
    "The blank page waits patiently",
    "All paths lead somewhere",
    "Curiosity is a compass",
    "The first step echoes longest",
  ],
  architect: [
    "Structure enables freedom",
    "Systems within systems",
    "The elegant solution waits to be found",
    "Efficiency is a form of beauty",
    "Build to last, design to adapt",
    "The foundation determines the height",
    "Complexity managed becomes simplicity served",
    "What would you build if you couldn't fail?",
    "Architecture is frozen music",
    "Every constraint is a creative opportunity",
    "The blueprint dreams of becoming real",
    "Scalability is anticipated growth",
    "Clean interfaces hide complex internals",
    "Technical debt accrues interest",
    "The system remembers what you forget",
  ],
  author: [
    "Words are containers for thought",
    "The story tells itself through you",
    "Voice emerges from accumulated silence",
    "Every sentence is a small journey",
    "What story are you living?",
    "The narrative shapes the narrator",
    "Between the lines lives meaning",
    "Writing is thinking made visible",
    "The reader completes the circuit",
    "Characters dream of freedom",
    "Plot is character under pressure",
    "The first draft is discovery",
    "Revision is re-vision",
    "Every ending is a beginning in disguise",
    "The truth hides in fiction",
  ],
  lab: [
    "Hypothesis → experiment → understanding",
    "Failure is information in disguise",
    "The unexpected result is the gift",
    "What if we tried it differently?",
    "Iteration reveals what theory conceals",
    "The prototype speaks truth",
    "Break it to understand it",
    "Variables dance with constants",
    "The edge case defines the system",
    "Measure twice, break once, learn always",
    "Emergence defies prediction",
    "The experiment continues",
    "Control groups dream of variables",
    "Data whispers its secrets",
    "The lab is where certainty goes to die",
  ],
};

const TIME_WHISPERS: Record<TimeOfDay, string[]> = {
  dawn: [
    "The day unfolds from darkness",
    "First light carries fresh possibility",
    "What will you make of these hours?",
    "The world rewrites itself each morning",
    "Dawn is a verb",
  ],
  morning: [
    "The mind sharpens with use",
    "Potential waits to be spent",
    "Early decisions echo long",
    "The clock runs but time flows",
    "Momentum gathers in stillness",
  ],
  afternoon: [
    "The peak reveals the valley",
    "Energy ebbs and flows like tides",
    "The halfway point is a mirror",
    "Persistence outlasts inspiration",
    "The work continues",
  ],
  dusk: [
    "Transitions hold their own beauty",
    "The day's work finds its rest",
    "Reflection comes with fading light",
    "What did you learn today?",
    "The gloaming hour thinks deeply",
  ],
  night: [
    "The dark is a different kind of light",
    "Night thoughts run deeper",
    "The subconscious takes the wheel",
    "Stars are distant suns",
    "Rest is its own form of work",
  ],
  witching: [
    "The small hours know things",
    "Between yesterday and tomorrow",
    "The world sleeps but you remain",
    "3am clarity is a double-edged gift",
    "The night owl sees what others miss",
  ],
};

const INTENT_RESPONSES: Record<string, string[]> = {
  hire: [
    "Every collaboration begins with trust",
    "The right partnership transforms both parties",
    "Value recognizes value",
    "What problem needs solving?",
    "Together we go further",
  ],
  build: [
    "Creation is an act of faith",
    "The first line of code is a commitment",
    "Architecture emerges from accumulated decisions",
    "What will stand the test of time?",
    "Building is thinking with materials",
  ],
  story: [
    "Every life is a narrative in progress",
    "The story chooses its teller",
    "What chapter are you writing?",
    "Characters have agency",
    "The plot thickens with every choice",
  ],
  process: [
    "Method is portable magic",
    "The how reveals the who",
    "Process is crystallized learning",
    "Every workflow tells a story",
    "Systems outlive their creators",
  ],
  explore: [
    "Curiosity has no destination",
    "The wanderer finds unexpected paths",
    "Discovery rewards the patient",
    "What's around the next corner?",
    "Exploration is its own reward",
  ],
  learn: [
    "Understanding is a spiral, not a line",
    "The student becomes the teacher",
    "Knowledge compounds silently",
    "What you don't know shapes you",
    "Learning never announces its arrival",
  ],
};

// ====================================
// WHISPER ENGINE
// ====================================

class WhisperEngine {
  private usedWhispers: Set<string> = new Set();
  private currentContext: WhisperContext = {
    mode: 'landing',
    timeOfDay: getTimeOfDay(),
  };

  /**
   * Update the engine's context for better whisper selection
   */
  setContext(context: Partial<WhisperContext>): void {
    this.currentContext = { ...this.currentContext, ...context };
  }

  /**
   * Get current context
   */
  getContext(): WhisperContext {
    return { ...this.currentContext };
  }

  /**
   * Select a whisper based on current context
   */
  selectWhisper(): Whisper {
    const candidates = this.buildCandidatePool();
    
    // Filter out recently used whispers (memory of last 50%)
    const maxMemory = Math.floor(candidates.length * 0.5);
    if (this.usedWhispers.size >= maxMemory) {
      // Reset memory when we've used half the pool
      const usedArray = Array.from(this.usedWhispers);
      this.usedWhispers = new Set(usedArray.slice(-Math.floor(maxMemory / 2)));
    }

    const fresh = candidates.filter(c => !this.usedWhispers.has(c.text));
    const pool = fresh.length > 0 ? fresh : candidates;
    
    const selected = pool[Math.floor(Math.random() * pool.length)];
    this.usedWhispers.add(selected.text);
    
    return {
      ...selected,
      id: `whisper-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    };
  }

  /**
   * Build a weighted pool of whisper candidates
   */
  private buildCandidatePool(): Omit<Whisper, 'id'>[] {
    const pool: Omit<Whisper, 'id'>[] = [];
    const { mode, timeOfDay, userIntent } = this.currentContext;

    // Add universal whispers (lower weight)
    UNIVERSAL_WHISPERS.forEach(text => {
      pool.push({ text, mood: 'philosophical', source: 'curated' });
    });

    // Add mode-specific whispers (higher weight - add twice)
    MODE_WHISPERS[mode].forEach(text => {
      pool.push({ text, mood: this.moodForMode(mode), source: 'curated' });
      pool.push({ text, mood: this.moodForMode(mode), source: 'curated' });
    });

    // Add time-of-day whispers
    TIME_WHISPERS[timeOfDay].forEach(text => {
      pool.push({ text, mood: 'contemplative', source: 'curated' });
    });

    // Add intent-based whispers if we have user intent
    if (userIntent) {
      const intentKey = this.detectIntentCategory(userIntent);
      if (intentKey && INTENT_RESPONSES[intentKey]) {
        INTENT_RESPONSES[intentKey].forEach(text => {
          // Higher weight for intent-based whispers
          pool.push({ text, mood: 'philosophical', source: 'curated' });
          pool.push({ text, mood: 'philosophical', source: 'curated' });
          pool.push({ text, mood: 'philosophical', source: 'curated' });
        });
      }
    }

    return pool;
  }

  /**
   * Map mode to primary mood
   */
  private moodForMode(mode: ViewMode): WhisperMood {
    switch (mode) {
      case 'architect': return 'technical';
      case 'author': return 'creative';
      case 'lab': return 'mysterious';
      default: return 'contemplative';
    }
  }

  /**
   * Detect intent category from user input
   */
  private detectIntentCategory(intent: string): string | null {
    const lower = intent.toLowerCase();
    
    const patterns: Record<string, RegExp> = {
      hire: /\b(hire|work|collaborate|partner|consult|project|freelance|contract)\b/i,
      build: /\b(build|create|develop|make|construct|ship|launch|deploy)\b/i,
      story: /\b(story|stories|narrative|write|writing|author|blog|content)\b/i,
      process: /\b(process|how|method|approach|workflow|system|practice)\b/i,
      explore: /\b(explore|browse|look|see|discover|wander|curious)\b/i,
      learn: /\b(learn|understand|know|study|teach|explain|about)\b/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      if (pattern.test(lower)) {
        return key;
      }
    }

    return null;
  }

  /**
   * Get multiple whispers at once
   */
  selectMultiple(count: number): Whisper[] {
    const whispers: Whisper[] = [];
    for (let i = 0; i < count; i++) {
      whispers.push(this.selectWhisper());
    }
    return whispers;
  }

  /**
   * Reset the used whispers memory
   */
  reset(): void {
    this.usedWhispers.clear();
  }
}

// ====================================
// SINGLETON EXPORT
// ====================================

export const whisperEngine = new WhisperEngine();

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Get initial whispers for page load
 */
export function getInitialWhispers(count: number = 8): Whisper[] {
  return whisperEngine.selectMultiple(count);
}

/**
 * Update context and get fresh whispers
 */
export function getContextualWhispers(
  context: Partial<WhisperContext>,
  count: number = 5
): Whisper[] {
  whisperEngine.setContext(context);
  return whisperEngine.selectMultiple(count);
}

