/**
 * ====================================
 * DOCUMENTATION SYSTEM - FORMATTER
 * ====================================
 * 
 * Converts parsed documentation into readable Markdown output.
 */

import type {
  TypeDefinition,
  FunctionDefinition,
  ComponentDefinition,
  ConstantDefinition,
  ModuleDefinition,
  DocumentationOutput,
} from './types';

// ====================================
// MARKDOWN FORMATTERS
// ====================================

/**
 * Formats the complete documentation as a single Markdown file.
 */
export function formatFullDocumentation(output: DocumentationOutput): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${output.meta.projectName} - API Documentation`);
  lines.push('');
  if (output.meta.projectDescription) {
    lines.push(`> ${output.meta.projectDescription}`);
    lines.push('');
  }
  lines.push(`**Generated:** ${output.meta.generatedAt}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## 📚 Table of Contents');
  lines.push('');
  lines.push('- [Overview](#overview)');
  lines.push('- [Components](#components)');
  lines.push('- [Functions](#functions)');
  lines.push('- [Types](#types)');
  lines.push('- [Constants](#constants)');
  lines.push('- [Modules](#modules)');
  lines.push('');

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Modules | ${output.meta.totalModules} |`);
  lines.push(`| React Components | ${output.meta.totalComponents} |`);
  lines.push(`| Functions | ${output.meta.totalFunctions} |`);
  lines.push(`| Types/Interfaces | ${output.meta.totalTypes} |`);
  lines.push('');

  // Components Section
  lines.push('## Components');
  lines.push('');
  
  const allComponents = output.modules.flatMap(m => m.components);
  if (allComponents.length === 0) {
    lines.push('_No components found._');
  } else {
    for (const component of allComponents) {
      lines.push(formatComponent(component));
      lines.push('');
    }
  }
  lines.push('');

  // Functions Section
  lines.push('## Functions');
  lines.push('');

  const allFunctions = output.modules.flatMap(m => m.functions.filter(f => f.exported));
  if (allFunctions.length === 0) {
    lines.push('_No exported functions found._');
  } else {
    for (const func of allFunctions) {
      lines.push(formatFunction(func));
      lines.push('');
    }
  }
  lines.push('');

  // Types Section
  lines.push('## Types');
  lines.push('');

  const allTypes = output.modules.flatMap(m => m.types.filter(t => t.exported));
  if (allTypes.length === 0) {
    lines.push('_No exported types found._');
  } else {
    for (const type of allTypes) {
      lines.push(formatType(type));
      lines.push('');
    }
  }
  lines.push('');

  // Constants Section
  lines.push('## Constants');
  lines.push('');

  const allConstants = output.modules.flatMap(m => m.constants.filter(c => c.exported));
  if (allConstants.length === 0) {
    lines.push('_No exported constants found._');
  } else {
    for (const constant of allConstants) {
      lines.push(formatConstant(constant));
      lines.push('');
    }
  }
  lines.push('');

  // Modules Section
  lines.push('## Modules');
  lines.push('');

  for (const module of output.modules) {
    lines.push(formatModuleSummary(module));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Formats a single React component.
 */
export function formatComponent(component: ComponentDefinition): string {
  const lines: string[] = [];
  const badges: string[] = [];

  if (component.isClient) badges.push('`Client`');
  if (component.isServer) badges.push('`Server`');
  if (component.isDefault) badges.push('`Default Export`');

  lines.push(`### ${component.name}`);
  lines.push('');
  
  if (badges.length > 0) {
    lines.push(badges.join(' ') + '  ');
    lines.push('');
  }

  if (component.doc?.description) {
    lines.push(component.doc.description);
    lines.push('');
  }

  lines.push(`**File:** \`${component.filePath}\` (line ${component.lineNumber})`);
  lines.push('');

  if (component.propsType) {
    lines.push(`**Props Type:** \`${component.propsType}\``);
    lines.push('');
  }

  if (component.props && component.props.length > 0) {
    lines.push('#### Props');
    lines.push('');
    lines.push('| Name | Type | Required | Description |');
    lines.push('|------|------|----------|-------------|');
    for (const prop of component.props) {
      const required = prop.required ? '✅' : '❌';
      lines.push(`| \`${prop.name}\` | \`${prop.type}\` | ${required} | ${prop.description || '-'} |`);
    }
    lines.push('');
  }

  if (component.hooks.length > 0) {
    lines.push(`**Hooks Used:** ${component.hooks.map(h => `\`${h}\``).join(', ')}`);
    lines.push('');
  }

  if (component.doc?.examples && component.doc.examples.length > 0) {
    lines.push('#### Example');
    lines.push('');
    for (const example of component.doc.examples) {
      lines.push('```tsx');
      lines.push(example);
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Formats a single function.
 */
export function formatFunction(func: FunctionDefinition): string {
  const lines: string[] = [];
  const badges: string[] = [];

  if (func.async) badges.push('`async`');
  if (func.exported) badges.push('`exported`');

  lines.push(`### ${func.name}()`);
  lines.push('');

  if (badges.length > 0) {
    lines.push(badges.join(' ') + '  ');
    lines.push('');
  }

  if (func.doc?.description) {
    lines.push(func.doc.description);
    lines.push('');
  }

  if (func.doc?.deprecated) {
    lines.push(`> ⚠️ **Deprecated:** ${func.doc.deprecated}`);
    lines.push('');
  }

  lines.push(`**File:** \`${func.filePath}\` (line ${func.lineNumber})`);
  lines.push('');

  lines.push('```typescript');
  lines.push(func.signature);
  lines.push('```');
  lines.push('');

  if (func.parameters.length > 0) {
    lines.push('#### Parameters');
    lines.push('');
    lines.push('| Name | Type | Optional | Default | Description |');
    lines.push('|------|------|----------|---------|-------------|');
    
    for (const param of func.parameters) {
      const optional = param.optional ? '✅' : '❌';
      const defaultVal = param.defaultValue || '-';
      const desc = func.doc?.params.find(p => p.name === param.name)?.description || '-';
      lines.push(`| \`${param.name}\` | \`${param.type || 'any'}\` | ${optional} | \`${defaultVal}\` | ${desc} |`);
    }
    lines.push('');
  }

  if (func.returnType) {
    lines.push(`**Returns:** \`${func.returnType}\``);
    if (func.doc?.returns) {
      lines.push(`  ${func.doc.returns.description}`);
    }
    lines.push('');
  }

  if (func.doc?.throws) {
    lines.push(`**Throws:** ${func.doc.throws}`);
    lines.push('');
  }

  if (func.doc?.examples && func.doc.examples.length > 0) {
    lines.push('#### Example');
    lines.push('');
    for (const example of func.doc.examples) {
      lines.push('```typescript');
      lines.push(example);
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Formats a single type definition.
 */
export function formatType(type: TypeDefinition): string {
  const lines: string[] = [];

  const kindBadge = type.kind === 'interface' ? '`interface`' : 
                    type.kind === 'enum' ? '`enum`' : '`type`';

  lines.push(`### ${type.name}`);
  lines.push('');
  lines.push(kindBadge);
  lines.push('');

  if (type.doc?.description) {
    lines.push(type.doc.description);
    lines.push('');
  }

  lines.push(`**File:** \`${type.filePath}\` (line ${type.lineNumber})`);
  lines.push('');

  if (type.kind === 'interface' && type.properties && type.properties.length > 0) {
    lines.push('#### Properties');
    lines.push('');
    lines.push('| Name | Type | Optional | Description |');
    lines.push('|------|------|----------|-------------|');
    for (const prop of type.properties) {
      const optional = prop.optional ? '✅' : '❌';
      lines.push(`| \`${prop.name}\` | \`${prop.type}\` | ${optional} | ${prop.doc || '-'} |`);
    }
    lines.push('');
  }

  if (type.kind === 'enum' && type.members && type.members.length > 0) {
    lines.push('#### Members');
    lines.push('');
    lines.push('| Name | Value |');
    lines.push('|------|-------|');
    for (const member of type.members) {
      lines.push(`| \`${member.name}\` | \`${member.value ?? 'auto'}\` |`);
    }
    lines.push('');
  }

  if (type.kind === 'type') {
    lines.push('```typescript');
    lines.push(`type ${type.name} = ${type.definition}`);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Formats a single constant.
 */
export function formatConstant(constant: ConstantDefinition): string {
  const lines: string[] = [];

  lines.push(`### ${constant.name}`);
  lines.push('');

  if (constant.doc?.description) {
    lines.push(constant.doc.description);
    lines.push('');
  }

  lines.push(`**File:** \`${constant.filePath}\` (line ${constant.lineNumber})`);
  lines.push('');

  if (constant.type) {
    lines.push(`**Type:** \`${constant.type}\``);
    lines.push('');
  }

  if (constant.value) {
    lines.push('```typescript');
    lines.push(`const ${constant.name} = ${constant.value}`);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Formats a module summary.
 */
export function formatModuleSummary(module: ModuleDefinition): string {
  const lines: string[] = [];
  const badges: string[] = [];

  if (module.isClient) badges.push('`Client`');
  if (module.isServer) badges.push('`Server`');

  lines.push(`### ${module.moduleName}`);
  lines.push('');
  
  if (badges.length > 0) {
    lines.push(badges.join(' '));
    lines.push('');
  }

  if (module.moduleDoc?.description) {
    lines.push(module.moduleDoc.description);
    lines.push('');
  }

  lines.push(`**File:** \`${module.filePath}\``);
  lines.push('');

  // Summary table
  lines.push('| Category | Count |');
  lines.push('|----------|-------|');
  lines.push(`| Components | ${module.components.length} |`);
  lines.push(`| Functions | ${module.functions.length} |`);
  lines.push(`| Types | ${module.types.length} |`);
  lines.push(`| Constants | ${module.constants.length} |`);
  lines.push('');

  if (module.exports.length > 0) {
    lines.push(`**Exports:** ${module.exports.map(e => `\`${e}\``).join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ====================================
// INDEX FORMATTERS
// ====================================

/**
 * Generates a component index as Markdown.
 */
export function formatComponentIndex(output: DocumentationOutput): string {
  const lines: string[] = [];

  lines.push('# Component Index');
  lines.push('');
  lines.push(`_Generated: ${output.meta.generatedAt}_`);
  lines.push('');
  lines.push('| Component | File | Client | Props Type |');
  lines.push('|-----------|------|--------|------------|');

  for (const comp of output.componentIndex) {
    const isClient = comp.isClient ? '✅' : '❌';
    lines.push(`| \`${comp.name}\` | \`${comp.filePath}\` | ${isClient} | \`${comp.propsType || '-'}\` |`);
  }

  return lines.join('\n');
}

/**
 * Generates a function index as Markdown.
 */
export function formatFunctionIndex(output: DocumentationOutput): string {
  const lines: string[] = [];

  lines.push('# Function Index');
  lines.push('');
  lines.push(`_Generated: ${output.meta.generatedAt}_`);
  lines.push('');
  lines.push('| Function | File | Signature |');
  lines.push('|----------|------|-----------|');

  for (const func of output.functionIndex) {
    lines.push(`| \`${func.name}\` | \`${func.filePath}\` | \`${func.signature}\` |`);
  }

  return lines.join('\n');
}

/**
 * Generates a type index as Markdown.
 */
export function formatTypeIndex(output: DocumentationOutput): string {
  const lines: string[] = [];

  lines.push('# Type Index');
  lines.push('');
  lines.push(`_Generated: ${output.meta.generatedAt}_`);
  lines.push('');
  lines.push('| Type | Kind | File |');
  lines.push('|------|------|------|');

  for (const type of output.typeIndex) {
    lines.push(`| \`${type.name}\` | \`${type.kind}\` | \`${type.filePath}\` |`);
  }

  return lines.join('\n');
}

// ====================================
// JSON FORMATTER
// ====================================

/**
 * Formats documentation as JSON.
 */
export function formatAsJson(output: DocumentationOutput): string {
  return JSON.stringify(output, null, 2);
}






