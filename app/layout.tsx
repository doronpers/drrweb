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
import { Inter, EB_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ViewModeProvider } from '@/contexts/ViewModeContext';

// ====================================
// FONT CONFIGURATION
// ====================================

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
  preload: false, // Load on demand for Author mode
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false, // Load on demand for Lab mode
});

// ====================================
// METADATA
// ====================================

export const metadata: Metadata = {
  title: 'Doron Reizes - Interactive Installation',
  description:
    'Systems architect, sound designer, and educator. An interactive installation exploring the intersection of sound, story, and systems.',
  keywords: [
    'sound design',
    'voice fraud detection',
    'sonotheia',
    'portfolio',
    'interactive installation',
    'doron reizes',
  ],
  authors: [{ name: 'Doron Reizes' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
  },
  openGraph: {
    title: 'Doron Reizes - Interactive Installation',
    description: 'Improving systems, stories, and the people that tell them.',
    type: 'website',
  },
};

// ====================================
// VIEWPORT CONFIGURATION
// ====================================

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        {/* Grain texture overlay - always present */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Main application wrapped in ViewMode context */}
        <ViewModeProvider>{children}</ViewModeProvider>
      </body>
    </html>
  );
}
