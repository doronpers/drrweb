# Prism Architecture - New Features

This file documents the new features added to implement the "Prism" personal website architecture.

## Quick Links

- **Implementation Guide:** See [PRISM_IMPLEMENTATION.md](./PRISM_IMPLEMENTATION.md)
- **Project Structure:** See [FILE_TREE.txt](./FILE_TREE.txt)
- **Full Summary:** See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## What's New

### 1. AI-Powered Intent Detection

**File:** `actions/detect-intent.ts`

The site now uses Google's Gemini 1.5 Flash to analyze user input and intelligently route to the appropriate mode:

```typescript
// Example usage in Landing component
const result = await detectIntent("I'm looking for a sound designer");
// Returns: { targetMode: 'architect', audioParams: { reverb: 0.1, filter: 1800 } }
```

**Features:**
- Structured output with Zod validation
- Audio parameters for soundscape integration
- Graceful fallback to keyword matching
- No API key required (optional enhancement)

### 2. FailuresLog Component

**File:** `components/FailuresLog.tsx`

A brutally honest table of failures and lessons learned:

```tsx
<FailuresLog />
```

**Design:**
- Monospace font (terminal aesthetic)
- Simple table layout
- No hover effects
- Pure data presentation

**Data Source:** `public/data/failures.json`

### 3. Soundscape Hook

**File:** `lib/useSoundscape.ts`

Custom React hook for mode-specific audio control:

```typescript
const { isReady, isMuted, toggleMute, setParams } = useSoundscape(currentMode);
```

**Features:**
- Mode-specific audio presets
- Mute control
- Parameter validation
- Integration with AudioManager

## Setup Instructions

### 1. Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Add your Google AI API key (optional):
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your key at: https://ai.google.dev/

### 2. Dependencies

Already installed via `npm install`:
- `ai` - Vercel AI SDK
- `@ai-sdk/google` - Google AI provider
- `zod` - Schema validation

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing

### Test Intent Detection

Try these inputs on the landing page:

**Architect Mode:**
- "I want to hire you"
- "Looking for consulting services"
- "Need your CV and experience"

**Author Mode:**
- "Tell me your story"
- "What's your teaching philosophy?"
- "I want to read about your ideas"

**Lab Mode:**
- "Show me how you build"
- "Walk me through your process"
- "I'm interested in the technical details"

### Verify Audio

1. Click the mute toggle (top right)
2. Focus on the input field (should hear warm click)
3. Submit a query (should hear dry click)
4. Navigate between modes (UI sounds change)

### Check FailuresLog

The FailuresLog component should display a table with 7 entries loaded from JSON.

## Architecture

### The "No Navigation" Constraint

The site does NOT use traditional routing. All three modes render on the same URL (`/`) with state-driven re-rendering.

**How it works:**
1. User enters intent on landing page
2. Server Action analyzes intent (or keyword matching)
3. ViewModeContext updates state
4. Components re-render based on new mode
5. Audio parameters adjust automatically

### Smart vs Dumb Components

**Smart (Business Logic):**
- `app/page.tsx` - Mode routing
- `components/Landing.tsx` - Intent detection
- `components/modes/*.tsx` - Mode content
- `components/FailuresLog.tsx` - Data fetching
- `contexts/ViewModeContext.tsx` - Global state

**Dumb (Presentation):**
- `components/canvas/EchoEntry.tsx` - Pure rendering
- Could extract: Form inputs, buttons

### Data Flow

```
User Input 
  → Server Action (AI analysis)
  → { targetMode, audioParams }
  → ViewModeContext.setMode()
  → Components re-render
  → Audio parameters adjust
```

## Files Changed

### New Files
- `actions/detect-intent.ts` - AI routing
- `components/FailuresLog.tsx` - Failures table
- `lib/useSoundscape.ts` - Audio hook
- `public/data/failures.json` - Data source
- `FILE_TREE.txt` - Project structure
- `PRISM_IMPLEMENTATION.md` - Guide
- `IMPLEMENTATION_SUMMARY.md` - Summary

### Modified Files
- `components/Landing.tsx` - AI integration
- `.env.local.example` - API key config
- `package.json` - New dependencies

## Troubleshooting

### Intent Detection Not Working

**Symptom:** Always falls back to keyword matching

**Solution:** Check that `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env.local`

### FailuresLog Not Loading

**Symptom:** "Loading failures.json..." never goes away

**Solution:** Verify `public/data/failures.json` exists and is valid JSON

### Audio Not Working

**Symptom:** No sound on interactions

**Solution:** 
1. Check mute toggle (should be unmuted)
2. Interact with page first (browser autoplay policy)
3. Check browser console for errors

### Build Fails on Fonts

**Symptom:** "Failed to fetch font from Google Fonts"

**Solution:** This is a network restriction in certain environments. Fonts will work in production or with internet access.

## Next Steps

1. **Add AI API Key** to enable intelligent routing
2. **Customize failures.json** with authentic content
3. **Test all three modes** thoroughly
4. **Deploy to production** (fonts will work)
5. **Monitor intent detection** accuracy

## Support

For detailed documentation, see:
- [PRISM_IMPLEMENTATION.md](./PRISM_IMPLEMENTATION.md) - Complete guide
- [FILE_TREE.txt](./FILE_TREE.txt) - Project structure
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical summary

For issues:
1. Check the console for error messages
2. Verify environment variables
3. Ensure API keys are valid
4. Check network connectivity
