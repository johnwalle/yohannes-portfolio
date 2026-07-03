import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { AvatarRig } from './AvatarRig'

interface Props {
  progressRef: React.MutableRefObject<number>
}

export function AvatarScene({ progressRef }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 4.4], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated />

      {/* Soft studio lighting + reflections */}
      <Environment preset="city" environmentIntensity={0.35} />

      <ambientLight intensity={0.4} />
      <pointLight
        position={[3, 4, 4]}
        intensity={1.8}
        color="#ffffff"
      />
      <pointLight
        position={[-4, -1, -3]}
        intensity={0.7}
        color="#a78bfa"
      />
      <spotLight
        position={[0, 3, -4]}
        angle={0.5}
        intensity={1.2}
        color="#7c5cfc"
      />

      <Suspense fallback={null}>
        <AvatarRig progressRef={progressRef} />

        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.55}
          scale={6}
          blur={2.4}
          far={2}
          color="#000000"
        />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.3}
          mipmapBlur
        />
        <Vignette
          offset={0.25}
          darkness={0.65}
        />
      </EffectComposer>
    </Canvas>
  )
}