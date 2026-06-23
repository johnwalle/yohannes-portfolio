import { useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null!)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width  / 2
    const y = e.clientY - rect.top  - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
  }

  const handleMouseLeave = () => {
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
  }

  const handleMouseEnter = () => {
    ref.current.style.transition = 'transform 0.15s ease-out'
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      data-cursor-hover
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </button>
  )
}