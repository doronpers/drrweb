#!/usr/bin/env npx ts-node

/**
 * ====================================
 * DOCUMENTATION SYSTEM - WATCHER
 * ====================================
 * 
 * Watches source files for changes and automatically regenerates
 * documentation. Useful during development.
 * 
 * Usage:
 *   npx ts-node scripts/docs/watch.ts
 *   npm run docs:watch
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateDocumentation, DEFAULT_CONFIG } from './generate.js';

// ====================================
// CONFIGURATION
// ====================================

const WATCH_DIRS = ['app', 'components', 'contexts', 'lib', 'actions'];
const DEBOUNCE_MS = 1000;

// ====================================
// WATCHER IMPLEMENTATION
// ====================================

let debounceTimer: NodeJS.Timeout | null = null;
let isGenerating = false;

/**
 * Triggers documentation regeneration with debouncing.
 */
function triggerRegeneration(changedFile: string): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    if (isGenerating) {
      console.log('⏳ Generation already in progress, queuing...');
      return;
    }

    isGenerating = true;
    console.log('');
    console.log(`📝 Change detected: ${changedFile}`);
    console.log('🔄 Regenerating documentation...');
    console.log('');

    try {
      await generateDocumentation(DEFAULT_CONFIG);
    } catch (error) {
      console.error('❌ Generation failed:', error);
    } finally {
      isGenerating = false;
    }
  }, DEBOUNCE_MS);
}

/**
 * Sets up file watchers for the specified directories.
 */
function setupWatchers(): void {
  console.log('👀 Starting documentation watcher...');
  console.log(`   Watching: ${WATCH_DIRS.join(', ')}`);
  console.log('   Press Ctrl+C to stop');
  console.log('');

  for (const dir of WATCH_DIRS) {
    const watchPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(watchPath)) {
      console.log(`   ⚠️  Directory not found: ${dir}`);
      continue;
    }

    try {
      fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        
        // Only watch TypeScript files
        if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) {
          return;
        }

        const fullPath = path.join(dir, filename);
        triggerRegeneration(fullPath);
      });
      
      console.log(`   ✅ Watching: ${dir}`);
    } catch (error) {
      console.error(`   ❌ Failed to watch ${dir}:`, error);
    }
  }

  console.log('');
  console.log('📚 Performing initial documentation generation...');
  console.log('');

  // Initial generation
  generateDocumentation(DEFAULT_CONFIG).catch(error => {
    console.error('❌ Initial generation failed:', error);
  });
}

// ====================================
// ENTRY POINT
// ====================================

if (require.main === module) {
  setupWatchers();

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('');
    console.log('👋 Stopping documentation watcher...');
    process.exit(0);
  });
}

export { setupWatchers };






