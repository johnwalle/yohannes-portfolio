import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface RevealConfig {
  selector: string
  y?: number
  x?: number
  opacity?: number
  duration?: number
  stagger?: number
  delay?: number
  ease?: string
  start?: string
  scaleX?: number
  transformOrigin?: string
}

/**
 * Batch-registers multiple scroll-triggered reveal animations
 * scoped to a container ref. All cleaned up on unmount.
 */
export function useScrollReveal(reveals: RevealConfig[]) {
  const ref = useRef<HTMLElement>(null!)

  useEffect(() => {
    const ctx = gsap.context(() => {
      reveals.forEach(({
        selector,
        y = 0,
        x = 0,
        opacity = 0,
        duration = 0.9,
        stagger = 0,
        delay = 0,
        ease = 'power3.out',
        start = 'top 86%',
        scaleX,
        transformOrigin,
      }) => {
        const from: gsap.TweenVars = { opacity, duration, stagger, delay, ease }
        if (y)              from.y = y
        if (x)              from.x = x
        if (scaleX !== undefined) from.scaleX = scaleX
        if (transformOrigin)      from.transformOrigin = transformOrigin

        gsap.from(selector, {
          ...from,
          scrollTrigger: {
            trigger: selector,
            start,
            toggleActions: 'play none none none',
          },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
