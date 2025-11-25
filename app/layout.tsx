/**
 * ====================================
 * ROOT LAYOUT
 * ====================================
 *
 * The foundational layout for the entire application.
 * Includes:
 * - Font loading (variable fonts)
 * - Global styles
 * - ViewModeProvider (The Prism context)
 * - Grain texture overlay
 */

import type { Metadata } from 'next';
import './globals.css';
import { ViewModeProvider } from '@/contexts/ViewModeContext';

// ====================================
// FONT CONFIGURATION
// ====================================

// Note: Using system fonts as fallback for environments without Google Fonts access
// In production, you can add Google Fonts via <link> tag in <head> or use next/font when network is available

// ====================================
// METADATA
// ====================================

export const metadata: Metadata = {
  title: 'Doron Pers - Interactive Installation',
  description:
    'Systems architect, sound designer, and educator. An interactive installation exploring the intersection of sound, story, and systems.',
  keywords: [
    'sound design',
    'voice fraud detection',
    'sonotheia',
    'portfolio',
    'interactive installation',
    'doron pers',
  ],
  authors: [{ name: 'Doron Pers' }],
  openGraph: {
    title: 'Doron Pers - Interactive Installation',
    description: 'Improving systems, stories, and the people that tell them.',
    type: 'website',
  },
};

// ====================================
// ROOT LAYOUT COMPONENT
// ====================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Add Google Fonts when network is available */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=EB+Garamond:wght@400..800&family=JetBrains+Mono:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Grain texture overlay - always present */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Main application wrapped in ViewMode context */}
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
