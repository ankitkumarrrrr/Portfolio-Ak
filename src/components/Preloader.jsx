import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playStartupChime, armChimeFallback } from '../lib/chime'

/*
 * Cinematic boot screen — an Apple-style cursive "hello" that draws itself
 * in script, fills in, then lifts away like a curtain to reveal the site.
 * Path is a faithful hand-traced recreation of the Apple Watch hello.
 */

const HELLO_PATH =
  'M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31'

const HELLO_TRANSFORM = 'translate(311.08 476.02)'

const DRAW_DELAY = 0.35
const DRAW_DURATION = 2.1
const HOLD = 0.55

export default function Preloader({ onComplete }) {
  const doneRef = useRef(false)
  const finish = () => {
    if (!doneRef.current) {
      doneRef.current = true
      onComplete?.()
    }
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = reduced ? 700 : (DRAW_DELAY + DRAW_DURATION + HOLD) * 1000
    const t = setTimeout(() => {
      finish()
      // Soft Mac-style chime as the curtain starts to lift. If the browser
      // blocks autoplay (no gesture yet), arm it to fire on first tap/key.
      if (!playStartupChime()) armChimeFallback()
    }, total)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      className="fixed inset-0 z-[20000] bg-charcoal flex flex-col items-center justify-center"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* The hello */}
      <motion.svg
        viewBox="0 0 1230.94 414.57"
        className="w-[72vw] max-w-[620px] overflow-visible"
        role="img"
        aria-label="hello"
      >
        <motion.path
          d={HELLO_PATH}
          transform={HELLO_TRANSFORM}
          stroke="#E8E6E3"
          strokeWidth={reduced ? 30 : 26}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            pathLength: reduced ? 1 : 0,
            fill: reduced ? 'rgba(232,230,227,1)' : 'rgba(232,230,227,0)',
          }}
          animate={{
            pathLength: 1,
            fill: 'rgba(232,230,227,1)',
          }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  pathLength: {
                    delay: DRAW_DELAY,
                    duration: DRAW_DURATION,
                    ease: [0.45, 0.05, 0.35, 1],
                  },
                  fill: { delay: DRAW_DELAY + DRAW_DURATION + 0.05, duration: 0.55 },
                }
          }
        />
      </motion.svg>

      {/* Vermilion underline accent */}
      <motion.div
        className="h-[2px] bg-vermilion mt-10 origin-center"
        initial={{ width: 0, opacity: reduced ? 1 : 0 }}
        animate={{ width: reduced ? 96 : 120, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                width: { delay: DRAW_DELAY + DRAW_DURATION + 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { delay: DRAW_DELAY + DRAW_DURATION + 0.35, duration: 0.2 },
              }
        }
      />

      {/* Caption */}
      <motion.span
        className="mt-5 text-[10px] font-display tracking-[0.45em] uppercase text-cream-dim/40"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { delay: DRAW_DELAY + DRAW_DURATION + 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
      >
        Ankit Kumar — Portfolio
      </motion.span>
    </motion.div>
  )
}
