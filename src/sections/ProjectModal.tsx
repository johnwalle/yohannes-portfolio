import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Project } from '@data/projects';

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function ArrowIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (dir: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ProjectModal({ project, isOpen, onClose, onNavigate, hasPrev, hasNext }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // enter transition: flip a class one tick after mount
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
  }, [isOpen]);

  // lock scroll + esc/arrow keys
  useEffect(() => {
    if (!isOpen) return;

    // overflow:hidden alone doesn't reliably stop background scroll in every
    // layout (e.g. if a wrapper other than body is the real scroll container,
    // or on touch devices). Pinning body with position:fixed guarantees the
    // page underneath cannot move while the modal is open.
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevLeft = style.left;
    const prevRight = style.right;
    const prevWidth = style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';

    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
      if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      style.position = prevPosition;
      style.top = prevTop;
      style.left = prevLeft;
      style.right = prevRight;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, hasPrev, hasNext, onClose, onNavigate]);

  if (!project && !isOpen) return null;
  const p = project;
  if (!p) return null;

  const navBtnStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(10,10,10,0.55)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  const linkPrimary: React.CSSProperties = {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '11px 22px',
    borderRadius: '999px',
    background: p.accent,
    color: '#000',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const linkSecondary: React.CSSProperties = {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '11px 22px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  };

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        // NOTE: no flex/align-items here — centering a scroll container with
        // align-items:center clips overflow content and makes it unreachable
        // by scrolling. Centering happens on the inner wrapper below instead.
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        background: mounted ? 'rgba(4,4,6,0.82)' : 'rgba(4,4,6,0)',
        backdropFilter: mounted ? 'blur(14px)' : 'blur(0px)',
        transition: 'background 0.45s ease, backdrop-filter 0.45s ease',
      }}
    >
      {/* ambient glow tied to project accent */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 20%, ${p.glow} 0%, transparent 70%)`,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* prev / next, desktop side arrows */}
      {hasPrev && (
        <button
          aria-label="Previous project"
          onClick={() => onNavigate('prev')}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = p.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10,10,10,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
          style={{ ...navBtnStyle, position: 'fixed', left: 'clamp(0.75rem, 3vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)', zIndex: 201 }}
          className="pm-side-nav"
        >
          <ArrowIcon dir="left" />
        </button>
      )}
      {hasNext && (
        <button
          aria-label="Next project"
          onClick={() => onNavigate('next')}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = p.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10,10,10,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
          style={{ ...navBtnStyle, position: 'fixed', right: 'clamp(0.75rem, 3vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)', zIndex: 201 }}
          className="pm-side-nav"
        >
          <ArrowIcon dir="right" />
        </button>
      )}

      {/* centering wrapper — grows with content instead of clipping it */}
      <div
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          position: 'relative',
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1rem, 4vw, 3rem)',
        }}
      >
      {/* panel */}
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '880px',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1px solid ${mounted ? p.accentDim : 'rgba(255,255,255,0.08)'}`,
          background: '#0a0a0c',
          boxShadow: mounted ? `0 60px 120px -40px ${p.glow}, 0 0 0 1px rgba(255,255,255,0.03)` : 'none',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0px) scale(1)' : 'translateY(28px) scale(0.96)',
          transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.5s ease',
        }}
      >
        <button
          ref={closeBtnRef}
          aria-label="Close project details"
          onClick={onClose}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10,10,10,0.6)'; }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 5,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.16)',
            background: 'rgba(10,10,10,0.6)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          <CloseIcon />
        </button>

        {/* hero image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            background: p.imgBg,
            overflow: 'hidden',
          }}
        >
          {p.image ? (
            <img
              key={p.id}
              src={p.image}
              alt={p.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                animation: 'pm-fade-in 0.5s ease',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: [
                  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                  'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                ].join(','),
                backgroundSize: '40px 40px',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #0a0a0c 0%, rgba(10,10,12,0.15) 45%, transparent 75%)',
            }}
          />
          <div style={{ position: 'absolute', bottom: '20px', left: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.accent, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
              {p.number}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: p.accent,
                background: p.accentBg,
                padding: '5px 13px',
                borderRadius: '999px',
                backdropFilter: 'blur(8px)',
              }}
            >
              {p.tag}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{p.year}</span>
          </div>
        </div>

        {/* content */}
        <div style={{ padding: 'clamp(1.5rem, 4vw, 2.75rem)' }}>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.3rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '1rem',
              lineHeight: 1.05,
            }}
          >
            {p.title}
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
              maxWidth: '640px',
              marginBottom: '1.75rem',
            }}
          >
            {p.description}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              Stack
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {p.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '6px 14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px -8px ${p.glow}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                style={linkPrimary}
              >
                View live ↗
              </a>
            )}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = p.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
                style={linkSecondary}
              >
                Source ↗
              </a>
            )}
          </div>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes pm-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 720px) {
          .pm-side-nav { display: none; }
        }
      `}</style>
    </div>
  );

  // Render into document.body so the modal escapes any ancestor with a
  // transform/filter/perspective set (e.g. a smooth-scroll or scroll-jack
  // wrapper) — those create a new containing block for position:fixed,
  // which otherwise breaks the modal's fixed positioning and scrolling.
  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}