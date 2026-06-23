import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { AvatarRig } from './AvatarRig'

interface Props {
  progressRef: React.MutableRefObject<number>
  modelUrl?: string
}

export function AvatarScene({ progressRef, modelUrl }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 4.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 4, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#a78bfa" />

      <Suspense fallback={null}>
        <AvatarRig progressRef={progressRef} modelUrl={modelUrl} />
      </Suspense>
    </Canvas>
  )
}