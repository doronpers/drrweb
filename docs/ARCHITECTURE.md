# Architecture Documentation

## Overview

This document describes the system architecture of the DRR Web interactive installation. The core concept is **"The Prism"** - a metaphor where a single identity refracts into multiple presentations based on viewer intent.

## The Prism System

The Prism architecture allows a single website to refract into three distinct modes based on user intent:

```
                    ┌─────────────────┐
                    │   ANTECHAMBER   │
                    │    (Landing)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   USER INPUT    │
                    │ "What do you    │
                    │    seek?"       │
                    └────────┬────────┘
                             │
                   ┌─────────┴─────────┐
                   │  INTENT PARSING   │
                   │  (AI + Keywords)  │
                   └─────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
         │  MODE A │    │  MODE B │   │  MODE C │
         │ARCHITECT│    │ AUTHOR  │   │   LAB   │
         └─────────┘    └─────────┘   └─────────┘
```

### Mode Descriptions

| Mode | Name | Audience | Aesthetic |
|------|------|----------|-----------|
| **A** | The Architect | Recruiters, Business | Swiss Style, utilitarian, high contrast |
| **B** | The Author | Students, Explorers | Editorial, breathable, warm |
| **C** | The Lab | Makers, Developers | Brutalist, raw, experimental |

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ViewModeProvider (contexts/ViewModeContext.tsx)
│   └── Home (app/page.tsx)
│       ├── WhispersChamber (background, all modes)
│       ├── EchoChamber (background, modes except landing)
│       ├── VoiceSelector (voice preference UI)
│       ├── Landing (mode === 'landing')
│       ├── Architect (mode === 'architect')
│       │   └── AntiPortfolio
│       ├── Author (mode === 'author')
│       │   └── AntiPortfolio
│       └── Lab (mode === 'lab')
│           └── AntiPortfolio
```

## State Management

### ViewModeContext

Central state manager for The Prism system.

**State:**
- `currentMode`: 'landing' | 'architect' | 'author' | 'lab'
- `previousMode`: For transition effects
- `isTransitioning`: Animation coordination
- `userIntent`: Original user input for context

**Methods:**
- `setMode(mode)`: Triggers mode transition with animation delay
- `parseIntent(input)`: Keyword-based intent parsing (fallback)

**Configuration:**
- `MODE_CONFIG`: Visual/audio theme per mode
- `KEYWORD_MAP`: Intent parsing dictionary
- `parseIntent(input)`: Keyword → ViewMode mapping

## AI-Powered Intent Detection

**File:** `actions/detect-intent.ts`

The system uses Anthropic Claude 3.5 Sonnet (primary) or Google Gemini 1.5 Flash (fallback) to analyze user input and route to the appropriate mode.

**Features:**
- Structured output with Zod validation
- Returns: `{ targetMode, audioParams }`
- Graceful fallback to keyword matching if API unavailable
- No chat responses - pure routing data

**Logic:**
- Hiring/data/credentials → Architect
- Reading/curiosity/philosophy → Author
- Building/code/process → Lab

**Environment Variables:**
- `ANTHROPIC_API_KEY` (primary)
- `AI_GATEWAY_API_KEY` (fallback)

## Audio Architecture

```
AudioManager (Singleton)
├── Ambient System
│   ├── Noise Generator (pink noise)
│   ├── Low-pass Filter (LFO modulated)
│   └── Volume Control (breathing automation)
│   └── Ducking Control (for voice playback)
└── UI Sound System
    ├── Musical Tones (Architect mode)
    ├── Warm Tones + Reverb (Author mode)
    └── Filtered Tones (Lab mode)
└── Voice System
    ├── ElevenLabs Integration
    ├── Audio Ducking (-2dB)
    └── IndexedDB Caching
```

### Audio Initialization Flow

1. User interacts (required for browser autoplay policy)
2. `Tone.start()` initializes audio context
3. Synthesizers created and connected
4. LFO automation begins
5. Ambient drone fades in (2s attack)

### Voice Playback

- ElevenLabs text-to-speech for whispers
- Subtle audio ducking (-2dB) during voice playback
- IndexedDB caching for persistent audio storage
- Sequential playback queue for natural pacing

## Data Flow

### Echo Chamber

```
User Input → Validation → Supabase Insert → Moderation → Approval → Display
                              ↓ (if no Supabase)
                         Mock Data Array
```

**Without Supabase:**
- Uses `INITIAL_ECHOES` array in `EchoChamber.tsx`
- New echoes stored in local state only

**With Supabase:**
- Inserts go to `echoes` table with `approved: false`
- RLS policy allows public reads of `approved: true` only
- Manual moderation required via Supabase dashboard

### Whispers Chamber

```
AI Generation → Text Display → Voice Generation → Caching → Playback
     ↓
Curated Pool (fallback)
```

## Animation Strategy

### Framer Motion Patterns

1. **Page Transitions**: `<AnimatePresence mode="wait">` for exclusive mode rendering
2. **Layout Animations**: Automatic FLIP animations for reordering
3. **Gesture Animations**: `whileHover`, `whileTap` for interactive feedback
4. **Physics Simulations**: Spring animations for Echo Chamber floating

### Performance Optimizations

- `willChange` CSS property on animated elements
- `layout` animations only when necessary
- Staggered delays to distribute render cost
- `AnimatePresence` to cleanup unmounted components
- Code splitting for mode components

## Styling Architecture

### Tailwind Configuration

Custom theme extensions in `tailwind.config.ts`:

```typescript
colors: {
  architect: { bg, text, accent },
  author: { bg, text, accent },
  lab: { bg, text, accent }
}

fontFamily: {
  sans: '--font-inter',    // Architect mode
  serif: '--font-eb-garamond', // Author mode
  mono: '--font-jetbrains-mono' // Lab mode
}

spacing: {
  // 8px-based scale
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  // ... up to '128'
}
```

### CSS Custom Properties

In `globals.css`:

```css
:root {
  --grain-opacity: 0.015;
  --transition-prism: 800ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

Used for consistent animation timing across components.

## File Organization

### Separation of Concerns

- **`/app`**: Next.js routing, layouts, global styles
- **`/actions`**: Server Actions (AI, voice generation)
- **`/components`**: Reusable UI components
  - `/canvas`: Visual/interactive (EchoChamber, WhispersChamber)
  - `/modes`: The three view modes
  - Root level: Shared (Landing, AntiPortfolio, VoiceSelector)
- **`/contexts`**: React Context providers (ViewMode)
- **`/lib`**: Utilities, clients (audio, supabase, voice, whispers)

### Naming Conventions

- **Components**: PascalCase (`Landing.tsx`)
- **Utilities**: camelCase (`audio.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`KEYWORD_MAP`)
- **Types**: PascalCase interfaces (`ViewMode`)

## TypeScript Patterns

### Strict Typing

```typescript
// Literal union types for safety
type ViewMode = 'landing' | 'architect' | 'author' | 'lab';

// Config objects with 'as const' for inference
export const MODE_CONFIG = { ... } as const;
```

### Error Boundaries

Audio initialization wrapped in try/catch with fallback:

```typescript
try {
  await audioManager.init();
} catch (error) {
  console.error('Audio failed, continuing without sound');
}
```

## Extensibility Points

### Adding a New Mode

1. Add to `ViewMode` union type in `ViewModeContext.tsx`
2. Add theme config to `MODE_CONFIG`
3. Add keywords to `KEYWORD_MAP`
4. Create component in `/components/modes/NewMode.tsx`
5. Add route in `app/page.tsx` AnimatePresence

### Adding New Audio Sounds

1. Create synthesizer in `lib/audio.ts` → `AudioManager.init()`
2. Add type to `UISoundType` union
3. Add switch case in `playUISound(type)`
4. Connect to UI interactions via `onMouseEnter={handleHover}`

### Extending Echo Chamber

1. Add fields to Supabase `echoes` table
2. Update `Echo` interface in `lib/supabase.ts`
3. Update `EchoEntry.tsx` display logic
4. Modify `EchoChamber.tsx` input form

## Performance Considerations

### Rendering

- Modes use `AnimatePresence` with `mode="wait"` to prevent simultaneous renders
- Echo Chamber entries use `position: absolute` to avoid layout thrashing
- Grain overlay uses `pointer-events: none` to prevent interaction cost
- Mode components are lazy-loaded with `dynamic` imports

### Audio

- Synthesizers created once at initialization, reused for all sounds
- No audio file loading (all synthesis), reducing network overhead
- Ambient drone uses single noise source with efficient filtering
- Voice audio cached in IndexedDB to reduce API calls

### Bundle Size

- Next.js code splitting per route (automatic)
- Framer Motion tree-shaking via named imports
- Tone.js is large (~200KB gzipped) - consider lazy loading if needed
- Mode components dynamically imported

## Security Considerations

### Supabase RLS

- Public reads restricted to `approved: true` echoes
- Inserts allowed but require moderation
- No direct user authentication (reduces attack surface)

### Input Validation

- Echo text limited to 100 characters (enforced both client & DB)
- XSS prevention via React's automatic escaping
- Input sanitization for AI prompts
- No user-uploaded files (eliminates entire class of vulnerabilities)

### API Keys

- All API keys stored in environment variables
- Server-side only (except `NEXT_PUBLIC_*` which are safe to expose)
- No hardcoded secrets in codebase

## Future Enhancements

### Potential Additions

1. **Real-time Echo updates**: Supabase realtime subscriptions
2. **Audio recording**: Allow users to submit voice echoes
3. **Spatial audio**: 3D positioning for Echo Chamber entries
4. **Custom mode themes**: User-selectable color schemes
5. **Analytics**: Privacy-respecting usage tracking
6. **A11y improvements**: Reduced motion support, better ARIA labels
7. **Voice customization**: More voice options and parameters

---

This architecture prioritizes:
- **Clarity**: Easy to understand flow
- **Extensibility**: Simple to add features
- **Performance**: Optimized for smooth animations
- **Maintainability**: Well-organized, documented code
