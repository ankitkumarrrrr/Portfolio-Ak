import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── GLSL Shaders ─── */
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uIntensity;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Multi-octave organic displacement
    float slowTime = uTime * 0.15;
    float n1 = snoise(vec3(pos.x * 0.8, pos.y * 0.8, slowTime)) * 0.6;
    float n2 = snoise(vec3(pos.x * 1.6, pos.y * 1.6, slowTime * 0.7)) * 0.25;
    float n3 = snoise(vec3(pos.x * 3.2, pos.y * 3.2, slowTime * 0.5)) * 0.15;
    float noise = n1 + n2 + n3;
    
    // Mouse influence — spatial, not uniform
    float dist = length(pos.xy - uMouse * 3.0);
    float mouseInfluence = smoothstep(3.0, 0.0, dist) * uIntensity;
    float mouseDisplace = snoise(vec3(pos.xy * 1.5, slowTime + 2.0)) * mouseInfluence;
    
    // Combine
    float elevation = noise * 0.4 + mouseDisplace * 0.8;
    pos.z += elevation;
    
    vElevation = elevation;
    vDistortion = mouseInfluence;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying float vDistortion;
  
  void main() {
    // Deep monochrome with subtle tonal variation
    vec3 baseColor = vec3(0.04, 0.04, 0.045); // #0A0A0B-ish
    vec3 midTone = vec3(0.08, 0.08, 0.085);   // Slightly lighter
    vec3 highlight = vec3(0.14, 0.14, 0.15);   // Surface tone
    
    // Mix based on elevation
    float t = smoothstep(-0.5, 0.5, vElevation);
    vec3 color = mix(baseColor, midTone, t);
    
    // Subtle vermilion bleed at distortion peaks
    float vermilionBleed = smoothstep(0.3, 0.8, vDistortion);
    color = mix(color, vec3(1.0, 0.2, 0.0), vermilionBleed * 0.06);
    
    // Edge darkening for depth
    float edgeFade = smoothstep(0.0, 0.7, length(vUv - 0.5));
    color = mix(color, baseColor * 0.5, edgeFade * 0.6);
    
    // Very subtle grid line effect
    float gridX = smoothstep(0.98, 1.0, abs(sin(vUv.x * 60.0 + vElevation * 2.0)));
    float gridY = smoothstep(0.98, 1.0, abs(sin(vUv.y * 60.0 + vElevation * 2.0)));
    float grid = max(gridX, gridY) * 0.04;
    color += grid;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

/* ─── Fluid Mesh Component ─── */
function FluidMesh() {
  const meshRef = useRef()
  const materialRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uIntensity: { value: 0 },
  }), [])

  const handlePointerMove = useCallback((e) => {
    // Convert screen coords to mesh space
    targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  // Attach global listener
  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handlePointerMove)
      return () => window.removeEventListener('mousemove', handlePointerMove)
    }
  }, [handlePointerMove])

  useFrame((state) => {
    if (!materialRef.current) return

    const time = state.clock.getElapsedTime()
    materialRef.current.uniforms.uTime.value = time

    // Lerp mouse for smooth inertia
    const mouse = mouseRef.current
    const target = targetMouseRef.current
    mouse.x += (target.x - mouse.x) * 0.04
    mouse.y += (target.y - mouse.y) * 0.04
    materialRef.current.uniforms.uMouse.value.set(mouse.x * 2, mouse.y * 2)

    // Ramp up intensity
    const intensity = materialRef.current.uniforms.uIntensity.value
    materialRef.current.uniforms.uIntensity.value = Math.min(intensity + 0.003, 1.0)

    // Subtle camera breathing
    state.camera.position.x = Math.sin(time * 0.05) * 0.1
    state.camera.position.y = Math.cos(time * 0.07) * 0.05
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.35, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[12, 12, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ─── Main Export ─── */
export default function FluidBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ cursor: 'none' }}>
      <Canvas
        camera={{ position: [0, 2.5, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.08} color="#E8E6E3" />
        <FluidMesh />
      </Canvas>
    </div>
  )
}
