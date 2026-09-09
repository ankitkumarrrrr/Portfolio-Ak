import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Preloader from './components/Preloader'
import FluidBackground from './components/FluidBackground'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'

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

      {/* Header */}
      <Header />

      {/* Main content - either home page sections or child routes */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}