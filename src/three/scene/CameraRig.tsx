import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollScenes } from '@data/scrollScenes'

interface Props {
  progressRef: React.MutableRefObject<number>
}

const lookTarget = new THREE.Vector3(0, 0.95, 0)

export function CameraRig({ progressRef }: Props) {
  const { camera } = useThree()

  useFrame(() => {
    const progress = progressRef.current
    const index = THREE.MathUtils.clamp(Math.floor(progress), 0, scrollScenes.length - 2)
    const frac = THREE.MathUtils.clamp(progress - index, 0, 1)

    const a = scrollScenes[index].camera
    const b = scrollScenes[index + 1]?.camera ?? a

    camera.position.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], frac),
      THREE.MathUtils.lerp(a.position[1], b.position[1], frac),
      THREE.MathUtils.lerp(a.position[2], b.position[2], frac)
    )

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(a.fov, b.fov, frac)
      camera.updateProjectionMatrix()
    }

    camera.lookAt(lookTarget)
  })

  return null
}