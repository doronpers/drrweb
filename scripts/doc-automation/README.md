# Documentation Automation

Automated documentation generation system for the drrweb project. This system extracts documentation from code comments, type annotations, and component structures to generate comprehensive, always-up-to-date documentation.

## 🎯 Overview

The documentation automation system provides:

- **Component Documentation**: Auto-generates docs from React/TypeScript components
- **API Documentation**: Extracts function signatures, parameters, and return types
- **Documentation Validation**: Ensures code is adequately documented
- **Automated Updates**: Documentation stays in sync with code changes

## 📁 Structure

```
scripts/doc-automation/
├── extract-component-docs.js    # Component documentation extractor
├── generate-api-docs.js         # API documentation generator
├── validate-docs.js             # Documentation validator
└── generate-all-docs.js         # Main orchestration script

docs/generated/                  # Auto-generated documentation output
├── README.md                    # Documentation index
├── COMPONENTS.md                # Component documentation
├── API.md                       # API documentation
└── VALIDATION.md                # Validation report
```

## 🚀 Usage

### Generate All Documentation

Generate complete documentation set:

```bash
npm run docs:generate
```

This will:
1. Extract component documentation from all `.tsx`/`.jsx` files
2. Generate API documentation from `lib/`, `actions/`, and `contexts/`
3. Validate documentation completeness
4. Create a documentation index

Output will be in `docs/generated/`

### Validate Documentation

Check if code is adequately documented:

```bash
npm run docs:validate
```

This checks for:
- Missing JSDoc comments
- Undocumented functions
- Undocumented component props
- Low documentation coverage

### Generate Component Documentation

Extract documentation for a specific component:

```bash
npm run docs:components components/Landing.tsx
```

Or for all components:

```bash
node scripts/doc-automation/extract-component-docs.js components/
```

### Generate API Documentation

Generate API docs for a specific directory:

```bash
npm run docs:api lib
```

## 📝 Writing Documentable Code

### Components

Add JSDoc comment at the top of component files:

```typescript
/**
 * Landing Component
 * 
 * The antechamber - entry point where users declare their intent.
 * Features AI-powered intent detection and keyword routing.
 */

interface LandingProps {
  /** Callback when user enters intent */
  onIntentDetected?: (mode: ViewMode) => void;
  /** Whether audio is enabled */
  audioEnabled?: boolean;  // Audio state flag
}

export default function Landing({ onIntentDetected, audioEnabled }: LandingProps) {
  // ...
}
```

### Functions

Document functions with JSDoc:

```typescript
/**
 * Detect user intent from input text
 * @param {string} input - User's input text
 * @param {Object} options - Detection options
 * @returns {Promise<ViewMode>} - Detected view mode
 */
export async function detectIntent(input: string, options = {}) {
  // ...
}
```

### Hooks

Document custom hooks:

```typescript
/**
 * useSoundscape Hook
 * 
 * Manages audio context and soundscape for view modes.
 * Provides mode-specific ambient drones and UI sound effects.
 * 
 * @returns {Object} Audio control methods and state
 */
export function useSoundscape() {
  // ...
}
```

## ⚙️ Configuration

Edit `doc-automation.config.json` to customize:

```json
{
  "docAutomation": {
    "directories": {
      "components": "components",
      "lib": "lib",
      "output": "docs/generated"
    },
    "excludeDirs": ["node_modules", ".git", ".next"],
    "validation": {
      "requireFileJSDoc": true,
      "minFunctionDocCoverage": 0.5,
      "requirePropsDoc": true
    }
  }
}
```

## 🔍 What Gets Documented

### Components
- Component description (from file-level JSDoc)
- Props with types and descriptions
- Hooks used
- Local dependencies

### Functions
- Function signature with types
- Parameters with descriptions
- Return type and description
- Examples (if provided in JSDoc)

### Validation Checks
- ✓ File has JSDoc comment
- ✓ Function documentation coverage ≥ 50%
- ✓ Component props are documented
- ✓ Complex logic has comments

## 🎨 Output Format

Generated documentation is in Markdown format:

- **COMPONENTS.md**: One section per component with props table, hooks, and dependencies
- **API.md**: Functions grouped by file with signatures and parameters
- **VALIDATION.md**: Report of documentation issues with statistics
- **README.md**: Index linking all generated documentation

## 🔄 CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/docs.yml
- name: Validate Documentation
  run: npm run docs:validate

- name: Generate Documentation
  run: npm run docs:generate

- name: Commit Updated Docs
  run: |
    git add docs/generated/
    git commit -m "docs: auto-update generated documentation"
```

## 🛠️ Extending the System

### Add Custom Extractors

Create new extractors in `scripts/doc-automation/`:

```javascript
function extractCustomInfo(content) {
  // Your extraction logic
}

module.exports = { extractCustomInfo };
```

### Add Custom Validation Rules

Edit `validate-docs.js`:

```javascript
function customValidationRule(content) {
  // Your validation logic
  return { passed: true, issues: [] };
}
```

### Add New Documentation Types

Edit `generate-all-docs.js` to add new generation tasks:

```javascript
function generateCustomDocs() {
  // Your generation logic
}
```

## 📚 Best Practices

1. **Document public APIs**: All exported functions/components should have JSDoc
2. **Describe the "why"**: Explain intent, not just what the code does
3. **Keep it current**: Run `docs:generate` regularly
4. **Use TypeScript**: Types are automatically extracted and documented
5. **Link related docs**: Use relative links to connect documentation

## 🤝 Benefits

- **Always Up-to-Date**: Documentation extracted from code can't get stale
- **Consistent Format**: Standardized documentation across the codebase
- **Onboarding**: New developers can quickly understand the codebase
- **Validation**: Catch undocumented code before it's merged
- **Searchable**: All docs in one place, easy to search

## 📖 Example Output

Running `npm run docs:generate` produces:

```
🚀 Starting documentation generation...

📝 Generating component documentation...
   ✓ Generated: docs/generated/COMPONENTS.md

📝 Generating API documentation...
   ✓ Generated: docs/generated/API.md

📝 Validating documentation...
   ✓ Generated: docs/generated/VALIDATION.md
   ⚠️  Found 3 file(s) with documentation issues

📝 Generating documentation index...
   ✓ Generated: docs/generated/README.md

✅ Documentation generation complete!

Generated files in: docs/generated/
```

## 🔗 Integration with Existing Docs

Generated docs complement existing manual documentation:

- **README.md**: Project overview (manual)
- **ARCHITECTURE.md**: System design (manual)
- **docs/generated/COMPONENTS.md**: Component reference (auto)
- **docs/generated/API.md**: API reference (auto)

## 💡 Tips

- Run `docs:validate` before committing to catch missing docs
- Use `docs:generate` after major refactoring to update references
- Review generated docs to ensure quality of source comments
- Add examples in JSDoc for complex functions
- Keep component files well-organized for better extraction

---

**Note**: This system is designed to be extensible. Feel free to add custom extractors, validators, and generators to suit your project needs.
