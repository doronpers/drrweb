#!/usr/bin/env node

/**
 * Generate All Documentation
 * 
 * This is the main script that orchestrates all documentation generation tasks.
 * It runs all documentation automation tools and generates a complete documentation set.
 * 
 * Features:
 * - Generates component documentation
 * - Generates API documentation
 * - Validates documentation completeness
 * - Creates a documentation index
 * 
 * Usage: node generate-all-docs.js
 */

const fs = require('fs');
const path = require('path');
const { processComponent, generateMarkdown: generateComponentMarkdown } = require('./extract-component-docs');
const { processDirectory, generateAPIMarkdown } = require('./generate-api-docs');
const { validateDirectory, generateReport } = require('./validate-docs');

/**
 * Configuration for documentation generation
 */
const CONFIG = {
  componentsDir: 'components',
  libDir: 'lib',
  actionsDir: 'actions',
  contextsDir: 'contexts',
  outputDir: 'docs/generated',
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build']
};

/**
 * Ensure output directory exists
 * @param {string} dir - Directory path
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Find all component files recursively
 * @param {string} dir - Directory to search
 * @param {Array} fileList - Accumulated file list
 * @returns {Array} - List of component file paths
 */
function findComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !CONFIG.excludeDirs.includes(file)) {
      findComponentFiles(filePath, fileList);
    } else if (file.match(/\.(tsx|jsx)$/) && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Generate component documentation
 * @returns {string} - Path to generated file
 */
function generateComponentsDocs() {
  console.log('📝 Generating component documentation...');
  
  const componentsPath = path.resolve(CONFIG.componentsDir);
  if (!fs.existsSync(componentsPath)) {
    console.log('   ⚠️  Components directory not found, skipping...');
    return null;
  }
  
  const componentFiles = findComponentFiles(componentsPath);
  let markdown = '# Component Documentation\n\n';
  markdown += `*Auto-generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  markdown += `Total components: ${componentFiles.length}\n\n`;
  markdown += '---\n\n';
  
  componentFiles.forEach(filePath => {
    try {
      const componentInfo = processComponent(filePath);
      markdown += generateComponentMarkdown(componentInfo);
      markdown += '\n---\n\n';
    } catch (error) {
      console.error(`   ⚠️  Error processing ${filePath}: ${error.message}`);
    }
  });
  
  const outputPath = path.join(CONFIG.outputDir, 'COMPONENTS.md');
  ensureDir(CONFIG.outputDir);
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`   ✓ Generated: ${outputPath}`);
  return outputPath;
}

/**
 * Generate API documentation
 * @returns {string} - Path to generated file
 */
function generateAPIDocumentation() {
  console.log('📝 Generating API documentation...');
  
  const dirs = [CONFIG.libDir, CONFIG.actionsDir, CONFIG.contextsDir]
    .map(d => path.resolve(d))
    .filter(d => fs.existsSync(d));
  
  if (dirs.length === 0) {
    console.log('   ⚠️  No API directories found, skipping...');
    return null;
  }
  
  let allResults = {};
  
  dirs.forEach(dir => {
    const results = processDirectory(dir);
    allResults = { ...allResults, ...results };
  });
  
  const markdown = generateAPIMarkdown(allResults);
  const outputPath = path.join(CONFIG.outputDir, 'API.md');
  ensureDir(CONFIG.outputDir);
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`   ✓ Generated: ${outputPath}`);
  return outputPath;
}

/**
 * Generate validation report
 * @returns {string} - Path to generated file
 */
function generateValidationReport() {
  console.log('📝 Validating documentation...');
  
  const results = validateDirectory(process.cwd(), CONFIG.excludeDirs);
  const report = generateReport(results);
  
  const outputPath = path.join(CONFIG.outputDir, 'VALIDATION.md');
  ensureDir(CONFIG.outputDir);
  fs.writeFileSync(outputPath, report);
  
  console.log(`   ✓ Generated: ${outputPath}`);
  
  if (results.length > 0) {
    console.log(`   ⚠️  Found ${results.length} file(s) with documentation issues`);
  } else {
    console.log('   ✓ All files are well documented!');
  }
  
  return outputPath;
}

/**
 * Generate documentation index
 * @param {Array} generatedFiles - List of generated documentation files
 */
function generateIndex(generatedFiles) {
  console.log('📝 Generating documentation index...');
  
  let markdown = '# Documentation Index\n\n';
  markdown += `*Auto-generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  markdown += 'This directory contains auto-generated documentation from the codebase.\n\n';
  markdown += '## Generated Documentation\n\n';
  
  generatedFiles.forEach(file => {
    if (file) {
      const basename = path.basename(file);
      const title = basename.replace('.md', '').replace(/_/g, ' ');
      markdown += `- [${title}](./${basename})\n`;
    }
  });
  
  markdown += '\n## Manual Documentation\n\n';
  markdown += 'For manual documentation, see:\n\n';
  markdown += '- [README.md](../README.md)\n';
  markdown += '- [ARCHITECTURE.md](../ARCHITECTURE.md)\n';
  markdown += '- [PRISM_IMPLEMENTATION.md](../PRISM_IMPLEMENTATION.md)\n';
  markdown += '- [PRISM_FEATURES.md](../PRISM_FEATURES.md)\n';
  
  markdown += '\n## Regenerating Documentation\n\n';
  markdown += 'To regenerate this documentation, run:\n\n';
  markdown += '```bash\n';
  markdown += 'npm run docs:generate\n';
  markdown += '```\n';
  
  const outputPath = path.join(CONFIG.outputDir, 'README.md');
  ensureDir(CONFIG.outputDir);
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`   ✓ Generated: ${outputPath}`);
}

// Main execution
if (require.main === module) {
  console.log('🚀 Starting documentation generation...\n');
  
  try {
    const generatedFiles = [];
    
    // Generate all documentation
    generatedFiles.push(generateComponentsDocs());
    generatedFiles.push(generateAPIDocumentation());
    generatedFiles.push(generateValidationReport());
    
    // Generate index
    generateIndex(generatedFiles);
    
    console.log('\n✅ Documentation generation complete!');
    console.log(`\nGenerated files in: ${CONFIG.outputDir}/`);
  } catch (error) {
    console.error(`\n❌ Error generating documentation: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = {
  generateComponentsDocs,
  generateAPIDocumentation,
  generateValidationReport,
  generateIndex
};
