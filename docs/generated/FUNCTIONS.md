# Function Index

_Generated: 2026-01-06T14:19:39.890Z_

| Function | File | Signature |
|----------|------|-----------|
| `useViewMode` | `contexts/ViewModeContext.tsx` | `useViewMode(): ViewModeContextType` |
| `parseIntent` | `contexts/ViewModeContext.tsx` | `parseIntent(input: string): ViewMode` |
| `getModel` | `lib/ai-gateway.ts` | `getModel(
  modelName: string = 'claude-3-5-sonnet-20241022'
): ReturnType<NonNullable<typeof anthropicProvider>> | ReturnType<NonNullable<typeof gateway>>` |
| `getActiveProvider` | `lib/ai-gateway.ts` | `getActiveProvider(): AIProvider` |
| `isAIGatewayAvailable` | `lib/ai-gateway.ts` | `isAIGatewayAvailable(): boolean` |
| `getAnthropicProvider` | `lib/ai-gateway.ts` | `getAnthropicProvider(): ReturnType<typeof createAnthropic> | null` |
| `getAIGateway` | `lib/ai-gateway.ts` | `getAIGateway(): ReturnType<typeof createGateway> | null` |
| `getTypography` | `lib/styles.ts` | `getTypography(mode: ViewMode): TypographyConfig` |
| `getFocusRing` | `lib/styles.ts` | `getFocusRing(mode: ViewMode): string` |
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
| `generateVoice` | `actions/generate-voice.ts` | `generateVoice(
  text: string,
  voiceId: string
): Promise<GenerateVoiceResult>` |
| `getAvailableVoices` | `actions/generate-voice.ts` | `getAvailableVoices(): Promise<` |
| `generateWhisper` | `actions/generate-whisper.ts` | `generateWhisper(
  params: GenerateWhisperParams
): Promise<GenerateWhisperResult>` |
| `generateWhisperBatch` | `actions/generate-whisper.ts` | `generateWhisperBatch(
  params: GenerateWhisperParams,
  count: number = 3
): Promise<GenerateWhisperResult[]>` |