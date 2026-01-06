# DRR Web - API Documentation

> Interactive Installation - Personal Website with The Prism Architecture

**Generated:** 2026-01-06T14:19:39.890Z

---

## 📚 Table of Contents

- [Overview](#overview)
- [Components](#components)
- [Functions](#functions)
- [Types](#types)
- [Constants](#constants)
- [Modules](#modules)

## Overview

| Metric | Count |
|--------|-------|
| Total Modules | 26 |
| React Components | 24 |
| Functions | 22 |
| Types/Interfaces | 10 |

## Components

### RootLayout

`Default Export`  

**File:** `app/layout.tsx` (line 80)

**Props Type:** `React`


### Home

`Client` `Default Export`  

**File:** `app/page.tsx` (line 43)

**Hooks Used:** `useViewMode`


### ModeButton

`Client`  

**File:** `app/page.tsx` (line 159)

**Props Type:** `ModeButtonProps`


### AntiPortfolio

`Client` `Default Export`  

**File:** `components/AntiPortfolio.tsx` (line 80)

**Hooks Used:** `useState`


### FailuresLog

`Client` `Default Export`  

**File:** `components/FailuresLog.tsx` (line 37)

**Hooks Used:** `useState`, `useEffect`


### Landing

`Client` `Default Export`  

**File:** `components/Landing.tsx` (line 25)

**Hooks Used:** `useViewMode`, `useState`, `useCallback`, `useEffect`


### OnboardingHint

`Client` `Default Export`  

**File:** `components/OnboardingHint.tsx` (line 22)

**Props Type:** `OnboardingHintProps`

**Hooks Used:** `useState`, `useEffect`


### VoiceSelector

`Client` `Default Export`  

**File:** `components/VoiceSelector.tsx` (line 31)

**Hooks Used:** `useState`, `useEffect`, `useCallback`


### EchoChamber

`Client` `Default Export`  

**File:** `components/canvas/EchoChamber.tsx` (line 114)

**Hooks Used:** `useState`, `useEffect`, `useCallback`


### EchoEntry

`Client`  

**File:** `components/canvas/EchoEntry.tsx` (line 60)

**Props Type:** `EchoEntryProps`

**Hooks Used:** `useMemo`


### Whisper

`Client`  

**File:** `components/canvas/Whisper.tsx` (line 127)

**Hooks Used:** `useMemo`


### WhispersChamber

`Client` `Default Export`  

**File:** `components/canvas/WhispersChamber.tsx` (line 67)

**Props Type:** `WhispersChamberProps`

**Hooks Used:** `useState`, `useEffect`, `useCallback`


### Architect

`Client` `Default Export`  

**File:** `components/modes/Architect.tsx` (line 27)

**Hooks Used:** `useEffect`


### Section

`Client`  

**File:** `components/modes/Architect.tsx` (line 296)

**Props Type:** `SectionProps`


### Position

`Client`  

**File:** `components/modes/Architect.tsx` (line 321)

**Props Type:** `PositionProps`


### CompetencyCard

`Client`  

**File:** `components/modes/Architect.tsx` (line 367)

**Props Type:** `CompetencyCardProps`


### Pill

`Client`  

**File:** `components/modes/Architect.tsx` (line 391)

**Props Type:** `React`


### ContactItem

`Client`  

**File:** `components/modes/Architect.tsx` (line 409)

**Props Type:** `ContactItemProps`


### Metric

`Client`  

**File:** `components/modes/Architect.tsx` (line 430)

**Props Type:** `MetricProps`


### Author

`Client` `Default Export`  

**File:** `components/modes/Author.tsx` (line 26)

**Hooks Used:** `useEffect`


### MicroMotive

`Client`  

**File:** `components/modes/Author.tsx` (line 275)

**Props Type:** `string`


### Lab

`Client` `Default Export`  

**File:** `components/modes/Lab.tsx` (line 27)

**Hooks Used:** `useState`, `useEffect`


### StackItem

`Client`  

**File:** `components/modes/Lab.tsx` (line 389)

**Props Type:** `string`


### ViewModeProvider

`Client`  

**File:** `contexts/ViewModeContext.tsx` (line 48)

**Props Type:** `ViewModeProviderProps`

**Hooks Used:** `useState`, `useCallback`, `useViewMode`, `useContext`



## Functions

### useViewMode()

`exported`  

**File:** `contexts/ViewModeContext.tsx` (line 3)

```typescript
useViewMode(): ViewModeContextType
```

**Returns:** `ViewModeContextType`


### parseIntent()

`exported`  

**File:** `contexts/ViewModeContext.tsx` (line 125)

```typescript
parseIntent(input: string): ViewMode
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `input` | `string` | ❌ | `-` | - |

**Returns:** `ViewMode`


### getModel()

`exported`  

**File:** `lib/ai-gateway.ts` (line 91)

```typescript
getModel(
  modelName: string = 'claude-3-5-sonnet-20241022'
): ReturnType<NonNullable<typeof anthropicProvider>> | ReturnType<NonNullable<typeof gateway>>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `modelName` | `string` | ✅ | `'claude-3-5-sonnet-20241022'` | - |

**Returns:** `ReturnType<NonNullable<typeof anthropicProvider>> | ReturnType<NonNullable<typeof gateway>>`


### getActiveProvider()

`exported`  

**File:** `lib/ai-gateway.ts` (line 111)

```typescript
getActiveProvider(): AIProvider
```

**Returns:** `AIProvider`


### isAIGatewayAvailable()

`exported`  

**File:** `lib/ai-gateway.ts` (line 118)

```typescript
isAIGatewayAvailable(): boolean
```

**Returns:** `boolean`


### getAnthropicProvider()

`exported`  

**File:** `lib/ai-gateway.ts` (line 125)

```typescript
getAnthropicProvider(): ReturnType<typeof createAnthropic> | null
```

**Returns:** `ReturnType<typeof createAnthropic> | null`


### getAIGateway()

`exported`  

**File:** `lib/ai-gateway.ts` (line 132)

```typescript
getAIGateway(): ReturnType<typeof createGateway> | null
```

**Returns:** `ReturnType<typeof createGateway> | null`


### getTypography()

`exported`  

**File:** `lib/styles.ts` (line 1)

```typescript
getTypography(mode: ViewMode): TypographyConfig
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `ViewMode` | ❌ | `-` | - |

**Returns:** `TypographyConfig`


### getFocusRing()

`exported`  

**File:** `lib/styles.ts` (line 99)

```typescript
getFocusRing(mode: ViewMode): string
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `ViewMode` | ❌ | `-` | - |

**Returns:** `string`


### fetchEchoes()

`async` `exported`  

**File:** `lib/supabase.ts` (line 1)

```typescript
fetchEchoes(): Promise<Echo[]>
```

**Returns:** `Promise<Echo[]>`


### submitEcho()

`async` `exported`  

**File:** `lib/supabase.ts` (line 162)

```typescript
submitEcho(text: string): Promise<boolean>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `string` | ❌ | `-` | - |

**Returns:** `Promise<boolean>`


### useSoundscape()

`exported`  

**File:** `lib/useSoundscape.ts` (line 1)

```typescript
useSoundscape(mode: ViewMode): UseSoundscapeReturn
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `ViewMode` | ❌ | `-` | - |

**Returns:** `UseSoundscapeReturn`


### getAudioParamsForMode()

`exported`  

**File:** `lib/useSoundscape.ts` (line 79)

```typescript
getAudioParamsForMode(mode: ViewMode): SoundscapeParams | null
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `ViewMode` | ❌ | `-` | - |

**Returns:** `SoundscapeParams | null`


### validateAudioParams()

`exported`  

**File:** `lib/useSoundscape.ts` (line 179)

```typescript
validateAudioParams(params: SoundscapeParams): boolean
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `params` | `SoundscapeParams` | ❌ | `-` | - |

**Returns:** `boolean`


### getInitialWhispers()

`exported`  

**File:** `lib/whispers.ts` (line 1)

```typescript
getInitialWhispers(count: number = 8): Whisper[]
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `count` | `number` | ✅ | `8` | - |

**Returns:** `Whisper[]`


### getContextualWhispers()

`exported`  

**File:** `lib/whispers.ts` (line 393)

```typescript
getContextualWhispers(
  context: Partial<WhisperContext>,
  count: number = 5
): Whisper[]
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `context` | `Partial<WhisperContext>` | ❌ | `-` | - |
| `count` | `number` | ✅ | `5` | - |

**Returns:** `Whisper[]`


### detectIntent()

`async` `exported`  

**File:** `actions/detect-intent.ts` (line 85)

```typescript
detectIntent(input: string): Promise<IntentResponse>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `input` | `string` | ❌ | `-` | - |

**Returns:** `Promise<IntentResponse>`


### testIntentDetection()

`async` `exported`  

**File:** `actions/detect-intent.ts` (line 224)

```typescript
testIntentDetection(inputs: string[]): Promise<void>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `inputs` | `string[]` | ❌ | `-` | - |

**Returns:** `Promise<void>`


### generateVoice()

`async` `exported`  

**File:** `actions/generate-voice.ts` (line 3)

```typescript
generateVoice(
  text: string,
  voiceId: string
): Promise<GenerateVoiceResult>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `string` | ❌ | `-` | - |
| `voiceId` | `string` | ❌ | `-` | - |

**Returns:** `Promise<GenerateVoiceResult>`


### getAvailableVoices()

`async` `exported`  

**File:** `actions/generate-voice.ts` (line 170)

```typescript
getAvailableVoices(): Promise<
```

**Returns:** `Promise<`


### generateWhisper()

`async` `exported`  

**File:** `actions/generate-whisper.ts` (line 97)

```typescript
generateWhisper(
  params: GenerateWhisperParams
): Promise<GenerateWhisperResult>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `params` | `GenerateWhisperParams` | ❌ | `-` | - |

**Returns:** `Promise<GenerateWhisperResult>`


### generateWhisperBatch()

`async` `exported`  

**File:** `actions/generate-whisper.ts` (line 207)

```typescript
generateWhisperBatch(
  params: GenerateWhisperParams,
  count: number = 3
): Promise<GenerateWhisperResult[]>
```

#### Parameters

| Name | Type | Optional | Default | Description |
|------|------|----------|---------|-------------|
| `params` | `GenerateWhisperParams` | ❌ | `-` | - |
| `count` | `number` | ✅ | `3` | - |

**Returns:** `Promise<GenerateWhisperResult[]>`



## Types

### ViewMode

`type`

**File:** `contexts/ViewModeContext.tsx` (line 23)

```typescript
type ViewMode = 'landing' | 'architect' | 'author' | 'lab'
```


### ViewMode

`type`

**File:** `lib/styles.ts` (line 1)

```typescript
type ViewMode = 'architect' | 'author' | 'lab'
```


### Echo

`interface`

**File:** `lib/supabase.ts` (line 50)

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | ❌ | - |
| `text` | `string` | ❌ | - |
| `created_at` | `string` | ❌ | - |
| `approved` | `boolean` | ❌ | - |


### ViewMode

`type`

**File:** `lib/whispers.ts` (line 20)

```typescript
type ViewMode = 'landing' | 'architect' | 'author' | 'lab'
```


### TimeOfDay

`type`

**File:** `lib/whispers.ts` (line 21)

```typescript
type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night' | 'witching'
```


### WhisperMood

`type`

**File:** `lib/whispers.ts` (line 22)

```typescript
type WhisperMood = 'contemplative' | 'technical' | 'creative' | 'mysterious' | 'philosophical'
```


### Whisper

`interface`

**File:** `lib/whispers.ts` (line 24)

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `id` | `string` | ❌ | - |
| `text` | `string` | ❌ | - |
| `mood` | `WhisperMood` | ❌ | - |
| `source` | `'curated' | 'ai' | 'echo'` | ❌ | - |


### WhisperContext

`interface`

**File:** `lib/whispers.ts` (line 31)

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `mode` | `ViewMode` | ❌ | - |
| `timeOfDay` | `TimeOfDay` | ❌ | - |
| `userIntent` | `string` | ✅ | - |
| `sessionDuration` | `number` | ✅ | - |


### IntentResponse

`type`

**File:** `actions/detect-intent.ts` (line 53)

```typescript
type IntentResponse = z.infer<typeof IntentSchema>
```


### GenerateVoiceResult

`interface`

**File:** `actions/generate-voice.ts` (line 43)

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `success` | `boolean` | ❌ | - |
| `audioData` | `ArrayBuffer` | ✅ | - |
| `audioUrl` | `string` | ✅ | - |
| `error` | `string` | ✅ | - |



## Constants

### metadata

**File:** `app/layout.tsx` (line 50)

**Type:** `Metadata`

```typescript
const metadata = {
  title: 'Doron Reizes - Interactive Installation',
  description:
    'Systems architect, sound d...
```


### MODE_CONFIG

**File:** `contexts/ViewModeContext.tsx` (line 104)

```typescript
const MODE_CONFIG = {
  architect: {
    name: 'The Architect',
    theme: {
      bg: 'bg-architect-bg',
      text: 't...
```


### KEYWORD_MAP

**File:** `contexts/ViewModeContext.tsx` (line 178)

**Type:** `Record<string, ViewMode>`

```typescript
const KEYWORD_MAP = {
  // MODE A: The Architect (Business/Recruiter)
  'hire': 'architect',
  'cv': 'architect',
  'res...
```


### audioManager

**File:** `lib/audio.ts` (line 594)

```typescript
const audioManager = new AudioManager()
```


### animations

**File:** `lib/styles.ts` (line 1)

```typescript
const animations = {
  // Fade in from below
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: ...
```


### transitions

**File:** `lib/styles.ts` (line 144)

```typescript
const transitions = {
  // Smooth, theatrical (for major transitions)
  smooth: {
    duration: 0.6,
    ease: [0.645, 0...
```


### spacing

**File:** `lib/styles.ts` (line 186)

```typescript
const spacing = {
  xs: 'space-y-2',      // 8px
  sm: 'space-y-4',       // 16px
  md: 'space-y-6',       // 24px
 ...
```


### supabase

**File:** `lib/supabase.ts` (line 96)

```typescript
const supabase = envVars
  ? createClient(envVars.url, envVars.key, {
      auth: {
        persistSession: false, //...
```


### voiceManager

**File:** `lib/voice.ts` (line 352)

```typescript
const voiceManager = new VoiceManager()
```


### whisperEngine

**File:** `lib/whispers.ts` (line 380)

```typescript
const whisperEngine = new WhisperEngine()
```



## Modules

### layout

====================================
ROOT LAYOUT
====================================

The foundational layout for the entire application.
Includes:
- Font loading (variable fonts)
- Global styles
- ViewModeProvider (The Prism context)
- Grain texture overlay

**File:** `app/layout.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 1 |
| Types | 0 |
| Constants | 1 |

**Exports:** `metadata`, `default`


### page

`Client`

**File:** `app/page.tsx`

| Category | Count |
|----------|-------|
| Components | 2 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### AntiPortfolio

`Client`

**File:** `components/AntiPortfolio.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 1 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### ErrorBoundary

`Client`

**File:** `components/ErrorBoundary.tsx`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 0 |
| Types | 2 |
| Constants | 0 |

**Exports:** `ErrorBoundary`


### FailuresLog

`Client`

**File:** `components/FailuresLog.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### Landing

`Client`

**File:** `components/Landing.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 1 |
| Types | 0 |
| Constants | 0 |

**Exports:** `default`


### OnboardingHint

`Client`

**File:** `components/OnboardingHint.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### VoiceSelector

`Client`

**File:** `components/VoiceSelector.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### EchoChamber

`Client`

**File:** `components/canvas/EchoChamber.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 5 |
| Types | 2 |
| Constants | 0 |

**Exports:** `default`


### EchoEntry

`Client`

**File:** `components/canvas/EchoEntry.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 2 |
| Constants | 0 |

**Exports:** `default`


### Whisper

`Client`

**File:** `components/canvas/Whisper.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 3 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### WhispersChamber

`Client`

**File:** `components/canvas/WhispersChamber.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `default`


### Architect

`Client`

**File:** `components/modes/Architect.tsx`

| Category | Count |
|----------|-------|
| Components | 7 |
| Functions | 8 |
| Types | 5 |
| Constants | 0 |

**Exports:** `default`


### Author

`Client`

**File:** `components/modes/Author.tsx`

| Category | Count |
|----------|-------|
| Components | 2 |
| Functions | 3 |
| Types | 0 |
| Constants | 0 |

**Exports:** `default`


### Lab

`Client`

**File:** `components/modes/Lab.tsx`

| Category | Count |
|----------|-------|
| Components | 2 |
| Functions | 3 |
| Types | 0 |
| Constants | 0 |

**Exports:** `default`


### ViewModeContext

`Client`

**File:** `contexts/ViewModeContext.tsx`

| Category | Count |
|----------|-------|
| Components | 1 |
| Functions | 2 |
| Types | 3 |
| Constants | 2 |

**Exports:** `ViewMode`, `ViewModeProvider`, `useViewMode`, `MODE_CONFIG`, `KEYWORD_MAP`, `parseIntent`


### ai-gateway

====================================
AI GATEWAY UTILITY - SHARED CONFIGURATION
====================================

Centralized configuration for AI providers.
Supports both Anthropic (direct) and Vercel AI Gateway.
Used by both intent detection and whisper generation.

Priority:
1. ANTHROPIC_API_KEY (direct Anthropic API)
2. AI_GATEWAY_API_KEY (Vercel AI Gateway)

**File:** `lib/ai-gateway.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 6 |
| Types | 1 |
| Constants | 0 |

**Exports:** `getModel`, `getActiveProvider`, `isAIGatewayAvailable`, `getAnthropicProvider`, `getAIGateway`


### audio

====================================
AUDIO ENGINE - TONE.JS IMPLEMENTATION
====================================

This module handles all audio synthesis and playback.
Audio is a first-class citizen in this installation.

Features:
- Musical ambient drone (filtered noise + harmonic tones)
- Mode-specific UI sounds (musical intervals, cohesive scale)
- Graceful handling of browser autoplay policies
- Real-time audio processing (filters, reverb, musical synthesis)
- Pentatonic scale for universal musical appeal

**File:** `lib/audio.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 1 |
| Types | 2 |
| Constants | 1 |

**Exports:** `audioManager`


### styles

====================================
TYPOGRAPHY & STYLE CONFIGURATION
====================================

Centralized typography and style configuration for all view modes.
Following Dieter Rams principles: systematic, timeless, clear hierarchy.

Typography scale uses Major Third ratio (1.25) for consistency.
Spacing follows 8px base unit system.

Usage:
  import { getTypography } from '@/lib/styles';
  const styles = getTypography('architect');
  <h1 className={styles.h1}>Title</h1>

**File:** `lib/styles.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 2 |
| Types | 2 |
| Constants | 3 |

**Exports:** `ViewMode`, `getTypography`, `animations`, `transitions`, `getFocusRing`, `spacing`


### supabase

====================================
SUPABASE CLIENT CONFIGURATION
====================================

Client for interacting with Supabase backend.
Currently used for the Echo Chamber feature.

Setup Instructions:
1. Create a Supabase project at https://supabase.com
2. Create an 'echoes' table with the following schema:

   CREATE TABLE echoes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     text TEXT NOT NULL CHECK (char_length(text) <= 100),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     approved BOOLEAN DEFAULT false
   );

3. Enable Row Level Security (RLS):

   ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;

4. Create a policy for public reads of approved echoes:

   CREATE POLICY "Public can read approved echoes"
   ON echoes FOR SELECT
   USING (approved = true);

5. Create a policy for authenticated inserts:

   CREATE POLICY "Anyone can insert echoes for moderation"
   ON echoes FOR INSERT
   WITH CHECK (true);

6. Add your Supabase credentials to .env.local:
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
   
   Note: Supabase calls it "publishable key" in the dashboard, but the
   environment variable name is still NEXT_PUBLIC_SUPABASE_ANON_KEY

**File:** `lib/supabase.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 2 |
| Types | 1 |
| Constants | 1 |

**Exports:** `Echo`, `supabase`


### useSoundscape

`Client`

====================================
SOUNDSCAPE HOOK - TONE.JS INTEGRATION
====================================

Custom React hook for managing mode-specific audio synthesis.
Smoothly transitions audio parameters when view mode changes.

Features:
- Mode-specific reverb and filter settings
- Smooth parameter ramping (2-second transitions)
- Automatic cleanup on unmount
- Integration with global AudioManager

Usage:
  const { isReady, isMuted, toggleMute } = useSoundscape(currentMode);

**File:** `lib/useSoundscape.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 3 |
| Types | 2 |
| Constants | 0 |

**Exports:** `useSoundscape`, `getAudioParamsForMode`, `validateAudioParams`


### voice

`Client`

====================================
VOICE MANAGER - ELEVENLABS PLAYBACK
====================================

Manages voice playback for whispers with:
- Subtle audio ducking integration
- IndexedDB caching for persistent storage
- Sequential playback queue
- Error handling and graceful degradation

**File:** `lib/voice.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 4 |
| Types | 2 |
| Constants | 1 |

**Exports:** `voiceManager`


### whispers

====================================
WHISPERS - AI-POWERED AMBIENT TEXT
====================================

A system for generating and selecting contextual,
ephemeral text fragments that drift through the experience.

Features:
- Mode-aware content selection
- Time-of-day sensitivity
- User intent memory
- Curated + AI-generated blend

**File:** `lib/whispers.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 2 |
| Types | 5 |
| Constants | 1 |

**Exports:** `ViewMode`, `TimeOfDay`, `WhisperMood`, `Whisper`, `WhisperContext`, `getTimeOfDay`, `whisperEngine`, `getInitialWhispers`, `getContextualWhispers`


### detect-intent

`Server`

====================================
GHOST ROUTER - INTENT DETECTION SERVER ACTION
====================================

This Server Action uses Anthropic Claude (or Vercel AI Gateway) to analyze
user input and route to the appropriate view mode.

Philosophy:
- Generate routing data, not chat responses
- Fast inference with Claude Sonnet
- Audio parameters derived from intent
- Fallback to keyword matching if AI unavailable

Input: User string from Landing Page
Output: { targetMode, audioParams }

**File:** `actions/detect-intent.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 5 |
| Types | 2 |
| Constants | 0 |

**Exports:** `IntentResponse`


### generate-voice

`Server`

**File:** `actions/generate-voice.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 2 |
| Types | 1 |
| Constants | 0 |

**Exports:** `GenerateVoiceResult`


### generate-whisper

`Server`

**File:** `actions/generate-whisper.ts`

| Category | Count |
|----------|-------|
| Components | 0 |
| Functions | 4 |
| Types | 2 |
| Constants | 0 |

