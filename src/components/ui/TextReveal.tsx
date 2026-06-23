import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

export function TextReveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = ref.current
    gsap.fromTo(el,
      { y: 32, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}
