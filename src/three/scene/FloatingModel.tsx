import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseParallax } from '@hooks/useMouseParallax'

// Placeholder geometry — swap for useGLTF() once you have a .glb avatar
export function FloatingModel() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { lerp } = useMouseParallax()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const mouse = lerp(0.06) // smoothed -1..1 mouse position

    mesh.current.rotation.y = t * 0.15 + mouse.x * 0.4
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.08 + mouse.y * 0.25
    mesh.current.position.y = Math.sin(t * 0.5) * 0.15
  })

  return (
    <mesh ref={mesh} castShadow>
      <icosahedronGeometry args={[1.4, 2]} />
      <meshStandardMaterial
        color="#a78bfa"
        wireframe={false}
        metalness={0.6}
        roughness={0.2}
        emissive="#4c2db2"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}