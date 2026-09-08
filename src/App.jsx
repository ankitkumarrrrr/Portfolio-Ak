import { Suspense } from 'react'
import FluidBackground from './components/FluidBackground'
import CustomCursor from './components/CustomCursor'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="relative min-h-screen bg-charcoal">
      {/* Three.js fluid background */}
      <Suspense fallback={null}>
        <FluidBackground />
      </Suspense>

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}
