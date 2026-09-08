import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
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
   JobSwipe Scene — Tinder-style card stack
   ─────────────────────────────────────────────── */
function SwipeCard({ position, rotation, color, delay, label }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() + delay
    // Gentle float + subtle tilt
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.03
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.02
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Text-like strip */}
      <mesh position={[0, 0.3, 0.015]}>
        <boxGeometry args={[0.8, 0.08, 0.005]} />
        <meshStandardMaterial color="#ffffff" opacity={0.15} transparent />
      </mesh>
      <mesh position={[-0.1, 0.1, 0.015]}>
        <boxGeometry args={[0.6, 0.06, 0.005]} />
        <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>
      <mesh position={[-0.2, -0.1, 0.015]}>
        <boxGeometry args={[0.9, 0.04, 0.005]} />
        <meshStandardMaterial color="#ffffff" opacity={0.08} transparent />
      </mesh>
      {/* Swipe indicator line */}
      <mesh position={[0, -0.65, 0.015]}>
        <boxGeometry args={[0.4, 0.02, 0.005]} />
        <meshStandardMaterial color={label === 'match' ? '#22c55e' : '#ef4444'} opacity={0.6} transparent />
      </mesh>
    </group>
  )
}

export function JobSwipeScene() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15
  })

  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 30 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} color="#ffeedd" />
      <group ref={groupRef}>
        {/* Back cards (stacked) */}
        <SwipeCard position={[0, 0, -0.3]} rotation={[0, 0, 0.05]} color="#1c1c1f" delay={2} label="skip" />
        <SwipeCard position={[0, 0, -0.15]} rotation={[0, 0, -0.02]} color="#222225" delay={1} label="skip" />
        {/* Front card */}
        <SwipeCard position={[0, 0, 0]} rotation={[0, 0, -0.08]} color="#2a2a2e" delay={0} label="match" />
      </group>
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
