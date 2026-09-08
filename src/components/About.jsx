import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 md:py-40">
      <div className="divider mb-32" />
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          {/* Left label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
              About
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mt-4">
              Background
            </h2>
          </motion.div>

          {/* Right content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <p className="text-base md:text-lg text-cream-dim/70 leading-[1.8] font-light">
              I'm a Computer Science and Engineering student at GITAM University, Visakhapatnam,
              currently maintaining a 7.6 CGPA. My work sits at the crossroads of artificial intelligence,
              computer vision, and modern full-stack web development — building systems that are both
              technically rigorous and thoughtfully designed.
            </p>
            <p className="text-base md:text-lg text-cream-dim/70 leading-[1.8] font-light">
              From developing AI-driven trading platforms processing real-time market data to engineering
              computer vision pipelines for gesture recognition, I approach every project with the
              conviction that the best technology feels inevitable — not engineered.
            </p>
            <p className="text-base md:text-lg text-cream-dim/70 leading-[1.8] font-light">
              When I'm not writing code, you'll find me competing in hackathons — where our team placed
              Top 10 at Smart India Hackathon 2024 out of hundreds of national teams, and won 2nd Prize
              at IIT Kanpur for our drone vision project.
            </p>

            {/* Quick facts */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-surface-light/30">
              <div className="flex flex-col">
                <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">
                  Location
                </span>
                <span className="text-sm text-cream/80">Visakhapatnam, India</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">
                  Focus
                </span>
                <span className="text-sm text-cream/80">AI / Full-Stack / CV</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">
                  Email
                </span>
                <a href="mailto:ankit176424@gmail.com" className="text-sm text-cream/80 hover:text-vermilion transition-colors" data-cursor-hover>
                  ankit176424@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
