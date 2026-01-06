import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ====================================
 * ABOUT PAGE
 * ====================================
 *
 * Static page with biographical and professional information.
 * Minimal, fast-loading, and accessible.
 */

export const metadata: Metadata = {
  title: 'About - Doron Reizes',
  description: 'Audio engineer and educator focused on audio authenticity under adversarial conditions.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-8 py-16 md:py-24">
        {/* Back to home link */}
        <nav className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black/90 transition-colors text-sm font-light tracking-wide focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm px-2 py-1"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </nav>

        {/* Main content */}
        <article className="space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-light text-black/90 mb-6 tracking-tight">
              About
            </h1>
          </header>

          <section className="space-y-6 text-black/70 leading-relaxed font-light">
            <p className="text-lg md:text-xl">
              Audio engineer and educator focused on audio authenticity under adversarial conditions.
            </p>

            <p>
              I build and test short-slice evaluation tooling (10–15s) and review workflows that 
              surface uncertainty rather than hide it. My current work involves stress-testing 
              synthetic speech, developing calibrated deferral signals, and creating audit-grade 
              evidence records.
            </p>

            <p>
              With over 20 years of experience spanning sound editorial, post-production, and 
              higher education, I approach audio challenges through both technical rigor and 
              pedagogical clarity.
            </p>

            <p>
              My focus is on developing systems that acknowledge the limits of detection while 
              maintaining high standards for audio authenticity verification.
            </p>
          </section>

          <section className="pt-8 border-t border-black/10">
            <h2 className="text-xl font-light text-black/80 mb-4">Background</h2>
            <ul className="space-y-3 text-black/70 font-light">
              <li>• Audio post-production and sound editorial</li>
              <li>• Higher education teaching (Full Sail University and others)</li>
              <li>• Voice fraud detection and audio authenticity research</li>
              <li>• Sonotheia evaluation frameworks and tooling</li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-light text-black/80 mb-4">Connect</h2>
            <p className="text-black/70 font-light">
              For project inquiries, collaboration opportunities, or speaking engagements, 
              please visit the <Link href="/contact" className="underline underline-offset-4 hover:text-black/90 transition-colors">contact page</Link>.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
