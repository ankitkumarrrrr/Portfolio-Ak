import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const socials = [
  { label: 'GitHub', href: 'https://github.com/ankitkumarrrrr', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ankit-kumar-860374293', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:ankit176424@gmail.com', icon: 'email' },
]

const socialIcons = {
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="relative py-32 md:py-40">
      <div className="divider mb-32" />
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
              Get in Touch
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-cream mt-4 mb-6">
              Let's Build
              <br />
              <span className="italic text-cream-dim/50">Something Together</span>
            </h2>
            <p className="text-base text-cream-dim/50 font-light leading-relaxed max-w-lg mx-auto">
              Open to internships, collaborations, and interesting conversations.
              Whether it's AI, full-stack, or just hacking something cool — let's talk.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <a
              href="mailto:ankit176424@gmail.com"
              className="magnetic-btn-accent magnetic-btn text-sm"
              data-cursor-hover
            >
              Say Hello
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex justify-center gap-6 mt-12"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-surface-light/30 text-cream-dim/50 hover:text-vermilion hover:border-vermilion/40 transition-all duration-300"
                data-cursor-hover
                aria-label={s.label}
              >
                {socialIcons[s.icon]}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-surface-light/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/30">
            © 2025 Ankit Kumar
          </span>
          <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/20">
            Designed & Built with Precision
          </span>
        </div>
      </div>
    </section>
  )
}
