import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ───────────────────────────────────────────────
   Chess Scene — Rotating board with pieces
   ─────────────────────────────────────────────── */
function ChessBoard() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.4 + t * 0.1
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05 - 0.3
  })

  const squares = useMemo(() => {
    const arr = []
    for (let x = 0; x < 8; x++) {
      for (let z = 0; z < 8; z++) {
        arr.push({
          key: `${x}-${z}`,
          position: [x * 0.32 - 1.12, 0, z * 0.32 - 1.12],
          isBlack: (x + z) % 2 === 1,
        })
      }
    }
    return arr
  }, [])

  // Simplified chess pieces — just pawns and a king/queen
  const pieces = useMemo(() => {
    const p = []
    // Black pawns (back row)
    for (let i = 0; i < 8; i++) {
      p.push({ key: `bp${i}`, pos: [i * 0.32 - 1.12, 0.2, 0.32 * 6 - 1.12], color: '#1a1a1a', h: 0.25 })
    }
    // White pawns
    for (let i = 0; i < 8; i++) {
      p.push({ key: `wp${i}`, pos: [i * 0.32 - 1.12, 0.2, 0.32 * 1 - 1.12], color: '#d4cfc8', h: 0.25 })
    }
    // Kings
    p.push({ key: 'bk', pos: [4 * 0.32 - 1.12, 0.25, 0.32 * 7 - 1.12], color: '#1a1a1a', h: 0.4 })
    p.push({ key: 'wk', pos: [4 * 0.32 - 1.12, 0.25, 0], color: '#d4cfc8', h: 0.4 })
    // Queens
    p.push({ key: 'bq', pos: [3 * 0.32 - 1.12, 0.22, 0.32 * 7 - 1.12], color: '#1a1a1a', h: 0.35 })
    p.push({ key: 'wq', pos: [3 * 0.32 - 1.12, 0.22, 0], color: '#d4cfc8', h: 0.35 })
    return p
  }, [])

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Board squares */}
      {squares.map((s) => (
        <mesh key={s.key} position={s.position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            color={s.isBlack ? '#2a2520' : '#c8bfb0'}
            roughness={0.8}
          />
        </mesh>
      ))}
      {/* Board base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2.8, 0.08, 2.8]} />
        <meshStandardMaterial color="#1a1612" roughness={0.6} />
      </mesh>
      {/* Pieces */}
      {pieces.map((piece) => (
        <group key={piece.key} position={piece.pos}>
          {/* Base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.06, 12]} />
            <meshStandardMaterial color={piece.color} roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Body */}
          <mesh position={[0, piece.h * 0.4, 0]}>
            <cylinderGeometry args={[0.05, 0.08, piece.h, 10]} />
            <meshStandardMaterial color={piece.color} roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Top */}
          <mesh position={[0, piece.h * 0.8, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={piece.color} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function ChessScene() {
  return (
    <Canvas camera={{ position: [2.5, 3, 2.5], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffeedd" />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} color="#aabbcc" />
      <ChessBoard />
    </Canvas>
  )
}

/* ───────────────────────────────────────────────
   JobSwipe Scene — Cinematic 3D AI Job Cards & Holographic Deck
   ─────────────────────────────────────────────── */

const JOB_CARDS_DATA = [
  {
    company: 'Google DeepMind',
    logoChar: 'G',
    role: 'Lead AI Engineer',
    location: 'Remote / London, UK',
    salary: '$240,000 - $320,000 / yr',
    matchScore: '99%',
    cosine: '0.988 (High Confidence)',
    recruiter: 'sarah.m@deepmind.google',
    skills: ['Gemini 1.5', 'Next.js', 'PyTorch', 'Agentic AI'],
    borderColor: '#FF3300',
    accentColor: '#FF3300',
    id: 'DM-9821',
  },
  {
    company: 'OpenAI Systems',
    logoChar: 'O',
    role: 'Staff ML Infrastructure',
    location: 'San Francisco, CA',
    salary: '$225,000 - $300,000 / yr',
    matchScore: '98%',
    cosine: '0.976 (High Confidence)',
    recruiter: 'alex.k@openai.com',
    skills: ['Python', 'PostgreSQL', 'FastAPI', 'Distributed'],
    borderColor: '#38BDF8',
    accentColor: '#38BDF8',
    id: 'OAI-4410',
  },
  {
    company: 'Stripe Fintech',
    logoChar: 'S',
    role: 'Senior Automation Eng.',
    location: 'Remote (Global)',
    salary: '$195,000 - $265,000 / yr',
    matchScore: '97%',
    cosine: '0.965 (Strong Match)',
    recruiter: 'talent@stripe.com',
    skills: ['Next.js 15', 'Prisma', 'Razorpay', 'TypeScript'],
    borderColor: '#10B981',
    accentColor: '#10B981',
    id: 'ST-1094',
  },
]

function createJobCardTexture(job) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1320
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Card Dark Glass Body
  ctx.fillStyle = '#0f1016'
  ctx.beginPath()
  ctx.roundRect(16, 16, 992, 1288, 44)
  ctx.fill()

  // Inner subtle gradient fill
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1320)
  bgGrad.addColorStop(0, 'rgba(28, 30, 42, 0.95)')
  bgGrad.addColorStop(0.5, 'rgba(16, 17, 24, 0.98)')
  bgGrad.addColorStop(1, 'rgba(10, 11, 15, 0.99)')
  ctx.fillStyle = bgGrad
  ctx.beginPath()
  ctx.roundRect(24, 24, 976, 1272, 38)
  ctx.fill()

  // Glowing cyber rim border
  const borderGrad = ctx.createLinearGradient(0, 0, 1024, 1320)
  borderGrad.addColorStop(0, job.borderColor || '#FF3300')
  borderGrad.addColorStop(0.5, '#38BDF8')
  borderGrad.addColorStop(1, '#10B981')
  ctx.lineWidth = 6
  ctx.strokeStyle = borderGrad
  ctx.stroke()

  // Top luminous neon accent bar
  const headerGrad = ctx.createLinearGradient(24, 24, 1000, 24)
  headerGrad.addColorStop(0, '#FF3300')
  headerGrad.addColorStop(0.5, '#38BDF8')
  headerGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = headerGrad
  ctx.fillRect(24, 24, 976, 8)

  // Company logo circle emblem
  ctx.save()
  ctx.beginPath()
  ctx.arc(104, 114, 46, 0, Math.PI * 2)
  ctx.fillStyle = '#1c1e28'
  ctx.fill()
  ctx.lineWidth = 3.5
  ctx.strokeStyle = job.accentColor || '#FF3300'
  ctx.stroke()

  // Emblem letter
  ctx.fillStyle = job.accentColor || '#FF3300'
  ctx.font = 'bold 42px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(job.logoChar || 'AI', 104, 115)
  ctx.restore()

  // Company Name
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 38px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(job.company, 175, 104)

  // Location
  ctx.fillStyle = '#94A3B8'
  ctx.font = '400 24px sans-serif'
  ctx.fillText(job.location, 175, 140)

  // AI Match Badge (top right)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
  ctx.beginPath()
  ctx.roundRect(690, 84, 280, 56, 28)
  ctx.fill()
  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Green pulsing dot
  ctx.beginPath()
  ctx.arc(722, 112, 9, 0, Math.PI * 2)
  ctx.fillStyle = '#34D399'
  ctx.fill()

  ctx.fillStyle = '#34D399'
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(job.matchScore + ' AI MATCH', 742, 120)

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(60, 192)
  ctx.lineTo(964, 192)
  ctx.stroke()

  // Job Role Title
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '800 50px sans-serif'
  ctx.fillText(job.role, 60, 272)

  // Salary Pill
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
  ctx.beginPath()
  ctx.roundRect(60, 318, 480, 58, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#FBBF24'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText(job.salary, 85, 358)

  // AI Gemini Resume Match Diagnostic Card
  ctx.fillStyle = 'rgba(18, 24, 38, 0.9)'
  ctx.beginPath()
  ctx.roundRect(60, 410, 904, 360, 24)
  ctx.fill()
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Gemini badge header
  ctx.fillStyle = '#38BDF8'
  ctx.font = 'bold 24px sans-serif'
  ctx.fillText('✦ GOOGLE GEMINI 1.5 PRO RESUME PARSER', 95, 462)

  // AI analysis bullet points
  ctx.fillStyle = '#E2E8F0'
  ctx.font = '400 27px sans-serif'
  ctx.fillText('✓ Cosine Vector Match: ' + job.cosine, 95, 520)
  ctx.fillText('✓ Direct Recruiter Outreach: ' + job.recruiter, 95, 578)
  ctx.fillText('✓ Personalized Pitch: Formulated & Scored', 95, 636)
  ctx.fillText('✓ ATS Compatibility: 99.4% Pass Probability', 95, 694)

  // Tech Stacks section
  ctx.fillStyle = '#94A3B8'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText('MATCHED TECH STACK', 60, 824)

  // Skill tags
  let tagX = 60
  const tagY = 852
  job.skills.forEach((skill) => {
    ctx.font = 'bold 26px sans-serif'
    const textWidth = ctx.measureText(skill).width
    const pillWidth = textWidth + 48

    ctx.fillStyle = 'rgba(255, 51, 0, 0.15)'
    ctx.beginPath()
    ctx.roundRect(tagX, tagY, pillWidth, 54, 14)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 51, 0, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#FFAA99'
    ctx.fillText(skill, tagX + 24, tagY + 37)

    tagX += pillWidth + 20
  })

  // Outreach Status Bar
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)'
  ctx.beginPath()
  ctx.roundRect(60, 946, 904, 76, 20)
  ctx.fill()
  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#10B981'
  ctx.font = 'bold 28px sans-serif'
  ctx.fillText('⚡ 1-CLICK TINDER AUTO-SWIPE & RECRUITER OUTREACH', 95, 994)

  // Bottom scan telemetry
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
  ctx.font = '400 20px monospace'
  ctx.fillText('// JOBSWIPE-AI PROTOCOL • HACKERNEWS & REMOTIVE LIVE STREAM //', 60, 1080)
  ctx.fillText('EMBEDDING: TEXT-EMBEDDING-004 • ID: ' + job.id + ' • ACTIVE', 60, 1115)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/* 3D Action Button for Tinder controls */
function ActionButton3D({ position, color, symbol, isHighlightRef }) {
  const ref = useRef()
  const matRef = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const isHighlight = Boolean(isHighlightRef?.current)
    const baseScale = isHighlight ? 1.25 : 1.0
    const pulse = isHighlight ? Math.sin(t * 12) * 0.08 : Math.sin(t * 2.5 + position[0]) * 0.03
    ref.current.scale.setScalar(baseScale + pulse)
    if (matRef.current) {
      matRef.current.emissiveIntensity = isHighlight ? 2.8 : 0.8
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Outer Glow Ring */}
      <mesh>
        <torusGeometry args={[0.16, 0.018, 16, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Inner Button Disc */}
      <mesh position={[0, 0, -0.005]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#16171d" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Icon Symbol */}
      {symbol === 'cross' && (
        <group position={[0, 0, 0.015]} rotation={[0, 0, Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.13, 0.026, 0.01]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.026, 0.13, 0.01]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
        </group>
      )}
      {symbol === 'star' && (
        <group position={[0, 0, 0.015]}>
          <mesh rotation={[0, 0, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
          </mesh>
        </group>
      )}
      {symbol === 'heart' && (
        <group position={[0, -0.01, 0.015]}>
          <mesh position={[-0.036, 0.03, 0]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0.036, 0.03, 0]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0, -0.025, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.066, 0.085, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

/* Individual 3D Job Card Mesh */
function SingleJobCard({ texture, glowColor, stampRef, hasLaser = false }) {
  return (
    <group>
      {/* 3D Glass Slab Base with Glow Rim */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[1.74, 2.24, 0.035]} />
        <meshStandardMaterial
          color="#0f1016"
          emissive={glowColor}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Front Face with Ultra-Crisp Canvas Texture */}
      {texture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.7, 2.2]} />
          <meshStandardMaterial
            map={texture}
            transparent
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* Holographic Applied Stamp when Swiping Right */}
      <group ref={stampRef} position={[0.3, 0.4, 0.06]} rotation={[0, 0, 0.2]} visible={false}>
        <mesh>
          <boxGeometry args={[1.2, 0.35, 0.01]} />
          <meshStandardMaterial
            color="#064e3b"
            emissive="#10B981"
            emissiveIntensity={2.0}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.14, 0.29, 0.005]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#34D399"
            emissiveIntensity={2.8}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>

      {/* Real-time AI laser scanner bar */}
      {hasLaser && <HolographicLaserBeam />}
    </group>
  )
}

/* Real-Time AI Laser Scanner Beam */
function HolographicLaserBeam() {
  const beamRef = useRef()
  const sheetRef = useRef()

  useFrame((state) => {
    if (!beamRef.current) return
    const t = state.clock.getElapsedTime()
    // Sweeps up and down the card
    const scanY = Math.sin(t * 2.6) * 0.95
    beamRef.current.position.y = scanY
    if (sheetRef.current) {
      sheetRef.current.position.y = scanY - 0.12
    }
  })

  return (
    <group position={[0, 0, 0.035]}>
      {/* Luminous laser line */}
      <mesh ref={beamRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.76, 0.024, 0.015]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={2.5}
          roughness={0.1}
        />
      </mesh>
      {/* Trailing optical laser sweep glow */}
      <mesh ref={sheetRef} position={[0, -0.12, -0.005]}>
        <planeGeometry args={[1.74, 0.24]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={0.8}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/* Volumetric Neural Particles */
function CyberParticles() {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 34; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9898 + 78.233)) % 1
      const r2 = Math.abs(Math.sin(i * 4.1414 + 31.415)) % 1
      const r3 = Math.abs(Math.sin(i * 7.5123 + 19.821)) % 1
      pts.push({
        x: (r1 - 0.5) * 4.2,
        y: (r2 - 0.5) * 3.4,
        z: (r3 - 0.5) * 2.2 - 0.2,
        speed: 0.5 + r1 * 0.7,
        size: 0.02 + r2 * 0.025,
        color: i % 3 === 0 ? '#FF3300' : i % 3 === 1 ? '#10B981' : '#38BDF8',
      })
    }
    return pts
  }, [])

  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.children.forEach((mesh, idx) => {
      const p = points[idx]
      mesh.position.y = ((p.y + t * p.speed * 0.22 + 2) % 3.6) - 1.8
      mesh.rotation.x = t * p.speed
      mesh.rotation.y = t * p.speed * 1.3
    })
  })

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <octahedronGeometry args={[p.size, 0]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

/* Holographic Tech Orbital Rings */
function TechOrbitalRings() {
  const r1 = useRef()
  const r2 = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (r1.current) {
      r1.current.rotation.z = t * 0.2
      r1.current.rotation.x = Math.PI / 2.3 + Math.sin(t * 0.3) * 0.08
    }
    if (r2.current) {
      r2.current.rotation.z = -t * 0.15
      r2.current.rotation.y = Math.PI / 2.5 + Math.cos(t * 0.25) * 0.08
    }
  })

  return (
    <group position={[0, -0.05, -0.1]}>
      <mesh ref={r1}>
        <torusGeometry args={[1.85, 0.009, 16, 64]} />
        <meshStandardMaterial
          color="#FF3300"
          emissive="#FF3300"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.15, 0.007, 16, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

/* Interactive & Animated Card Deck Controller */
function JobSwipeDeck() {
  const deckRef = useRef()
  const card0Ref = useRef()
  const card1Ref = useRef()
  const card2Ref = useRef()
  const stamp0Ref = useRef()
  const stamp1Ref = useRef()
  const stamp2Ref = useRef()
  const isHighlightRef = useRef(false)

  // Generate textures once in useMemo
  const textures = useMemo(() => {
    return JOB_CARDS_DATA.map((job) => createJobCardTexture(job))
  }, [])

  // Animation timeline clock
  useFrame((state) => {
    if (!deckRef.current) return
    const t = state.clock.getElapsedTime()

    // Interactive mouse parallax tilt
    const targetRotY = state.pointer.x * 0.38
    const targetRotX = -state.pointer.y * 0.28
    deckRef.current.rotation.y += (targetRotY - deckRef.current.rotation.y) * 0.08
    deckRef.current.rotation.x += (targetRotX - deckRef.current.rotation.x) * 0.08

    // Continuous 5.2s cinematic swipe cycle
    const cycleDuration = 5.2
    const totalCycles = Math.floor(t / cycleDuration)
    const progress = (t % cycleDuration) / cycleDuration

    // Card assignment per cycle
    const topIdx = totalCycles % 3
    const nextIdx = (totalCycles + 1) % 3
    const backIdx = (totalCycles + 2) % 3

    const cards = [card0Ref.current, card1Ref.current, card2Ref.current]
    const topCard = cards[topIdx]
    const nextCard = cards[nextIdx]
    const backCard = cards[backIdx]

    if (!topCard || !nextCard || !backCard) return

    const isSwiping = progress >= 0.65 && progress < 0.88
    isHighlightRef.current = isSwiping

    // Animate holographic stamps
    const stamps = [stamp0Ref.current, stamp1Ref.current, stamp2Ref.current]
    stamps.forEach((s, idx) => {
      if (!s) return
      if (idx === topIdx && isSwiping) {
        const sp = (progress - 0.65) / 0.23
        if (sp > 0.1) {
          s.visible = true
          s.scale.setScalar(Math.min(1, sp * 1.5))
        } else {
          s.visible = false
        }
      } else {
        s.visible = false
      }
    })

    // Idle float breathing
    const breath = Math.sin(t * 1.4) * 0.035

    if (progress < 0.65) {
      // ── PHASE 1: Hover, Floating & Scanning ──
      topCard.position.set(0, breath, 0.22)
      topCard.rotation.set(0, 0, Math.sin(t * 1.0) * 0.02)
      topCard.scale.setScalar(1)

      nextCard.position.set(0.24, -0.02 + breath * 0.6, -0.16)
      nextCard.rotation.set(0.03, -0.12, 0.06)
      nextCard.scale.setScalar(0.96)

      backCard.position.set(-0.28, 0.03 + breath * 0.4, -0.42)
      backCard.rotation.set(0.05, 0.14, -0.08)
      backCard.scale.setScalar(0.92)
    } else if (progress < 0.88) {
      // ── PHASE 2: Dynamic Swipe Right (Match / Apply!) ──
      const sp = (progress - 0.65) / 0.23
      const ease = sp * sp * (3 - 2 * sp) // smooth cubic ease

      // Top card swipes right with dynamic rotation & lift
      topCard.position.set(ease * 3.6, breath + ease * 0.35, 0.22 + ease * 0.2)
      topCard.rotation.set(0, ease * 0.2, -ease * 0.45)
      topCard.scale.setScalar(1 - ease * 0.15)

      // Next card slides forward to take foreground
      nextCard.position.set(0.24 * (1 - ease), -0.02 * (1 - ease) + breath, -0.16 + ease * 0.38)
      nextCard.rotation.set(0.03 * (1 - ease), -0.12 * (1 - ease), 0.06 * (1 - ease))
      nextCard.scale.setScalar(0.96 + ease * 0.04)

      // Back card moves into next position
      backCard.position.set(-0.28 + ease * 0.52, 0.03 - ease * 0.05 + breath * 0.5, -0.42 + ease * 0.26)
      backCard.rotation.set(0.05 - ease * 0.02, 0.14 - ease * 0.26, -0.08 + ease * 0.14)
      backCard.scale.setScalar(0.92 + ease * 0.04)
    } else {
      // ── PHASE 3: Restack and settle ──
      const rp = (progress - 0.88) / 0.12
      // Swiped card slips behind to the back
      topCard.position.set(-0.28 * rp, 0.03 * rp + breath * 0.4, -0.42)
      topCard.rotation.set(0.05 * rp, 0.14 * rp, -0.08 * rp)
      topCard.scale.setScalar(0.92)

      nextCard.position.set(0, breath, 0.22)
      nextCard.rotation.set(0, 0, 0)
      nextCard.scale.setScalar(1)

      backCard.position.set(0.24, -0.02 + breath * 0.6, -0.16)
      backCard.rotation.set(0.03, -0.12, 0.06)
      backCard.scale.setScalar(0.96)
    }
  })

  return (
    <group ref={deckRef} position={[0, -0.05, 0]}>
      {/* Card 0 */}
      <group ref={card0Ref}>
        <SingleJobCard
          texture={textures[0]}
          glowColor="#FF3300"
          stampRef={stamp0Ref}
          hasLaser={true}
        />
      </group>

      {/* Card 1 */}
      <group ref={card1Ref}>
        <SingleJobCard
          texture={textures[1]}
          glowColor="#38BDF8"
          stampRef={stamp1Ref}
        />
      </group>

      {/* Card 2 */}
      <group ref={card2Ref}>
        <SingleJobCard
          texture={textures[2]}
          glowColor="#10B981"
          stampRef={stamp2Ref}
        />
      </group>

      {/* Floating 3D Action Controls (Tinder buttons) */}
      <group position={[0, -1.22, 0.32]}>
        <ActionButton3D position={[-0.54, 0, 0]} color="#EF4444" symbol="cross" />
        <ActionButton3D position={[0, 0, 0]} color="#F59E0B" symbol="star" />
        <ActionButton3D
          position={[0.54, 0, 0]}
          color="#10B981"
          symbol="heart"
          isHighlightRef={isHighlightRef}
        />
      </group>

      {/* Tech Orbital Rings */}
      <TechOrbitalRings />

      {/* Neural Cyber Particles */}
      <CyberParticles />
    </group>
  )
}

/* Perspective Cybernetic Floor Grid */
function CyberFloorGrid() {
  const gridRef = useRef()

  useFrame((state) => {
    if (!gridRef.current) return
    const t = state.clock.getElapsedTime()
    gridRef.current.position.z = ((t * 0.3) % 0.8) - 0.4
  })

  return (
    <group position={[0, -1.35, -0.2]} rotation={[0.28, 0, 0]}>
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8, 24, 24]} />
        <meshStandardMaterial
          color="#101322"
          emissive="#FF3300"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export function JobSwipeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.3], fov: 38 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#38BDF8" />

      {/* Cinematic Rim & Accent Lighting */}
      <pointLight position={[-2.5, 1.5, 2]} intensity={2.2} color="#FF3300" distance={7} />
      <pointLight position={[2.5, -1, 2]} intensity={2.5} color="#10B981" distance={7} />
      <pointLight position={[0, 2.8, 2.5]} intensity={1.5} color="#38BDF8" distance={6} />

      {/* Perspective Ground Grid */}
      <CyberFloorGrid />

      {/* Animated Holographic Job Deck */}
      <JobSwipeDeck />
    </Canvas>
  )
}


/* ───────────────────────────────────────────────
   IntelliEx Scene — Animated financial bars
   ─────────────────────────────────────────────── */
function CandleBar({ position, maxHeight, delay, color }) {
  const ref = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() + delay
    // Animate height
    const h = maxHeight * (0.5 + 0.5 * Math.sin(t * 0.6 + delay))
    ref.current.scale.y = h
    ref.current.position.y = (h * 0.5) - 0.8
    // Glow on active
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.1 + 0.15 * Math.sin(t * 1.2 + delay)
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.12, 1, 0.12]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  )
}

function PriceLine() {
  const ref = useRef()
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 40; i++) {
      const x = (i / 39) * 2.4 - 1.2
      const y = Math.sin(i * 0.3) * 0.3 + Math.sin(i * 0.7) * 0.15
      pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }, [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.position.z = Math.sin(t * 0.4) * 0.05
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#FF3300" linewidth={1} opacity={0.6} transparent />
    </line>
  )
}

export function IntelliExScene() {
  const bars = useMemo(() => {
    const b = []
    for (let i = 0; i < 16; i++) {
      const x = (i / 15) * 2.2 - 1.1
      const h = 0.3 + Math.random() * 0.7
      const green = Math.random() > 0.4
      b.push({
        key: i,
        position: [x, 0, 0],
        maxHeight: h,
        delay: i * 0.3,
        color: green ? '#22c55e' : '#ef4444',
      })
    }
    return b
  }, [])

  return (
    <Canvas camera={{ position: [0, 0.5, 3], fov: 30 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.6} color="#ffeedd" />
      {/* Base platform */}
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[2.8, 0.02, 0.8]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.5} />
      </mesh>
      {bars.map((bar) => (
        <CandleBar key={bar.key} {...bar} />
      ))}
      <PriceLine />
    </Canvas>
  )
}

/* ───────────────────────────────────────────────
   GestureSense Scene — Floating tracking shapes
   ─────────────────────────────────────────────── */
function HandNode({ position, delay, size = 0.06 }) {
  const ref = useRef()
  const matRef = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() + delay
    ref.current.position.x = position[0] + Math.sin(t * 0.7) * 0.08
    ref.current.position.y = position[1] + Math.cos(t * 0.5) * 0.06
    ref.current.position.z = position[2] + Math.sin(t * 0.9 + 1) * 0.04
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.3 + 0.3 * Math.sin(t * 2)
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        ref={matRef}
        color="#FF3300"
        emissive="#FF3300"
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

function ConnectionLine({ from, to, delay }) {
  const ref = useRef()

  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [from, to])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() + delay
    ref.current.material.opacity = 0.15 + 0.1 * Math.sin(t * 1.5)
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#FF3300" opacity={0.2} transparent />
    </line>
  )
}

function ScanningRing() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2
    ref.current.rotation.z = t * 0.3
    ref.current.material.opacity = 0.08 + 0.06 * Math.sin(t * 0.8)
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.6, 0.005, 8, 64]} />
      <meshStandardMaterial color="#FF3300" opacity={0.15} transparent />
    </mesh>
  )
}

export function GestureSenseScene() {
  // Hand landmark positions (simplified 5-finger layout)
  const landmarks = useMemo(() => [
    [0, -0.3, 0],       // wrist
    [-0.15, -0.1, 0],   // thumb base
    [-0.25, 0.1, 0],    // thumb tip
    [-0.08, 0.15, 0],   // index base
    [-0.06, 0.35, 0],   // index tip
    [0.02, 0.15, 0],    // middle base
    [0.03, 0.38, 0],    // middle tip
    [0.12, 0.13, 0],    // ring base
    [0.11, 0.32, 0],    // ring tip
    [0.2, 0.1, 0],      // pinky base
    [0.22, 0.25, 0],    // pinky tip
  ], [])

  const connections = useMemo(() => [
    [0, 1], [1, 2],     // thumb
    [0, 3], [3, 4],     // index
    [0, 5], [5, 6],     // middle
    [0, 7], [7, 8],     // ring
    [0, 9], [9, 10],    // pinky
    [3, 5], [5, 7], [7, 9], // palm connections
  ], [])

  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 30 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 3, 3]} intensity={0.5} color="#ffeedd" />
      <group position={[0, -0.05, 0]}>
        {landmarks.map((pos, i) => (
          <HandNode key={i} position={pos} delay={i * 0.2} size={i === 0 ? 0.08 : 0.045} />
        ))}
        {connections.map(([a, b], i) => (
          <ConnectionLine key={i} from={landmarks[a]} to={landmarks[b]} delay={i * 0.15} />
        ))}
        <ScanningRing />
      </group>
    </Canvas>
  )
}

/* ───────────────────────────────────────────────
   Hyperlocal Hand Scene — 3D neighborhood map:
   errand pin → tasker pin, live route dots, GPS
   pulses, and a floating errand box
   ─────────────────────────────────────────────── */

const ROUTE_A = { x: -0.95, z: 0.5 }
const ROUTE_B = { x: 0.95, z: -0.45 }
const ROUTE_MID = { x: 0, y: 0.62, z: 0.1 }

function routePoint(t) {
  const ax = ROUTE_A.x, az = ROUTE_A.z
  const bx = ROUTE_B.x, bz = ROUTE_B.z
  const x1 = ax + (ROUTE_MID.x - ax) * t
  const z1 = az + (ROUTE_MID.z - az) * t
  const y1 = 0.06 + (ROUTE_MID.y - 0.06) * t
  const x2 = ROUTE_MID.x + (bx - ROUTE_MID.x) * t
  const z2 = ROUTE_MID.z + (bz - ROUTE_MID.z) * t
  const y2 = ROUTE_MID.y + (0.06 - ROUTE_MID.y) * t
  return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, z: z1 + (z2 - z1) * t }
}

function MapPin({ x, z, color }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.09, 0.3, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function PulseRing({ x, z, offset }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const phase = (t * 0.55 + offset) % 1
    ref.current.scale.setScalar(0.4 + phase * 1.7)
    ref.current.material.opacity = 0.5 * (1 - phase)
  })
  return (
    <mesh ref={ref} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.15, 0.19, 32]} />
      <meshStandardMaterial color="#E4572E" emissive="#E4572E" emissiveIntensity={0.6} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

function RouteDots() {
  const group = useRef()
  const N = 16
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.children.forEach((dot, i) => {
      const p = (i / N + t * 0.1) % 1
      const pt = routePoint(p)
      dot.position.set(pt.x, pt.y + 0.05, pt.z)
      dot.scale.setScalar(0.7 + 0.5 * (0.5 + 0.5 * Math.sin(t * 4 + i)))
    })
  })
  return (
    <group ref={group}>
      {Array.from({ length: N }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#E4572E" emissive="#E4572E" emissiveIntensity={0.9} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function ErrandBox() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.position.y = 0.72 + Math.sin(t * 1.6) * 0.06
    ref.current.rotation.y = t * 0.8
    ref.current.rotation.x = Math.sin(t * 0.9) * 0.15
  })
  return (
    <mesh ref={ref} position={[ROUTE_A.x, 0.72, ROUTE_A.z]}>
      <boxGeometry args={[0.16, 0.16, 0.16]} />
      <meshStandardMaterial color="#E8E6E3" emissive="#E8E6E3" emissiveIntensity={0.12} roughness={0.5} />
    </mesh>
  )
}

function MapGrid() {
  const tiles = useMemo(() => {
    const arr = []
    for (let gx = -3; gx <= 3; gx++) {
      for (let gz = -3; gz <= 3; gz++) {
        arr.push({
          key: `${gx}-${gz}`,
          x: gx * 0.34,
          z: gz * 0.34,
          tone: (gx + gz) % 2 === 0 ? '#1D2025' : '#22262D',
        })
      }
    }
    return arr
  }, [])
  return (
    <group>
      {tiles.map((tl) => (
        <mesh key={tl.key} position={[tl.x, 0, tl.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.31, 0.31]} />
          <meshStandardMaterial color={tl.tone} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function MapWorld() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.25) * 0.18
  })
  return (
    <group ref={group} rotation={[-0.52, 0, 0]} position={[0, -0.35, 0]}>
      <MapGrid />
      <MapPin x={ROUTE_A.x} z={ROUTE_A.z} color="#E8E6E3" />
      <MapPin x={ROUTE_B.x} z={ROUTE_B.z} color="#E4572E" />
      <PulseRing x={ROUTE_B.x} z={ROUTE_B.z} offset={0} />
      <PulseRing x={ROUTE_B.x} z={ROUTE_B.z} offset={0.5} />
      <RouteDots />
      <ErrandBox />
    </group>
  )
}

export function HyperlocalScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.1], fov: 32 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 4]} intensity={0.8} color="#ffeedd" />
      <pointLight position={[-2, 2, 2]} intensity={1.2} color="#E4572E" distance={6} />
      <MapWorld />
    </Canvas>
  )
}

/* ───────────────────────────────────────────────
   LearnReels Scene — a phone cycling vertical reel
   cards with play buttons, live chat pings, and an
   upload progress bar (media pipeline)
   ─────────────────────────────────────────────── */

const REEL_ACCENTS = ['#E4572E', '#38BDF8', '#10B981']

function ReelCard({ index }) {
  const group = useRef()
  const accent = REEL_ACCENTS[index % 3]

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    const cycle = 3.6
    const p = ((t / cycle + index / 3) % 1)
    let y, fade
    if (p < 0.32) {
      const e = p / 0.32
      const ease = 1 - Math.pow(1 - e, 3)
      y = -1.15 + ease * 1.35
      fade = ease
    } else if (p < 0.68) {
      y = 0.2 + Math.sin(t * 1.2 + index) * 0.02
      fade = 1
    } else {
      const e = (p - 0.68) / 0.32
      const ease = e * e
      y = 0.2 + ease * 1.15
      fade = 1 - ease
    }
    group.current.position.y = y
    group.current.scale.setScalar(0.55 + 0.45 * fade)
    group.current.rotation.z = Math.sin(t * 0.8 + index * 2) * 0.05 * (1 - fade * 0.5)
    group.current.traverse((o) => {
      if (o.material && o.userData.baseOpacity !== undefined) {
        o.material.opacity = o.userData.baseOpacity * Math.max(0, fade)
      }
    })
  })

  return (
    <group
      ref={group}
      onBeforeRender={() => {
        if (group.current && !group.current.userData.basesSaved) {
          group.current.traverse((o) => {
            if (o.material && o.userData.baseOpacity === undefined) {
              o.userData.baseOpacity = o.material.opacity
            }
          })
          group.current.userData.basesSaved = true
        }
      }}
    >
      <mesh>
        <planeGeometry args={[1.06, 1.44]} />
        <meshStandardMaterial color="#1B1D24" emissive={accent} emissiveIntensity={0.05} transparent opacity={0.96} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[0.94, 1.32]} />
        <meshStandardMaterial color={accent} transparent opacity={0.14} />
      </mesh>
      {/* play button */}
      <mesh position={[0, 0, 0.016]}>
        <circleGeometry args={[0.15, 24]} />
        <meshStandardMaterial color="#0B0C10" transparent opacity={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0.02, 0, 0.02]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.075, 0.13, 3]} />
        <meshStandardMaterial color="#E8E6E3" emissive="#E8E6E3" emissiveIntensity={0.45} transparent opacity={0.95} />
      </mesh>
      {/* reel caption bars */}
      <mesh position={[-0.18, -0.52, 0.016]}>
        <planeGeometry args={[0.5, 0.05]} />
        <meshStandardMaterial color="#E8E6E3" transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.26, -0.6, 0.016]}>
        <planeGeometry args={[0.34, 0.04]} />
        <meshStandardMaterial color="#E8E6E3" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function ChatPing({ offset, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const a = t * 0.9 + offset
    ref.current.position.set(0.82 + Math.sin(a) * 0.08, 0.55 + Math.cos(a * 1.3) * 0.35, 0.3)
    ref.current.scale.setScalar(0.8 + 0.3 * Math.sin(t * 3 + offset * 2))
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} transparent opacity={0.9} />
    </mesh>
  )
}

function LiveRing() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const phase = (t * 0.7) % 1
    ref.current.scale.setScalar(0.5 + phase * 1.4)
    ref.current.material.opacity = 0.55 * (1 - phase)
  })
  return (
    <mesh ref={ref} position={[0.82, 0.55, 0.28]}>
      <torusGeometry args={[0.09, 0.008, 8, 32]} />
      <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.8} transparent opacity={0.5} />
    </mesh>
  )
}

function UploadBar() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const p = (Math.sin(t * 0.9) * 0.5 + 0.5)
    ref.current.scale.x = Math.max(0.03, p)
    ref.current.position.x = -(0.46 * (1 - p))
  })
  return (
    <group position={[0, -0.95, 0.05]}>
      <mesh>
        <planeGeometry args={[0.92, 0.05]} />
        <meshStandardMaterial color="#26282F" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ref} position={[0, 0, 0.005]}>
        <planeGeometry args={[0.92, 0.05]} />
        <meshStandardMaterial color="#E4572E" emissive="#E4572E" emissiveIntensity={0.7} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function PhoneWorld() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t * 0.4) * 0.28
    group.current.rotation.x = Math.sin(t * 0.3) * 0.05
  })
  return (
    <group ref={group} position={[0, -0.05, 0]}>
      {/* phone body + screen */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.38, 2.55, 0.1]} />
        <meshStandardMaterial color="#14151A" roughness={0.35} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.24, 2.4]} />
        <meshStandardMaterial color="#0B0C10" roughness={0.25} />
      </mesh>
      {/* reels cycling inside the screen */}
      {[0, 1, 2].map((i) => (
        <ReelCard key={i} index={i} />
      ))}
      {/* live socket pings */}
      <ChatPing offset={0} color="#38BDF8" />
      <ChatPing offset={2.2} color="#E4572E" />
      <LiveRing />
      {/* cloudinary upload progress */}
      <UploadBar />
    </group>
  )
}

export function LearnReelsScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.4], fov: 34 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 5]} intensity={0.9} color="#ffffff" />
      <pointLight position={[2.4, 1, 2.4]} intensity={1.6} color="#38BDF8" distance={7} />
      <pointLight position={[-2.4, -1, 2]} intensity={1.2} color="#E4572E" distance={7} />
      <PhoneWorld />
    </Canvas>
  )
}
