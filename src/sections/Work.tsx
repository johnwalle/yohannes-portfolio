import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { projects, Project } from '@data/projects';
import { ProjectModal } from './ProjectModal';

const pad = (n: number) => String(n).padStart(2, '0');

// ---------- icons ----------
function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ---------- Card ----------
function Card({
  p,
  width = '340px',
  height = '340px',
  ghostSize = '140px',
  onOpen,
}: {
  p: Project;
  width?: string;
  height?: string;
  ghostSize?: string;
  onOpen: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLImageElement>(null);

  const onEnter = () => {
    if (cardRef.current) cardRef.current.style.borderColor = p.accent;
    if (imgRef.current) imgRef.current.style.transform = 'scale(1.045)';
    if (overlayRef.current) overlayRef.current.style.transform = 'translateY(0)';
    if (descRef.current) {
      descRef.current.style.maxHeight = '90px';
      descRef.current.style.opacity = '1';
    }
    if (ghostRef.current) {
      ghostRef.current.style.transform = 'translate(-10px,-10px) scale(1.06)';
      ghostRef.current.style.opacity = '0.7';
    }
    if (shotRef.current) shotRef.current.style.opacity = '0.94';
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1200px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg)`;
    cardRef.current.style.boxShadow = `0 40px 80px -32px ${p.glow}, 0 0 0 1px ${p.accentDim}`;
  };

  const onLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(255,255,255,0.07)';
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      cardRef.current.style.boxShadow = 'none';
    }
    if (imgRef.current) imgRef.current.style.transform = 'scale(1)';
    if (overlayRef.current) overlayRef.current.style.transform = 'translateY(64px)';
    if (descRef.current) {
      descRef.current.style.maxHeight = '0px';
      descRef.current.style.opacity = '0';
    }
    if (ghostRef.current) {
      ghostRef.current.style.transform = 'translate(0,0) scale(1)';
      ghostRef.current.style.opacity = '0.35';
    }
    if (shotRef.current) shotRef.current.style.opacity = '0.74';
  };

  const liveLinkStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    padding: '6px 14px',
    borderRadius: '999px',
    background: p.accent,
    color: '#000',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'opacity 0.2s ease',
    cursor: 'pointer',
  };

  const githubLinkStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    padding: '6px 14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(p);
        }
      }}
      aria-label={`View details for ${p.title}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#0a0a0a',
        cursor: 'pointer',
        width,
        height,
        flexShrink: 0,
        transition: 'border-color 0.35s ease, transform 0.15s ease-out, box-shadow 0.4s ease',
        willChange: 'transform',
      }}
    >
      {/* background layer */}
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: p.imgBg,
          transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          transformOrigin: 'center',
        }}
      >
        {p.image ? (
          <img
            ref={shotRef}
            src={p.image}
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: 0.74,
              transition: 'opacity 0.4s ease',
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
            background: `radial-gradient(ellipse at 50% 85%, ${p.glow} 0%, transparent 58%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ghost number */}
      <div
        ref={ghostRef}
        style={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px',
          fontSize: ghostSize,
          fontWeight: 900,
          letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: `1px ${p.accentDim}`,
          userSelect: 'none',
          lineHeight: 1,
          opacity: 0.35,
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
        }}
      >
        {p.number}
      </div>

      {/* tag pill */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: p.accent,
          background: p.accentBg,
          padding: '5px 13px',
          borderRadius: '999px',
          zIndex: 4,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: p.accent,
            boxShadow: `0 0 6px ${p.accent}`,
          }}
        />
        {p.tag}
      </div>

      {/* year */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          fontSize: '0.62rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em',
          zIndex: 4,
        }}
      >
        {p.year}
      </div>

      {/* overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(6,6,8,0.98) 0%, rgba(6,6,8,0.9) 60%, transparent 100%)',
          padding: '0 1.75rem 1.75rem',
          zIndex: 3,
          transform: 'translateY(64px)',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '9px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: p.accent, letterSpacing: '0.1em' }}>
            {p.number}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            {p.tag}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: '10px',
            lineHeight: 1.1,
          }}
        >
          {p.title}
        </h3>

        <p
          ref={descRef}
          style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.44)',
            lineHeight: 1.65,
            marginBottom: '16px',
            maxHeight: '0px',
            opacity: 0,
            overflow: 'hidden',
            transition: 'max-height 0.4s ease, opacity 0.35s ease',
          }}
        >
          {p.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {p.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '0.62rem',
                  padding: '2px 9px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                style={liveLinkStyle}
              >
                Live ↗
              </a>
            )}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }}
                style={githubLinkStyle}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- useWindowSize ----------
function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

// ---------- Work ----------
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const glowARef = useRef<HTMLDivElement>(null);
  const glowBRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<0 | 1>(0);

  const [translateX, setTranslateX] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // ---------- modal state ----------
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProject = useCallback((p: Project) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSelectedProject(p);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    closeTimerRef.current = setTimeout(() => setSelectedProject(null), 450);
  }, []);

  const navigateModal = useCallback((dir: 'prev' | 'next') => {
    setSelectedProject((current) => {
      if (!current) return current;
      const idx = projects.findIndex((pr) => pr.id === current.id);
      const nextIdx = dir === 'prev' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= projects.length) return current;
      return projects[nextIdx];
    });
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const modalIndex = selectedProject ? projects.findIndex((pr) => pr.id === selectedProject.id) : -1;
  const hasPrev = modalIndex > 0;
  const hasNext = modalIndex >= 0 && modalIndex < projects.length - 1;

  const rawProgressRef = useRef(0);
  const currentXRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const activeSlideRef = useRef(0);

  const { width: windowWidth } = useWindowSize();

  // ---------- Responsive sizing (fixed type: all returns have the same shape) ----------
  const getSizes = useCallback((width: number) => {
    const isDesktop = width >= 901;
    if (!isDesktop) {
      return {
        cardWidth: 0,
        gap: 0,
        panelWidth: 0,
        cardHeight: '0px',    // now a string, not a number
        ghostSize: '100px',
        padding: '0',
        isDesktop: false,
      };
    }
    let cardWidth = 440;
    let gap = 28;
    let panelWidth = 400;
    let padding = '4rem 2.75rem';
    let cardHeight = '64vh';
    let ghostSize = '180px';

    if (width < 1400) {
      cardWidth = 380;
      gap = 24;
      panelWidth = 340;
    }
    if (width < 1200) {
      cardWidth = 340;
      gap = 20;
      panelWidth = 300;
      padding = '3rem 2rem';
      cardHeight = '58vh';
      ghostSize = '150px';
    }
    if (width < 1024) {
      cardWidth = 300;
      gap = 16;
      panelWidth = 260;
      padding = '2.5rem 1.5rem';
      cardHeight = '50vh';
      ghostSize = '120px';
    }

    return { cardWidth, gap, panelWidth, cardHeight, ghostSize, padding, isDesktop: true };
  }, []);

  const sizes = useMemo(() => getSizes(windowWidth), [windowWidth, getSizes]);
  const { cardWidth, gap, panelWidth, cardHeight, ghostSize, padding, isDesktop: desktop } = sizes;

  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);

  // ---------- Scroll‑jacking (desktop) ----------
  useEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row || !isDesktop) {
      if (wrapperRef.current) {
        wrapperRef.current.style.position = 'relative';
        wrapperRef.current.style.top = '0px';
      }
      return;
    }

    const step = (cardWidth + gap) * 2;
    const slides = Math.ceil(projects.length / 2);
    const maxTranslate = (slides - 1) * step;
    maxTranslateRef.current = maxTranslate;
    setTotalSlides(slides);
    section.style.height = `${slides * 100}vh`;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = reduceMotion ? 1 : 0.12;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = -rect.top / (rect.height - vh);
      rawProgressRef.current = Math.min(Math.max(progress, 0), 1);

      const wrapper = wrapperRef.current;
      if (wrapper) {
        if (rect.top > 0) {
          wrapper.style.position = 'relative';
          wrapper.style.top = '0px';
          wrapper.style.bottom = '';
        } else if (rect.bottom <= vh) {
          wrapper.style.position = 'absolute';
          wrapper.style.top = '';
          wrapper.style.bottom = '0px';
        } else {
          wrapper.style.position = 'fixed';
          wrapper.style.top = '0px';
          wrapper.style.bottom = '';
        }
      }
    };
    updateProgress();

    let raf = 0;
    const animate = () => {
      const target = -rawProgressRef.current * maxTranslateRef.current;
      const diff = target - currentXRef.current;
      if (Math.abs(diff) > 0.05) {
        currentXRef.current += diff * lerp;
        setTranslateX(currentXRef.current);
      } else if (currentXRef.current !== target) {
        currentXRef.current = target;
        setTranslateX(target);
      }
      const idx = maxTranslateRef.current > 0
        ? Math.round((-currentXRef.current / maxTranslateRef.current) * (slides - 1))
        : 0;
      if (idx !== activeSlideRef.current) {
        activeSlideRef.current = idx;
        setActiveSlide(idx);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [isDesktop, cardWidth, gap]);

  // crossfade ambient glow
  useEffect(() => {
    if (!isDesktop) return;
    const idx = activeSlide * 2;
    const color = projects[idx]?.glow ?? 'rgba(167,139,250,0.18)';
    const hidden = topLayerRef.current === 0 ? glowBRef.current : glowARef.current;
    const visible = topLayerRef.current === 0 ? glowARef.current : glowBRef.current;
    if (hidden) {
      hidden.style.background = `radial-gradient(ellipse 70% 55% at 50% 0%, ${color} 0%, transparent 72%)`;
      hidden.style.opacity = '1';
    }
    if (visible) visible.style.opacity = '0';
    topLayerRef.current = topLayerRef.current === 0 ? 1 : 0;
  }, [activeSlide, isDesktop]);

  const scrollToSlide = (idx: number) => {
    const section = sectionRef.current;
    if (!section || totalSlides === 0) return;
    const clampedIdx = Math.min(Math.max(idx, 0), totalSlides - 1);
    const targetProgress = totalSlides > 1 ? clampedIdx / (totalSlides - 1) : 0;
    const targetY = section.offsetTop + targetProgress * (section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const setFocusRing = (on: boolean) => (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.outline = on ? '2px solid #a78bfa' : 'none';
    e.currentTarget.style.outlineOffset = on ? '2px' : '0px';
  };

  const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)',
    color: disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  });

  const githubPillStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#a78bfa',
    border: '1px solid rgba(167,139,250,0.25)',
    borderRadius: '999px',
    padding: '8px 0',
    width: '100%',
    textAlign: 'center',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.2s ease',
  };

  // ---------- Render ----------
  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ position: 'relative', background: '#080808' }}
    >
      {isDesktop ? (
        <div
          ref={wrapperRef}
          style={{
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div ref={glowARef} style={{ position: 'absolute', inset: 0, opacity: 1, transition: 'opacity 1.1s ease', pointerEvents: 'none', zIndex: 0 }} />
          <div ref={glowBRef} style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 1.1s ease', pointerEvents: 'none', zIndex: 0 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: [
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              ].join(','),
              backgroundSize: '64px 64px',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* left panel */}
          <div
            style={{
              width: `${panelWidth}px`,
              flexShrink: 0,
              padding: padding || '4rem 2.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
              borderRight: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(8,8,8,0.4)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '1rem' }}>
                02 — Selected work
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 4.2vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 0.98, color: '#fff', marginBottom: '1.5rem' }}>
                Things I've
                <br />
                <span style={{ color: 'rgba(255,255,255,0.14)' }}>built.</span>
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: '270px' }}>
                Scroll to move horizontally through each project. Click a card for details.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                  {pad(activeSlide + 1)}
                </span>
                <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#a78bfa', width: totalSlides > 1 ? `${(activeSlide / (totalSlides - 1)) * 100}%` : '100%', transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
                <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
                  {pad(totalSlides)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                <button
                  aria-label="Previous slide"
                  disabled={activeSlide === 0}
                  onClick={() => scrollToSlide(activeSlide - 1)}
                  onFocus={setFocusRing(true)}
                  onBlur={setFocusRing(false)}
                  onMouseEnter={(e) => { if (activeSlide === 0) return; e.currentTarget.style.background = 'rgba(167,139,250,0.12)'; e.currentTarget.style.borderColor = '#a78bfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  style={navBtnStyle(activeSlide === 0)}
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Next slide"
                  disabled={activeSlide === totalSlides - 1}
                  onClick={() => scrollToSlide(activeSlide + 1)}
                  onFocus={setFocusRing(true)}
                  onBlur={setFocusRing(false)}
                  onMouseEnter={(e) => { if (activeSlide === totalSlides - 1) return; e.currentTarget.style.background = 'rgba(167,139,250,0.12)'; e.currentTarget.style.borderColor = '#a78bfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  style={navBtnStyle(activeSlide === totalSlides - 1)}
                >
                  <ChevronRight />
                </button>
              </div>

              <a
                href="https://github.com/johnwalle"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; e.currentTarget.style.borderColor = '#a78bfa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.25)'; }}
                style={githubPillStyle}
              >
                github.com/johnwalle ↗
              </a>
            </div>
          </div>

          {/* right: cards */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1,
              WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${Math.min(56, cardWidth * 0.15)}px, black calc(100% - ${Math.min(90, cardWidth * 0.2)}px), transparent 100%)`,
              maskImage: `linear-gradient(to right, transparent 0, black ${Math.min(56, cardWidth * 0.15)}px, black calc(100% - ${Math.min(90, cardWidth * 0.2)}px), transparent 100%)`,
            }}
          >
            <div
              ref={rowRef}
              style={{
                display: 'flex',
                gap: `${gap}px`,
                paddingLeft: '3rem',
                transform: `translateX(${translateX}px)`,
                willChange: 'transform',
                width: `${projects.length * (cardWidth + gap) - gap}px`,
              }}
            >
              {projects.map((p) => (
                <Card key={p.id} p={p} width={`${cardWidth}px`} height={cardHeight} ghostSize={ghostSize} onOpen={openProject} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ---------- MOBILE: reduced gap ----------
        <div style={{ padding: '2rem 1.25rem 0.5rem' }}>
          <p
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: '0.5rem',
            }}
          >
            02 — Selected work
          </p>
          <h2
            style={{
              fontSize: 'clamp(2rem, 9vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 0.98,
              color: '#fff',
              marginBottom: '1.25rem',
            }}
          >
            Things I've <span style={{ color: 'rgba(255,255,255,0.14)' }}>built.</span>
          </h2>

          <div
            className="wk-mobile-scroll"
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '0.25rem',
              margin: '0 -1.25rem',
              padding: '0 1.25rem 0.25rem',
            }}
          >
            {projects.map((p) => (
              <div key={p.id} style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
                <Card p={p} width="min(80vw, 320px)" height="380px" ghostSize="100px" onOpen={openProject} />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              textAlign: 'center',
            }}
          >
            <a
              href="https://github.com/johnwalle"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#a78bfa',
                border: '1px solid rgba(167,139,250,0.25)',
                borderRadius: '999px',
                padding: '6px 16px',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              github.com/johnwalle ↗
            </a>
          </div>
        </div>
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
        onNavigate={navigateModal}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      <style>{`
        .wk-mobile-scroll::-webkit-scrollbar { display: none; }
        .wk-mobile-scroll { scrollbar-width: none; }
      `}</style>
    </section>
  );
}