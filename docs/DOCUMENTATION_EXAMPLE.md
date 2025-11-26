# Documentation Automation Example

This document demonstrates how to improve component documentation and use the documentation automation system.

## Example: Improving EchoEntry Component

### Before

```typescript
interface EchoEntryProps {
  id: string;
  text: string;
  timestamp: Date;
  index: number;
}

function EchoEntry({ id, text, timestamp, index }: EchoEntryProps) {
  // Component implementation
}
```

### After

```typescript
/**
 * Props for EchoEntry component
 */
interface EchoEntryProps {
  /** Unique identifier for the echo entry */
  id: string;
  /** The message text to display */
  text: string;
  /** When the echo was created */
  timestamp: Date;
  /** Position in the list for staggered animation */
  index: number;
}

/**
 * EchoEntry component - renders a single floating message in the Echo Chamber
 * 
 * Displays a user-submitted message that floats organically across the screen
 * with physics-based motion. Each entry has randomized starting position,
 * drift direction, duration, opacity (to simulate depth), and rotation.
 * 
 * @param props - Component props
 * @returns A memoized motion.div with animated floating message
 */
function EchoEntry({ id, text, timestamp, index }: EchoEntryProps) {
  // Component implementation
}
```

## Generated Documentation

After running `npm run docs:generate`, the system generates:

```markdown
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
```

## Workflow

### 1. Write Code with Good Documentation

```typescript
/**
 * Custom hook for managing soundscape based on view mode
 * 
 * Provides audio context initialization, mode-specific ambient drones,
 * and UI sound effects. Handles cleanup on unmount.
 * 
 * @returns {Object} Audio control methods
 * @returns {Function} returns.initializeAudio - Initialize audio context
 * @returns {Function} returns.playUISound - Play UI sound effect
 * @returns {boolean} returns.isReady - Whether audio is initialized
 */
export function useSoundscape() {
  // Implementation
}
```

### 2. Validate Documentation

```bash
npm run docs:validate
```

Output:
```
Validating documentation in: /home/runner/work/drrweb/drrweb

# Documentation Validation Report

✅ All files are well documented!
```

### 3. Generate Documentation

```bash
npm run docs:generate
```

Output:
```
🚀 Starting documentation generation...

📝 Generating component documentation...
   ✓ Generated: docs/generated/COMPONENTS.md

📝 Generating API documentation...
   ✓ Generated: docs/generated/API.md

📝 Validating documentation...
   ✓ Generated: docs/generated/VALIDATION.md

✅ Documentation generation complete!
```

### 4. Review Generated Documentation

Check `docs/generated/` for:
- **COMPONENTS.md**: Component reference
- **API.md**: Function/hook reference
- **VALIDATION.md**: Quality report

### 5. Commit Changes

```bash
git add .
git commit -m "docs: improve EchoEntry documentation"
```

The GitHub Actions workflow will automatically regenerate documentation on push.

## Best Practices

### ✅ Do

- Add file-level JSDoc comments explaining the purpose
- Document all props with JSDoc comments
- Document function parameters and return types
- Explain the "why" not just the "what"
- Keep documentation up-to-date with code changes

### ❌ Don't

- Leave exported functions undocumented
- Write obvious comments (`// increment counter`)
- Let documentation get stale
- Skip prop descriptions
- Over-document trivial code

## Advanced Examples

### Documenting Complex Props

```typescript
interface ComplexProps {
  /**
   * Callback fired when intent is detected
   * @param mode - The detected view mode
   * @param confidence - AI confidence score (0-1)
   */
  onIntentDetected?: (mode: ViewMode, confidence: number) => void;
  
  /**
   * Audio configuration
   * @default { enabled: true, volume: 0.5 }
   */
  audioConfig?: {
    enabled: boolean;
    volume: number;
  };
}
```

### Documenting Server Actions

```typescript
/**
 * Detect user intent from input text using AI
 * 
 * Uses Google Gemini 1.5 Flash via Vercel AI SDK to analyze user input
 * and determine which view mode best matches their intent. Falls back
 * to keyword matching if AI is unavailable.
 * 
 * @param {string} input - User's input text
 * @returns {Promise<Object>} Detection result with mode and audio parameters
 * @throws {Error} If input is invalid or API fails
 * 
 * @example
 * const result = await detectIntent("I want to hire you");
 * // Returns: { mode: 'architect', confidence: 0.95, ... }
 */
export async function detectIntent(input: string) {
  // Implementation
}
```

### Documenting Hooks

```typescript
/**
 * Custom hook for managing view mode state
 * 
 * Provides the current view mode, transition methods, and mode-specific
 * configuration. Uses React Context for global state management.
 * 
 * @returns {Object} View mode state and actions
 * @returns {ViewMode} returns.currentMode - Current active mode
 * @returns {Function} returns.setMode - Change to a different mode
 * @returns {Object} returns.modeConfig - Configuration for current mode
 * 
 * @throws {Error} If used outside ViewModeProvider
 * 
 * @example
 * const { currentMode, setMode } = useViewMode();
 * setMode('architect');
 */
export function useViewMode() {
  // Implementation
}
```

## Integration with Development Workflow

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run docs:validate || {
  echo "Documentation validation failed. Please add missing documentation."
  exit 1
}
```

### CI/CD Pipeline

The included GitHub Actions workflow automatically:
1. Validates documentation on pull requests
2. Generates updated documentation on main branch pushes
3. Commits generated docs back to the repository

### IDE Integration

Many IDEs show JSDoc comments as hover tooltips, making documentation immediately accessible to developers.

## Measuring Documentation Quality

The validation report provides metrics:

```markdown
## Summary

- **Total files with issues:** 3
- **Files without JSDoc:** 1
- **Overall function documentation coverage:** 75%
```

Aim for:
- 0 files without JSDoc
- 80%+ function documentation coverage
- All exported components with prop documentation

## Troubleshooting

### Props not appearing in documentation

**Problem**: Props interface exists but not showing in docs

**Solution**: Ensure interface name matches pattern `{ComponentName}Props`:

```typescript
// ✅ Correct
interface LandingProps { ... }
function Landing(props: LandingProps) { ... }

// ❌ Wrong
interface Props { ... }
function Landing(props: Props) { ... }
```

### Function not being documented

**Problem**: Function exists but not in API docs

**Solution**: Ensure JSDoc comment directly precedes function:

```typescript
// ✅ Correct
/**
 * Function description
 */
function myFunction() { ... }

// ❌ Wrong (blank line breaks association)
/**
 * Function description
 */

function myFunction() { ... }
```

### Validation reporting false positives

**Problem**: File is documented but validation fails

**Solution**: Check that:
1. File has JSDoc comment at the top
2. At least 50% of functions have JSDoc
3. Component props interface has documentation

---

**Happy documenting! 📝**
