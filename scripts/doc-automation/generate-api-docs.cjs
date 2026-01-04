#!/usr/bin/env node

/**
 * Generate API Documentation
 * 
 * This script automatically generates API documentation for server actions,
 * utilities, and hooks by extracting function signatures, parameters, and JSDoc comments.
 * 
 * Features:
 * - Extracts function documentation from JSDoc comments
 * - Documents function parameters and return types
 * - Generates markdown API reference
 * - Supports TypeScript type annotations
 * 
 * Usage: node generate-api-docs.js <directory>
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract function documentation from file
 * @param {string} content - File content
 * @returns {Array} - Array of function documentation
 */
function extractFunctions(content) {
  const functions = [];
  
  // Match function declarations with JSDoc
  const functionPattern = /\/\*\*\s*\n([^*]|\*(?!\/))*\*\/\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*(<[^>]+>)?\s*\(([^)]*)\)\s*:\s*([^{]+)/gs;
  
  let match;
  while ((match = functionPattern.exec(content)) !== null) {
    const jsDoc = match[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim();
    
    const functionName = match[2];
    const generics = match[3] || '';
    const params = match[4] || '';
    const returnType = match[5] ? match[5].trim() : 'void';
    
    functions.push({
      name: functionName,
      jsDoc,
      generics,
      params: parseParams(params),
      returnType,
      description: extractDescription(jsDoc),
      paramDocs: extractParamDocs(jsDoc),
      returns: extractReturns(jsDoc)
    });
  }
  
  // Also match arrow functions exported as const
  const arrowPattern = /\/\*\*\s*\n([^*]|\*(?!\/))*\*\/\s*export\s+const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*:\s*([^=]+)=>/gs;
  
  while ((match = arrowPattern.exec(content)) !== null) {
    const jsDoc = match[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim();
    
    const functionName = match[2];
    const params = match[3] || '';
    const returnType = match[4] ? match[4].trim() : 'unknown';
    
    functions.push({
      name: functionName,
      jsDoc,
      params: parseParams(params),
      returnType,
      description: extractDescription(jsDoc),
      paramDocs: extractParamDocs(jsDoc),
      returns: extractReturns(jsDoc)
    });
  }
  
  return functions;
}

/**
 * Parse function parameters
 * @param {string} paramsStr - Parameters string
 * @returns {Array} - Array of parameter objects
 */
function parseParams(paramsStr) {
  if (!paramsStr.trim()) return [];
  
  const params = [];
  const paramList = paramsStr.split(',');
  
  paramList.forEach(param => {
    const trimmed = param.trim();
    const match = trimmed.match(/(\w+)(\??)\s*:\s*(.+)/);
    
    if (match) {
      params.push({
        name: match[1],
        optional: !!match[2],
        type: match[3].trim()
      });
    }
  });
  
  return params;
}

/**
 * Extract description from JSDoc
 * @param {string} jsDoc - JSDoc comment
 * @returns {string} - Description
 */
function extractDescription(jsDoc) {
  const lines = jsDoc.split('\n');
  const description = [];
  
  for (const line of lines) {
    if (line.startsWith('@')) break;
    description.push(line);
  }
  
  return description.join('\n').trim();
}

/**
 * Extract parameter documentation from JSDoc
 * @param {string} jsDoc - JSDoc comment
 * @returns {Object} - Parameter documentation map
 */
function extractParamDocs(jsDoc) {
  const paramDocs = {};
  const paramRegex = /@param\s+{([^}]+)}\s+(\w+)\s*-?\s*(.+)/g;
  
  let match;
  while ((match = paramRegex.exec(jsDoc)) !== null) {
    paramDocs[match[2]] = {
      type: match[1],
      description: match[3].trim()
    };
  }
  
  return paramDocs;
}

/**
 * Extract return documentation from JSDoc
 * @param {string} jsDoc - JSDoc comment
 * @returns {string|null} - Return documentation
 */
function extractReturns(jsDoc) {
  const returnMatch = jsDoc.match(/@returns?\s+{([^}]+)}\s*-?\s*(.+)/);
  if (returnMatch) {
    return `${returnMatch[1]} - ${returnMatch[2].trim()}`;
  }
  return null;
}

/**
 * Generate markdown for a function
 * @param {Object} func - Function documentation
 * @returns {string} - Markdown
 */
function generateFunctionMarkdown(func) {
  let md = `### \`${func.name}\`\n\n`;
  
  if (func.description) {
    md += `${func.description}\n\n`;
  }
  
  // Function signature
  const paramStr = func.params
    .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
    .join(', ');
  
  md += `\`\`\`typescript\n`;
  md += `function ${func.name}${func.generics || ''}(${paramStr}): ${func.returnType}\n`;
  md += `\`\`\`\n\n`;
  
  // Parameters
  if (func.params.length > 0) {
    md += `**Parameters:**\n\n`;
    func.params.forEach(param => {
      const doc = func.paramDocs[param.name];
      const description = doc ? doc.description : '';
      md += `- \`${param.name}\` (\`${param.type}\`${param.optional ? ', optional' : ''}) - ${description}\n`;
    });
    md += `\n`;
  }
  
  // Returns
  if (func.returns) {
    md += `**Returns:** ${func.returns}\n\n`;
  }
  
  md += `---\n\n`;
  
  return md;
}

/**
 * Process a directory of files
 * @param {string} dirPath - Directory path
 * @returns {Object} - Map of file paths to function documentation
 */
function processDirectory(dirPath) {
  const results = {};
  
  function walk(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const functions = extractFunctions(content);
        
        if (functions.length > 0) {
          results[path.relative(process.cwd(), filePath)] = functions;
        }
      }
    });
  }
  
  walk(dirPath);
  return results;
}

/**
 * Generate API documentation markdown
 * @param {Object} results - Map of file paths to function documentation
 * @returns {string} - Markdown documentation
 */
function generateAPIMarkdown(results) {
  let md = `# API Documentation\n\n`;
  md += `*Auto-generated on ${new Date().toISOString().split('T')[0]}*\n\n`;
  
  Object.keys(results).sort().forEach(filePath => {
    md += `## ${filePath}\n\n`;
    
    const functions = results[filePath];
    functions.forEach(func => {
      md += generateFunctionMarkdown(func);
    });
  });
  
  return md;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node generate-api-docs.js <directory>');
    process.exit(1);
  }
  
  const dirPath = path.resolve(args[0]);
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Error: Directory not found: ${dirPath}`);
    process.exit(1);
  }
  
  try {
    const results = processDirectory(dirPath);
    const markdown = generateAPIMarkdown(results);
    
    console.log(markdown);
  } catch (error) {
    console.error(`Error generating API docs: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  extractFunctions,
  processDirectory,
  generateAPIMarkdown,
  generateFunctionMarkdown
};
