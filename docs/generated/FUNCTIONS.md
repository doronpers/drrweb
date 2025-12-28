# Function Index

_Generated: 2025-11-28T23:05:28.572Z_

| Function | File | Signature |
|----------|------|-----------|
| `useViewMode` | `contexts/ViewModeContext.tsx` | `useViewMode(): ViewModeContextType` |
| `parseIntent` | `contexts/ViewModeContext.tsx` | `parseIntent(input: string): ViewMode` |
| `getTypography` | `lib/styles.ts` | `getTypography(mode: ViewMode): TypographyConfig` |
| `fetchEchoes` | `lib/supabase.ts` | `fetchEchoes(): Promise<Echo[]>` |
| `submitEcho` | `lib/supabase.ts` | `submitEcho(text: string): Promise<boolean>` |
| `useSoundscape` | `lib/useSoundscape.ts` | `useSoundscape(mode: ViewMode): UseSoundscapeReturn` |
| `getAudioParamsForMode` | `lib/useSoundscape.ts` | `getAudioParamsForMode(mode: ViewMode): SoundscapeParams | null` |
| `validateAudioParams` | `lib/useSoundscape.ts` | `validateAudioParams(params: SoundscapeParams): boolean` |
| `getInitialWhispers` | `lib/whispers.ts` | `getInitialWhispers(count: number = 8): Whisper[]` |
| `getContextualWhispers` | `lib/whispers.ts` | `getContextualWhispers(
  context: Partial<WhisperContext>,
  count: number = 5
): Whisper[]` |
| `detectIntent` | `actions/detect-intent.ts` | `detectIntent(input: string): Promise<IntentResponse>` |
| `testIntentDetection` | `actions/detect-intent.ts` | `testIntentDetection(inputs: string[]): Promise<void>` |
| `generateWhisper` | `actions/generate-whisper.ts` | `generateWhisper(
  params: GenerateWhisperParams
): Promise<GenerateWhisperResult>` |
| `generateWhisperBatch` | `actions/generate-whisper.ts` | `generateWhisperBatch(
  params: GenerateWhisperParams,
  count: number = 3
): Promise<GenerateWhisperResult[]>` |