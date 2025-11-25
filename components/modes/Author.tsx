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
      <div className="container mx-auto px-8 py-20 max-w-4xl">
        {/* Masthead */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-24 border-b border-author-text/20 pb-12"
        >
          <div className="text-center">
            <h1 className="text-6xl font-light tracking-tight mb-6 text-balance">
              Doron Pers
            </h1>
            <p className="text-xl font-light italic text-author-text/70 text-balance">
              On improving systems, stories, and the people that tell them
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.article
          className="space-y-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Opening Statement */}
          <section className="space-y-6 text-lg leading-loose">
            <p className="first-letter:text-6xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:mt-1">
              My work exists at the intersection of{' '}
              <em className="font-semibold">sound</em>,{' '}
              <em className="font-semibold">story</em>, and{' '}
              <em className="font-semibold">systems</em>. I believe that the most
              compelling ideas emerge not from a single discipline, but from the
              friction and harmony between multiple ways of knowing.
            </p>

            <p>
              Sound taught me about <em>texture</em>—the grain of experience, the
              way information can be felt before it's understood. Literature taught
              me about <em>structure</em>—how meaning is built through pattern,
              repetition, and subversion. Entrepreneurship taught me about{' '}
              <em>systems</em>—how small decisions compound, how culture shapes
              product, how trust is the ultimate currency.
            </p>

            <p>
              These aren't separate practices. They're lenses that refract the same
              questions: <em>How do we make sense? How do we communicate that sense?
              How do we build structures that allow others to make their own?</em>
            </p>
          </section>

          {/* Teaching Philosophy */}
          <motion.section
            className="border-l-4 border-author-accent pl-8 py-4 my-16"
            onMouseEnter={handleHover}
          >
            <h2 className="text-3xl font-light mb-6">On Teaching</h2>
            <div className="space-y-4 text-lg leading-loose">
              <p>
                I teach a university portfolio course, which is really a course in{' '}
                <strong>curation</strong>. Not the social media kind—the curatorial
                kind. My students learn to ask: <em>What is the through-line? What
                is the argument my work is making, even when I'm not speaking?</em>
              </p>

              <p>
                A portfolio is not a container. It's a <em>narrative device</em>. It
                says, "Here is how I see. Here is what I value. Here is the pattern
                beneath the projects."
              </p>

              <p className="italic text-author-text/80">
                The best portfolios don't show everything. They show the right things,
                in the right order, with enough space between them to let the viewer
                draw connections.
              </p>
            </div>
          </motion.section>

          {/* On Sound Design */}
          <motion.section
            className="space-y-6 text-lg leading-loose"
            onMouseEnter={handleHover}
          >
            <h2 className="text-3xl font-light mb-6">On Sound</h2>
            <p>
              Sound is invisible architecture. You can't see it, but it shapes how
              you move through space, how you feel time, what you remember.
            </p>

            <p>
              I work with sound because it operates <em>beneath language</em>. A
              footstep tells you about weight, intention, surface. A room's reverb
              tells you about size, materials, history. A voice tells you
              everything—even what it's trying to hide.
            </p>

            <p>
              At Sonotheia, we're building systems that listen to voices the way a
              sound designer listens: not just for <em>what</em> is said, but for
              the microgestures, the tells, the signatures that can't be faked. It's
              forensic. It's creative. It's both.
            </p>
          </motion.section>

          {/* Micro-Motives Section */}
          <motion.section
            className="bg-author-accent/5 -mx-8 px-8 py-12 my-16"
            onMouseEnter={handleHover}
          >
            <h2 className="text-3xl font-light mb-8 text-center">Micro-Motives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base leading-relaxed">
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
            <h2 className="text-3xl font-light mb-8">Selected Writing</h2>
            <div className="space-y-6">
              <EssayLink
                title="The Pedagogy of Curation"
                date="2024"
                summary="How teaching portfolio construction changed how I think about
                  learning itself."
                onMouseEnter={handleHover}
              />
              <EssayLink
                title="Listening Forensically"
                date="2023"
                summary="What voice fraud detection taught me about trust, technology,
                  and the limits of automation."
                onMouseEnter={handleHover}
              />
              <EssayLink
                title="The Texture of Time"
                date="2023"
                summary="Field recording as a practice of attention. On capturing what
                  can't be photographed."
                onMouseEnter={handleHover}
              />
            </div>
          </section>

          {/* Closing */}
          <section className="text-center text-author-text/60 italic text-lg border-t border-author-text/20 pt-12 mt-20">
            <p>
              If you're interested in conversation—about teaching, sound, startups,
              or the spaces between—reach out. I'm always curious.
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
      <h3 className="font-semibold text-author-accent">{title}</h3>
      <p className="text-author-text/80 italic">{text}</p>
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
      className="block border-l-2 border-author-accent/30 pl-6 py-3 hover:border-author-accent transition-colors"
      whileHover={{ x: 8 }}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-sm text-author-text/50 font-sans">{date}</span>
      </div>
      <p className="text-author-text/70 font-light">{summary}</p>
    </motion.a>
  );
}
