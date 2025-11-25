# Architecture Overview

## The Prism System

The core architectural concept is **"The Prism"** - a metaphor from optics and sound where a single source (white light, complex audio) splits into constituent parts.

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
                   │  (Keyword Map)    │
                   └─────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
         │  MODE A │    │  MODE B │   │  MODE C │
         │ARCHITECT│    │ AUTHOR  │   │   LAB   │
         └─────────┘    └─────────┘   └─────────┘
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ViewModeProvider (contexts/ViewModeContext.tsx)
│   └── Home (app/page.tsx)
│       ├── EchoChamber (background, all modes except landing)
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

**Methods:**
- `setMode(mode)`: Triggers mode transition with animation delay

**Configuration:**
- `MODE_CONFIG`: Visual/audio theme per mode
- `KEYWORD_MAP`: Intent parsing dictionary
- `parseIntent(input)`: Keyword → ViewMode mapping

## Audio Architecture

```
AudioManager (Singleton)
├── Ambient System
│   ├── Noise Generator (pink noise)
│   ├── Low-pass Filter (LFO modulated)
│   └── Volume Control (breathing automation)
└── UI Sound System
    ├── Click Synth (Architect mode)
    ├── Warm Synth + Reverb (Author mode)
    └── Glitch Synth (Lab mode)
```

### Audio Initialization Flow

1. User interacts (required for browser autoplay policy)
2. `Tone.start()` initializes audio context
3. Synthesizers created and connected
4. LFO automation begins
5. Ambient drone fades in (2s attack)

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
```

### CSS Custom Properties

In `globals.css`:

```css
:root {
  --grain-opacity: 0.03;
  --transition-prism: 800ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

Used for consistent animation timing across components.

## File Organization

### Separation of Concerns

- **`/app`**: Next.js routing, layouts, global styles
- **`/components`**: Reusable UI components
  - `/canvas`: Visual/interactive (EchoChamber)
  - `/modes`: The three view modes
  - Root level: Shared (Landing, AntiPortfolio)
- **`/contexts`**: React Context providers (ViewMode)
- **`/lib`**: Utilities, clients (audio, supabase)

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

### Audio

- Synthesizers created once at initialization, reused for all sounds
- No audio file loading (all synthesis), reducing network overhead
- Ambient drone uses single noise source with efficient filtering

### Bundle Size

- Next.js code splitting per route (automatic)
- Framer Motion tree-shaking via named imports
- Tone.js is large (~200KB gzipped) - consider lazy loading if needed

## Security Considerations

### Supabase RLS

- Public reads restricted to `approved: true` echoes
- Inserts allowed but require moderation
- No direct user authentication (reduces attack surface)

### Input Validation

- Echo text limited to 100 characters (enforced both client & DB)
- XSS prevention via React's automatic escaping
- No user-uploaded files (eliminates entire class of vulnerabilities)

## Future Enhancements

### Potential Additions

1. **Real-time Echo updates**: Supabase realtime subscriptions
2. **Audio recording**: Allow users to submit voice echoes
3. **Spatial audio**: 3D positioning for Echo Chamber entries
4. **Custom mode themes**: User-selectable color schemes
5. **Analytics**: Privacy-respecting usage tracking
6. **A11y improvements**: Reduced motion support, better ARIA labels

---

This architecture prioritizes:
- **Clarity**: Easy to understand flow
- **Extensibility**: Simple to add features
- **Performance**: Optimized for smooth animations
- **Maintainability**: Well-organized, documented code
