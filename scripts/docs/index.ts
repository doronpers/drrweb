/**
 * ====================================
 * DOCUMENTATION SYSTEM - MAIN EXPORTS
 * ====================================
 * 
 * Central export point for the automated documentation system.
 */

// Core generators
export { generateDocumentation, DEFAULT_CONFIG } from './generate';
export { setupWatchers } from './watch';

// Parsers
export {
  parseJSDoc,
  parseTypes,
  parseFunctions,
  parseComponents,
  parseConstants,
  parseModule,
} from './parser';

// Formatters
export {
  formatFullDocumentation,
  formatComponent,
  formatFunction,
  formatType,
  formatConstant,
  formatModuleSummary,
  formatComponentIndex,
  formatFunctionIndex,
  formatTypeIndex,
  formatAsJson,
} from './formatter';

// Types
export type {
  DocComment,
  TypeDefinition,
  FunctionDefinition,
  ComponentDefinition,
  ConstantDefinition,
  ModuleDefinition,
  DocGeneratorConfig,
  DocumentationOutput,
} from './types';






