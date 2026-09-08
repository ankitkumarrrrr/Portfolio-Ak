import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const experiences = [
  {
    type: 'work',
    title: 'AI Developer',
    org: 'TheSci SolCielo Innovacion',
    period: 'Dec 2025 — Aug 2026',
    details: [
      'Built scalable Python ETL pipelines to ingest, clean, validate, and store live market data in PostgreSQL',
      'Implemented technical momentum indicators and rule-based scoring logic to generate automated trading signals',
      'Developed backend APIs and integrated them with interactive, user-centric financial dashboards',
      'Worked with real-time data processing and asynchronous workflows to deliver low-latency analytical updates',
    ],
  },
  {
    type: 'hackathon',
    title: 'Top 10 Finalist',
    org: 'Smart India Hackathon (SIH) 2024',
    period: '2024',
    details: [
      'Collaborated in cross-functional team to develop real-world educational solution under competitive timelines',
      'Achieved Top 10 Finalist position among hundreds of participating teams nationwide',
    ],
  },
]

const achievements = [
  { place: '2nd Prize', event: 'AeroVision Drone Project', venue: 'IIT Kanpur' },
  { place: 'Runner-Up', event: 'AeroVision Drone Project', venue: 'IISc Kerala' },
  { place: 'Top 10', event: 'Smart India Hackathon', venue: 'National Level' },
  { place: '3rd Place', event: 'College-Level Hackathon', venue: 'Among 600+ participants' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
}

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="relative py-32 md:py-40">
      <div className="divider mb-32" />
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
            Journey
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mt-4">
            Experience & Achievements
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-surface-light/30" />

            {experiences.map((exp, i) => (
              <motion.div
                key={exp.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-vermilion bg-charcoal" />

                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h3 className="font-display text-lg font-semibold text-cream">
                    {exp.title}
                  </h3>
                  <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40">
                    {exp.period}
                  </span>
                </div>

                <p className="text-sm font-display text-vermilion/80 mb-3 tracking-wide">
                  {exp.org}
                </p>

                <ul className="flex flex-col gap-2">
                  {exp.details.map((d, j) => (
                    <li key={j} className="flex gap-3 text-sm text-cream-dim/60 font-light leading-relaxed">
                      <span className="text-vermilion/40 mt-1.5 shrink-0">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Achievements sidebar */}
          <div>
            <motion.h3
              custom={0.5}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-cream-dim/40 mb-6"
            >
              Awards & Recognition
            </motion.h3>

            <div className="flex flex-col gap-4">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.event}
                  custom={i + 1}
                  variants={fadeUp}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="p-4 border border-surface-light/20 hover:border-vermilion/30 transition-all duration-300 group"
                  data-cursor-hover
                >
                  <span className="font-serif text-xl text-cream font-light block">
                    {a.place}
                  </span>
                  <span className="text-xs text-cream-dim/60 block mt-1">
                    {a.event}
                  </span>
                  <span className="text-[10px] text-cream-dim/30 tracking-wider uppercase mt-1 block">
                    {a.venue}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
