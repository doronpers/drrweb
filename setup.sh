#!/bin/bash
# Setup script to fix npm registry issues

echo "🔧 Fixing npm registry configuration..."

# Unset the problematic environment variable
unset NPM_CONFIG_REGISTRY

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Remove existing node_modules and lock file
echo "🗑️  Removing existing dependencies..."
rm -rf node_modules package-lock.json

# Install with explicit registry
echo "📦 Installing dependencies..."
npm install --registry=https://registry.npmjs.org/

echo "✅ Setup complete!"
echo ""
echo "To run the development server: npm run dev"
echo "To build for production: npm run build"

