import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Preloader from './components/Preloader'
import FluidBackground from './components/FluidBackground'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'

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

      {/* Header */}
      <Header />

      {/* Main content - either home page sections or child routes */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}