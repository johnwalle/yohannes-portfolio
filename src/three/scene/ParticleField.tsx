import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader   from '../shaders/particles.vert.glsl'
import fragmentShader from '../shaders/particles.frag.glsl'

const COUNT = 1200

export function ParticleField() {
  const points = useRef<THREE.Points>(null!)
  const mat    = useRef<THREE.ShaderMaterial>(null!)

  const [positions, scales] = useMemo(() => {
    const pos    = new Float32Array(COUNT * 3)
    const scale  = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      scale[i]       = Math.random()
    }
    return [pos, scale]
  }, [])

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize:       { value: 80 },
    uColor:      { value: new THREE.Color('#a78bfa') },
  }), [])

  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
