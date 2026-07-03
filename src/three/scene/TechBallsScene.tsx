import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const TECHS = [
  { label: 'React',        short: 'Re',  fg: '#61dafb', bg: '#0d2137', glow: '#61dafb' },
  { label: 'Next.js',      short: 'N→',  fg: '#ffffff', bg: '#111111', glow: '#ffffff' },
  { label: 'TypeScript',   short: 'TS',  fg: '#ffffff', bg: '#1e4f8c', glow: '#3178c6' },
  { label: 'Node.js',      short: '⬡',   fg: '#68a063', bg: '#0d1f0f', glow: '#68a063' },
  { label: 'Three.js',     short: '3',   fg: '#ffffff', bg: '#0a0a1a', glow: '#a78bfa' },
  { label: 'GraphQL',      short: '◈',   fg: '#e535ab', bg: '#1a0514', glow: '#e535ab' },
  { label: 'PostgreSQL',   short: 'PG',  fg: '#ffffff', bg: '#0d2035', glow: '#336791' },
  { label: 'Docker',       short: '▣',   fg: '#2496ed', bg: '#041224', glow: '#2496ed' },
  { label: 'GSAP',         short: 'GS',  fg: '#88ce02', bg: '#0d1800', glow: '#88ce02' },
  { label: 'Figma',        short: '◉',   fg: '#ffffff', bg: '#1a0a2e', glow: '#a259ff' },
  { label: 'MySQL',        short: 'SQL', fg: '#f29111', bg: '#1a0e00', glow: '#f29111' },
  { label: 'JavaScript',   short: 'JS',  fg: '#1a1200', bg: '#f7df1e', glow: '#f7df1e' },
  { label: 'MongoDB',      short: 'M',   fg: '#ffffff', bg: '#0b2b1c', glow: '#47a248' },
  { label: 'React Native', short: 'RN',  fg: '#61dafb', bg: '#0a1f2e', glow: '#61dafb' },
  { label: 'Tailwind CSS', short: '~',   fg: '#ffffff', bg: '#062730', glow: '#38bdf8' },
  { label: 'Express',      short: 'Ex',  fg: '#ffffff', bg: '#141414', glow: '#ffffff' },
  { label: 'NestJS',       short: 'Ne',  fg: '#ffffff', bg: '#2b0713', glow: '#e0234e' },
]

const BASE_POSITIONS: [number, number, number][] = [
  [ 0.0,  0.0,  0.0], [ 1.05,  0.30,  0.10], [-1.05,  0.20, -0.10],
  [ 0.50, -0.95,  0.25], [-0.50,  0.95, -0.20], [ 1.45, -0.45, -0.25],
  [-1.45, -0.30,  0.20], [ 0.00,  1.15,  0.45], [ 0.00, -1.15, -0.30],
  [ 0.95,  0.85, -0.35], [-0.95, -0.85,  0.35], [ 0.55,  0.00,  0.95],
  [-0.55,  0.00, -0.95], [ 1.65,  0.60,  0.55], [-1.65, -0.60, -0.55],
  [ 0.20,  1.55, -0.15], [-0.20, -1.55,  0.15],
]

function makeTexture(tech: typeof TECHS[0]): THREE.CanvasTexture {
  const size = 512
  const cv   = document.createElement('canvas')
  cv.width   = cv.height = size
  const ctx  = cv.getContext('2d')!

  // Base color
  ctx.fillStyle = tech.bg
  ctx.fillRect(0, 0, size, size)

  // Specular highlight — top left
  const hi = ctx.createRadialGradient(size * 0.35, size * 0.28, 0, size * 0.5, size * 0.5, size * 0.55)
  hi.addColorStop(0,   'rgba(255,255,255,0.26)')
  hi.addColorStop(0.5, 'rgba(255,255,255,0.04)')
  hi.addColorStop(1,   'rgba(0,0,0,0.22)')
  ctx.fillStyle = hi
  ctx.fillRect(0, 0, size, size)

  // Subtle bottom glow (brand color)
  const gl = ctx.createRadialGradient(size * 0.5, size * 0.85, 0, size * 0.5, size * 0.85, size * 0.45)
  gl.addColorStop(0,   tech.glow + '44')
  gl.addColorStop(1,   'transparent')
  ctx.fillStyle = gl
  ctx.fillRect(0, 0, size, size)

  // Short label — large, centered
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.font         = `900 ${tech.short.length > 2 ? 108 : 148}px Arial Black, sans-serif`
  ctx.shadowColor  = tech.glow
  ctx.shadowBlur   = 32
  ctx.fillStyle    = tech.fg
  ctx.fillText(tech.short, size / 2, size * 0.44)

  // Full name — small, bottom
  ctx.shadowBlur   = 10
  ctx.font         = `600 44px Arial, sans-serif`
  ctx.fillStyle    = tech.fg
  ctx.globalAlpha  = 0.7
  ctx.fillText(tech.label.toUpperCase(), size / 2, size * 0.72)
  ctx.globalAlpha  = 1

  // Brand color rim
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.465, 0, Math.PI * 2)
  ctx.strokeStyle  = tech.glow
  ctx.lineWidth    = 7
  ctx.globalAlpha  = 0.3
  ctx.stroke()
  ctx.globalAlpha  = 1

  return new THREE.CanvasTexture(cv)
}

interface BallProps {
  tech:         typeof TECHS[0]
  basePosition: THREE.Vector3
  index:        number
  onHover:      (label: string | null) => void
}

const GEO = new THREE.SphereGeometry(0.5, 64, 64)

function Ball({ tech, basePosition, index, onHover }: BallProps) {
  const meshRef  = useRef<THREE.Mesh>(null!)
  const hovered  = useRef(false)
  const vel      = useRef(new THREE.Vector3())
  const phase    = useMemo(() => (index / TECHS.length) * Math.PI * 2, [index])
  const freq     = useMemo(() => 0.28 + index * 0.06, [index])

  const texture  = useMemo(() => makeTexture(tech), [tech])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t  = clock.getElapsedTime()
    const isH = hovered.current

    // Apply burst velocity + dampen
    mesh.position.add(vel.current)
    vel.current.lerp(new THREE.Vector3(), 0.08)

    // Spring back to base
    const dx = basePosition.x - mesh.position.x
    const dy = basePosition.y - mesh.position.y
    const dz = basePosition.z - mesh.position.z
    mesh.position.x += dx * 0.05
    mesh.position.y += dy * 0.05
    mesh.position.z += dz * 0.05

    // Micro idle breathe — only when not hovered
    if (!isH) {
      mesh.position.x += Math.sin(t * freq + phase)       * 0.006
      mesh.position.y += Math.cos(t * freq * 0.8 + phase) * 0.006
    } else {
      // Hover: gentle pulse in place
      mesh.position.y += Math.sin(t * 4) * 0.005
    }

    // Rotation
    mesh.rotation.y += isH ? 0.025 : 0.004
    mesh.rotation.x += isH ? 0.008 : 0.001

    // Scale spring
    const ts = isH ? 1.18 : 1.0
    mesh.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.1)

    // Emissive glow on hover
    const mat = mesh.material as THREE.MeshPhysicalMaterial
    const targetEmissive = isH
      ? new THREE.Color(tech.glow)
      : new THREE.Color(0x000000)
    mat.emissive.lerp(targetEmissive, 0.08)
    mat.emissiveIntensity = isH ? 0.18 : 0
  })

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hovered.current = true
    onHover(tech.label)
    document.body.style.cursor = 'pointer'
  }

  const onPointerOut = () => {
    hovered.current = false
    onHover(null)
    document.body.style.cursor = 'default'
  }

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    vel.current.set(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.55 + 0.2,
      (Math.random() - 0.5) * 0.35
    )
  }

  return (
    <mesh
      ref={meshRef}
      position={basePosition}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
      geometry={GEO}
    >
      <meshPhysicalMaterial
        map={texture}
        roughness={0.06}
        metalness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        reflectivity={0.95}
        envMapIntensity={1.4}
        transparent
        opacity={0.96}
      />
    </mesh>
  )
}

function ClusterGroup({ onHover }: { onHover: (l: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { pointer } = useThree()

  const basePositions = useMemo(
    () => BASE_POSITIONS.map(p => new THREE.Vector3(...p)),
    []
  )

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += (pointer.x * 0.18 - groupRef.current.rotation.y) * 0.04
    groupRef.current.rotation.x += (-pointer.y * 0.08 - groupRef.current.rotation.x) * 0.04
    groupRef.current.rotation.y += 0.003
  })

  return (
    <group ref={groupRef}>
      {TECHS.map((tech, i) => (
        <Ball
          key={tech.label}
          tech={tech}
          basePosition={basePositions[i]}
          index={i}
          onHover={onHover}
        />
      ))}
    </group>
  )
}

interface Props {
  onHover?: (label: string | null) => void
}

export function TechBallsScene({ onHover = () => {} }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 46 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]}   intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, 3, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[0, -4, 5]}  intensity={0.8} color="#818cf8" />
      <pointLight position={[3, -3, 4]}  intensity={0.6} color="#f0abfc" />

      <ClusterGroup onHover={onHover} />

      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}