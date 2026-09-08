import { useRef, useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  // Touch devices have no hover cursor — render nothing there
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (isTouch) return undefined

    const move = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)
    const enter = () => setIsHidden(false)
    const leave = () => setIsHidden(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseenter', enter)
    document.addEventListener('mouseleave', leave)

    // Detect hoverable elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true))
        el.addEventListener('mouseleave', () => setIsHovering(false))
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Initial scan
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
      el.addEventListener('mouseenter', () => setIsHovering(true))
      el.addEventListener('mouseleave', () => setIsHovering(false))
    })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseleave', leave)
      observer.disconnect()
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-difference"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 1,
        }}
        animate={{
          scale: isClicking ? 0.7 : isHovering ? 2.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div
          className="rounded-full bg-cream"
          style={{ width: 8, height: 8 }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHidden ? 0 : 0.4,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'var(--color-vermilion)' : 'var(--color-cream)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div
          className="rounded-full border border-cream"
          style={{ width: 36, height: 36 }}
        />
      </motion.div>
    </>
  )
}
