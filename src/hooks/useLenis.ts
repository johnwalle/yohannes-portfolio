import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function useLenis() {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Keep ScrollTrigger's scroll position in sync with Lenis's virtual scroll
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis from GSAP's own ticker instead of a separate rAF loop —
    // this puts Lenis, ScrollTrigger, and the 3D scroll-camera on the exact
    // same frame clock, which is what makes scroll feel like one cohesive
    // thing instead of several slightly-out-of-sync animations.
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return lenis
}

export function getLenis() {
  return lenis
}