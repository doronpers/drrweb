#!/usr/bin/env npx ts-node

/**
 * ====================================
 * DOCUMENTATION SYSTEM - MAIN GENERATOR
 * ====================================
 * 
 * Main entry point for the automated documentation system.
 * Scans the codebase, parses TypeScript/TSX files, and generates
 * comprehensive API documentation.
 * 
 * Usage:
 *   npx ts-node scripts/docs/generate.ts
 *   npm run docs:generate
 * 
 * Output:
 *   docs/generated/API.md        - Full API documentation
 *   docs/generated/COMPONENTS.md - Component index
 *   docs/generated/FUNCTIONS.md  - Function index
 *   docs/generated/TYPES.md      - Type index
 *   docs/generated/api.json      - Machine-readable output
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseModule } from './parser';
import {
  formatFullDocumentation,
  formatComponentIndex,
  formatFunctionIndex,
  formatTypeIndex,
  formatAsJson,
} from './formatter';
import type {
  DocGeneratorConfig,
  DocumentationOutput,
  ModuleDefinition,
} from './types';

// ====================================
// CONFIGURATION
// ====================================

const DEFAULT_CONFIG: DocGeneratorConfig = {
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
  projectDescription: 'Interactive Installation - Personal Website with The Prism Architecture',
};

// ====================================
// FILE DISCOVERY
// ====================================

/**
 * Recursively finds all TypeScript/TSX files in the specified directories.
 */
function discoverFiles(config: DocGeneratorConfig): string[] {
  const files: string[] = [];
  const validExtensions = ['.ts', '.tsx'];

  function walkDir(dir: string): void {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Check exclusions
      if (config.exclude.some(exc => fullPath.includes(exc) || entry.name === exc)) {
        continue;
      }

      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        // Include TypeScript files, exclude test files
        if (validExtensions.includes(ext) && 
            !entry.name.includes('.test.') && 
            !entry.name.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    }
  }

  // Walk each included directory
  for (const includeDir of config.include) {
    const dirPath = path.join(config.rootDir, includeDir);
    walkDir(dirPath);
  }

  return files;
}

// ====================================
// MAIN GENERATOR
// ====================================

/**
 * Main documentation generation function.
 */
async function generateDocumentation(config: DocGeneratorConfig = DEFAULT_CONFIG): Promise<void> {
  console.log('📚 Starting documentation generation...');
  console.log(`   Project: ${config.projectName}`);
  console.log(`   Root: ${config.rootDir}`);
  console.log('');

  // Discover files
  console.log('🔍 Discovering source files...');
  const files = discoverFiles(config);
  console.log(`   Found ${files.length} files to process`);
  console.log('');

  // Parse modules
  console.log('📖 Parsing modules...');
  const modules: ModuleDefinition[] = [];

  for (const file of files) {
    const relativePath = path.relative(config.rootDir, file);
    process.stdout.write(`   Processing: ${relativePath}...`);
    
    const module = parseModule(file);
    if (module) {
      modules.push(module);
      console.log(' ✅');
    } else {
      console.log(' ⚠️ (skipped)');
    }
  }
  console.log('');

  // Build output structure
  console.log('🏗️  Building documentation output...');
  const output: DocumentationOutput = buildOutput(modules, config);
  console.log(`   Components: ${output.meta.totalComponents}`);
  console.log(`   Functions: ${output.meta.totalFunctions}`);
  console.log(`   Types: ${output.meta.totalTypes}`);
  console.log('');

  // Ensure output directory exists
  const outDir = path.join(config.rootDir, config.outDir);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Generate outputs
  console.log('📝 Generating documentation files...');

  if (config.generateMarkdown) {
    // Full API documentation
    const apiMd = formatFullDocumentation(output);
    fs.writeFileSync(path.join(outDir, 'API.md'), apiMd);
    console.log('   ✅ API.md');

    // Component index
    const componentsMd = formatComponentIndex(output);
    fs.writeFileSync(path.join(outDir, 'COMPONENTS.md'), componentsMd);
    console.log('   ✅ COMPONENTS.md');

    // Function index
    const functionsMd = formatFunctionIndex(output);
    fs.writeFileSync(path.join(outDir, 'FUNCTIONS.md'), functionsMd);
    console.log('   ✅ FUNCTIONS.md');

    // Type index
    const typesMd = formatTypeIndex(output);
    fs.writeFileSync(path.join(outDir, 'TYPES.md'), typesMd);
    console.log('   ✅ TYPES.md');
  }

  if (config.generateJson) {
    const json = formatAsJson(output);
    fs.writeFileSync(path.join(outDir, 'api.json'), json);
    console.log('   ✅ api.json');
  }

  console.log('');
  console.log('✨ Documentation generation complete!');
  console.log(`   Output directory: ${config.outDir}`);
}

/**
 * Builds the final documentation output structure.
 */
function buildOutput(modules: ModuleDefinition[], config: DocGeneratorConfig): DocumentationOutput {
  // Build indexes
  const componentIndex = modules.flatMap(m =>
    m.components.map(c => ({
      name: c.name,
      filePath: c.filePath,
      isClient: c.isClient,
      propsType: c.propsType,
    }))
  );

  const functionIndex = modules.flatMap(m =>
    m.functions
      .filter(f => f.exported)
      .map(f => ({
        name: f.name,
        filePath: f.filePath,
        signature: f.signature,
      }))
  );

  const typeIndex = modules.flatMap(m =>
    m.types
      .filter(t => t.exported)
      .map(t => ({
        name: t.name,
        kind: t.kind,
        filePath: t.filePath,
      }))
  );

  // Calculate totals
  const totalComponents = componentIndex.length;
  const totalFunctions = functionIndex.length;
  const totalTypes = typeIndex.length;

  // Read version from package.json
  let version = '1.0.0';
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(config.rootDir, 'package.json'), 'utf-8')
    );
    version = pkg.version || version;
  } catch {
    // Use default version
  }

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      projectName: config.projectName,
      projectDescription: config.projectDescription,
      version,
      totalModules: modules.length,
      totalComponents,
      totalFunctions,
      totalTypes,
    },
    modules,
    componentIndex,
    functionIndex,
    typeIndex,
  };
}

// ====================================
// CLI ENTRY POINT
// ====================================

// Run if called directly
if (require.main === module) {
  generateDocumentation().catch(error => {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  });
}

export { generateDocumentation, DEFAULT_CONFIG };

