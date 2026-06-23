import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { useMouseParallax } from '@hooks/useMouseParallax'
import { scrollScenes } from '@data/scrollScenes'

interface Props {
  progressRef: React.MutableRefObject<number>
  /** Path to your .glb, e.g. '/models/avatar.glb'. Leave undefined to use the placeholder primitive. */
  modelUrl?: string
}

export function AvatarRig({ progressRef, modelUrl }: Props) {
  return modelUrl ? (
    <GltfAvatar progressRef={progressRef} modelUrl={modelUrl} />
  ) : (
    <PlaceholderAvatar progressRef={progressRef} />
  )
}

// ── Real GLB avatar — drop in once you have one ──────────────────────────
function GltfAvatar({ progressRef, modelUrl }: Required<Props>) {
  const group = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Object3D>(null!)
  const { scene, animations } = useGLTF(modelUrl)
  const { actions } = useAnimations(animations, group)
  const { lerp } = useMouseParallax()
  const currentClip = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Cache the head bone if your rig names it "Head" — adjust to match your model
    head.current = scene.getObjectByName('Head') ?? group.current
  }, [scene])

  useFrame((_, delta) => {
    const { index, t } = sceneLerp(progressRef.current)
    const a = scrollScenes[index].pose
    const b = scrollScenes[index + 1]?.pose ?? a

    group.current.position.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], t),
      THREE.MathUtils.lerp(a.position[1], b.position[1], t),
      THREE.MathUtils.lerp(a.position[2], b.position[2], t)
    )
    group.current.rotation.set(
      THREE.MathUtils.lerp(a.rotation[0], b.rotation[0], t),
      THREE.MathUtils.lerp(a.rotation[1], b.rotation[1], t),
      THREE.MathUtils.lerp(a.rotation[2], b.rotation[2], t)
    )

    // Crossfade animation clips as we cross scene boundaries
    const targetClip = t < 0.5 ? a.clip : b.clip
    if (targetClip && targetClip !== currentClip.current && actions[targetClip]) {
      const next = actions[targetClip]!
      const prev = currentClip.current ? actions[currentClip.current] : undefined
      next.reset().fadeIn(0.5).play()
      prev?.fadeOut(0.5)
      currentClip.current = targetClip
    }

    // Subtle head-turn toward the cursor, layered on top of the scroll pose
    const mouse = lerp(0.08)
    if (head.current) {
      head.current.rotation.y += mouse.x * 0.12 * delta * 60
      head.current.rotation.x += mouse.y * 0.08 * delta * 60
    }
  })

  return <primitive ref={group} object={scene} />
}

// ── Placeholder so you can build/test the scroll mechanic with no asset ──
function PlaceholderAvatar({ progressRef }: Props) {
  const group = useRef<THREE.Group>(null!)
  const { lerp } = useMouseParallax()

  useFrame(() => {
    const { index, t } = sceneLerp(progressRef.current)
    const a = scrollScenes[index].pose
    const b = scrollScenes[index + 1]?.pose ?? a
    const mouse = lerp(0.08)

    group.current.position.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], t),
      THREE.MathUtils.lerp(a.position[1], b.position[1], t),
      THREE.MathUtils.lerp(a.position[2], b.position[2], t)
    )
    group.current.rotation.set(
      THREE.MathUtils.lerp(a.rotation[0], b.rotation[0], t) + mouse.y * 0.1,
      THREE.MathUtils.lerp(a.rotation[1], b.rotation[1], t) + mouse.x * 0.15,
      0
    )
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#e8b894" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.45, 1, 8, 16]} />
        <meshStandardMaterial color="#7c5cfc" />
      </mesh>
    </group>
  )
}

function sceneLerp(progress: number) {
  const index = Math.min(Math.floor(progress), scrollScenes.length - 2)
  const t = THREE.MathUtils.clamp(progress - index, 0, 1)
  return { index: Math.max(index, 0), t }
}