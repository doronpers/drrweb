# Component Documentation

*Auto-generated on 2026-01-04*

Total components: 10

---

# AntiPortfolio

====================================
ANTI-PORTFOLIO - FAILURES & UNKNOWNS
====================================

A terminal-style log of failures, mistakes, and uncertainties.
Builds trust through authenticity and transparency.

Design:
- Monospace terminal aesthetic
- JSON-like structure
- Collapsible sections
- Subtle hover effects

**File:** `components/AntiPortfolio.tsx`

## Hooks Used

- `useState`


---

# FailuresLog

====================================
FAILURES LOG - ANTI-PORTFOLIO COMPONENT
====================================

A brutally honest, terminal-style table of failures.
No hover effects. Pure data. Builds trust through transparency.

Data Source: /data/failures.json

Design Philosophy:
- Monospace font throughout
- Minimal styling, maximum clarity
- No animations or hover effects
- Let the content speak for itself

**File:** `components/FailuresLog.tsx`

## Hooks Used

- `useEffect`
- `useState`


---

# Landing

====================================
THE ANTECHAMBER - LANDING COMPONENT
====================================

The entry point. A clean slate that listens.
The user's first utterance determines their path through the prism.

**File:** `components/Landing.tsx`

## Hooks Used

- `useState`
- `useEffect`
- `useCallback`
- `useRef`
- `useViewMode`

## Dependencies

- `@/contexts/ViewModeContext`
- `@/actions/detect-intent`


---

# EchoChamber

====================================
ECHO CHAMBER - FLOATING GUESTBOOK
====================================

A communal space for ephemeral thoughts.
Messages float in the background with physics-based motion.

Features:
- Input for new echoes
- Physics-based floating animation
- Varying opacities for "distance"
- Validation and moderation

**File:** `components/canvas/EchoChamber.tsx`

## Hooks Used

- `useState`
- `useEffect`
- `useCallback`
- `useRef`

## Dependencies

- `./EchoEntry`
- `@/lib/supabase`


---

# EchoEntry

====================================
ECHO ENTRY - SINGLE FLOATING MESSAGE
====================================

Individual entry in the Echo Chamber.
Uses physics-based motion to create organic floating effect.

**File:** `components/canvas/EchoEntry.tsx`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✓ | Unique identifier for the echo entry |
| `text` | `string` | ✓ | The message text to display |
| `timestamp` | `Date` | ✓ | When the echo was created |
| `index` | `number` | ✓ | Position in the list for staggered animation |

## Hooks Used

- `useMemo`


---

# Whisper

====================================
WHISPER - ETHEREAL FLOATING TEXT
====================================

Individual whisper in the ambient text system.
Distinguished from user Echoes by visual treatment:
- More transparent, ghostly appearance
- Slower, more organic motion
- Subtle blur and glow effects
- Typography feels more "voice-like"

**File:** `components/canvas/Whisper.tsx`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✓ |  |
| `text` | `string` | ✓ |  |
| `mood` | `WhisperMood` | ✓ |  |
| `index` | `number` | ✓ |  |
| `totalCount` | `number` | ✓ |  |

## Hooks Used

- `useMemo`

## Dependencies

- `@/lib/whispers`


---

# WhispersChamber

====================================
WHISPERS CHAMBER - AI AMBIENT TEXT
====================================

Container for the floating whisper system.
Manages whisper lifecycle, context adaptation, and density.

Features:
- Context-aware whisper selection
- Automatic refresh cycle
- Adaptive density based on activity
- User intent memory

**File:** `components/canvas/WhispersChamber.tsx`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `ViewMode` | ✓ |  |
| `userIntent` | `string` |  |  |
| `density` | `number` |  | Number of whispers to display (default: 8) |
| `active` | `boolean` |  | Whether the chamber is active (default: true) |

## Hooks Used

- `useState`
- `useEffect`
- `useCallback`
- `useRef`

## Dependencies

- `./Whisper`
- `@/lib/whispers`
- `@/actions/generate-whisper`


---

# Architect

====================================
MODE A: THE ARCHITECT (REFACTORED)
====================================

Utilitarian. Swiss Style. High contrast.
For recruiters, business partners, and decision-makers.

REFACTORING HIGHLIGHTS:
- Centralized typography via getTypography()
- Layout animations for morphing content
- CSS transitions for colors (more performant)
- Cleaner component structure

**File:** `components/modes/Architect.tsx`

## Hooks Used

- `useEffect`

## Dependencies

- `@/lib/audio`
- `@/lib/styles`
- `@/lib/profile`


---

# Author

====================================
MODE B: THE AUTHOR
====================================

Editorial. Breathable. Serif typography.
For explorers, students, and those seeking depth.

Design principles:
- Essays and narrative over data
- High whitespace, generous line-height
- Warm, reverberant UI sounds
- "Reading experience" over "information density"

**File:** `components/modes/Author.tsx`

## Hooks Used

- `useEffect`

## Dependencies

- `@/lib/audio`
- `@/lib/profile`


---

# Lab

====================================
MODE C: THE LAB
====================================

Brutalist. Grid-breaking. Chaotic but navigable.
For makers, tinkerers, and those who want to see the process.

Design principles:
- Monospace everything
- Visible grid/structure
- Glitchy, granular UI sounds
- Raw, unfinished aesthetic
- Behind-the-scenes, WIP content

**File:** `components/modes/Lab.tsx`

## Hooks Used

- `useEffect`
- `useState`

## Dependencies

- `@/lib/audio`


---

