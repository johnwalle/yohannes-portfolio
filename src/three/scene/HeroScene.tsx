import { Suspense } from 'react'
import { Canvas }  from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { ParticleField }    from './ParticleField'
import { FloatingModel }    from './FloatingModel'
import { PostProcessing }   from './PostProcessing'
import { useScrollCamera }  from './useScrollCamera'
import { useStore }         from '@store/index'

function SceneInner() {
  useScrollCamera()
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]}    intensity={2}   color="#a78bfa" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#3b82f6" />
      <ParticleField />
      <FloatingModel />
      <PostProcessing />
    </>
  )
}

export function HeroScene() {
  const setLoaded = useStore((s) => s.setSceneLoaded)

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={() => setLoaded(true)}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneInner />
      </Suspense>
    </Canvas>
  )
}
