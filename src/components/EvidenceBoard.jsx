import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/*
 * THE BOARD — a detective's evidence map, crime-scene style.
 * Every card carries an inked evidence illustration (hand-drawn SVG, no
 * white backgrounds anywhere) on dark charcoal paper. Cards are pinned
 * and connected by sagging red string that re-renders live while you drag.
 *
 *  - Hover a card  → its connections glow, everything else dims
 *  - Drag a card   → strings follow in real time
 *  - Close         → X button or Escape
 */

const S = {
  stroke: '#E8E6E3',
  dim: 'rgba(232,230,227,0.55)',
  red: '#E4572E',
}

/* ── Evidence illustrations — ink on dark paper, 100×60 canvas ── */

const svgProps = {
  viewBox: '0 0 100 60',
  fill: 'none',
  className: 'w-full h-full',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Graduation cap + scroll (education)
const ArtEducation = () => (
  <svg {...svgProps}>
    <path d="M50 14 L20 24 L50 34 L80 24 Z" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M76 26 V38" stroke={S.dim} strokeWidth="2" />
    <circle cx="76" cy="40.5" r="2" fill={S.red} />
    <path d="M32 30 V40 C32 43 40 46 50 46 C60 46 68 43 68 40 V30" stroke={S.dim} strokeWidth="2" />
    <path d="M42 53 H58" stroke={S.red} strokeWidth="2.4" />
  </svg>
)

// Terminal with prompt + spark (AI developer)
const ArtJob = () => (
  <svg {...svgProps}>
    <rect x="18" y="14" width="56" height="32" rx="2" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M18 21 H74" stroke={S.dim} strokeWidth="1.6" />
    <circle cx="23" cy="17.5" r="1.2" fill={S.dim} />
    <circle cx="27.5" cy="17.5" r="1.2" fill={S.dim} />
    <path d="M26 30 l6 5 -6 5" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M38 41 H46" stroke={S.red} strokeWidth="2.4" />
    <path d="M64 26 l1.8 3.6 3.6 1.8 -3.6 1.8 -1.8 3.6 -1.8 -3.6 -3.6 -1.8 3.6 -1.8 Z" fill={S.red} />
  </svg>
)

// Trophy (SIH finalist)
const ArtTrophy = () => (
  <svg {...svgProps}>
    <path d="M36 12 H64 V24 A14 13 0 0 1 36 24 Z" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M36 16 H27 A7 8 0 0 0 36 28" stroke={S.dim} strokeWidth="2" />
    <path d="M64 16 H73 A7 8 0 0 1 64 28" stroke={S.dim} strokeWidth="2" />
    <path d="M50 37 V44" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M42 48 H58 L56 44 H44 Z" stroke={S.stroke} strokeWidth="2.2" />
    <path d="M50 18 l1.6 3.2 3.4 1.6 -3.4 1.6 -1.6 3.2 -1.6 -3.2 -3.4 -1.6 3.4 -1.6 Z" fill={S.red} />
  </svg>
)

// Quadcopter (IIT Kanpur drone)
const ArtDrone = () => (
  <svg {...svgProps}>
    <path d="M40 27 L30 19 M60 27 L70 19 M40 33 L30 41 M60 33 L70 41" stroke={S.dim} strokeWidth="2" />
    <ellipse cx="28" cy="17.5" rx="10" ry="2.4" stroke={S.stroke} strokeWidth="2" />
    <ellipse cx="72" cy="17.5" rx="10" ry="2.4" stroke={S.stroke} strokeWidth="2" />
    <ellipse cx="28" cy="42.5" rx="10" ry="2.4" stroke={S.stroke} strokeWidth="2" />
    <ellipse cx="72" cy="42.5" rx="10" ry="2.4" stroke={S.stroke} strokeWidth="2" />
    <rect x="40" y="25" width="20" height="11" rx="2" stroke={S.stroke} strokeWidth="2.4" />
    <circle cx="50" cy="41.5" r="2.6" fill={S.red} />
  </svg>
)

// Stacked swipe cards (JobSwipe AI)
const ArtSwipe = () => (
  <svg {...svgProps}>
    <rect x="26" y="10" width="38" height="26" rx="2.5" transform="rotate(-7 45 23)" stroke={S.dim} strokeWidth="2" />
    <rect x="36" y="22" width="38" height="26" rx="2.5" transform="rotate(4 55 35)" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M50 42 c-4.5 -3.5 -7 -5.8 -7 -8.6 a3.6 3.6 0 0 1 7 -1.4 a3.6 3.6 0 0 1 7 1.4 c0 2.8 -2.5 5.1 -7 8.6 Z" fill={S.red} />
    <path d="M14 30 h8 m0 0 l-3 -3 m3 3 l-3 3" stroke={S.dim} strokeWidth="2" />
    <path d="M86 30 h-8 m0 0 l3 -3 m-3 3 l3 3" stroke={S.dim} strokeWidth="2" />
  </svg>
)

// Knight (Chess.ai)
const ArtKnight = () => (
  <svg {...svgProps}>
    <path
      d="M36 48 C34 34 40 26 50 19 L47 12 L55 17 L60 14 L58 21 C66 26 68 36 66 48 Z"
      stroke={S.stroke}
      strokeWidth="2.4"
    />
    <path d="M52 24 l3 -3" stroke={S.dim} strokeWidth="2" />
    <circle cx="53.5" cy="23.5" r="1.3" fill={S.red} />
    <path d="M32 53 H70 L68 48 H34 Z" stroke={S.stroke} strokeWidth="2.2" />
  </svg>
)

// Target with arrow (motive)
const ArtMotive = () => (
  <svg {...svgProps}>
    <circle cx="54" cy="32" r="17" stroke={S.stroke} strokeWidth="2.4" />
    <circle cx="54" cy="32" r="10" stroke={S.dim} strokeWidth="2" />
    <circle cx="54" cy="32" r="3.4" fill={S.red} />
    <path d="M22 8 L51 29" stroke={S.stroke} strokeWidth="2.4" />
    <path d="M22 8 l7 1 M22 8 l1 7" stroke={S.dim} strokeWidth="2" />
  </svg>
)

const ART = {
  gitam: ArtEducation,
  thesci: ArtJob,
  sih: ArtTrophy,
  drone: ArtDrone,
  jobswipe: ArtSwipe,
  chess: ArtKnight,
  goal: ArtMotive,
}

/* ── Board data ── */

const INITIAL_CARDS = [
  { id: 'you',      kind: 'photo', label: 'ANKIT KUMAR',              caption: 'THE SUBJECT',       x: 44, y: 40, w: 150, h: 185, accent: true },
  { id: 'gitam',    kind: 'note',  label: 'B.TECH CSE · GITAM',       caption: 'EDUCATION 2022—26', x: 15, y: 20, w: 175, h: 122, accent: false },
  { id: 'thesci',   kind: 'note',  label: 'AI DEVELOPER',             caption: 'THESCI SOLCIELO',   x: 70, y: 13, w: 185, h: 122, accent: false },
  { id: 'sih',      kind: 'note',  label: 'TOP 10 · SIH 2024',        caption: 'NATIONAL LEVEL',    x: 11, y: 52, w: 172, h: 118, accent: true },
  { id: 'drone',    kind: 'note',  label: '2ND PRIZE · IIT KANPUR',   caption: 'AEROVISION DRONE',  x: 30, y: 74, w: 168, h: 118, accent: true },
  { id: 'jobswipe', kind: 'note',  label: 'JOBSWIPE AI',              caption: 'EXHIBIT A',         x: 56, y: 70, w: 156, h: 118, accent: false },
  { id: 'chess',    kind: 'note',  label: 'CHESS.AI',                 caption: 'EXHIBIT B',         x: 79, y: 53, w: 152, h: 118, accent: false },
  { id: 'goal',     kind: 'note',  label: 'BUILD WHAT MATTERS',       caption: 'MOTIVE',            x: 46, y: 12, w: 162, h: 112, accent: false },
]

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

const PIN_OFFSET = 12
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

  const onPointerDown = useCallback(
    (e, card) => {
      e.preventDefault()
      const m = pos[card.id]
      dragRef.current = { id: card.id, dx: e.clientX - m.x, dy: e.clientY - m.y }
      setHovered(card.id)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [pos, onPointerMove, onPointerUp] // eslint-disable-line react-hooks/exhaustive-deps
  )

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
              <path d={s.d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={3} strokeLinecap="round" transform="translate(2 3)" />
              <path
                d={s.d}
                fill="none"
                stroke={hot ? '#E4572E' : 'rgba(196,48,43,0.5)'}
                strokeWidth={hot ? 2 : 1.3}
                strokeLinecap="round"
                style={hot ? { filter: 'drop-shadow(0 0 6px rgba(228,87,46,0.7))' } : undefined}
              />
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
        const Art = ART[c.id]
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

            {c.kind === 'photo' ? (
              /* Subject card — real photo on a dark frame, no white anywhere */
              <div className="w-full h-full bg-[#141417] border border-cream/15 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <div className="w-full h-[calc(100%-34px)] overflow-hidden">
                  <img src="/ankit-photo.jpg" alt="" className="w-full h-full object-cover object-top" draggable={false} />
                </div>
                <p className="h-[34px] flex items-center justify-center text-[11px] font-display tracking-[0.3em] uppercase text-cream">
                  {c.label}
                </p>
                {c.accent && <span className="absolute top-2 right-2 text-sm leading-none text-vermilion">★</span>}
              </div>
            ) : (
              /* Evidence card — dark charcoal paper, inked illustration, no white */
              <div className="w-full h-full bg-[#1D1D21] border border-cream/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col">
                <div className="flex-1 min-h-0 px-3 pt-3">
                  {Art && <Art />}
                </div>
                <div className="px-3 pb-2.5 pt-1.5 border-t border-cream/10">
                  <p className="text-[10px] font-display tracking-[0.18em] uppercase text-cream truncate">{c.label}</p>
                  <p className="text-[8px] font-mono uppercase tracking-widest text-cream-dim/50 mt-0.5 flex items-center gap-1.5">
                    {c.accent && <span className="text-vermilion">★</span>}
                    {c.caption}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
