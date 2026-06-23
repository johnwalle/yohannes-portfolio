import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { HeroScene }      from '@three/scene/HeroScene'
import { MagneticButton } from '@components/ui/MagneticButton'
import styles from './Hero.module.css'

export function Hero() {
  const eyebrow = useRef<HTMLParagraphElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const sub     = useRef<HTMLParagraphElement>(null)
  const cta     = useRef<HTMLDivElement>(null)
  const hint    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait one frame so refs are guaranteed to be painted
    const id = requestAnimationFrame(() => {
      const els = [eyebrow.current, heading.current, sub.current, cta.current, hint.current]
      if (els.some((el) => !el)) return // bail if any ref missing

      const tl = gsap.timeline({ delay: 1.8 }) // after loader finishes (~1.7s)
      tl.from(eyebrow.current!, { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from(heading.current!, { y: 40, opacity: 0, duration: 1,   ease: 'power3.out' }, '-=0.5')
        .from(sub.current!,     { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from(cta.current!,     { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from(hint.current!,    { opacity: 0, duration: 1 },                               '-=0.2')
    })

    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.canvas}>
        <HeroScene />
      </div>

      <div className={styles.content}>
        <p ref={eyebrow} className={styles.eyebrow}>
          Full-Stack Developer — Addis Ababa, ET
        </p>
        <h1 ref={heading} className={styles.heading}>
          Building digital<br />
          <span className={styles.dim}>experiences that</span><br />
          feel alive.
        </h1>
        <p ref={sub} className={styles.sub}>
          I craft performant, beautiful web applications that merge
          clean code with cinematic design.
        </p>
        <div ref={cta} className={styles.cta}>
          <MagneticButton
            className={styles.btnPrimary}
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View my work
          </MagneticButton>
          <MagneticButton
            className={styles.btnOutline}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Say hello →
          </MagneticButton>
        </div>
      </div>

      <div ref={hint} className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>scroll</span>
      </div>
    </section>
  )
}
