import { useEffect, useRef } from 'react'

export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Lerp toward target each frame — call this inside useFrame (R3F) or rAF
  const lerp = (speed = 0.05) => {
    mouse.current.x += (target.current.x - mouse.current.x) * speed
    mouse.current.y += (target.current.y - mouse.current.y) * speed
    return mouse.current
  }

  return { mouse, lerp }
}
