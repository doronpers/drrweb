'use client';

/**
 * ====================================
 * MODE A: THE ARCHITECT
 * ====================================
 *
 * Utilitarian. Swiss Style. High contrast.
 * For recruiters, business partners, and decision-makers.
 *
 * Design principles:
 * - Structured data over narrative
 * - High information density
 * - Precise typography (sans-serif, varied weights)
 * - Dry, clicky UI sounds
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { audioManager } from '@/lib/audio';

// ====================================
// COMPONENT
// ====================================

export default function Architect() {
  // Play dry click sound on hover for interactive elements
  const handleHover = () => {
    audioManager.playUISound('click-dry');
  };

  useEffect(() => {
    // Mode-specific audio setup could go here
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-architect-bg text-architect-text font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ====================================
          GRID STRUCTURE
          ==================================== */}
      <div className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h1 className="text-5xl font-black tracking-tight mb-2">
            Doron Pers
          </h1>
          <p className="text-xl font-light tracking-wide text-black/60">
            Systems Architect • Sound Designer • Educator
          </p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Core Information */}
          <motion.div
            className="col-span-12 md:col-span-8 space-y-16"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Executive Summary */}
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
                EXECUTIVE SUMMARY
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p className="font-medium">
                  I improve <span className="font-bold">systems</span>,{' '}
                  <span className="font-bold">stories</span>, and the{' '}
                  <span className="font-bold">people</span> that tell them.
                </p>
                <p className="font-light">
                  Multi-domain expertise spanning sound design, technical writing,
                  and entrepreneurship. Currently serving as acting president and
                  chief technologist at Sonotheia.ai (voice fraud detection), while
                  teaching portfolio development at the university level.
                </p>
              </div>
            </section>

            {/* Current Position */}
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
                CURRENT POSITION
              </h2>
              <div className="space-y-6">
                <div
                  className="border-l-4 border-architect-accent pl-6 py-2"
                  onMouseEnter={handleHover}
                >
                  <h3 className="text-xl font-bold">Acting President & CTO</h3>
                  <p className="text-lg font-medium text-black/70">Sonotheia.ai</p>
                  <p className="mt-2 font-light">
                    Leading technical infrastructure for voice fraud detection platform.
                    Responsible for system architecture, product development, and
                    strategic direction.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>Voice AI</Pill>
                    <Pill>Security</Pill>
                    <Pill>Full-Stack Development</Pill>
                  </div>
                </div>

                <div
                  className="border-l-4 border-black/20 pl-6 py-2"
                  onMouseEnter={handleHover}
                >
                  <h3 className="text-xl font-bold">University Instructor</h3>
                  <p className="text-lg font-medium text-black/70">Portfolio Course</p>
                  <p className="mt-2 font-light">
                    Teaching students to construct compelling narratives around their
                    work. Emphasis on synthesis, curation, and presentation.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>Pedagogy</Pill>
                    <Pill>Narrative Design</Pill>
                    <Pill>Professional Development</Pill>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Competencies */}
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">
                CORE COMPETENCIES
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div onMouseEnter={handleHover}>
                  <h3 className="font-bold text-lg mb-2">Sound Design</h3>
                  <ul className="space-y-1 font-light text-black/80">
                    <li>• Field Recording</li>
                    <li>• Synthesis & Processing</li>
                    <li>• Spatial Audio</li>
                    <li>• Music Production</li>
                  </ul>
                </div>
                <div onMouseEnter={handleHover}>
                  <h3 className="font-bold text-lg mb-2">Technical Leadership</h3>
                  <ul className="space-y-1 font-light text-black/80">
                    <li>• System Architecture</li>
                    <li>• Product Strategy</li>
                    <li>• Team Management</li>
                    <li>• Technical Writing</li>
                  </ul>
                </div>
                <div onMouseEnter={handleHover}>
                  <h3 className="font-bold text-lg mb-2">Literature & Writing</h3>
                  <ul className="space-y-1 font-light text-black/80">
                    <li>• Creative Writing</li>
                    <li>• Critical Analysis</li>
                    <li>• Narrative Structure</li>
                    <li>• Editorial Work</li>
                  </ul>
                </div>
                <div onMouseEnter={handleHover}>
                  <h3 className="font-bold text-lg mb-2">Education</h3>
                  <ul className="space-y-1 font-light text-black/80">
                    <li>• Curriculum Design</li>
                    <li>• Workshop Facilitation</li>
                    <li>• Mentorship</li>
                    <li>• Assessment & Feedback</li>
                  </ul>
                </div>
              </div>
            </section>
          </motion.div>

          {/* Right Column - Contact & Quick Actions */}
          <motion.aside
            className="col-span-12 md:col-span-4 space-y-8"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Contact Card */}
            <div className="bg-black text-white p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4">CONTACT</h3>
              <div className="space-y-3 font-light">
                <ContactItem
                  href="https://sonotheia.ai"
                  label="Sonotheia.ai"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="mailto:contact@example.com"
                  label="Email"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="https://linkedin.com"
                  label="LinkedIn"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="https://github.com"
                  label="GitHub"
                  onMouseEnter={handleHover}
                />
              </div>

              {/* CTA */}
              <motion.button
                className="w-full mt-6 py-3 bg-white text-black font-bold tracking-wide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={handleHover}
              >
                DOWNLOAD CV
              </motion.button>
            </div>

            {/* Key Metrics */}
            <div className="border-2 border-black p-6">
              <h3 className="text-xl font-bold mb-4">BY THE NUMBERS</h3>
              <div className="space-y-4">
                <Metric value="10+" label="Years Experience" />
                <Metric value="3" label="Domains Mastered" />
                <Metric value="100+" label="Students Taught" />
                <Metric value="1" label="Startup Led" />
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}

// ====================================
// UTILITY COMPONENTS
// ====================================

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 bg-black/5 text-xs font-medium tracking-wide">
      {children}
    </span>
  );
}

function ContactItem({
  href,
  label,
  onMouseEnter,
}: {
  href: string;
  label: string;
  onMouseEnter?: () => void;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-white/80 transition-colors"
      whileHover={{ x: 4 }}
      onMouseEnter={onMouseEnter}
    >
      → {label}
    </motion.a>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-architect-accent pl-4">
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm font-light mt-1">{label}</div>
    </div>
  );
}
