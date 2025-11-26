# API Documentation

*Auto-generated on 2025-11-26*

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

