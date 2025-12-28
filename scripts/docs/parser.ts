/**
 * ====================================
 * DOCUMENTATION SYSTEM - PARSER
 * ====================================
 * 
 * Parses TypeScript/TSX files to extract documentation information.
 * Uses regex-based parsing for portability (no TypeScript compiler dependency).
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  DocComment,
  TypeDefinition,
  FunctionDefinition,
  ComponentDefinition,
  ConstantDefinition,
  ModuleDefinition,
} from './types';

// ====================================
// JSDOC PARSER
// ====================================

/**
 * Parses a JSDoc comment block into structured data.
 * 
 * @param comment - The raw JSDoc comment string (including delimiters)
 * @returns Parsed DocComment object
 */
export function parseJSDoc(comment: string): DocComment {
  const result: DocComment = {
    description: '',
    params: [],
    examples: [],
    tags: [],
  };

  if (!comment) return result;

  // Remove comment delimiters and clean up
  const cleaned = comment
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();

  // Split into description and tags
  const lines = cleaned.split('\n');
  const descriptionLines: string[] = [];
  let currentTag: { tag: string; content: string[] } | null = null;

  for (const line of lines) {
    const tagMatch = line.match(/^@(\w+)\s*(.*)/);
    
    if (tagMatch) {
      // Save previous tag if exists
      if (currentTag) {
        processTag(result, currentTag.tag, currentTag.content.join('\n').trim());
      }
      currentTag = { tag: tagMatch[1], content: [tagMatch[2]] };
    } else if (currentTag) {
      currentTag.content.push(line);
    } else {
      descriptionLines.push(line);
    }
  }

  // Process final tag
  if (currentTag) {
    processTag(result, currentTag.tag, currentTag.content.join('\n').trim());
  }

  result.description = descriptionLines.join('\n').trim();
  return result;
}

/**
 * Processes a single JSDoc tag.
 */
function processTag(doc: DocComment, tag: string, content: string): void {
  switch (tag) {
    case 'param': {
      const paramMatch = content.match(/^(?:\{([^}]+)\}\s+)?(\w+)\s*-?\s*(.*)/s);
      if (paramMatch) {
        doc.params.push({
          name: paramMatch[2],
          type: paramMatch[1],
          description: paramMatch[3].trim(),
        });
      }
      break;
    }
    case 'returns':
    case 'return': {
      const returnMatch = content.match(/^(?:\{([^}]+)\}\s+)?(.*)/s);
      if (returnMatch) {
        doc.returns = {
          type: returnMatch[1],
          description: returnMatch[2].trim(),
        };
      }
      break;
    }
    case 'throws':
    case 'throw':
      doc.throws = content;
      break;
    case 'example':
      doc.examples.push(content);
      break;
    case 'deprecated':
      doc.deprecated = content || 'This item is deprecated.';
      break;
    case 'since':
      doc.since = content;
      break;
    default:
      doc.tags.push({ tag, value: content });
  }
}

// ====================================
// TYPE PARSER
// ====================================

/**
 * Extracts type definitions from TypeScript source code.
 */
export function parseTypes(source: string, filePath: string): TypeDefinition[] {
  const types: TypeDefinition[] = [];
  
  // Match type aliases
  const typeRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?type\s+(\w+)(?:<[^>]+>)?\s*=\s*([^;]+);/g;
  let match;
  
  while ((match = typeRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    
    types.push({
      name: match[2],
      kind: 'type',
      filePath,
      lineNumber,
      exported: !!match[1],
      doc: docComment ? parseJSDoc(docComment) : undefined,
      definition: match[3].trim(),
    });
  }

  // Match interfaces
  const interfaceRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?interface\s+(\w+)(?:<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{([^}]*)\}/g;
  
  while ((match = interfaceRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    const properties = parseInterfaceProperties(match[3]);
    
    types.push({
      name: match[2],
      kind: 'interface',
      filePath,
      lineNumber,
      exported: !!match[1],
      doc: docComment ? parseJSDoc(docComment) : undefined,
      definition: match[0],
      properties,
    });
  }

  // Match enums
  const enumRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?(?:const\s+)?enum\s+(\w+)\s*\{([^}]*)\}/g;
  
  while ((match = enumRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    const members = parseEnumMembers(match[3]);
    
    types.push({
      name: match[2],
      kind: 'enum',
      filePath,
      lineNumber,
      exported: !!match[1],
      doc: docComment ? parseJSDoc(docComment) : undefined,
      definition: match[0],
      members,
    });
  }

  return types;
}

/**
 * Parses interface properties.
 */
function parseInterfaceProperties(body: string): TypeDefinition['properties'] {
  const properties: NonNullable<TypeDefinition['properties']> = [];
  const propRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);?/g;
  let match;

  while ((match = propRegex.exec(body)) !== null) {
    properties.push({
      name: match[2],
      type: match[4].trim(),
      optional: !!match[3],
      doc: match[1]?.replace(/\*\s*/g, '').trim(),
    });
  }

  return properties;
}

/**
 * Parses enum members.
 */
function parseEnumMembers(body: string): TypeDefinition['members'] {
  const members: NonNullable<TypeDefinition['members']> = [];
  const memberRegex = /(\w+)\s*(?:=\s*([^,\n]+))?/g;
  let match;

  while ((match = memberRegex.exec(body)) !== null) {
    members.push({
      name: match[1],
      value: match[2]?.trim(),
    });
  }

  return members;
}

// ====================================
// FUNCTION PARSER
// ====================================

/**
 * Extracts function definitions from TypeScript source code.
 */
export function parseFunctions(source: string, filePath: string): FunctionDefinition[] {
  const functions: FunctionDefinition[] = [];

  // Match regular functions
  const funcRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?(async\s+)?function\s+(\w+)(?:<([^>]+)>)?\s*\(([^)]*)\)(?:\s*:\s*([^\n{]+))?\s*\{/g;
  let match;

  while ((match = funcRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    const params = parseParameters(match[5]);

    functions.push({
      name: match[3],
      kind: 'function',
      async: !!match[2],
      exported: !!match[1],
      filePath,
      lineNumber,
      doc: docComment ? parseJSDoc(docComment) : undefined,
      signature: buildSignature(match[3], match[5], match[6]),
      parameters: params,
      returnType: match[6]?.trim(),
      typeParameters: match[4]?.split(',').map(t => t.trim()),
    });
  }

  // Match exported arrow functions
  const arrowRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?(?:const|let)\s+(\w+)(?:\s*:\s*[^=]+)?\s*=\s*(async\s+)?(?:\([^)]*\)|[^=])\s*=>/g;

  while ((match = arrowRegex.exec(source)) !== null) {
    // Skip if it looks like a React component (starts with uppercase)
    if (/^[A-Z]/.test(match[2])) continue;

    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);

    functions.push({
      name: match[2],
      kind: 'arrow',
      async: !!match[3],
      exported: !!match[1],
      filePath,
      lineNumber,
      doc: docComment ? parseJSDoc(docComment) : undefined,
      signature: match[2],
      parameters: [],
    });
  }

  return functions;
}

/**
 * Parses function parameters.
 */
function parseParameters(paramStr: string): FunctionDefinition['parameters'] {
  if (!paramStr.trim()) return [];

  const params: FunctionDefinition['parameters'] = [];
  // Handle destructuring and complex types
  const parts = splitParameters(paramStr);

  for (const part of parts) {
    const match = part.match(/^(\w+)(\?)?(?:\s*:\s*([^=]+))?(?:\s*=\s*(.+))?$/);
    if (match) {
      params.push({
        name: match[1],
        optional: !!match[2] || !!match[4],
        type: match[3]?.trim(),
        defaultValue: match[4]?.trim(),
      });
    } else {
      // Handle destructured params
      const destructMatch = part.match(/^\{[^}]+\}(?:\s*:\s*(\w+))?/);
      if (destructMatch) {
        params.push({
          name: 'props',
          type: destructMatch[1] || 'object',
          optional: false,
        });
      }
    }
  }

  return params;
}

/**
 * Splits parameters respecting brackets.
 */
function splitParameters(paramStr: string): string[] {
  const params: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of paramStr) {
    if (char === '(' || char === '{' || char === '<' || char === '[') {
      depth++;
      current += char;
    } else if (char === ')' || char === '}' || char === '>' || char === ']') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      params.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    params.push(current.trim());
  }

  return params;
}

/**
 * Builds a function signature string.
 */
function buildSignature(name: string, params: string, returnType?: string): string {
  let sig = `${name}(${params})`;
  if (returnType) {
    sig += `: ${returnType.trim()}`;
  }
  return sig;
}

// ====================================
// COMPONENT PARSER
// ====================================

/**
 * Extracts React component definitions from TSX source code.
 */
export function parseComponents(source: string, filePath: string): ComponentDefinition[] {
  const components: ComponentDefinition[] = [];
  const isClient = source.includes("'use client'") || source.includes('"use client"');
  const isServer = source.includes("'use server'") || source.includes('"use server"');

  // Match function components (function declaration)
  const funcCompRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?(default\s+)?function\s+([A-Z]\w*)\s*\(([^)]*)\)(?:\s*:\s*[^{]+)?\s*\{/g;
  let match;

  while ((match = funcCompRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    const hooks = extractHooks(source, match.index);
    const deps = extractDependencies(source);
    const propsType = extractPropsType(match[4]);

    components.push({
      name: match[3],
      type: 'function',
      isClient,
      isServer,
      isDefault: !!match[2],
      filePath,
      lineNumber,
      doc: docComment ? parseJSDoc(docComment) : undefined,
      propsType,
      hooks,
      dependencies: deps,
    });
  }

  // Match arrow function components
  const arrowCompRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?(default\s+)?(?:const|let)\s+([A-Z]\w*)\s*(?::\s*React\.FC[^=]*)?=\s*(?:\([^)]*\)|[^=])\s*=>/g;

  while ((match = arrowCompRegex.exec(source)) !== null) {
    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);
    const hooks = extractHooks(source, match.index);
    const deps = extractDependencies(source);

    components.push({
      name: match[3],
      type: 'arrow',
      isClient,
      isServer,
      isDefault: !!match[2],
      filePath,
      lineNumber,
      doc: docComment ? parseJSDoc(docComment) : undefined,
      hooks,
      dependencies: deps,
    });
  }

  // Handle default export if no named components found
  if (components.length === 0) {
    const defaultExportMatch = source.match(/export\s+default\s+function\s+(\w+)/);
    if (defaultExportMatch && /^[A-Z]/.test(defaultExportMatch[1])) {
      const lineNumber = getLineNumber(source, defaultExportMatch.index || 0);
      const docComment = extractPrecedingJSDoc(source, defaultExportMatch.index || 0);
      const hooks = extractHooks(source, 0);
      const deps = extractDependencies(source);

      components.push({
        name: defaultExportMatch[1],
        type: 'function',
        isClient,
        isServer,
        isDefault: true,
        filePath,
        lineNumber,
        doc: docComment ? parseJSDoc(docComment) : undefined,
        hooks,
        dependencies: deps,
      });
    }
  }

  return components;
}

/**
 * Extracts React hooks used in a component.
 */
function extractHooks(source: string, startIndex: number): string[] {
  const hooks: Set<string> = new Set();
  const hookRegex = /\buse[A-Z]\w*(?=\()/g;
  let match;

  // Search from component start to reasonable end (next component or EOF)
  const searchArea = source.slice(startIndex, startIndex + 10000);

  while ((match = hookRegex.exec(searchArea)) !== null) {
    hooks.add(match[0]);
  }

  return Array.from(hooks);
}

/**
 * Extracts component dependencies (imports).
 */
function extractDependencies(source: string): string[] {
  const deps: string[] = [];
  const importRegex = /import\s+(?:\{[^}]+\}|[^;]+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(source)) !== null) {
    deps.push(match[1]);
  }

  return deps;
}

/**
 * Extracts props type from function parameters.
 */
function extractPropsType(params: string): string | undefined {
  // Match { ... }: TypeName pattern
  const match = params.match(/\{\s*[^}]+\}\s*:\s*(\w+)/);
  if (match) return match[1];

  // Match props: TypeName pattern
  const propsMatch = params.match(/\w+\s*:\s*(\w+)/);
  if (propsMatch) return propsMatch[1];

  return undefined;
}

// ====================================
// CONSTANT PARSER
// ====================================

/**
 * Extracts constant definitions from TypeScript source code.
 */
export function parseConstants(source: string, filePath: string): ConstantDefinition[] {
  const constants: ConstantDefinition[] = [];

  // Match const declarations (focus on exported, SCREAMING_SNAKE_CASE, or with JSDoc)
  const constRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(export\s+)?const\s+([A-Z][A-Z0-9_]*|[a-z]\w*)\s*(?::\s*([^=]+))?\s*=\s*([^;]+)/g;
  let match;

  while ((match = constRegex.exec(source)) !== null) {
    // Skip if it's a function or component
    if (match[4].includes('=>') || match[4].includes('function')) continue;

    const lineNumber = getLineNumber(source, match.index);
    const docComment = extractPrecedingJSDoc(source, match.index);

    // Only include if exported or has JSDoc
    if (match[1] || docComment) {
      constants.push({
        name: match[2],
        exported: !!match[1],
        filePath,
        lineNumber,
        doc: docComment ? parseJSDoc(docComment) : undefined,
        type: match[3]?.trim(),
        value: truncateValue(match[4]),
      });
    }
  }

  return constants;
}

/**
 * Truncates long values for display.
 */
function truncateValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length > 100) {
    return trimmed.slice(0, 100) + '...';
  }
  return trimmed;
}

// ====================================
// MODULE PARSER
// ====================================

/**
 * Parses a complete TypeScript/TSX module.
 */
export function parseModule(filePath: string): ModuleDefinition | null {
  try {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    const source = fs.readFileSync(absolutePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), absolutePath);
    const moduleName = path.basename(filePath, path.extname(filePath));

    const isClient = source.includes("'use client'") || source.includes('"use client"');
    const isServer = source.includes("'use server'") || source.includes('"use server"');

    // Extract module-level JSDoc (first comment in file)
    const moduleDocMatch = source.match(/^(?:\s*\/\*\*[\s\S]*?\*\/)/);
    const moduleDoc = moduleDocMatch ? parseJSDoc(moduleDocMatch[0]) : undefined;

    // Parse imports
    const imports = parseImports(source);

    // Parse exports list
    const exports = parseExports(source);

    return {
      filePath: relativePath,
      moduleName,
      moduleDoc,
      isClient,
      isServer,
      imports,
      exports,
      types: parseTypes(source, relativePath),
      functions: parseFunctions(source, relativePath),
      components: parseComponents(source, relativePath),
      constants: parseConstants(source, relativePath),
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Parses import statements.
 */
function parseImports(source: string): ModuleDefinition['imports'] {
  const imports: ModuleDefinition['imports'] = [];
  const importRegex = /import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]+)\})?\s*from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(source)) !== null) {
    const names = match[2]
      ? match[2].split(',').map(n => n.trim().split(/\s+as\s+/)[0])
      : [];

    imports.push({
      from: match[3],
      names: names.filter(Boolean),
      default: match[1],
    });
  }

  return imports;
}

/**
 * Parses export statements.
 */
function parseExports(source: string): string[] {
  const exports: Set<string> = new Set();

  // Named exports: export { name }
  const namedExportRegex = /export\s+\{([^}]+)\}/g;
  let match;

  while ((match = namedExportRegex.exec(source)) !== null) {
    match[1].split(',').forEach(name => {
      exports.add(name.trim().split(/\s+as\s+/)[0]);
    });
  }

  // Direct exports: export const/function/class/type/interface name
  const directExportRegex = /export\s+(?:const|let|var|function|class|type|interface|enum)\s+(\w+)/g;

  while ((match = directExportRegex.exec(source)) !== null) {
    exports.add(match[1]);
  }

  // Default export
  if (/export\s+default/.test(source)) {
    exports.add('default');
  }

  return Array.from(exports);
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Gets the line number for a position in source.
 */
function getLineNumber(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

/**
 * Extracts the JSDoc comment preceding a position.
 */
function extractPrecedingJSDoc(source: string, index: number): string | null {
  // Look backwards from index for JSDoc
  const preceding = source.slice(Math.max(0, index - 2000), index);
  const match = preceding.match(/\/\*\*[\s\S]*?\*\/\s*$/);
  return match ? match[0] : null;
}






