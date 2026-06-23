import { useEffect, useRef } from 'react'
import { useStore } from '@store/index'
import styles from './Cursor.module.css'

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor-hover]'

export function Cursor() {
  const reducedMotion = useStore((s) => s.reducedMotion)
  const dotRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (reducedMotion || !isFinePointer) return

    document.documentElement.classList.add('has-custom-cursor')

    const ring = { x: 0, y: 0 }
    let mouseX = 0
    let mouseY = 0
    let frame = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const tick = () => {
      ring.x += (mouseX - ring.x) * 0.18
      ring.y += (mouseY - ring.y) * 0.18
      ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      frame = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest(INTERACTIVE_SELECTOR)) ringRef.current.classList.add(styles.hover)
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest(INTERACTIVE_SELECTOR)) ringRef.current.classList.remove(styles.hover)
    }

    const onLeaveWindow = () => {
      dotRef.current.style.opacity = '0'
      ringRef.current.style.opacity = '0'
    }
    const onEnterWindow = () => {
      dotRef.current.style.opacity = '1'
      ringRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeaveWindow)
    document.addEventListener('mouseenter', onEnterWindow)
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeaveWindow)
      document.removeEventListener('mouseenter', onEnterWindow)
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}