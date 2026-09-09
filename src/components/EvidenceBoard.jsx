import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*
 * THE BOARD — a detective's evidence map, crime-scene style.
 * Cards (subject, education, employer, wins, exhibits) are pinned to a
 * corkboard and connected by red string. Strings are quadratic curves
 * that sag like real thread and re-render live while you drag a card.
 *
 *  - Hover a card  → its connections glow, everything else dims
 *  - Drag a card   → strings follow in real time
 *  - Close         → X button or Escape
 */

const PORTRAIT = '/ankit-photo.jpg'

const INITIAL_CARDS = [
  { id: 'you',      kind: 'photo',   label: 'ANKIT KUMAR',              caption: 'THE SUBJECT',    x: 44, y: 42, w: 150, h: 185, accent: true },
  { id: 'gitam',    kind: 'note',    label: 'B.TECH CSE\nGITAM Univ.',  caption: 'EDUCATION 2022—26', x: 18, y: 22, w: 175, h: 92,  accent: false },
  { id: 'thesci',   kind: 'note',    label: 'AI DEVELOPER\nTheSci SolCielo', caption: 'EMPLOYER —', x: 72, y: 18, w: 190, h: 92,  accent: false },
  { id: 'sih',      kind: 'note',    label: 'TOP 10 FINALIST\nSIH 2024', caption: 'NATIONAL LEVEL', x: 14, y: 52, w: 170, h: 88,  accent: true },
  { id: 'drone',    kind: 'note',    label: '2ND PRIZE\nIIT Kanpur',    caption: 'AEROVISION DRONE', x: 33, y: 76, w: 165, h: 88, accent: true },
  { id: 'jobswipe', kind: 'project', label: 'JOBSWIPE AI',              caption: 'EXHIBIT A',      x: 57, y: 72, w: 155, h: 92,  accent: false },
  { id: 'chess',    kind: 'project', label: 'CHESS.AI',                 caption: 'EXHIBIT B',      x: 78, y: 56, w: 150, h: 92,  accent: false },
  { id: 'goal',     kind: 'note',    label: 'BUILD THINGS\nTHAT MATTER', caption: 'MOTIVE',         x: 52, y: 16, w: 160, h: 80,  accent: false },
]

// The red string — every pair renders as a sagging curve between pins.
const LINKS = [
  ['you', 'gitam'],
  ['you', 'thesci'],
  ['you', 'sih'],
  ['you', 'drone'],
  ['you', 'jobswipe'],
  ['you', 'chess'],
  ['you', 'goal'],
  ['gitam', 'sih'],
  ['thesci', 'jobswipe'],
  ['sih', 'drone'],
  ['chess', 'goal'],
]

const PIN_OFFSET = 12 // string ties to the pin just above each card

const TILT = { you: -2.5, gitam: 1.5, sih: -1.5, drone: 2, jobswipe: -2, chess: 1.5, goal: -1.5, thesci: -1 }

export default function EvidenceBoard({ open, onClose }) {
  const [cards, setCards] = useState(INITIAL_CARDS)
  const [hovered, setHovered] = useState(null)
  const dragRef = useRef(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Escape closes the board
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const pos = useMemo(() => {
    const m = {}
    cards.forEach((c) => {
      m[c.id] = { x: (c.x / 100) * size.w, y: (c.y / 100) * size.h, w: c.w, h: c.h }
    })
    return m
  }, [cards, size])

  const strings = useMemo(
    () =>
      LINKS.map(([a, b]) => {
        const pa = pos[a]
        const pb = pos[b]
        if (!pa || !pb) return null
        const ax = pa.x + pa.w / 2
        const ay = pa.y - PIN_OFFSET
        const bx = pb.x + pb.w / 2
        const by = pb.y - PIN_OFFSET
        const sag = 26 + Math.abs(bx - ax) * 0.07
        return {
          key: `${a}~${b}`,
          a,
          b,
          d: `M ${ax} ${ay} Q ${(ax + bx) / 2} ${(ay + by) / 2 + sag} ${bx} ${by}`,
          ax,
          ay,
          bx,
          by,
        }
      }).filter(Boolean),
    [pos]
  )

  const onPointerDown = useCallback(
    (e, card) => {
      e.preventDefault()
      const m = pos[card.id]
      dragRef.current = { id: card.id, dx: e.clientX - m.x, dy: e.clientY - m.y }
      setHovered(card.id)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [pos] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onPointerMove = useCallback(
    (e) => {
      if (!dragRef.current) return
      const { id, dx, dy } = dragRef.current
      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c
          return {
            ...c,
            x: ((e.clientX - dx) / size.w) * 100,
            y: ((e.clientY - dy) / size.h) * 100,
          }
        })
      )
    },
    [size]
  )

  const onPointerUp = useCallback(() => {
    dragRef.current = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 z-[15000] bg-charcoal/95 backdrop-blur-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Corkboard texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(120,90,60,0.07) 0 2px, transparent 2px 7px), repeating-linear-gradient(-45deg, rgba(120,90,60,0.05) 0 2px, transparent 2px 9px)',
        }}
      />

      {/* Header strip */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-4 bg-charcoal/70 backdrop-blur-sm border-b border-surface-light/20">
        <div>
          <p className="text-[10px] font-display tracking-[0.4em] uppercase text-vermilion">Case File № 07 — Classified</p>
          <h2 className="font-serif text-lg md:text-2xl text-cream font-light mt-1">
            The Ankit Kumar Case — every thread, connected.
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 shrink-0 flex items-center justify-center border border-cream/20 text-cream-dim hover:text-cream hover:border-vermilion/60 transition-colors text-sm"
          aria-label="Close the board"
          data-cursor-hover
        >
          ✕
        </button>
      </div>

      {/* Hint */}
      <p className="absolute bottom-4 left-0 right-0 z-20 text-center text-[10px] font-display tracking-[0.3em] uppercase text-cream-dim/30 pointer-events-none">
        Hover to trace a thread · Drag any card to rewire the case
      </p>

      {/* Strings layer */}
      <svg className="absolute inset-0 z-[5] pointer-events-none" width={size.w} height={size.h}>
        {strings.map((s) => {
          const hot = hovered && (s.a === hovered || s.b === hovered)
          return (
            <g key={s.key}>
              {/* soft shadow thread underneath */}
              <path d={s.d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={3} strokeLinecap="round" transform="translate(2 3)" />
              <path
                d={s.d}
                fill="none"
                stroke={hot ? '#E4572E' : 'rgba(196,48,43,0.5)'}
                strokeWidth={hot ? 2 : 1.3}
                strokeLinecap="round"
                style={hot ? { filter: 'drop-shadow(0 0 6px rgba(228,87,46,0.7))' } : undefined}
              />
              {/* pin heads the string ties to */}
              <circle cx={s.ax} cy={s.ay} r={2.6} fill="#E8E6E3" opacity={0.85} />
              <circle cx={s.bx} cy={s.by} r={2.6} fill="#E8E6E3" opacity={0.85} />
            </g>
          )
        })}
      </svg>

      {/* Cards */}
      {cards.map((c) => {
        const m = pos[c.id]
        const isHot = hovered === c.id
        const isConnected = hovered && LINKS.some(([a, b]) => (a === hovered && b === c.id) || (b === hovered && a === c.id))
        const dim = hovered && !isHot && !isConnected
        return (
          <motion.div
            key={c.id}
            className="absolute z-10 cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ left: m.x, top: m.y, width: c.w, height: c.h, rotate: TILT[c.id] || 0 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: dim ? 0.22 : 1, y: 0, scale: isHot ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onHoverStart={() => setHovered(c.id)}
            onHoverEnd={() => {
              if (!dragRef.current) setHovered(null)
            }}
            onPointerDown={(e) => onPointerDown(e, c)}
            data-cursor-hover
          >
            {/* Pin head */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full bg-cream z-10"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.65), inset -1px -2px 3px rgba(0,0,0,0.35)' }}
            />

            {c.kind === 'photo' && (
              <div className="w-full h-full bg-[#EDE9E1] p-2 pb-9 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <img src={PORTRAIT} alt="" className="w-full h-full object-cover object-top" draggable={false} />
                <p className="absolute bottom-2.5 left-0 right-0 text-center text-[10px] font-display tracking-[0.25em] uppercase text-[#3a3630]">
                  {c.label}
                </p>
              </div>
            )}

            {c.kind === 'note' && (
              <div className="w-full h-full bg-[#EDE9E1] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <p className="font-display text-[13px] leading-snug text-[#2b2823] whitespace-pre-line">{c.label}</p>
                <p className="absolute bottom-2 left-3 text-[8px] font-mono uppercase tracking-widest text-[#8a8378]">{c.caption}</p>
                {c.accent && <span className="absolute top-1.5 right-2 text-sm leading-none text-[#C4302B]">★</span>}
              </div>
            )}

            {c.kind === 'project' && (
              <div className="w-full h-full bg-[#17171A] border border-vermilion/40 p-3 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <p className="font-serif text-lg text-cream font-light leading-tight">{c.label}</p>
                <p className="text-[8px] font-mono uppercase tracking-widest text-vermilion/80">{c.caption}</p>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
