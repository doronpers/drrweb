import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ====================================
 * CONTACT PAGE
 * ====================================
 *
 * Static contact page with email and professional links.
 * Minimal, fast-loading, and accessible.
 */

export const metadata: Metadata = {
  title: 'Contact - Doron Reizes',
  description: 'Get in touch for project inquiries, collaboration opportunities, or speaking engagements.',
};

export default function ContactPage() {
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
              Contact
            </h1>
          </header>

          <section className="space-y-6 text-black/70 leading-relaxed font-light">
            <p className="text-lg md:text-xl">
              I'm open to project inquiries, collaboration opportunities, and speaking engagements.
            </p>

            <div className="pt-4 space-y-4">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-black/50 mb-2">Email</h2>
                <a 
                  href="mailto:doron@doronreizes.com"
                  className="text-lg md:text-xl text-black/70 hover:text-black/90 underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm"
                >
                  doron@doronreizes.com
                </a>
              </div>

              <div className="pt-6">
                <h2 className="text-sm uppercase tracking-widest text-black/50 mb-3">Links</h2>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://github.com/doronpers/sonotheia-examples"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/70 hover:text-black/90 underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm"
                    >
                      GitHub: Sonotheia Examples
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.linkedin.com/in/doronreizes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/70 hover:text-black/90 underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-sm"
                    >
                      LinkedIn Profile
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-black/10 space-y-4 text-sm text-black/60 font-light">
            <p>
              <strong className="font-normal text-black/70">Response time:</strong> I typically respond within 2-3 business days.
            </p>
            <p>
              <strong className="font-normal text-black/70">Topics of interest:</strong> Audio authenticity, 
              voice fraud detection, synthetic speech evaluation, educational consulting, 
              and speaking engagements.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
