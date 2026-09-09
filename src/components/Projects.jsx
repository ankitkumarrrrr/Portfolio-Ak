import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// Lazy-load 3D scenes for performance
const ChessScene = lazy(() =>
  import('./ProjectScenes').then((m) => ({ default: m.ChessScene }))
)
const JobSwipeScene = lazy(() =>
  import('./ProjectScenes').then((m) => ({ default: m.JobSwipeScene }))
)
const IntelliExScene = lazy(() =>
  import('./ProjectScenes').then((m) => ({ default: m.IntelliExScene }))
)
const GestureSenseScene = lazy(() =>
  import('./ProjectScenes').then((m) => ({ default: m.GestureSenseScene }))
)

const scenes = {
  'JobSwipe AI': JobSwipeScene,
  IntelliEx: IntelliExScene,
  'Chess.ai': ChessScene,
  GestureSense: GestureSenseScene,
}

/** True on touch/coarse-pointer devices (phones, tablets) */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return isTouch
}

const projects = [
  {
    title: 'JobSwipe AI',
    subtitle: 'AI-Powered Job Automation',
    description:
      'A Tinder-style job application platform that parses resumes via Google Gemini, scrapes live listings from Remotive and HackerNews, locates recruiter emails, and sends personalized outreach — all automated.',
    tech: ['Next.js', 'React', 'Prisma', 'PostgreSQL', 'Google Gemini API', 'Razorpay'],
    live: '#',
    github: 'https://github.com/ankitkumarrrrr/jobswipe-ai',
    accent: true,
  },
  {
    title: 'IntelliEx',
    subtitle: 'AI Financial Trading Platform',
    description:
      'Built scalable Python ETL pipelines to ingest and validate live market data in PostgreSQL. Implemented technical momentum indicators and rule-based scoring logic to generate automated trading signals, backed by interactive financial dashboards.',
    tech: ['Python', 'PostgreSQL', 'REST APIs', 'Financial Dashboards'],
    live: '#',
    github: 'https://github.com/ankitkumarrrrr',
  },
  {
    title: 'Chess.ai',
    subtitle: 'Intelligent Game Engine',
    description:
      'A fully functional chess engine with human-vs-AI gameplay. Implemented Minimax search with Alpha-Beta pruning alongside a greedy evaluation function for intelligent move selection, with an interactive web-based interface.',
    tech: ['Python', 'Pygame', 'Minimax', 'Alpha-Beta Pruning'],
    live: 'https://chess-master-ai-delta.vercel.app',
    github: 'https://github.com/ankitkumarrrrr/Chess.ai',
  },
  {
    title: 'GestureSense',
    subtitle: 'Computer Vision System',
    description:
      'Real-time hand gesture recognition using camera-based interaction. OpenCV-powered detection pipeline that classifies gestures with corresponding text output, built to handle varying lighting conditions.',
    tech: ['Python', 'OpenCV', 'Computer Vision', 'Image Processing'],
    live: '#',
    github: 'https://github.com/ankitkumarrrrr',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.12,
    },
  }),
}

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-4 h-4 border border-vermilion/40 border-t-vermilion rounded-full animate-spin" />
    </div>
  )
}

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isTouch = useIsTouch()
  // Desktop: hover reveals the scene. Touch: tap toggles it.
  const active = isTouch ? isExpanded : isHovered
  const isLarge = index === 0 || index === 3
  const SceneComponent = scenes[project.title]

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`group relative ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
      data-cursor-hover
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => !isTouch && setIsHovered(false)}
    >
      <div className="relative h-full border border-surface-light/30 bg-surface/20 backdrop-blur-sm transition-all duration-500 hover:border-cream/20 hover:bg-surface/40 overflow-hidden">
        {/* ── 3D Scene Area ── */}
        <div
          className="relative w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: active ? '260px' : '140px' }}
          onClick={isTouch ? () => setIsExpanded((v) => !v) : undefined}
          role={isTouch ? 'button' : undefined}
          aria-expanded={isTouch ? isExpanded : undefined}
          aria-label={isTouch ? 'Toggle 3D preview' : undefined}
        >
          {/* Gradient overlay that fades when active */}
          <div
            className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
            style={{
              background: active
                ? 'linear-gradient(to bottom, transparent 60%, rgba(10,10,11,0.3) 100%)'
                : 'linear-gradient(to bottom, transparent 30%, rgba(10,10,11,0.85) 100%)',
            }}
          />

          {/* Subtle grid lines behind scene */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(232,230,227,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,230,227,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Three.js Canvas */}
          <div className="absolute inset-0 z-[1]">
            <ErrorBoundary fallback={null}>
              <Suspense fallback={<SceneFallback />}>
                {SceneComponent && <SceneComponent />}
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Hint — hover on desktop, tap state on touch */}
          <AnimatePresence>
            {(active || isTouch) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20"
              >
                <span className="text-[9px] font-display tracking-[0.3em] uppercase text-cream/40">
                  {isTouch ? (isExpanded ? 'Tap to close' : 'Tap for 3D') : 'Interactive 3D'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Text Content ── */}
        <div className="p-6 md:p-8 relative">
          {/* Number */}
          <span className="absolute top-6 right-6 md:top-8 md:right-8 font-serif text-4xl md:text-5xl text-cream/[0.04] font-light select-none">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Accent line */}
          {project.accent && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-vermilion to-transparent" />
          )}

          {/* Subtitle */}
          <span className="text-[10px] font-display tracking-[0.25em] uppercase text-vermilion/80 mb-3 block">
            {project.subtitle}
          </span>

          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-cream mb-4 group-hover:text-cream transition-colors">
            {project.title}
          </h3>

          {/* Description — collapses on desktop hover; stays readable on touch */}
          <div
            className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              maxHeight: !isTouch && isHovered ? '0px' : '120px',
              opacity: !isTouch && isHovered ? 0 : 1,
            }}
          >
            <p className="text-sm text-cream-dim/60 leading-relaxed mb-6 font-light max-w-xl">
              {project.description}
            </p>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-display tracking-wider uppercase px-3 py-1 border border-surface-light/50 text-cream-dim/50 rounded-none transition-colors duration-300 group-hover:border-cream/15"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display tracking-[0.15em] uppercase text-cream-dim/50 hover:text-vermilion transition-colors flex items-center gap-2"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Code
            </a>
            {project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-display tracking-[0.15em] uppercase text-cream-dim/50 hover:text-vermilion transition-colors flex items-center gap-2"
                data-cursor-hover
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live
              </a>
            )}
          </div>

          {/* Hover arrow */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-vermilion">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="relative py-32 md:py-40">
      <div className="divider mb-32" />
      <div ref={sectionRef} className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
            Selected Work
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mt-4">
            Projects
          </h2>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
