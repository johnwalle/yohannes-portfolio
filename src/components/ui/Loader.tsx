import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Loader.module.css'

interface Props {
  onComplete: () => void
}

export function Loader({ onComplete }: Props) {
  const overlay = useRef<HTMLDivElement>(null)
  const bar     = useRef<HTMLDivElement>(null)
  const text    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!overlay.current || !bar.current || !text.current) return

    const tl = gsap.timeline({ onComplete })

    tl.to(bar.current, {
      scaleX: 1, duration: 1.2, ease: 'power2.inOut',
    })
    .to(text.current, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
    }, '-=0.2')
    .to(overlay.current, {
      yPercent: -100, duration: 0.7, ease: 'power3.inOut',
    }, '+=0.05')

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div ref={overlay} className={styles.overlay}>
      <p ref={text} className={styles.text}>Loading</p>
      <div className={styles.track}>
        <div ref={bar} className={styles.bar} />
      </div>
    </div>
  )
}
