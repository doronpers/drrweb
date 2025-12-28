# DRR Web - Operations & Usage Guide

> **An Interactive Installation** — A theatrical personal website treating web design as an art installation rather than a traditional portfolio.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Full Build & Deployment](#full-build--deployment)
4. [Architecture](#architecture)
5. [Key Features](#key-features)
6. [Configuration](#configuration)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [Suggested Improvements](#suggested-improvements)

---

## Overview

### The Concept: "The Prism"

This website is structured around **The Prism** — a metaphor where a single identity refracts into multiple presentations based on viewer intent:

| Mode | Name | Audience | Aesthetic |
|------|------|----------|-----------|
| **A** | The Architect | Recruiters, Business | Swiss Style, utilitarian, high contrast |
| **B** | The Author | Students, Explorers | Editorial, breathable, warm |
| **C** | The Lab | Makers, Developers | Brutalist, raw, experimental |

### Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom utility classes
- **Animation**: Framer Motion (layout animations & transitions)
- **Audio**: Tone.js (real-time synthesis & processing)
- **AI**: Vercel AI SDK with Google Gemini (intent detection)
- **Backend**: Supabase (PostgreSQL for Echo Chamber)
- **State**: React Context API (ViewMode management)
- **Validation**: Zod (schema validation for AI outputs)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase (for Echo Chamber feature)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Vercel AI Gateway (for AI-powered intent detection)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

> **Note**: The site works without these — it falls back to keyword matching and mock data.

---

## Full Build & Deployment

### Production Build

```bash
# Build for production (includes auto-generated docs)
npm run build

# Preview the production build
npm start
```

### Build Output

The build process:
1. **Pre-build**: Generates API documentation (`docs/generated/`)
2. **Next.js Build**: Compiles and optimizes the application
3. **Static Generation**: Pre-renders static pages

Expected output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    171 kB          258 kB
└ ○ /_not-found                          873 B          88.2 kB
+ First Load JS shared by all            87.3 kB
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms

See platform-specific guides:
- `IONOS_DEPLOYMENT.md` — IONOS hosting
- `VERCEL_DNS_SETUP.md` — Vercel DNS configuration

---

## Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ViewModeProvider (contexts/ViewModeContext.tsx)
│   └── Home (app/page.tsx)
│       ├── WhispersChamber (AI-generated ambient text)
│       ├── EchoChamber (user-submitted messages)
│       ├── Landing (mode === 'landing')
│       ├── Architect + AntiPortfolio (mode === 'architect')
│       ├── Author + AntiPortfolio (mode === 'author')
│       └── Lab + AntiPortfolio (mode === 'lab')
```

### File Structure

```
drrweb/
├── actions/              # Server Actions
│   ├── detect-intent.ts  # AI-powered intent routing
│   └── generate-whisper.ts
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main Prism router
├── components/
│   ├── canvas/           # Visual/interactive components
│   │   ├── EchoChamber.tsx
│   │   ├── Whisper.tsx
│   │   └── WhispersChamber.tsx
│   ├── modes/            # The three view modes
│   │   ├── Architect.tsx
│   │   ├── Author.tsx
│   │   └── Lab.tsx
│   ├── Landing.tsx       # Entry point (Antechamber)
│   ├── AntiPortfolio.tsx # Failures footer
│   └── FailuresLog.tsx   # Table-style failures
├── contexts/
│   └── ViewModeContext.tsx  # Prism state management
├── lib/
│   ├── audio.ts          # Tone.js audio engine
│   ├── useSoundscape.ts  # Audio mode hook
│   ├── supabase.ts       # Supabase client
│   └── whispers.ts       # Whisper generation
└── public/
    ├── data/failures.json
    └── textures/grain.svg
```

### Data Flow

1. **User Input** → Landing page "What do you seek?" prompt
2. **Intent Detection** → AI (Vercel Gateway) or keyword matching
3. **Mode Selection** → ViewModeContext updates state
4. **Rendering** → Mode-specific component + audio + styling
5. **Audio Feedback** → Mode-specific synthesizer sounds

---

## Key Features

### 1. The Antechamber (Landing)

- Minimal input field: "What do you seek?"
- **Enter key** triggers intent detection and mode navigation
- Audio initializes on first interaction
- Keywords hint: `hire • story • process`

### 2. Intent Detection (Ghost Router)

**Hybrid approach:**
- **Single word**: Fast keyword matching (instant, no API call)
- **Multiple words**: AI Gateway for natural language understanding

Fallback chain: AI → Keyword Matching → Default (Architect)

### 3. Audio System

Real-time synthesis using Tone.js:

| Mode | Sound Character | Detune |
|------|-----------------|--------|
| Architect | Dry, precise sine clicks | ±3 cents |
| Author | Warm, reverb-heavy pads | ±8 cents |
| Lab | Experimental, filtered | ±12 cents |

**Humanization**: Each note trigger applies semi-random detune for organic feel.

### 4. Echo Chamber

- Floating guestbook messages with physics-based motion
- Supabase-backed with moderation (RLS policies)
- Falls back to mock data without Supabase

### 5. Whispers Chamber

- AI-generated ambient text floating in background
- Responds to user intent for personalization
- Subtle atmospheric effect

### 6. Anti-Portfolio

- Brutally honest failures log
- Terminal-style presentation
- Categories: failures, lessons, unknowns

---

## Configuration

### Mode Keywords

Edit `contexts/ViewModeContext.tsx` → `KEYWORD_MAP`:

```typescript
export const KEYWORD_MAP: Record<string, ViewMode> = {
  // Architect mode
  'hire': 'architect',
  'cv': 'architect',
  'business': 'architect',
  
  // Author mode
  'story': 'author',
  'philosophy': 'author',
  
  // Lab mode
  'process': 'lab',
  'code': 'lab',
};
```

### Audio Parameters

Edit `lib/audio.ts`:

```typescript
// Detune presets for humanization (cents)
const DETUNE_PRESETS = {
  architect: { min: -3, max: 3 },   // Subtle
  author: { min: -8, max: 8 },      // Warm
  lab: { min: -12, max: 12 },       // Experimental
};

// Pentatonic scale frequencies
const PENTATONIC_SCALE = {
  C4: 261.63,
  D4: 293.66,
  // ...
};
```

### AI Intent Detection

Edit `actions/detect-intent.ts`:

```typescript
// Adjust the prompt for different routing behavior
function buildPrompt(input: string): string {
  return `You are a routing assistant...`;
}

// Customize audio parameters per mode
const audioParamsMap = {
  architect: { reverb: 0.1, filter: 1800 },
  author: { reverb: 0.8, filter: 1000 },
  lab: { reverb: 0.3, filter: 400 },
};
```

---

## Customization

### Update Content

| Content | File |
|---------|------|
| Personal info | `components/modes/Architect.tsx`, `Author.tsx`, `Lab.tsx` |
| Failures | `public/data/failures.json` |
| Initial echoes | `components/canvas/EchoChamber.tsx` → `INITIAL_ECHOES` |
| Keywords | `contexts/ViewModeContext.tsx` → `KEYWORD_MAP` |

### Styling

| Element | Location |
|---------|----------|
| Colors | `tailwind.config.ts` → `theme.extend.colors` |
| Animations | `app/globals.css` → custom keyframes |
| Typography | `app/layout.tsx` → font configuration |

### Security Headers

Edit `next.config.mjs` for CSP and security headers:

```javascript
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
      "worker-src 'self' blob:", // For Tone.js
      // ...
    ].join('; '),
  },
]
```

---

## Troubleshooting

### Common Issues

#### Audio not playing
- Check browser autoplay policy (requires user interaction first)
- Verify audio isn't muted (icon in top-right)
- Check console for CSP errors

#### AI Intent Detection failing
- Verify `AI_GATEWAY_API_KEY` is set
- Check Vercel AI Gateway dashboard for quota/errors
- Falls back to keyword matching automatically

#### Echo Chamber not loading
- Verify Supabase credentials
- Check RLS policies are configured
- Falls back to mock data

#### Build failing
- Ensure `integrate-workspace/` and `scripts/` are in `tsconfig.json` exclude
- Check for TypeScript errors: `npx tsc --noEmit`

### Debug Commands

```bash
# Type check without building
npx tsc --noEmit

# Lint check
npm run lint

# Generate documentation
npm run docs:generate

# Check Supabase connection
node test-supabase.js
```

---

## Suggested Improvements

### High Priority

1. **Fix AI Gateway Model**
   - Current: `google/gemini-1.5-flash` returns "model not found"
   - Solution: Update to correct model ID in Vercel AI Gateway
   - File: `actions/detect-intent.ts`

2. **Add Loading States**
   - Show "Refracting..." animation during intent detection
   - Add skeleton loaders for Echo Chamber

3. **Improve Mobile Experience**
   - Test and optimize touch interactions
   - Consider reducing animation complexity on mobile

### Medium Priority

4. **Real-time Echo Updates**
   - Implement Supabase realtime subscriptions
   - Show new echoes without page refresh

5. **Enhanced Audio**
   - Add spatial audio (3D positioning) for Echo Chamber
   - Implement audio parameter modulation based on AI response

6. **Accessibility (A11y)**
   - Add reduced motion support
   - Improve ARIA labels for interactive elements
   - Test with screen readers

### Nice to Have

7. **Analytics Integration**
   - Add privacy-respecting usage tracking
   - Track mode selections and user flows

8. **Custom Mode Themes**
   - Allow user-selectable color schemes
   - Persist preferences in localStorage

9. **Voice Input**
   - Allow users to speak their intent
   - Submit voice echoes to Echo Chamber

10. **Performance Optimization**
    - Lazy load Tone.js (currently ~200KB gzipped)
    - Implement code splitting for mode components

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint check |
| `npm run docs` | Generate API documentation |
| `npm run docs:watch` | Watch mode for documentation |

---

## Documentation

- `README.md` — Project overview
- `ARCHITECTURE.md` — System architecture details
- `PRISM_IMPLEMENTATION.md` — Implementation guide
- `PRISM_FEATURES.md` — Feature documentation
- `docs/generated/` — Auto-generated API docs

---

**Built with care for atmosphere, subtext, and sensory feedback.**

*Last updated: November 2025*

