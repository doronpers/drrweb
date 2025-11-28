'use client';

/**
 * ====================================
 * MODE A: THE ARCHITECT (REFACTORED)
 * ====================================
 *
 * Utilitarian. Swiss Style. High contrast.
 * For recruiters, business partners, and decision-makers.
 *
 * REFACTORING HIGHLIGHTS:
 * - Centralized typography via getTypography()
 * - Layout animations for morphing content
 * - CSS transitions for colors (more performant)
 * - Cleaner component structure
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { audioManager } from '@/lib/audio';
import { getTypography, animations, transitions } from '@/lib/styles';

// ====================================
// COMPONENT
// ====================================

export default function Architect() {
  const styles = getTypography('architect');

  // Play dry click sound on hover for interactive elements
  const handleHover = () => {
    audioManager.playUISound('click-dry');
  };

  useEffect(() => {
    // Mode-specific setup
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <motion.div
      layout // HYBRID: Layout animations for container
      className={`min-h-screen transition-colors duration-700 ${styles.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transitions.smooth}
    >
      {/* ====================================
          GRID STRUCTURE WITH LAYOUT ANIMATIONS
          ==================================== */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-6xl">
        {/* Header with layout="position" for smooth repositioning */}
        <motion.header
          layout="position"
          initial={animations.fadeInUp.initial}
          animate={animations.fadeInUp.animate}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="mb-12 md:mb-20"
        >
          <motion.h1 layout="position" className={styles.h1}>
            Doron Reizes
          </motion.h1>
          <motion.p
            layout="position"
            className={`${styles.p} text-black/60 mt-2`}
          >
            Audio Postproduction Educator • Voice Trust Consultant
          </motion.p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Core Information */}
          <motion.div
            layout
            className="col-span-12 md:col-span-8 space-y-12 md:space-y-16"
            variants={animations.staggerContainer}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            {/* Executive Summary */}
            <Section title="EXECUTIVE SUMMARY" onHover={handleHover}>
              <motion.div
                layout="position"
                className="space-y-4 leading-relaxed"
                variants={animations.staggerItem}
              >
                <p className={`${styles.p} font-medium`}>
                  I improve <span className="font-bold">systems</span>,{' '}
                  <span className="font-bold">stories</span>, and the{' '}
                  <span className="font-bold">people</span> that tell them.
                </p>
                <p className={styles.p}>
                  Seasoned audio professional with 20+ years spanning sound editorial,
                  post-production, and higher education. Career trajectory moves from
                  NYC&apos;s premier audio facilities through 18 years shaping curriculum
                  at Full Sail University, to founding Sonotheia—a venture applying
                  audio expertise to voice fraud detection and authentication governance.
                </p>
              </motion.div>
            </Section>

            {/* Current Position */}
            <Section title="CURRENT POSITION" onHover={handleHover}>
              <motion.div layout className="space-y-6">
                <Position
                  title="President & Co-Founder"
                  company="Sonotheia, Inc."
                  description="Voice fraud prevention and audio authentication consultancy serving finance, legal, media, and real estate sectors. Developing vendor-agnostic detection methodologies combining physics-based anomaly testing with human-in-the-loop verification and legally defensible governance frameworks. Co-founded with Alexander Forostenko (CEO, ex-Morgan Stanley/SVB/RBS)."
                  tags={['Voice Fraud Detection', 'Audio Authentication', 'Governance Frameworks', 'Physics-Based Analysis']}
                  highlight
                  onHover={handleHover}
                />

                <Position
                  title="Course Director, Sound for Film Portfolio"
                  company="Full Sail University"
                  description="Direct capstone portfolio development for Recording Arts students. Mentor demo reel creation, professional presence strategy, and personal branding. Previously served as Course Director for Interactive Audio (2007–2015), co-authoring the program textbook and establishing curriculum for sound design in emerging media formats."
                  tags={['Higher Education', 'Curriculum Design', 'Audio Post-Production', 'Portfolio Development']}
                  onHover={handleHover}
                />
              </motion.div>
            </Section>

            {/* Professional Experience */}
            <Section title="PROFESSIONAL EXPERIENCE" onHover={handleHover}>
              <motion.div layout className="space-y-6">
                <Position
                  title="Audio Engineer / Sound Editor"
                  company="Sony Music Studios, NYC"
                  description="Premixed and edited sound effects, dialogue, and music for long-format programming. Contributed to Emmy Award-winning project Tony Bennett: An American Classic (Outstanding Sound Mixing for a Variety, Music Series, or Special, 2006–2007)."
                  tags={['Sound Editorial', 'Dialogue Editing', 'Emmy Award', 'Long-Format']}
                  onHover={handleHover}
                />
                <Position
                  title="Co-Founder & Managing Partner"
                  company="Touch Interactive Media Group"
                  description="Media consulting group serving clients including Brighthouse Networks and Enlightened Grain Spirits. Pivoted from production to advisory services based on regional market needs."
                  tags={['Media Consulting', 'Client Services', 'Strategic Advisory']}
                  onHover={handleHover}
                />
              </motion.div>
            </Section>

            {/* Core Competencies */}
            <Section title="CORE COMPETENCIES" onHover={handleHover}>
              <motion.div layout className="grid grid-cols-2 gap-6">
                <CompetencyCard
                  title="Audio Production"
                  items={[
                    'Pro Tools (Expert)',
                    'iZotope RX Suite',
                    'Dialogue Editing & Sound Design',
                    'Re-recording Mixing & ADR',
                    'Dolby Atmos',
                  ]}
                  onHover={handleHover}
                />
                <CompetencyCard
                  title="Technical Leadership"
                  items={[
                    'System Architecture & Design',
                    'Product Strategy & Roadmapping',
                    'Team Leadership & Management',
                    'Technical Writing & Documentation',
                    'Agile & Scrum Methodologies',
                  ]}
                  onHover={handleHover}
                />
                <CompetencyCard
                  title="Emerging Technologies"
                  items={[
                    'Python (Active Development)',
                    'Machine Learning Fundamentals',
                    'Audio Deepfake Detection',
                    'Physics-Based Signal Analysis',
                    'AI Platforms (Claude, OpenAI)',
                  ]}
                  onHover={handleHover}
                />
                <CompetencyCard
                  title="Education & Communication"
                  items={[
                    'Curriculum Design & Development',
                    'Workshop Facilitation',
                    'Mentorship & Coaching',
                    'Public Speaking & Presentation',
                    'Critical Analysis & Writing',
                  ]}
                  onHover={handleHover}
                />
              </motion.div>
            </Section>

            {/* Education */}
            <Section title="EDUCATION" onHover={handleHover}>
              <motion.div layout className="space-y-4">
                <motion.div
                  layout
                  className="border-l-4 border-architect-accent pl-6 py-2"
                >
                  <motion.h3 layout="position" className={styles.h3}>
                    MS, Innovation & Entrepreneurship
                  </motion.h3>
                  <motion.p
                    layout="position"
                    className={`${styles.p} text-black/70 font-medium mt-1`}
                  >
                    Full Sail University | 2020 | GPA: 4.0, Valedictorian
                  </motion.p>
                </motion.div>
                <motion.div
                  layout
                  className="border-l-4 border-black/20 pl-6 py-2"
                >
                  <motion.h3 layout="position" className={styles.h3}>
                    Specialized AS, Recording Arts
                  </motion.h3>
                  <motion.p
                    layout="position"
                    className={`${styles.p} text-black/70 font-medium mt-1`}
                  >
                    Full Sail University | 2004
                  </motion.p>
                </motion.div>
                <motion.div
                  layout
                  className="border-l-4 border-black/20 pl-6 py-2"
                >
                  <motion.h3 layout="position" className={styles.h3}>
                    BA, Literature & Creative Writing
                  </motion.h3>
                  <motion.p
                    layout="position"
                    className={`${styles.p} text-black/70 font-medium mt-1`}
                  >
                    American University | 2003
                  </motion.p>
                </motion.div>
              </motion.div>
            </Section>
          </motion.div>

          {/* Right Column - Contact & Quick Actions */}
          <motion.aside
            layout
            className="col-span-12 md:col-span-4 space-y-6 md:space-y-8"
            initial={animations.fadeInLeft.initial}
            animate={animations.fadeInLeft.animate}
            transition={{ ...transitions.smooth, delay: 0.4 }}
          >
            {/* Contact Card */}
            <motion.div
              layout
              className="bg-black text-white p-4 md:p-6 md:sticky md:top-20 z-40 transition-colors duration-500"
            >
              <h3 className="text-xl font-bold mb-4">CONTACT</h3>
              <motion.div layout className="space-y-3 font-light">
                <ContactItem
                  href="https://sonotheia.ai"
                  label="Sonotheia"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="mailto:doron@doronreizes.com"
                  label="Email"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="https://www.linkedin.com/in/doronreizes"
                  label="LinkedIn"
                  onMouseEnter={handleHover}
                />
                <ContactItem
                  href="https://github.com"
                  label="GitHub"
                  onMouseEnter={handleHover}
                />
              </motion.div>

              {/* CTA */}
              <motion.button
                layout="position"
                className="w-full mt-6 py-3 bg-white text-black font-bold tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={handleHover}
              >
                DOWNLOAD CV
              </motion.button>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              layout
              className="border-2 border-black p-4 md:p-6 transition-colors duration-500"
            >
              <h3 className="text-xl font-bold mb-4">BY THE NUMBERS</h3>
              <motion.div layout className="space-y-4">
                <Metric value="20+" label="Years Experience" />
                <Metric value="18" label="Years Teaching" />
                <Metric value="1" label="Emmy Recognition" />
                <Metric value="1" label="Startup Founded" />
              </motion.div>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </motion.div>
  );
}

// ====================================
// SUB-COMPONENTS WITH LAYOUT ANIMATIONS
// ====================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onHover?: () => void;
}

function Section({ title, children, onHover }: SectionProps) {
  const styles = getTypography('architect');

  return (
    <motion.section layout onMouseEnter={onHover}>
      <motion.h2
        layout="position"
        className={`${styles.h2} border-b-2 border-black pb-2 mb-6 transition-colors duration-300`}
      >
        {title}
      </motion.h2>
      {children}
    </motion.section>
  );
}

interface PositionProps {
  title: string;
  company: string;
  description: string;
  tags: string[];
  highlight?: boolean;
  onHover?: () => void;
}

function Position({
  title,
  company,
  description,
  tags,
  highlight,
  onHover,
}: PositionProps) {
  const styles = getTypography('architect');

  return (
    <motion.div
      layout
      className={`border-l-4 pl-6 py-2 transition-all duration-300 ${
        highlight ? 'border-architect-accent' : 'border-black/20'
      }`}
      whileHover={{ x: 4 }}
      onMouseEnter={onHover}
    >
      <motion.h3 layout="position" className={styles.h3}>
        {title}
      </motion.h3>
      <motion.p
        layout="position"
        className={`${styles.p} text-black/70 font-medium mt-1`}
      >
        {company}
      </motion.p>
      <motion.p layout="position" className={`${styles.p} mt-2`}>
        {description}
      </motion.p>
      <motion.div layout className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface CompetencyCardProps {
  title: string;
  items: string[];
  onHover?: () => void;
}

function CompetencyCard({ title, items, onHover }: CompetencyCardProps) {
  const styles = getTypography('architect');

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      transition={transitions.spring}
      onMouseEnter={onHover}
    >
      <motion.h3 layout="position" className={`${styles.h3} mb-2`}>
        {title}
      </motion.h3>
      <motion.ul layout className={`space-y-1 ${styles.p} text-black/80`}>
        {items.map((item) => (
          <motion.li key={item} layout="position">
            • {item}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      layout
      className="px-3 py-1 bg-black/5 text-xs font-medium tracking-wide transition-colors duration-300 hover:bg-black/10"
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  );
}

interface ContactItemProps {
  href: string;
  label: string;
  onMouseEnter?: () => void;
}

function ContactItem({ href, label, onMouseEnter }: ContactItemProps) {
  return (
    <motion.a
      layout="position"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-white/80 transition-colors duration-200"
      whileHover={{ x: 4 }}
      onMouseEnter={onMouseEnter}
    >
      → {label}
    </motion.a>
  );
}

interface MetricProps {
  value: string;
  label: string;
}

function Metric({ value, label }: MetricProps) {
  return (
    <motion.div
      layout
      className="border-l-2 border-architect-accent pl-4 transition-colors duration-300"
    >
      <motion.div layout="position" className="text-3xl font-black">
        {value}
      </motion.div>
      <motion.div layout="position" className="text-sm font-light mt-1">
        {label}
      </motion.div>
    </motion.div>
  );
}
