import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseParallax } from '@hooks/useMouseParallax'
import { scrollScenes } from '@data/scrollScenes'

const SKIN       = '#f2c19b'
const SKIN_SHADE = '#e8ad84'
const HAIR       = '#3a2418'
const HOODIE     = '#3f7fd6'
const HOODIE_DK  = '#2f63ad'
const SHIRT      = '#eceeec'
const PANTS      = '#232733'
const DESK       = '#d8b48a'
const DESK_LEG   = '#6b4a30'
const CHAIR      = '#2a3550'
const CHAIR_POLE = '#14161c'
const KEYCAP     = '#e9ebee'
const KEY_BASE   = '#1c1f26'
const SHOE       = '#2f3d56'
const SHOE_SOLE  = '#d9dce0'
const RIM        = '#a78bfa'

interface Props {
  progressRef: React.MutableRefObject<number>
}

export function AvatarRig({ progressRef }: Props) {
  const root        = useRef<THREE.Group>(null!)
  const headGroup   = useRef<THREE.Group>(null!)
  const torso       = useRef<THREE.Mesh>(null!)

  const shoulderL   = useRef<THREE.Group>(null!)
  const shoulderR   = useRef<THREE.Group>(null!)
  const elbowL      = useRef<THREE.Group>(null!)
  const elbowR      = useRef<THREE.Group>(null!)
  const wristL      = useRef<THREE.Group>(null!)
  const wristR      = useRef<THREE.Group>(null!)

  const eyeL        = useRef<THREE.Mesh>(null!)
  const eyeR        = useRef<THREE.Mesh>(null!)
  const pupilL      = useRef<THREE.Mesh>(null!)
  const pupilR      = useRef<THREE.Mesh>(null!)

  const { lerp } = useMouseParallax()

  // ── Shared geometries ─────────────────────────────────────────────
  const torsoGeo   = useMemo(() => new THREE.CapsuleGeometry(0.26, 0.42, 8, 16), [])
  const headGeo    = useMemo(() => new THREE.SphereGeometry(0.27, 32, 32), [])
  const jawGeo     = useMemo(() => new THREE.SphereGeometry(0.18, 24, 24), [])
  const earGeo     = useMemo(() => new THREE.SphereGeometry(0.045, 12, 12), [])
  const hairTopGeo = useMemo(
    () => new THREE.SphereGeometry(0.275, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.85),
    []
  )
  const eyeWhiteGeo = useMemo(() => new THREE.SphereGeometry(0.052, 16, 16), [])
  const pupilGeo     = useMemo(() => new THREE.SphereGeometry(0.026, 12, 12), [])
  const noseGeo      = useMemo(() => new THREE.SphereGeometry(0.028, 10, 10), [])

  const upperArmGeo = useMemo(() => new THREE.CapsuleGeometry(0.075, 0.24, 6, 12), [])
  const lowerArmGeo = useMemo(() => new THREE.CapsuleGeometry(0.062, 0.24, 6, 12), [])
  const handGeo     = useMemo(() => new THREE.SphereGeometry(0.07, 14, 14), [])
  const fingerGeo   = useMemo(() => new THREE.CapsuleGeometry(0.014, 0.05, 4, 8), [])

  const upperLegGeo = useMemo(() => new THREE.CapsuleGeometry(0.105, 0.34, 6, 12), [])
  const lowerLegGeo = useMemo(() => new THREE.CapsuleGeometry(0.095, 0.34, 6, 12), [])
  const shoeGeo     = useMemo(() => new THREE.BoxGeometry(0.15, 0.1, 0.26), [])
  const soleGeo     = useMemo(() => new THREE.BoxGeometry(0.155, 0.035, 0.27), [])

  // Mouth built as a real THREE.Line object — avoids JSX <line> colliding
  // with the SVG <line> element type in TypeScript's DOM typings.
  const mouthLine = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 0.05, 0.025, Math.PI * 0.15, Math.PI * 0.85, false, 0)
    const pts = curve.getPoints(16)
    const geo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, p.y, 0)))
    const mat = new THREE.LineBasicMaterial({ color: '#8a5a45' })
    return new THREE.Line(geo, mat)
  }, [])

  // ── Per-finger typing schedule (4 per hand) ───────────────────────
  const strikeSchedule = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      phase: (i * 0.91) % 1,
      speed: 2.1 + (i % 3) * 0.35,
    })),
    []
  )
  const fingerRefs = useRef<THREE.Group[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const progress = progressRef.current
    const { index, frac } = sceneAt(progress)
    const a = scrollScenes[index].pose
    const b = scrollScenes[index + 1]?.pose ?? a

    root.current.rotation.y = THREE.MathUtils.lerp(a.rotation[1], b.rotation[1], frac)
    root.current.position.x = THREE.MathUtils.lerp(a.position[0], b.position[0], frac)
    root.current.position.z = THREE.MathUtils.lerp(a.position[2], b.position[2], frac)

    // Idle breathing
    torso.current.scale.set(1, 1.05 + Math.sin(t * 1.4) * 0.012, 0.92)

    const waveWeight = weightFor(progress, 0)
    const typeWeight = weightFor(progress, scrollScenes.length - 1)

    // ── Head: gentle idle sway + cursor look + glance down while typing ──
    const mouse = lerp(0.06)
    const glanceDown = typeWeight * 0.1
    headGroup.current.rotation.y =
      Math.sin(t * 0.4) * 0.05 + mouse.x * 0.25
    headGroup.current.rotation.x =
      0.12 + Math.sin(t * 0.5) * 0.01 + mouse.y * 0.12 + glanceDown

    // Eye blink
    const blink = Math.sin(t * 0.7) > 0.997 ? 0.1 : 1
    eyeL.current.scale.y = blink
    eyeR.current.scale.y = blink
    pupilL.current.scale.y = blink
    pupilR.current.scale.y = blink

    // ── Shoulders: resting toward keyboard ───────────────────────────
    const restShoulderX = -0.55
    shoulderL.current.rotation.x = restShoulderX
    shoulderR.current.rotation.x = restShoulderX

    // ── Wave (first chapter) ──────────────────────────────────────────
    if (waveWeight > 0.01) {
      const waveX = -1.9 + Math.sin(t * 3) * 0.25
      shoulderR.current.rotation.x = THREE.MathUtils.lerp(restShoulderX, waveX, waveWeight)
      shoulderR.current.rotation.z = THREE.MathUtils.lerp(0.18, 0.55, waveWeight)
      elbowR.current.rotation.x = THREE.MathUtils.lerp(-1.7, -0.4, waveWeight)
      wristR.current.rotation.z = Math.sin(t * 6) * 0.3 * waveWeight
    } else {
      shoulderR.current.rotation.z = 0.18
      elbowR.current.rotation.x = -1.7
      wristR.current.rotation.z = 0
    }

    // ── Typing (last chapter) — per-finger strike, hand stays mostly still ──
    const wristBob = typeWeight > 0.04 ? Math.sin(t * 1.7) * 0.006 * typeWeight : 0
    wristL.current.position.y = wristBob
    wristR.current.position.y = wristBob

    fingerRefs.current.forEach((finger, i) => {
      if (!finger) return
      const sched = strikeSchedule[i]
      const cycle = (t * sched.speed + sched.phase) % 1
      const pressCurve = cycle < 0.18 ? Math.sin((cycle / 0.18) * Math.PI) : 0
      finger.rotation.x = THREE.MathUtils.lerp(0.25, 0.85, pressCurve * typeWeight)
    })

    if (typeWeight <= 0.01) {
      wristL.current.rotation.x = 0
      wristR.current.rotation.x = 0
    } else {
      const cycleR = (t * 1.8) % 1
      const pressR = cycleR < 0.16 ? Math.sin((cycleR / 0.16) * Math.PI) : 0
      wristR.current.rotation.x = pressR * 0.2 * typeWeight

      const cycleL = (t * 1.8 + 0.5) % 1
      const pressL = cycleL < 0.16 ? Math.sin((cycleL / 0.16) * Math.PI) : 0
      wristL.current.rotation.x = pressL * 0.2 * typeWeight
    }
  })

  return (
    <group ref={root} position={[0, -1.1, 0]}>

      {/* ── Chair ─────────────────────────────────────────────── */}
      <group>
        <mesh position={[0, 1.15, -0.32]} rotation={[0.12, 0, 0]}>
          <capsuleGeometry args={[0.34, 0.55, 8, 16]} />
          <meshStandardMaterial color={CHAIR} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.62, -0.05]}>
          <cylinderGeometry args={[0.34, 0.36, 0.16, 24]} />
          <meshStandardMaterial color={CHAIR} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.42, -0.05]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
          <meshStandardMaterial color={CHAIR_POLE} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.22, -0.05]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 5]} />
          <meshStandardMaterial color={CHAIR_POLE} roughness={0.6} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, 0.22, -0.05]}
            rotation={[0, i * ((Math.PI * 2) / 5), 0]}
          >
            <boxGeometry args={[0.2, 0.02, 0.02]} />
            <meshStandardMaterial color={CHAIR_POLE} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Torso ─────────────────────────────────────────────── */}
      <mesh ref={torso} position={[0, 1.0, 0]} geometry={torsoGeo}>
        <meshStandardMaterial color={HOODIE} roughness={0.85} />
      </mesh>
      <RimGlow geometry={torsoGeo} position={[0, 1.0, 0]} color={RIM} scale={1.06} opacity={0.14} />
      <mesh position={[0, 1.27, 0.07]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.13, 0.025, 8, 16]} />
        <meshStandardMaterial color={SHIRT} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0.255]}>
        <boxGeometry args={[0.018, 0.32, 0.01]} />
        <meshStandardMaterial color={HOODIE_DK} roughness={0.7} />
      </mesh>

      {/* ── Legs ──────────────────────────────────────────────── */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.13, 0.78, 0.02]}>
          <mesh position={[0, -0.17, 0]} rotation={[-1.35, 0, 0]} geometry={upperLegGeo}>
            <meshStandardMaterial color={PANTS} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.42, 0.34]} rotation={[-0.08, 0, 0]} geometry={lowerLegGeo}>
            <meshStandardMaterial color={PANTS} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.62, 0.46]} geometry={shoeGeo}>
            <meshStandardMaterial color={SHOE} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.675, 0.46]} geometry={soleGeo}>
            <meshStandardMaterial color={SHOE_SOLE} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Neck ──────────────────────────────────────────────── */}
      <mesh position={[0, 1.28, 0.02]}>
        <cylinderGeometry args={[0.08, 0.09, 0.1, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* ── Head ──────────────────────────────────────────────── */}
      <group ref={headGroup} position={[0, 1.5, 0.04]}>
        <mesh geometry={headGeo} scale={[1, 1.04, 0.96]}>
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <RimGlow geometry={headGeo} color={RIM} scale={1.08} opacity={0.18} />

        <mesh position={[0, -0.14, 0.06]} scale={[0.92, 0.62, 0.85]} geometry={jawGeo}>
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>

        {[-0.26, 0.26].map((x) => (
          <mesh key={x} position={[x, -0.01, 0]} geometry={earGeo}>
            <meshStandardMaterial color={SKIN} roughness={0.55} />
          </mesh>
        ))}

        <mesh
          position={[0, 0.045, -0.01]}
          scale={[1.03, 1.0, 1.02]}
          geometry={hairTopGeo}
        >
          <meshStandardMaterial color={HAIR} roughness={0.75} />
        </mesh>

        {Array.from({ length: 7 }).map((_, s) => {
          const ang = (s / 7) * Math.PI - Math.PI / 2
          return (
            <mesh
              key={s}
              position={[Math.sin(ang) * 0.16, 0.23, -0.05 + Math.cos(ang) * 0.08]}
              rotation={[-0.5, 0, -ang * 0.6]}
            >
              <coneGeometry args={[0.035, 0.11, 8]} />
              <meshStandardMaterial color={HAIR} roughness={0.75} />
            </mesh>
          )
        })}

        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.1, 0.07, 0.235]} rotation={[0, 0, side * 0.12]}>
            <boxGeometry args={[0.08, 0.018, 0.02]} />
            <meshStandardMaterial color={HAIR} roughness={0.75} />
          </mesh>
        ))}

        <mesh ref={eyeL} position={[-0.1, 0.025, 0.245]} geometry={eyeWhiteGeo}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh ref={pupilL} position={[-0.1, 0.02, 0.285]} geometry={pupilGeo}>
          <meshStandardMaterial color="#2a2118" roughness={0.3} />
        </mesh>
        <mesh ref={eyeR} position={[0.1, 0.025, 0.245]} geometry={eyeWhiteGeo}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh ref={pupilR} position={[0.1, 0.02, 0.285]} geometry={pupilGeo}>
          <meshStandardMaterial color="#2a2118" roughness={0.3} />
        </mesh>

        <mesh position={[0, -0.03, 0.27]} scale={[0.8, 0.9, 0.8]} geometry={noseGeo}>
          <meshStandardMaterial color={SKIN_SHADE} roughness={0.5} />
        </mesh>

        <primitive object={mouthLine} position={[0, -0.085, 0.275]} />
      </group>

      {/* ── Arms ──────────────────────────────────────────────── */}
      {(['L', 'R'] as const).map((side) => {
        const mirror = side === 'L' ? -1 : 1
        const shoulderRef = side === 'L' ? shoulderL : shoulderR
        const elbowRef = side === 'L' ? elbowL : elbowR
        const wristRef = side === 'L' ? wristL : wristR

        return (
          <group
            key={side}
            ref={shoulderRef}
            position={[mirror * 0.27, 1.18, 0]}
            rotation={[-0.55, 0, mirror * 0.18]}
          >
            <mesh position={[0, -0.14, 0]} geometry={upperArmGeo}>
              <meshStandardMaterial color={HOODIE} roughness={0.85} />
            </mesh>

            <group ref={elbowRef} position={[0, -0.27, 0]} rotation={[-1.7, 0, 0]}>
              <mesh position={[0, -0.14, 0]} geometry={lowerArmGeo}>
                <meshStandardMaterial color={SKIN} roughness={0.6} />
              </mesh>

              <group ref={wristRef} position={[0, -0.27, 0]}>
                <mesh geometry={handGeo} scale={[1, 0.8, 1.1]}>
                  <meshStandardMaterial color={SKIN} roughness={0.6} />
                </mesh>
                {Array.from({ length: 4 }).map((_, f) => (
                  <group
                    key={f}
                    position={[(f - 1.5) * 0.024, -0.05, 0.035]}
                    ref={(g) => {
                      if (g) fingerRefs.current[(side === 'L' ? 0 : 4) + f] = g
                    }}
                  >
                    <mesh geometry={fingerGeo} rotation={[0.25, 0, 0]}>
                      <meshStandardMaterial color={SKIN} roughness={0.6} />
                    </mesh>
                  </group>
                ))}
              </group>
            </group>
          </group>
        )
      })}

      {/* ── Desk + keyboard ───────────────────────────────────── */}
      <group position={[0, 1.0, 0.62]}>
        <mesh>
          <boxGeometry args={[1.0, 0.045, 0.55]} />
          <meshStandardMaterial color={DESK} roughness={0.6} />
        </mesh>
        {[[-0.43, -0.22], [0.43, -0.22], [-0.43, 0.22], [0.43, 0.22]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.23, z]}>
            <boxGeometry args={[0.035, 0.42, 0.035]} />
            <meshStandardMaterial color={DESK_LEG} roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0.034, 0.1]}>
          <boxGeometry args={[0.34, 0.018, 0.13]} />
          <meshStandardMaterial color={KEY_BASE} roughness={0.6} />
        </mesh>
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => (
            <mesh key={`${r}-${c}`} position={[(c - 4) * 0.033, 0.046, 0.04 + r * 0.032]}>
              <boxGeometry args={[0.028, 0.012, 0.028]} />
              <meshStandardMaterial color={KEYCAP} roughness={0.55} />
            </mesh>
          ))
        )}
      </group>

    </group>
  )
}

function RimGlow({
  geometry,
  color,
  scale = 1.06,
  position = [0, 0, 0],
  opacity = 0.2,
}: {
  geometry: THREE.BufferGeometry
  color: string
  scale?: number
  position?: [number, number, number]
  opacity?: number
}) {
  return (
    <mesh geometry={geometry} scale={scale} position={position}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function sceneAt(progress: number) {
  const index = Math.min(Math.max(Math.floor(progress), 0), scrollScenes.length - 2)
  const frac = THREE.MathUtils.clamp(progress - index, 0, 1)
  return { index, frac }
}

function weightFor(progress: number, chapterIndex: number) {
  const d = Math.abs(progress - chapterIndex)
  return THREE.MathUtils.clamp(1 - d, 0, 1)
}