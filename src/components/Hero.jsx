import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const textReveal = {
  hidden: { y: '110%', rotateX: -40 },
  visible: (i) => ({
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5 + i * 0.12,
    },
  }),
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 + i * 0.1 },
  }),
}

function TiltImage() {
  const containerRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -8, y: x * 8 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="relative w-full aspect-[3/4] max-w-[300px] sm:max-w-[380px] md:max-w-[420px] mx-auto md:mx-0"
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      data-cursor-hover
    >
      {/* Architectural frame lines */}
      <div className="absolute -inset-3 md:-inset-5">
        <div className="absolute top-0 left-0 w-12 h-[1px] bg-cream/30" />
        <div className="absolute top-0 left-0 w-[1px] h-12 bg-cream/30" />
        <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-cream/30" />
        <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-cream/30" />
      </div>

      {/* Image with sketch effect */}
      <div className="relative w-full h-full overflow-hidden bg-canvas">
        <img
          src="/ankit-photo.jpg"
          alt="Ankit Kumar"
          className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[0.9]"
          style={{
            mixBlendMode: 'luminosity',
          }}
        />
        {/* Sketch overlay lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(232,230,227,0.015) 3px, rgba(232,230,227,0.015) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(232,230,227,0.015) 3px, rgba(232,230,227,0.015) 4px)
            `,
          }}
        />
        {/* Gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/60" />
        {/* Vermilion accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-vermilion/60" />
      </div>

      {/* Corner caption */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between items-center">
        <span className="text-[10px] font-body text-cream-dim/50 tracking-[0.2em] uppercase">
          Portrait — 2025
        </span>
        <span className="text-[10px] font-body text-cream-dim/50 tracking-[0.2em] uppercase">
          Visakhapatnam, IN
        </span>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 md:pt-0"
      id="hero"
    >
      <motion.div
        style={{ y: parallaxY, opacity }}
        className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-8 items-center md:min-h-[80vh]">
          {/* Left — Text */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px] bg-vermilion" />
              <span className="text-xs font-display font-medium tracking-[0.25em] uppercase text-vermilion">
                Developer & Engineer
              </span>
            </motion.div>

            {/* Name */}
            <div className="overflow-hidden">
              <motion.h1
                custom={0}
                variants={textReveal}
                initial="hidden"
                animate="visible"
                className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-light text-cream tracking-tight"
              >
                Ankit
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                custom={1}
                variants={textReveal}
                initial="hidden"
                animate="visible"
                className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-light text-cream-dim/60 tracking-tight italic"
              >
                Kumar
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base md:text-lg text-cream-dim/70 max-w-md leading-relaxed font-light"
            >
              CS undergrad building at the intersection of AI, computer vision, and
              full-stack engineering. Turning complex problems into elegant, functional
              software.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 mt-2"
            >
              <a href="#projects" className="magnetic-btn-accent magnetic-btn" data-cursor-hover>
                View Work
              </a>
              <a href="#contact" className="magnetic-btn" data-cursor-hover>
                Get in Touch
              </a>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex gap-8 mt-4 pt-6 border-t border-surface-light/40"
            >
              {[
                { value: '7.6', label: 'CGPA' },
                { value: '6', label: 'Projects' },
                { value: '4', label: 'Awards' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-serif text-2xl md:text-3xl text-cream font-light">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center md:justify-end"
          >
            <TiltImage />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-display tracking-[0.3em] uppercase text-cream-dim/30">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-cream/30 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
