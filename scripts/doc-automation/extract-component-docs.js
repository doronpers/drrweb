#!/usr/bin/env node

/**
 * Component Documentation Extractor
 * 
 * This script automatically extracts documentation from React/TypeScript components
 * by analyzing JSDoc comments, TypeScript types, and component structure.
 * 
 * Features:
 * - Extracts component descriptions from JSDoc comments
 * - Documents props with types and descriptions
 * - Identifies component dependencies and imports
 * - Generates markdown documentation
 * 
 * Usage: node extract-component-docs.js <component-path>
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract JSDoc comment from a file
 * @param {string} content - File content
 * @returns {string|null} - Extracted JSDoc comment or null
 */
function extractJSDoc(content) {
  const jsDocRegex = /\/\*\*\s*\n([^*]|\*(?!\/))*\*\//g;
  const matches = content.match(jsDocRegex);
  if (matches && matches.length > 0) {
    return matches[0]
      .replace(/^\/\*\*\s*\n?/, '')
      .replace(/\s*\*\/$/, '')
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim();
  }
  return null;
}

/**
 * Extract component name from file path
 * @param {string} filePath - Path to component file
 * @returns {string} - Component name
 */
function extractComponentName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Extract props interface from TypeScript content
 * @param {string} content - File content
 * @param {string} componentName - Name of the component
 * @returns {Array} - Array of prop definitions
 */
function extractProps(content, componentName) {
  const props = [];
  
  // Look for interface or type definitions
  const interfaceRegex = new RegExp(
    `(?:interface|type)\\s+${componentName}Props\\s*(?:=\\s*)?{([^}]*)}`,
    's'
  );
  
  const match = content.match(interfaceRegex);
  if (match) {
    const propsContent = match[1];
    const propLines = propsContent.split('\n').filter(line => line.trim());
    
    propLines.forEach(line => {
      // Match prop name, type, and optional comment
      const propMatch = line.match(/(\w+)(\??)\s*:\s*([^;\/]+)(?:\/\/\s*(.+))?/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          required: !propMatch[2],
          type: propMatch[3].trim(),
          description: propMatch[4] ? propMatch[4].trim() : ''
        });
      }
    });
  }
  
  return props;
}

/**
 * Extract imports from file
 * @param {string} content - File content
 * @returns {Array} - Array of import statements
 */
function extractImports(content) {
  const imports = [];
  const importRegex = /import\s+(?:{[^}]+}|[\w]+)\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Only include local imports (not node_modules)
    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
      imports.push(importPath);
    }
  }
  
  return imports;
}

/**
 * Extract hooks used in the component
 * @param {string} content - File content
 * @returns {Array} - Array of hook names
 */
function extractHooks(content) {
  const hooks = new Set();
  const hookRegex = /\buse[A-Z]\w+/g;
  
  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    hooks.add(match[0]);
  }
  
  return Array.from(hooks);
}

/**
 * Generate markdown documentation for a component
 * @param {Object} componentInfo - Component information
 * @returns {string} - Markdown documentation
 */
function generateMarkdown(componentInfo) {
  let markdown = `# ${componentInfo.name}\n\n`;
  
  if (componentInfo.description) {
    markdown += `${componentInfo.description}\n\n`;
  }
  
  markdown += `**File:** \`${componentInfo.filePath}\`\n\n`;
  
  if (componentInfo.props && componentInfo.props.length > 0) {
    markdown += `## Props\n\n`;
    markdown += `| Prop | Type | Required | Description |\n`;
    markdown += `|------|------|----------|-------------|\n`;
    
    componentInfo.props.forEach(prop => {
      markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? '✓' : ''} | ${prop.description} |\n`;
    });
    
    markdown += `\n`;
  }
  
  if (componentInfo.hooks && componentInfo.hooks.length > 0) {
    markdown += `## Hooks Used\n\n`;
    componentInfo.hooks.forEach(hook => {
      markdown += `- \`${hook}\`\n`;
    });
    markdown += `\n`;
  }
  
  if (componentInfo.dependencies && componentInfo.dependencies.length > 0) {
    markdown += `## Dependencies\n\n`;
    componentInfo.dependencies.forEach(dep => {
      markdown += `- \`${dep}\`\n`;
    });
    markdown += `\n`;
  }
  
  return markdown;
}

/**
 * Process a single component file
 * @param {string} filePath - Path to component file
 * @returns {Object} - Component information
 */
function processComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = extractComponentName(filePath);
  
  const componentInfo = {
    name: componentName,
    filePath: path.relative(process.cwd(), filePath),
    description: extractJSDoc(content),
    props: extractProps(content, componentName),
    hooks: extractHooks(content),
    dependencies: extractImports(content)
  };
  
  return componentInfo;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node extract-component-docs.js <component-path>');
    process.exit(1);
  }
  
  const componentPath = path.resolve(args[0]);
  
  if (!fs.existsSync(componentPath)) {
    console.error(`Error: File not found: ${componentPath}`);
    process.exit(1);
  }
  
  try {
    const componentInfo = processComponent(componentPath);
    const markdown = generateMarkdown(componentInfo);
    
    console.log(markdown);
  } catch (error) {
    console.error(`Error processing component: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  processComponent,
  generateMarkdown,
  extractJSDoc,
  extractProps,
  extractImports,
  extractHooks
};
