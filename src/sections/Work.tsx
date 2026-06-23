import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@hooks/useGSAP'
import { projects } from '@data/projects'
import type { Project } from '@types-local/index'
import styles from './Work.module.css'

gsap.registerPlugin(ScrollTrigger)

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlay = useRef<HTMLDivElement>(null!)
  const modal   = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.from(overlay.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
      .from(modal.current,   { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.15')
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(modal.current,   { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(overlay.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.1')
  }

  return (
    <div ref={overlay} className={styles.modalOverlay} onClick={handleClose}>
      <div ref={modal} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={handleClose} aria-label="Close">✕</button>
        <span className={styles.modalTag}>{project.tag}</span>
        <h3 className={styles.modalTitle}>{project.title}</h3>
        <p className={styles.modalYear}>{project.year}</p>
        <p className={styles.modalDesc}>{project.longDescription}</p>
        <div className={styles.modalTech}>
          {project.tech.map((t) => (
            <span key={t} className={styles.techPill}>{t}</span>
          ))}
        </div>
        <div className={styles.modalLinks}>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.linkPrimary}>
              Live site ↗
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.linkGhost}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function Work() {
  const [active, setActive] = useState<Project | null>(null)

  const section = useGSAP(() => {
    // Header meta
    gsap.from('.work-rule', {
      scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: '.work-rule', start: 'top 90%' },
    })
    gsap.from('.work-label', {
      x: -20, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-label', start: 'top 88%' },
    })
    gsap.from('.work-heading', {
      y: 36, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-heading', start: 'top 86%' },
    })

    // Cards stagger up — bottom two slightly delayed
    gsap.from('.project-card', {
      y: 64, opacity: 0, duration: 1, stagger: 0.11, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-grid', start: 'top 80%' },
    })

    // Hover: card border glow (pure CSS handles colour, GSAP handles lift)
    document.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0,  duration: 0.5,  ease: 'power3.out' })
      })
    })
  })

  return (
    <section ref={section} className={styles.section} id="work">
      <div className={`container ${styles.inner}`}>

        <div className={styles.sectionMeta}>
          <div className={`work-rule ${styles.rule}`} />
          <span className={`work-label ${styles.label}`}>Selected work</span>
        </div>

        <div className={styles.header}>
          <h2 className={`work-heading ${styles.heading}`}>Things I've built.</h2>
          <span className={styles.count}>{projects.length} projects</span>
        </div>

        <div className={`work-grid ${styles.grid}`}>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-card ${styles.card}`}
              onClick={() => setActive(p)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardTag}>{p.tag}</span>
                <span className={styles.cardYear}>{p.year}</span>
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.techRow}>
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className={styles.techTag}>{t}</span>
                  ))}
                </div>
                <span className={styles.arrow}>↗</span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  )
}
