# Automated Documentation System

This project includes a powerful automated documentation system that parses TypeScript/TSX source files and generates comprehensive API documentation.

## 🚀 Quick Start

### Generate Documentation

```bash
# Generate documentation once
npm run docs

# Or use the full command
npm run docs:generate
```

### Watch Mode

```bash
# Watch for changes and auto-regenerate
npm run docs:watch
```

### Automatic Generation on Build

Documentation is automatically regenerated before each production build:

```bash
npm run build  # Runs docs:generate first via prebuild hook
```

## 📁 Output Structure

Generated documentation is placed in `docs/generated/`:

```
docs/generated/
├── API.md          # Full API documentation
├── COMPONENTS.md   # Component index table
├── FUNCTIONS.md    # Function index table
├── TYPES.md        # Type/Interface index table
└── api.json        # Machine-readable JSON output
```

## 📖 What Gets Documented

The system automatically extracts and documents:

### Components
- React functional components (function and arrow syntax)
- Client/Server component detection (`'use client'` / `'use server'`)
- Props type information
- Hooks used in each component
- Module dependencies

### Functions
- Exported functions (regular and arrow)
- Async functions
- Parameters with types and defaults
- Return types
- JSDoc comments and descriptions

### Types
- Type aliases (`type X = ...`)
- Interfaces with properties
- Enums with members
- JSDoc descriptions

### Constants
- Exported constants
- Configuration objects
- SCREAMING_SNAKE_CASE constants

## ✍️ Writing Good Documentation

The system automatically extracts JSDoc comments. Here's how to write effective documentation:

### Module-Level Documentation

Place a JSDoc comment at the top of your file:

```typescript
/**
 * ====================================
 * MODULE NAME
 * ====================================
 * 
 * Brief description of what this module does.
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * Usage:
 *   import { something } from '@/lib/module';
 */
```

### Function Documentation

```typescript
/**
 * Brief description of what the function does.
 * 
 * @param input - Description of the input parameter
 * @returns Description of what is returned
 * @throws Error description if the function can throw
 * @example
 * const result = myFunction('hello');
 */
export function myFunction(input: string): ReturnType {
  // ...
}
```

### Component Documentation

```typescript
/**
 * Brief description of the component.
 * 
 * @example
 * <MyComponent title="Hello" />
 */
export function MyComponent({ title }: MyComponentProps) {
  // ...
}
```

### Type Documentation

```typescript
/**
 * Description of what this type represents.
 */
export interface MyInterface {
  /** Description of this property */
  name: string;
  /** Whether this is optional */
  optional?: boolean;
}
```

## ⚙️ Configuration

The documentation generator can be configured in `scripts/docs/generate.ts`:

```typescript
const DEFAULT_CONFIG = {
  rootDir: process.cwd(),
  outDir: 'docs/generated',
  include: [
    'app',
    'components', 
    'contexts',
    'lib',
    'actions',
  ],
  exclude: [
    'node_modules',
    'integrate-workspace',
    '.next',
  ],
  generateJson: true,
  generateMarkdown: true,
  includePrivate: false,
  projectName: 'DRR Web',
  projectDescription: 'Interactive Installation - Personal Website',
};
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `rootDir` | `string` | Root directory to scan (default: cwd) |
| `outDir` | `string` | Output directory for generated docs |
| `include` | `string[]` | Directories to scan |
| `exclude` | `string[]` | Directories/patterns to exclude |
| `generateJson` | `boolean` | Generate `api.json` output |
| `generateMarkdown` | `boolean` | Generate Markdown files |
| `includePrivate` | `boolean` | Include private members |
| `projectName` | `string` | Project name in documentation |
| `projectDescription` | `string` | Project description |

## 🔌 Programmatic Usage

You can also use the documentation system programmatically:

```typescript
import { generateDocumentation, parseModule } from './scripts/docs';

// Generate all documentation
await generateDocumentation({
  ...customConfig,
});

// Parse a single module
const moduleInfo = parseModule('path/to/module.tsx');
console.log(moduleInfo.components);
console.log(moduleInfo.functions);
console.log(moduleInfo.types);
```

## 📊 Using the JSON Output

The `api.json` file contains machine-readable documentation that can be used for:

- Building custom documentation sites
- IDE integrations
- Code analysis tools
- Custom search functionality

Example structure:

```json
{
  "meta": {
    "generatedAt": "2025-11-26T12:00:00.000Z",
    "projectName": "DRR Web",
    "totalComponents": 20,
    "totalFunctions": 10,
    "totalTypes": 4
  },
  "modules": [...],
  "componentIndex": [...],
  "functionIndex": [...],
  "typeIndex": [...]
}
```

## 🔧 Extending the System

### Adding New Parsers

To parse additional syntax patterns, edit `scripts/docs/parser.ts`:

```typescript
// Add new regex patterns in the appropriate parser function
export function parseCustomSyntax(source: string, filePath: string): CustomType[] {
  const items: CustomType[] = [];
  const regex = /your-pattern/g;
  // ... extraction logic
  return items;
}
```

### Custom Formatters

To add new output formats, edit `scripts/docs/formatter.ts`:

```typescript
export function formatAsHTML(output: DocumentationOutput): string {
  // Generate HTML documentation
  return htmlString;
}
```

## 🐛 Troubleshooting

### No files found

Make sure the directories in `include` exist and contain `.ts` or `.tsx` files.

### Missing documentation

1. Ensure functions/components are exported
2. Add JSDoc comments for better descriptions
3. Check that the file isn't in an excluded directory

### Type parsing issues

The parser uses regex-based extraction. Complex type expressions might not be fully captured. Consider simplifying complex types or using explicit type aliases.

---

Generated documentation is maintained automatically. Run `npm run docs` to update after significant changes.






