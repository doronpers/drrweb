/**
 * Static Export Configuration for Ionos
 * 
 * Use this config if Ionos only supports static file hosting (no Node.js).
 * 
 * To use:
 * 1. Rename this file to next.config.mjs (backup the original first!)
 * 2. Run: npm run build
 * 3. Upload the 'out' folder contents to Ionos via FTP
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'tone'],
  },
  // Note: Headers are removed because they're not supported in static export
  // Security headers would need to be set at the web server level (Apache/Nginx)
};

export default nextConfig;

