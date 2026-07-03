import { useRef } from 'react'
import { GithubIcon, LinkedInIcon, XIcon, InstagramIcon } from './SocialIcons'

interface SocialLink {
  label: string
  href:  string
  icon:  React.ReactNode
  color: string
  glow:  string
}

const SOCIALS: SocialLink[] = [
  { label: 'GitHub',    href: 'https://github.com/johnwalle', icon: <GithubIcon />,    color: '#f0f6fc', glow: 'rgba(240,246,252,0.35)' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/yohanneswalle',         icon: <LinkedInIcon />,  color: '#0a66c2', glow: 'rgba(10,102,194,0.45)'  },
  { label: 'X',         href: 'https://twitter.com/Leojo_W',          icon: <XIcon />,         color: '#ffffff', glow: 'rgba(255,255,255,0.3)'  },
  { label: 'Instagram', href: 'https://instagram.com/w.leojo',        icon: <InstagramIcon />, color: '#e1306c', glow: 'rgba(225,48,108,0.45)'  },
]

function SocialItem({ s }: { s: SocialLink }) {
  const ref      = useRef<HTMLAnchorElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  const onEnter = () => {
    if (!ref.current || !labelRef.current) return
    ref.current.style.borderColor   = s.color
    ref.current.style.color         = s.color
    ref.current.style.background    = `${s.color}14`
    ref.current.style.boxShadow     = `0 0 0 1px ${s.color}33, 0 4px 18px ${s.glow}`
    ref.current.style.transform     = 'translateX(6px) scale(1.06)'
    labelRef.current.style.opacity  = '1'
    labelRef.current.style.transform = 'translateX(0)'
  }

  const onLeave = () => {
    if (!ref.current || !labelRef.current) return
    ref.current.style.borderColor   = 'rgba(255,255,255,0.1)'
    ref.current.style.color         = 'rgba(255,255,255,0.4)'
    ref.current.style.background    = 'rgba(255,255,255,0.02)'
    ref.current.style.boxShadow     = 'none'
    ref.current.style.transform     = 'translateX(0) scale(1)'
    labelRef.current.style.opacity  = '0'
    labelRef.current.style.transform = 'translateX(-6px)'
  }

  return (
    <a
      ref={ref}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={s.label}
      style={{
        position:       'relative',
        width:          '38px',
        height:         '38px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        border:         '1px solid rgba(255,255,255,0.1)',
        borderRadius:   '10px',
        background:     'rgba(255,255,255,0.02)',
        color:          'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(6px)',
        transition:     'all 0.32s cubic-bezier(0.16,1,0.3,1)',
        cursor:         'pointer',
      }}
    >
      {s.icon}
      <span
        ref={labelRef}
        style={{
          position:      'absolute',
          left:          '46px',
          top:            '50%',
          transform:     'translate(-6px, -50%)',
          whiteSpace:    'nowrap',
          fontSize:      '0.66rem',
          fontWeight:    700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color:         s.color,
          opacity:       0,
          pointerEvents: 'none',
          transition:    'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {s.label}
      </span>
    </a>
  )
}


export function SocialRail({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position:      'absolute',
        left:          '1.75rem',
        top:           '50%',
        transform:     'translateY(-50%)',
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.85rem',
        zIndex:        10,
      }}
    >
      {SOCIALS.map(s => (
        <SocialItem key={s.label} s={s} />
      ))}

      {/* vertical connecting line */}
      <div
        style={{
          position:   'absolute',
          left:       '18px',
          top:        '44px',
          bottom:     '6px',
          width:      '1px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
          zIndex:     -1,
        }}
      />
    </div>
  )
}