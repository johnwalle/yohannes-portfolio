import { useState } from 'react'
import { TechBallsScene } from '@three/scene/TechBallsScene'

export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="skills" style={{
      height: '100vh',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── GIANT BACKGROUND TEXT ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0rem',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
      }}>
        {/* Line 1 — outlined */}
        <p style={{
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(167,139,250,0.12)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          MY TECH
        </p>

        {/* Line 2 — filled, very dim */}
        <p style={{
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'rgba(167,139,250,0.04)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          STACK
        </p>

        {/* Line 3 — outlined, offset right */}
        <p style={{
          fontSize: 'clamp(5rem, 14vw, 13rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.04)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          alignSelf: 'flex-end',
          marginRight: '-2vw',
        }}>
          2025
        </p>
      </div>

      {/* ── HORIZONTAL MARQUEE — bottom strip ── */}
      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: 0,
        right: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}>
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          width: 'max-content',
          animation: 'marquee 18s linear infinite',
        }}>
          {/* Repeat twice so it loops seamlessly */}
          {[...Array(2)].map((_, ri) => (
            ['React', 'Next.js', 'TypeScript', 'Node.js', 'Three.js',
             'GraphQL', 'PostgreSQL', 'Docker', 'GSAP', 'Figma', 'MySQL', 'JavaScript'
            ].map((t) => (
              <span key={`${ri}-${t}`} style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(167,139,250,0.3)',
                whiteSpace: 'nowrap',
              }}>
                {t} <span style={{ color: 'rgba(167,139,250,0.15)', margin: '0 0.5rem' }}>·</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── GLOWS ── */}
      <div style={{
        position: 'absolute', right: '-8%', bottom: '5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', left: '-8%', top: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── TOP LEFT LABEL ── */}
      <div style={{
        position: 'absolute', top: '8%', left: '6%',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: '0.68rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#a78bfa', marginBottom: '0.5rem',
        }}>
          03 — Stack
        </p>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          fontWeight: 800, letterSpacing: '-0.02em',
          color: '#fff', lineHeight: 1.1,
        }}>
          What I<br />
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Work With</span>
        </h2>
      </div>

      {/* ── HOVERED TECH NAME ── */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 6,
        pointerEvents: 'none',
        textAlign: 'center',
        transition: 'opacity 0.25s ease',
        opacity: hovered ? 1 : 0,
      }}>
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: '#a78bfa',
          marginBottom: '0.3rem',
        }}>
          hovering
        </p>
        <p style={{
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          fontWeight: 900, letterSpacing: '-0.02em', color: '#fff',
        }}>
          {hovered}
        </p>
      </div>

      {/* ── HINT ── */}
      <div style={{
        position: 'absolute', bottom: '4%', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
        }}>
          hover · click to interact
        </p>
      </div>

      {/* ── 3D CANVAS ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
      }}>
        <TechBallsScene onHover={setHovered} />
      </div>

      {/* ── MARQUEE KEYFRAME ── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

    </section>
  )
}