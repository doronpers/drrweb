/**
 * ====================================
 * DOCUMENTATION SYSTEM - TYPE DEFINITIONS
 * ====================================
 * 
 * Core types used throughout the documentation generator.
 */

/**
 * Represents a parsed JSDoc comment.
 */
export interface DocComment {
  /** The main description text */
  description: string;
  /** @param tags with name and description */
  params: Array<{ name: string; type?: string; description: string }>;
  /** @returns tag description */
  returns?: { type?: string; description: string };
  /** @throws tag description */
  throws?: string;
  /** @example tag content */
  examples: string[];
  /** @deprecated tag description */
  deprecated?: string;
  /** @since version */
  since?: string;
  /** Custom tags */
  tags: Array<{ tag: string; value: string }>;
}

/**
 * Represents a TypeScript type definition.
 */
export interface TypeDefinition {
  /** The type name */
  name: string;
  /** Type kind: 'type', 'interface', 'enum' */
  kind: 'type' | 'interface' | 'enum';
  /** The file where this type is defined */
  filePath: string;
  /** Line number in the source file */
  lineNumber: number;
  /** Whether the type is exported */
  exported: boolean;
  /** JSDoc comment if available */
  doc?: DocComment;
  /** The raw type definition text */
  definition: string;
  /** For interfaces: the properties */
  properties?: Array<{
    name: string;
    type: string;
    optional: boolean;
    doc?: string;
  }>;
  /** For enums: the members */
  members?: Array<{ name: string; value?: string | number }>;
}

/**
 * Represents a function or method.
 */
export interface FunctionDefinition {
  /** Function name */
  name: string;
  /** Function kind: 'function', 'arrow', 'method' */
  kind: 'function' | 'arrow' | 'method';
  /** Whether it's async */
  async: boolean;
  /** Whether it's exported */
  exported: boolean;
  /** The file where this function is defined */
  filePath: string;
  /** Line number in the source file */
  lineNumber: number;
  /** JSDoc comment if available */
  doc?: DocComment;
  /** Function signature */
  signature: string;
  /** Parameters */
  parameters: Array<{
    name: string;
    type?: string;
    optional: boolean;
    defaultValue?: string;
  }>;
  /** Return type */
  returnType?: string;
  /** Type parameters (generics) */
  typeParameters?: string[];
}

/**
 * Represents a React component.
 */
export interface ComponentDefinition {
  /** Component name */
  name: string;
  /** Component type: 'function', 'arrow', 'class' */
  type: 'function' | 'arrow' | 'class';
  /** Whether it's a client component ('use client') */
  isClient: boolean;
  /** Whether it's a server component ('use server') */
  isServer: boolean;
  /** Whether it's the default export */
  isDefault: boolean;
  /** The file where this component is defined */
  filePath: string;
  /** Line number in the source file */
  lineNumber: number;
  /** JSDoc comment if available */
  doc?: DocComment;
  /** Props interface/type name */
  propsType?: string;
  /** Resolved props (if we can find the interface) */
  props?: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
    defaultValue?: string;
  }>;
  /** Hooks used in this component */
  hooks: string[];
  /** Other components imported/used */
  dependencies: string[];
}

/**
 * Represents a constant or configuration object.
 */
export interface ConstantDefinition {
  /** Constant name */
  name: string;
  /** Whether it's exported */
  exported: boolean;
  /** The file where this constant is defined */
  filePath: string;
  /** Line number in the source file */
  lineNumber: number;
  /** JSDoc comment if available */
  doc?: DocComment;
  /** Inferred or declared type */
  type?: string;
  /** The value (for simple constants) */
  value?: string;
}

/**
 * Represents a parsed module/file.
 */
export interface ModuleDefinition {
  /** Relative file path */
  filePath: string;
  /** Module name (derived from path) */
  moduleName: string;
  /** Top-level module JSDoc comment */
  moduleDoc?: DocComment;
  /** Whether it's a client module */
  isClient: boolean;
  /** Whether it's a server module */
  isServer: boolean;
  /** Imports in this module */
  imports: Array<{
    from: string;
    names: string[];
    default?: string;
  }>;
  /** Exports from this module */
  exports: string[];
  /** Types defined in this module */
  types: TypeDefinition[];
  /** Functions defined in this module */
  functions: FunctionDefinition[];
  /** React components in this module */
  components: ComponentDefinition[];
  /** Constants in this module */
  constants: ConstantDefinition[];
}

/**
 * Configuration for the documentation generator.
 */
export interface DocGeneratorConfig {
  /** Root directory to scan */
  rootDir: string;
  /** Output directory for generated docs */
  outDir: string;
  /** Glob patterns for files to include */
  include: string[];
  /** Glob patterns for files to exclude */
  exclude: string[];
  /** Whether to generate JSON output */
  generateJson: boolean;
  /** Whether to generate Markdown output */
  generateMarkdown: boolean;
  /** Whether to include private members */
  includePrivate: boolean;
  /** Project name for documentation */
  projectName: string;
  /** Project description */
  projectDescription?: string;
  /** Base URL for links */
  baseUrl?: string;
}

/**
 * The complete documentation output.
 */
export interface DocumentationOutput {
  /** Generation metadata */
  meta: {
    generatedAt: string;
    projectName: string;
    projectDescription?: string;
    version: string;
    totalModules: number;
    totalComponents: number;
    totalFunctions: number;
    totalTypes: number;
  };
  /** All parsed modules */
  modules: ModuleDefinition[];
  /** Index of all components */
  componentIndex: Array<{
    name: string;
    filePath: string;
    isClient: boolean;
    propsType?: string;
  }>;
  /** Index of all exported functions */
  functionIndex: Array<{
    name: string;
    filePath: string;
    signature: string;
  }>;
  /** Index of all exported types */
  typeIndex: Array<{
    name: string;
    kind: 'type' | 'interface' | 'enum';
    filePath: string;
  }>;
}

