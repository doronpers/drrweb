'use client';

/**
 * ====================================
 * MODE B: THE AUTHOR
 * ====================================
 *
 * Editorial. Breathable. Serif typography.
 * For explorers, students, and those seeking depth.
 *
 * Design principles:
 * - Essays and narrative over data
 * - High whitespace, generous line-height
 * - Warm, reverberant UI sounds
 * - "Reading experience" over "information density"
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { audioManager } from '@/lib/audio';

// ====================================
// COMPONENT
// ====================================

export default function Author() {
  // Calculate years of experience dynamically (started professionally in 2005)
  const CAREER_START_YEAR = 2005;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - CAREER_START_YEAR;

  // Play warm click sound on hover for interactive elements
  const handleHover = () => {
    audioManager.playUISound('click-warm');
  };

  useEffect(() => {
    // Could adjust ambient audio characteristics for this mode
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-author-bg text-author-text font-serif"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ====================================
          EDITORIAL LAYOUT
          ==================================== */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-4xl">
        {/* Masthead */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12 md:mb-24 border-b border-author-text/15 pb-8 md:pb-12"
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 md:mb-6 text-balance">
              Doron Reizes
            </h1>
            <p className="text-base md:text-lg font-light italic text-author-text/60 text-balance px-4">
              Audio Postproduction Educator & Voice Trust Consultant
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.article
          className="space-y-12 md:space-y-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Opening Statement */}
          <section className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed md:leading-loose">
            <p className="first-letter:text-4xl md:first-letter:text-5xl first-letter:font-normal first-letter:mr-2 first-letter:float-left first-letter:mt-1 first-letter:leading-none">
              My career exists at the intersection of{' '}
              <em className="font-medium not-italic">critical listening</em>,{' '}
              <em className="font-medium not-italic">signal analysis</em>, and{' '}
              <em className="font-medium not-italic">technology translation</em>. The same ear
              trained to detect subtle artifacts in dialogue premixes now informs
              methodologies for identifying synthetic speech.
            </p>

            <p>
              {yearsOfExperience > 20 ? `Over ${yearsOfExperience} years` : 'Twenty years'} spanning NYC&apos;s premier audio facilities—Sony Music Studios,
              Sync Sound—through 18 years shaping curriculum and mentoring students at
              Full Sail University. Now I&apos;m applying that audio expertise to voice fraud
              detection and authentication governance at Sonotheia.
            </p>

            <p>
              This synthesis of creative audio craft and emerging detection technologies
              positions unique value for organizations where voice authenticity carries
              financial, legal, or reputational weight.
            </p>
          </section>

          {/* Teaching Philosophy */}
          <motion.section
            className="border-l-2 border-author-accent/60 pl-4 md:pl-8 py-4 my-8 md:my-16"
            onMouseEnter={handleHover}
          >
            <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6 tracking-wide">On Teaching</h2>
            <div className="space-y-4 text-base md:text-lg leading-relaxed md:leading-loose">
              <p>
                As Course Director for Sound for Film Portfolio at Full Sail University,
                I direct capstone portfolio development for Recording Arts students.
                My role involves mentoring demo reel creation, professional presence
                strategy, and personal branding. Previously, I served as Course Director
                for Interactive Audio (2007–2015), co-authoring the program textbook
                and establishing curriculum for sound design in emerging media formats.
              </p>

              <p>
                A portfolio is not a container. It&apos;s a <em>narrative device</em>. It
                says, &quot;Here is how I see. Here is what I value. Here is the pattern
                beneath the projects.&quot;
              </p>

              <p className="italic text-author-text/70">
                The best portfolios don&apos;t show everything. They show the right things,
                in the right order, with enough space between them to let the viewer
                draw connections.
              </p>
            </div>
          </motion.section>

          {/* On Sound Design */}
          <motion.section
            className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed md:leading-loose"
            onMouseEnter={handleHover}
          >
            <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6 tracking-wide">On Sound</h2>
            <p>
              Sound is invisible architecture. You can&apos;t see it, but it shapes how
              you move through space, how you feel time, what you remember.
            </p>

            <p>
              I work with sound because it operates <em>beneath language</em>. A
              footstep tells you about weight, intention, surface. A room&apos;s reverb
              tells you about size, materials, history. A voice tells you
              everything—even what it&apos;s trying to hide.
            </p>

            <p>
              At Sonotheia, we&apos;re developing vendor-agnostic detection methodologies
              combining physics-based anomaly testing with human-in-the-loop verification.
              We listen to voices the way a sound designer listens: not just for{' '}
              <em>what</em> is said, but for the microgestures, the tells, the signatures
              that can&apos;t be faked. Our work serves finance, legal, media, and real
              estate sectors where voice authenticity carries financial, legal, or
              reputational weight.
            </p>
          </motion.section>

          {/* Micro-Motives Section */}
          <motion.section
            className="bg-author-accent/5 -mx-4 md:-mx-8 px-4 md:px-8 py-8 md:py-12 my-8 md:my-16"
            onMouseEnter={handleHover}
          >
            <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-center tracking-wide">Micro-Motives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm md:text-base leading-relaxed">
              <MicroMotive
                title="On Failure"
                text="Every good project has at least three abandoned versions that nobody sees. That's not failure—that's fluency."
              />
              <MicroMotive
                title="On Tools"
                text="Master your tools, but don't mistake the tool for the work. The work is always about the human on the other side."
              />
              <MicroMotive
                title="On Listening"
                text="Listening is not waiting for your turn to speak. It's creating space for something unexpected to emerge."
              />
              <MicroMotive
                title="On Systems"
                text="A good system is opinionated but not brittle. It guides without constraining. It scales by staying simple."
              />
            </div>
          </motion.section>

          {/* Essays Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 tracking-wide">Selected Writing</h2>
            <div className="space-y-6">
              <EssayLink
                title="Practical Exercises for Critical Listening"
                date="Publication"
                summary="Methods for developing the discerning ear essential to
                  audio post-production and quality control."
                onMouseEnter={handleHover}
              />
              <EssayLink
                title="Interactive Audio"
                date="Publication"
                summary="Co-authored textbook establishing curriculum for sound design
                  in emerging media formats."
                onMouseEnter={handleHover}
              />
              <EssayLink
                title="Sound Design and Music: Diluting the Distinctions"
                date="Publication"
                summary="Exploring the boundaries between disciplines and strengthening
                  the art form."
                onMouseEnter={handleHover}
              />
            </div>
          </section>

          {/* Background */}
          <motion.section
            className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed md:leading-loose border-t border-author-text/15 pt-8 md:pt-12 mt-12 md:mt-16"
            onMouseEnter={handleHover}
          >
            <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6 tracking-wide">Background</h2>
            <p>
              My path has been anything but linear. From NYC&apos;s premier audio
              facilities—Sony Music Studios, Sync Sound—where I contributed to an
              Emmy Award-winning project, through 18 years shaping curriculum at
              Full Sail University. I&apos;ve premixed dialogue, edited sound effects,
              and helped shape how a generation of audio professionals think about
              their craft.
            </p>
            <p>
              Each domain has taught me something the others couldn&apos;t. Sound taught
              me to listen—really listen—to what&apos;s beneath the surface. Higher
              education taught me that the best learning happens when you help someone
              see what they already know, just from a new angle. Now at Sonotheia,
              I&apos;m applying that trained ear to the emerging challenge of voice
              authenticity in an age of synthetic media.
            </p>
          </motion.section>

          {/* Closing */}
          <section className="text-center text-author-text/50 italic text-sm md:text-base border-t border-author-text/15 pt-8 md:pt-12 mt-12 md:mt-20">
            <p>
              If you're interested in conversation—about teaching, sound, startups,
              or the spaces between—reach out. I'm always curious.
            </p>
            <p className="mt-4 text-sm not-italic">
              <a
                href="https://www.linkedin.com/in/doronreizes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-author-accent/80 hover:text-author-accent hover:underline transition-colors"
              >
                Connect on LinkedIn
              </a>
            </p>
          </section>
        </motion.article>
      </div>
    </motion.div>
  );
}

// ====================================
// UTILITY COMPONENTS
// ====================================

function MicroMotive({ title, text }: { title: string; text: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-author-accent/90 text-sm">{title}</h3>
      <p className="text-author-text/70 italic">{text}</p>
    </div>
  );
}

function EssayLink({
  title,
  date,
  summary,
  onMouseEnter,
}: {
  title: string;
  date: string;
  summary: string;
  onMouseEnter?: () => void;
}) {
  return (
    <motion.a
      href="#"
      className="block border-l border-author-accent/30 pl-4 md:pl-6 py-3 hover:border-author-accent/60 transition-colors"
      whileHover={{ x: 6 }}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 gap-1">
        <h3 className="text-base md:text-lg font-medium">{title}</h3>
        <span className="text-xs text-author-text/40 font-sans">{date}</span>
      </div>
      <p className="text-sm text-author-text/60">{summary}</p>
    </motion.a>
  );
}
