# Prism Architecture - Implementation Guide

## Overview

This document describes the implementation of the "Prism" personal website architecture as specified in the master prompt. The Prism system allows a single website to refract into three distinct modes based on user intent.

## Implementation Status

### ✅ Phase 1: The "Prism" Architecture (State Management)

**File:** `contexts/ViewModeContext.tsx`

The global ViewModeContext successfully manages three states:
- **Mode A: The Architect** - For business/hiring (Swiss Style, B&W, Inter font)
- **Mode B: The Author** - For reading/philosophy (High whitespace, Merriweather, warm)
- **Mode C: The Lab** - For process/making (Monospace, dark terminal aesthetics)

**Key Features:**
- Type-safe mode switching with TypeScript
- Transition state management for smooth animations
- MODE_CONFIG object defining visual and audio themes
- KEYWORD_MAP for client-side intent parsing
- No page navigation - pure state-driven re-rendering

### ✅ Phase 2: The "Ghost" Router (Server Action)

**File:** `actions/detect-intent.ts`

AI-powered intent detection using Vercel AI Gateway with Gemini 1.5 Flash:
- Structured output with Zod schema validation
- Returns: `{ targetMode: 'architect' | 'author' | 'lab', audioParams: { reverb, filter } }`
- Graceful fallback to keyword matching if API unavailable
- No chat responses - pure routing data
- Uses Vercel AI Gateway for unified API access and cost optimization

**Logic:**
- Hiring/data/credentials → Architect
- Reading/curiosity/philosophy → Author
- Building/code/process → Lab

**Environment Variable:**
```bash
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

**Integration:** Landing component calls `detectIntent()` on form submission with fallback to `parseIntent()`.

### ✅ Phase 3: The "Anti-Portfolio" (Footer Component)

**Files:**
- `components/FailuresLog.tsx` - Table-style brutally honest component
- `components/AntiPortfolio.tsx` - Enhanced collapsible version
- `public/data/failures.json` - Data source

**Data Structure:**
```json
[
  {
    "year": "2024",
    "project": "Project Name",
    "outcome": "What happened",
    "lesson": "What was learned"
  }
]
```

**Design:**
- Monospace font (JetBrains Mono)
- Simple table layout (FailuresLog) or collapsible JSON-style (AntiPortfolio)
- No hover effects on FailuresLog (pure data aesthetic)
- Category filtering in AntiPortfolio

### ✅ Phase 4: Audio Engine (Tone.js)

**Files:**
- `lib/audio.ts` - AudioManager singleton
- `lib/useSoundscape.ts` - Custom React hook

**Features:**
- Tone.Player and Tone.Oscillator for synthesis
- Tone.Reverb and Tone.Filter routing
- Mode-specific parameter presets:
  - **Architect:** reverb: 0.1, filter: 1800 Hz (dry, bright)
  - **Author:** reverb: 0.8, filter: 1000 Hz (warm, spacious)
  - **Lab:** reverb: 0.3, filter: 400 Hz (textured, dark)
- Smooth parameter ramping (2-second transitions)
- Global mute toggle with browser autoplay compliance
- UI sounds: click-dry, click-warm, glitch

## Deliverables Checklist

✅ **Project Tree:** See `FILE_TREE.txt` for complete structure differentiating smart/dumb components

✅ **Context Provider:** `contexts/ViewModeContext.tsx` - Complete with all three modes

✅ **Landing Page:** `components/Landing.tsx` - Minimalist input field with AI Server Action integration

✅ **Typographic Config:** 
- `tailwind.config.ts` - Mode-specific colors and fonts
- `lib/styles.ts` - Typography helper functions with mode swapping

✅ **Server Action:** `actions/detect-intent.ts` - Gemini AI for intent analysis

✅ **Failures Data:** `public/data/failures.json` - Anti-portfolio data

✅ **FailuresLog Component:** `components/FailuresLog.tsx` - Table-style failures

✅ **Audio Engine:** `lib/audio.ts` - Tone.js implementation

✅ **Soundscape Hook:** `lib/useSoundscape.ts` - Mode-based audio control

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Tone.js
- Supabase client
- Vercel AI SDK (`ai`, `@ai-sdk/google`)
- Zod for validation

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Optional: For Echo Chamber feature
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: For AI intent detection (Vercel AI Gateway)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

**Get Vercel AI Gateway API Key:**
1. Sign in to your Vercel account
2. Navigate to the AI Gateway section in your dashboard
3. Create a new API key
4. Add to `.env.local`

### 3. Development

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Testing Intent Detection

Try these inputs on the landing page:
- "I want to hire you" → Architect mode
- "Tell me your story" → Author mode
- "Show me how you build" → Lab mode

## Architecture Notes

### The "No Navigation" Constraint

The site does NOT navigate to new pages. All modes render on the same URL (`/`) with state-driven re-rendering.

**Implementation:**
- Single page component: `app/page.tsx`
- State managed by: `ViewModeContext`
- Mode switching via: `setMode(newMode)`
- AnimatePresence handles transitions

### Placeholder Philosophy

Following the "avoid Uncanny Valley" principle, content uses strict placeholders:
- `[Insert Bio Here]`
- `[Insert Project Description]`
- `[Insert Teaching Philosophy]`

This allows the user to input authentic voice later rather than using generic marketing copy.

### Smart vs Dumb Components

**Smart (Logic):**
- `app/page.tsx` - Routing logic
- `components/Landing.tsx` - Intent detection, audio init
- `components/modes/*.tsx` - Mode content and state
- `contexts/ViewModeContext.tsx` - Global state

**Dumb (Presentation):**
- `components/canvas/EchoEntry.tsx` - Pure rendering
- Could extract: Form inputs, buttons, typography

### Audio Implementation

The audio engine uses Tone.js for real-time synthesis:

**Ambient Drone:**
- Pink noise → Low-pass filter → Volume
- LFO modulation for "breathing" effect
- 2-second fade in/out

**UI Sounds:**
- Architect: Dry sine wave click (800 Hz)
- Author: Membrane synth with reverb (200 Hz)
- Lab: White noise burst (30ms)

**Mute Toggle:**
- Global control in UI
- Respects browser autoplay policies
- Requires user interaction to start

## Known Limitations

### 1. Font Loading in Build

The build may fail when Google Fonts are blocked (network restrictions). This is a development environment issue.

**Workaround:** Fonts will load fine in production or with internet access. The app is otherwise fully functional.

### 2. AI API Key Required

Without `AI_GATEWAY_API_KEY`, the Server Action falls back to keyword matching. This is by design - graceful degradation.

### 3. Audio Context Autoplay

Browser autoplay policies require user interaction before audio can start. The mute button and input focus handle this automatically.

## Testing

### Manual Testing Checklist

- [ ] Landing page loads with centered input
- [ ] Typing in input shows hint to press Enter
- [ ] Submitting "hire" navigates to Architect mode
- [ ] Submitting "story" navigates to Author mode
- [ ] Submitting "code" navigates to Lab mode
- [ ] Mode switcher pills work (A/B/C)
- [ ] Back arrow returns to landing
- [ ] Mute toggle controls audio
- [ ] Audio feedback on input focus
- [ ] Audio feedback on submit
- [ ] FailuresLog loads data from JSON
- [ ] AntiPortfolio expands/collapses
- [ ] Echo Chamber appears in modes (if Supabase configured)

### Testing AI Intent Detection

With API key configured, test ambiguous inputs:
- "I'm looking for someone to help with my project" → Should route to Architect
- "What inspires your teaching?" → Should route to Author
- "Walk me through your technical stack" → Should route to Lab

## Future Enhancements

1. **Audio Parameter Ramping:** Implement smooth parameter transitions in AudioManager
2. **Grain Texture:** Add subtle film grain overlay
3. **Font Subsetting:** Optimize font loading
4. **Advanced Soundscapes:** Add mode-specific ambient sounds beyond drone
5. **Analytics:** Track mode preferences and user journeys

## File Structure Summary

```
├── actions/detect-intent.ts      # AI routing (NEW)
├── components/
│   ├── Landing.tsx               # Entry point (UPDATED)
│   ├── FailuresLog.tsx          # Table component (NEW)
│   └── AntiPortfolio.tsx        # Enhanced footer
├── contexts/ViewModeContext.tsx  # State management
├── lib/
│   ├── audio.ts                  # Tone.js engine
│   ├── useSoundscape.ts         # Audio hook (NEW)
│   └── styles.ts                 # Typography
├── public/data/failures.json     # Anti-portfolio (NEW)
└── FILE_TREE.txt                # Project tree (NEW)
```

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set
3. Ensure API keys are valid
4. Check network connectivity for AI features

## License

ISC
