import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drives the R3F camera based on scroll position.
 * Call this inside a component that lives inside <Canvas>.
 */
export function useScrollCamera() {
  const { camera } = useThree()

  useEffect(() => {
    // Baseline position
    camera.position.set(0, 0, 5)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    })

    // Hero → About: pull back and tilt up
    tl.to(camera.position, { z: 7, y: 1, duration: 1, ease: 'none' }, 0)
    // About → Work: orbit left
    tl.to(camera.position, { x: -1.5, duration: 1, ease: 'none' }, 1)
    // Work → Skills: push in and right
    tl.to(camera.position, { z: 5, x: 1, y: 0, duration: 1, ease: 'none' }, 2)
    // Skills → Contact: settle back to centre
    tl.to(camera.position, { x: 0, z: 6, duration: 1, ease: 'none' }, 3)

    return () => {
      tl.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === 'body')
        .forEach((st) => st.kill())
    }
  }, [camera])
}
