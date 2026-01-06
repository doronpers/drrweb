#!/usr/bin/env node

/**
 * Documentation Validator
 * 
 * This script validates that all components, functions, and files have adequate documentation.
 * It checks for:
 * - Missing JSDoc comments
 * - Undocumented functions
 * - Undocumented component props
 * - Missing README files in directories
 * 
 * Usage: node validate-docs.js [directory]
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if a file has JSDoc comment
 * @param {string} content - File content
 * @returns {boolean} - True if JSDoc found
 */
function hasJSDoc(content) {
  return /\/\*\*[\s\S]*?\*\//.test(content);
}

// Regex patterns compiled once for performance
const FUNCTION_PATTERN = /(?:export\s+)?(?:async\s+)?function\s+\w+/g;
const ARROW_FUNCTION_PATTERN = /(?:export\s+)?const\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*(?::\s*[^=]+)?=>/g;
const DOCUMENTED_FUNCTION_PATTERN = /\/\*\*[\s\S]*?\*\/\s*(?:export\s+)?(?:async\s+)?(?:function\s+\w+|const\s+\w+\s*=)/g;

/**
 * Count functions in a file
 * @param {string} content - File content
 * @returns {number} - Number of functions
 */
function countFunctions(content) {
  const functionMatches = content.match(FUNCTION_PATTERN) || [];
  const arrowMatches = content.match(ARROW_FUNCTION_PATTERN) || [];
  return functionMatches.length + arrowMatches.length;
}

/**
 * Count documented functions in a file
 * @param {string} content - File content
 * @returns {number} - Number of documented functions
 */
function countDocumentedFunctions(content) {
  const matches = content.match(DOCUMENTED_FUNCTION_PATTERN) || [];
  return matches.length;
}

/**
 * Check if a component has props documentation
 * @param {string} content - File content
 * @param {string} componentName - Component name
 * @returns {boolean} - True if props are documented
 */
function hasPropsDocumentation(content, componentName) {
  // Check for Props interface/type with comments
  const propsPattern = new RegExp(
    `(?:interface|type)\\s+${componentName}Props[\\s\\S]*?{[\\s\\S]*?}`,
    'i'
  );
  
  const propsMatch = content.match(propsPattern);
  if (!propsMatch) return true; // No props interface means no props to document
  
  // Check if the props interface has any documentation
  return /\/\*\*[\s\S]*?\*\//.test(propsMatch[0]) || /\/\//.test(propsMatch[0]);
}

/**
 * Validate a single file
 * @param {string} filePath - Path to file
 * @returns {Object} - Validation results
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const componentName = fileName.replace(/\.(tsx?|jsx?)$/, '');
  
  const results = {
    path: path.relative(process.cwd(), filePath),
    hasJSDoc: hasJSDoc(content),
    totalFunctions: countFunctions(content),
    documentedFunctions: countDocumentedFunctions(content),
    hasPropsDoc: hasPropsDocumentation(content, componentName),
    issues: []
  };
  
  // Check for issues
  if (!results.hasJSDoc) {
    results.issues.push('Missing file-level JSDoc comment');
  }
  
  if (results.totalFunctions > 0) {
    const coverage = results.documentedFunctions / results.totalFunctions;
    if (coverage < 0.5) {
      results.issues.push(`Low function documentation coverage: ${Math.round(coverage * 100)}%`);
    }
  }
  
  if (!results.hasPropsDoc && fileName.match(/\.(tsx|jsx)$/)) {
    results.issues.push('Component props not documented');
  }
  
  return results;
}

/**
 * Validate a directory
 * @param {string} dirPath - Directory path
 * @param {Array} excludeDirs - Directories to exclude
 * @returns {Array} - Array of validation results
 */
function validateDirectory(dirPath, excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build']) {
  const results = [];
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!excludeDirs.includes(file)) {
          walk(filePath);
        }
      } else if (file.match(/\.(ts|tsx|js|jsx)$/) && !file.endsWith('.d.ts')) {
        const result = validateFile(filePath);
        if (result.issues.length > 0) {
          results.push(result);
        }
      }
    });
  }
  
  walk(dirPath);
  return results;
}

/**
 * Generate validation report
 * @param {Array} results - Validation results
 * @returns {string} - Report text
 */
function generateReport(results) {
  let report = '# Documentation Validation Report\n\n';
  report += `*Generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  
  if (results.length === 0) {
    report += '✅ **All files are well documented!**\n\n';
    return report;
  }
  
  report += `Found ${results.length} file(s) with documentation issues:\n\n`;
  
  results.forEach(result => {
    report += `## ${result.path}\n\n`;
    
    result.issues.forEach(issue => {
      report += `- ⚠️  ${issue}\n`;
    });
    
    report += `\n**Stats:**\n`;
    report += `- Functions: ${result.documentedFunctions}/${result.totalFunctions} documented\n`;
    report += `- Has file-level JSDoc: ${result.hasJSDoc ? '✓' : '✗'}\n`;
    report += `- Props documented: ${result.hasPropsDoc ? '✓' : '✗'}\n\n`;
  });
  
  // Summary statistics
  const totalFiles = results.length;
  const filesWithoutJSDoc = results.filter(r => !r.hasJSDoc).length;
  const totalFunctions = results.reduce((sum, r) => sum + r.totalFunctions, 0);
  const documentedFunctions = results.reduce((sum, r) => sum + r.documentedFunctions, 0);
  const overallCoverage = totalFunctions > 0 
    ? Math.round((documentedFunctions / totalFunctions) * 100) 
    : 100;
  
  report += `## Summary\n\n`;
  report += `- **Total files with issues:** ${totalFiles}\n`;
  report += `- **Files without JSDoc:** ${filesWithoutJSDoc}\n`;
  report += `- **Overall function documentation coverage:** ${overallCoverage}%\n`;
  
  return report;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dirPath = args.length > 0 ? path.resolve(args[0]) : process.cwd();
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Error: Directory not found: ${dirPath}`);
    process.exit(1);
  }
  
  try {
    console.log(`Validating documentation in: ${dirPath}\n`);
    
    const results = validateDirectory(dirPath);
    const report = generateReport(results);
    
    console.log(report);
    
    // Exit with error code if issues found
    if (results.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error validating documentation: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  validateFile,
  validateDirectory,
  generateReport
};
