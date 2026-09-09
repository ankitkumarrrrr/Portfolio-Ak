import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Preloader from './components/Preloader'
import FluidBackground from './components/FluidBackground'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import EvidenceBoard from './components/EvidenceBoard'

/**
 * Scroll behavior for route changes: plain navigations go to the top of
 * the new page; navigations carrying a hash (e.g. /#projects from the
 * blog) scroll to that section once it exists. Back/forward (POP) is left
 * to the browser/router so the visitor returns where they were.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType === 'POP') return
    if (hash) {
      const id = hash.slice(1)
      let tries = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView()
          return
        }
        // Section may still be mounting — retry for ~1s before giving up.
        if (++tries < 20) requestAnimationFrame(tick)
        else window.scrollTo(0, 0)
      }
      requestAnimationFrame(tick)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navType])
  return null
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [boardOpen, setBoardOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-charcoal">
      {/* Three.js fluid background */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <FluidBackground />
        </Suspense>
      </ErrorBoundary>

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Cinematic hello preloader */}
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll behavior for route changes */}
      <ScrollManager />

      {/* THE BOARD — case-file easter egg */}
      <button
        onClick={() => setBoardOpen(true)}
        className="fixed bottom-6 right-6 z-[9500] flex items-center gap-2.5 bg-[#EDE9E1] text-charcoal px-4 py-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.5)] rotate-[-2deg] hover:rotate-0 transition-transform duration-300"
        data-cursor-hover
        aria-label="Open the evidence board"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-vermilion shadow-[inset_-1px_-2px_2px_rgba(0,0,0,0.35)]" />
        <span className="text-[11px] font-display tracking-[0.25em] uppercase font-semibold">The Board</span>
      </button>

      <EvidenceBoard open={boardOpen} onClose={() => setBoardOpen(false)} />

      {/* Header */}
      <Header />

      {/* Main content - either home page sections or child routes */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}