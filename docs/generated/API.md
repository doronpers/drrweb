# API Documentation

*Auto-generated on 2026-01-04*

## actions/detect-intent.ts

### `toNarrowMode`

```typescript
function toNarrowMode(mode: ViewMode): NarrowMode
```

**Parameters:**

- `mode` (`ViewMode`) - 

---

### `detectIntent`

```typescript
function detectIntent(input: string): Promise<IntentResponse>
```

**Parameters:**

- `input` (`string`) - 

---

### `buildPrompt`

```typescript
function buildPrompt(input: string): string
```

**Parameters:**

- `input` (`string`) - 

---

### `createFallbackResponse`

```typescript
function createFallbackResponse(mode: NarrowMode): IntentResponse
```

**Parameters:**

- `mode` (`NarrowMode`) - 

---

### `testIntentDetection`

```typescript
function testIntentDetection(inputs: string[]): Promise<void>
```

**Parameters:**

- `inputs` (`string[]`) - 

---

## actions/generate-whisper.ts

### `sanitizeInput`

```typescript
function sanitizeInput(input: string): string
```

**Parameters:**

- `input` (`string`) - 

---

### `generateWhisperBatch`

```typescript
function generateWhisperBatch(params: GenerateWhisperParams, count: number = 3): Promise<GenerateWhisperResult[]>
```

**Parameters:**

- `params` (`GenerateWhisperParams`) - 
- `count` (`number = 3`) - 

---

### `inferMood`

```typescript
function inferMood(text: string, mode: ViewMode): WhisperMood
```

**Parameters:**

- `text` (`string`) - 
- `mode` (`ViewMode`) - 

---

## contexts/ViewModeContext.tsx

### `useViewMode`

```typescript
function useViewMode(): ViewModeContextType
```

---

### `parseIntent`

```typescript
function parseIntent(input: string): ViewMode
```

**Parameters:**

- `input` (`string`) - 

---

## lib/profile.ts

### `getYearsOfExperience`

```typescript
function getYearsOfExperience(): number
```

---

### `formatYearsOfExperience`

```typescript
function formatYearsOfExperience(): string
```

---

## lib/styles.ts

### `getTypography`

```typescript
function getTypography(mode: ViewMode): TypographyConfig
```

**Parameters:**

- `mode` (`ViewMode`) - 

---

## lib/supabase.ts

### `fetchEchoes`

```typescript
function fetchEchoes(): Promise<Echo[]>
```

---

### `submitEcho`

```typescript
function submitEcho(text: string): Promise<boolean>
```

**Parameters:**

- `text` (`string`) - 

---

## lib/useSoundscape.ts

### `useSoundscape`

```typescript
function useSoundscape(mode: ViewMode): UseSoundscapeReturn
```

**Parameters:**

- `mode` (`ViewMode`) - 

---

### `getAudioParamsForMode`

```typescript
function getAudioParamsForMode(mode: ViewMode): SoundscapeParams | null
```

**Parameters:**

- `mode` (`ViewMode`) - 

---

### `validateAudioParams`

```typescript
function validateAudioParams(params: SoundscapeParams): boolean
```

**Parameters:**

- `params` (`SoundscapeParams`) - 

---

## lib/whispers.ts

### `getInitialWhispers`

```typescript
function getInitialWhispers(count: number = 8): Whisper[]
```

**Parameters:**

- `count` (`number = 8`) - 

---

### `getContextualWhispers`

```typescript
function getContextualWhispers(context: Partial<WhisperContext>, count: number = 5): Whisper[]
```

**Parameters:**

- `context` (`Partial<WhisperContext>`) - 
- `count` (`number = 5`) - 

---

