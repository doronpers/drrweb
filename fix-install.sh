#!/bin/bash
# Fix npm install issues with canary dependencies

echo "🔧 Fixing npm dependency issues..."

# Remove lock file and node_modules
echo "📦 Cleaning old dependencies..."
rm -rf node_modules package-lock.json

# Clear npm cache (optional but helpful)
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Reinstall with fresh lock file
echo "⬇️  Installing dependencies..."
npm install

echo "✅ Done! Try running 'npm run dev' now."
